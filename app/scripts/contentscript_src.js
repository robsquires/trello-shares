require([
  'amplify',
  'observer/board',
  'observer/list',
  'observer/card',

  'parser/title',
  'parser/name',

  'model/ticker',

  'repository/ticker',
  
  'view/card',

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
  CardView,
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
        tickers = {},
        cardViews = {};

    function addCard(card){

      var title = titleParser.fromCard(card),
          id = titleParser.id(title),
          name = titleParser.name(title);

      var symbol = nameParser.symbol(name),
          price = nameParser.price(name),
          quantity = nameParser.quantity(name);


      var ticker = tickers[id];
      if (ticker /*&& symbol === ticker.symbol*/) {

        ticker.setQuantity(quantity);
        ticker.setPrice(price);

        cards[ticker.id] = card;
        pubsub.publish('ticker:quoted', ticker);
      } else {
        ticker = new Ticker(id, symbol, price, quantity);
        tickers[ticker.id] = ticker;
        cards[ticker.id] = card;
      }

      //now parsed all data 
      var view = cardViews[id];
      if (view) {
        view.setCard(card);
      } else {
        view = new CardView(card, ticker);
        cardViews[id] = view;
      }

      // var ticker = tickers[id];
      // if (ticker && symbol === ticker.symbol) {
      //   //ie. not expecting data to have changed
      //   // if (! titleUpdate) {
      //     //if it has
      //   if ( (quantity === null && ticker.quantity !== null) ||
      //        (price === null && ticker.price !== null) ) {
      //     return;
      //   }
      //   // }
        
      //   cards[ticker.id] = card;
      //   ticker.setQuantity(quantity);
      //   ticker.setPrice(price);

      //   pubsub.publish('ticker:quoted', ticker);

      // } else {

      //   ticker = new Ticker(id, symbol, price, quantity);

      //   tickers[ticker.id] = ticker;
      //   cards[ticker.id] = card;
      // }
    };

    var idx = 0;
    pubsub.subscribe('ticker:quoted', function(ticker){

      var card = cards[ticker.id];
      var title = card.querySelector('.list-card-title'),
          span = title.querySelector('span');

      // pubsub.subscribe('ui:togglePrice', updateDiv);


      if (ticker.owns) {
        // title.style.fontWeight = 'bold';
        title.style.color = 'black';
        card.style.backgroundColor = ticker.movement() === -1 ? 'rgb(253, 143, 143)' : 'rgb(165, 229, 129)';
        // title.style.color = ticker.movement() === -1 ? '#FF6666' : '#66AF52';
      }

      title.innerHTML = span.outerHTML + ticker.symbol;
        
    });
  });