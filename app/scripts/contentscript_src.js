require([
  'amplify',
  'observer/board',
  'observer/list',
  'observer/card',
  'parser/title',
  'parser/name',
  'model/ticker',
  'repository/ticker',
  'service/trello'
], function(
  pubsub,
  boardObserver,
  listObserver,
  cardObserver,
  titleParser,
  nameParser,
  Ticker,
  tickerRepo,
  trello
) {
    'use strict';



    var cardsInited = false,
        dataInited = false,
        initialData = {};

    var content = document.getElementById('content');

    boardObserver
      .init(content)
      .then(listObserver.init)
      .then(cardObserver.init)
      .then(function(cards) {
        cards.forEach(addCard);

        cardsInited = true;

        if (dataInited) {
          initialQuoting();
        }
      });
    
  
    trello
    .lists('5h0P0qrs')
    .then(function(data){
      listObserver.setNumberLists(data.length);
      }, function(reason) {
        alert('Could not grab lists');
    });

    processResults = function(results){

      for (var symbol in symbolIdx) {
        var cardIds = symbolIdx[symbol];
        for(var i in cardIds) {
          var cardId = cardIds[i],
              quote = results[symbol],
              ticker = tickers[cardId];
        
          if(quote) {
            ticker.updateQuote(quote);
            pubsub.publish('ticker:quoted', ticker);
          }
        }
      }
    };

    var symbolIdx  = {};
    processCard = function(cardId, name){
      var symbol = nameParser.symbol(name);

      if (!symbolIdx[symbol]) {
        symbolIdx[symbol] = [cardId];
      } else {
        symbolIdx[symbol].push(cardId);
      }
      tickerRepo.add(symbol);
    }

    trello
    .cards('5h0P0qrs')
    .then(function(cards){
      cardObserver.setNumberCards(cards.length);

      cards.forEach(function(card) {
        processCard(card.idShort, card.name);
      });

      tickerRepo
      .sync()
      .then(processResults);

    });

    pubsub.subscribe('trello:card:added', function(card) {
      addCard(card);
      var title = titleParser.fromCard(card);

      processCard(titleParser.id(title), titleParser.name(title));

      tickerRepo
        .sync()
        .then(processResults);
    });

    var cards = {},
        tickers = {};

    function addCard(card){

      var title = titleParser.fromCard(card),
          id = titleParser.id(title),
          name = titleParser.name(title);

      var symbol = nameParser.symbol(name),
          price = nameParser.price(name),
          quantity = nameParser.quantity(name);


      //now parsed all data 

      var ticker = tickers[id];
      if (ticker && symbol === ticker.symbol) {
        //ie. not expecting data to have changed
        // if (! titleUpdate) {
          //if it has
        if ( (quantity === null && ticker.quantity !== null) ||
             (price === null && ticker.price !== null) ) {
          return;
        }
        // }
        
        cards[ticker.id] = card;
        ticker.setQuantity(quantity);
        ticker.setPrice(price);

        pubsub.publish('ticker:quoted', ticker);

      } else {

        ticker = new Ticker(id, symbol, price, quantity);

        tickers[ticker.id] = ticker;
        cards[ticker.id] = card;
      }
    };

    var idx = 0;
    pubsub.subscribe('ticker:quoted', function(ticker){

      var card = cards[ticker.id],
          badges = card.querySelector('.badges');

      if(!badges) {
        return;
      }
      var badge = badges.querySelector('.badge-ticker');
      if(!badge) {
        badge = document.createElement('div');
        badge.addEventListener('click', function(event) {
          event.stopPropagation();

          idx++;
          if(idx > 2) {
            idx = 0;
          }
          
          pubsub.publish('ui:togglePrice');
        });
      }

      var title = card.querySelector('.list-card-title'),
          span = title.querySelector('span');

      badge.classList.add('badge', 'badge-ticker');

      var price = ticker.owns ? '£' + ((ticker.price * ticker.quantity)/100).toFixed(2) : ticker.marketPrice;

      var data = [price, '£' + ticker.change.toFixed(2), ticker.changePct];

      var updateDiv = function() {
        badge.innerHTML = '<div>' + data[idx] + '</div>';
      };

      pubsub.subscribe('ui:togglePrice', updateDiv);

      updateDiv();

      if (ticker.owns) {
        // title.style.fontWeight = 'bold';
        title.style.color = 'black';
        card.style.backgroundColor = ticker.movement() === -1 ? 'rgb(253, 143, 143)' : 'rgb(165, 229, 129)';
        // title.style.color = ticker.movement() === -1 ? '#FF6666' : '#66AF52';
      }

      badge.style.backgroundColor = ticker.movement() === -1 ? 'rgb(237, 80, 80)' : '#66AF52';
      badge.style.color = 'white';
      badge.style.padding = '1px 4px';
      badge.style.borderRadius = '2px';
      // badge.style.borderBottom = '1px solid ' + (ticker.movement() === -1) ? '#FF6666' : 'rgb(75, 132, 60)';
  
      title.innerHTML = span.outerHTML + ticker.symbol;

      var allbadges = badges.querySelectorAll('.badge');
      if (allbadges.length > 0) {
        badges.insertBefore(badge, allbadges[0]);
      } else {
        badges.appendChild(badge);
      }
        
    });
  });