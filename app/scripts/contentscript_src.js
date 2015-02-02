require([
  'amplify',
  'observer/card',
  'model/ticker',
  'service/yahoo'
], function(
  pubsub,
  cardObserver,
  Ticker,
  yahoo
) {
    'use strict';

    cardObserver.init();

    var cards = {},
        tickers = {};

    pubsub.subscribe('card:added', function(card, titleUpdate){

      var m = card.querySelector('.list-card-title').textContent.match(/(#[0-9]+) (.*)/);
      if (m === null) {
        return;
      }

      var id = m[1],
          data = m[2];

      m = data.match(/^([^| ]+)[| ]*([0-9.]*)@?([0-9.]*)/);
      if(m === null) {
        pubsub.publish('ticker:error', id);
        return;
      }

      var symbol = m[1],
          price = null,
          quantity = null;

      if (m[2] !== '' && m[3] !== '') {
        price = m[3];
        quantity = m[2];
      } else if (m[2] !== '' && m[3] === '') {
        price = m[2];
      }

      //now parsed all data 

      var ticker = tickers[id];
      if (ticker && symbol === ticker.symbol) {
        //ie. not expecting data to have changed
        if (! titleUpdate) {
          //if it has
          if ( (quantity === null && ticker.quantity !== null) ||
               (price === null && ticker.price !== null) ) {
            return;
          }
        }
        
        cards[ticker.id] = card;
        ticker.setQuantity(quantity);
        ticker.setPrice(price);

        pubsub.publish('ticker:quoted', ticker);

      } else {

        ticker = new Ticker(id, symbol, price, quantity);

        tickers[ticker.id] = ticker;
        cards[ticker.id] = card;
        pubsub.publish('ticker:new', ticker);
      }
    });

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

    pubsub.subscribe('ticker:new', function(ticker){

      yahoo.get([ticker.symbol], function(err, data){
        data.results.forEach(function(quote){
          ticker.updateQuote(quote);
          pubsub.publish('ticker:quoted', ticker);
        });
      });
    });

    pubsub.subscribe('ticker:error', function(id){
      console.log('err', id);
      var card = cards[id];
      card.backgroundColor = 'red';
    });
  });