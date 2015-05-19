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
  'view/refreshButton',

  'service/trello'
], function(
  pubsub,
  BoardObserver,
  listObserver,
  cardObserver,
  titleParser,
  nameParser,
  Ticker,
  tickerRepo,
  CardView,
  RefreshButtonView,

  trello
) {
    'use strict';

    var content = document.getElementById('content');

    var boardHeaderObserver = new BoardObserver();
    boardHeaderObserver
    .init(content, '.board-header')
    .then(function(header){
      new RefreshButtonView(header);
    });

    var boardObserver = new BoardObserver();
    boardObserver
    .init(content, '#board')
    .then(listObserver.init)
    .then(cardObserver.init)
    .then(function(cards) {
      cards.forEach(addCard);
    });
    
  
    trello
    .lists('nAfUYQfQ')
    .then(function(data){
      listObserver.setNumberLists(data.length);
      }, function(reason) {
        alert('Could not grab lists');
    });

    var initialQuotes = {};

    function processResults(results){

      for (var symbol in symbolIdx) {
        var cardIds = symbolIdx[symbol];
        for(var i in cardIds) {
          var cardId = cardIds[i],
              quote = results[symbol],
              ticker = tickers[cardId];

          if (quote) {
            //haven't built the tickers yet
            if (!ticker) {
              initialQuotes[symbol] = quote;
            } else {
              ticker.updateQuote(quote);
              pubsub.publish('ticker:quoted', ticker);
            }
          }
        }
      }
    };

    pubsub.subscribe('updateData', function(){
      
      tickerRepo
      .sync()
      .then(processResults);

    });

    var symbolIdx  = {};
    function processCard(cardId, name){
      var symbol = nameParser.symbol(name);

      if (!symbolIdx[symbol]) {
        symbolIdx[symbol] = [cardId];
      } else {
        symbolIdx[symbol].push(cardId);
      }
      tickerRepo.add(symbol);
    }

    trello
    .cards('nAfUYQfQ')
    .then(function(cards){
      cardObserver.setNumberCards(cards.length);

      cards.forEach(function(card) {
        processCard(card.idShort, card.name);
      });

      tickerRepo
      .sync()
      .then(processResults);

    });

    var highestCardId = 0;

    pubsub.subscribe('trello:card:added', function(card) {
    
      var title = titleParser.fromCard(card), 
          name = titleParser.name(title),
          id;

      try {
        id = titleParser.id(title);
      } catch(e) {
        id = highestCardId + 1;
        titleParser.updateId(title, id);
      }
      highestCardId = parseInt(id,10) > highestCardId ? parseInt(id,10) :  highestCardId;

      var newCard = cards[id] === undefined;
      addCard(card);

      processCard(id, name);

      if(newCard) {
        tickerRepo
          .sync()
          .then(processResults);
      }
    });

    var cards = {},
        tickers = {},
        cardViews = {},
        prices = {};
        quantities = {};

    function addCard(card){

      var title = titleParser.fromCard(card), 
          name = titleParser.name(title),
          id;
      try {
        id = titleParser.id(title);
      } catch(e) {
        id = highestCardId + 1;
        titleParser.updateId(title, id);
      }


      highestCardId = parseInt(id,10) > highestCardId ? parseInt(id,10) :  highestCardId;

      var symbol = nameParser.symbol(name),
          price = nameParser.price(name),
          quantity = nameParser.quantity(name);


      if (price !== '') {
        prices[id] = price;
      } else {

        price = prices[id] !== undefined ? prices[id]: null;
      }

      if (quantity !== '') {
        quantities[id] = quantity;
      } else {
        quantity = quantities[id] !== undefined ? quantities[id]: null;
      }

      var ticker = tickers[id];
      if (ticker /*&& symbol === ticker.symbol*/) {

        ticker.setQuantity(quantity);
        ticker.setPrice(price);

        cards[id] = card;
        pubsub.publish('ticker:quoted', ticker);
      } else {
        ticker = new Ticker(symbol, price, quantity);
        tickers[id] = ticker;
        cards[id] = card;
      }

      if (initialQuotes[symbol]) {
        ticker.updateQuote(initialQuotes[symbol]);
        delete initialQuotes[symbol];
      }

      //now parsed all data 
      var view = cardViews[id];
      if (view) {
        view.setCard(card);
      } else {
        view = new CardView(card, ticker);
        cardViews[id] = view;
      }
    };

  });


