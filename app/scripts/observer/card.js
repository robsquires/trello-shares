define([
  'underscore',
  'amplify',
  'observer/cardTitle'
],
function(
  _,
  pubsub,
  cardTitleObserver
) {
  'use strict';

  var cards = [],
      initialCount,
      selector = '.list-card:not(.placeholder)',
      resolved = false,
      resolve,
      reject;



  var observer = new MutationObserver(function(mutations) {
    _.each(mutations, function(mutation) {
      
      //go throughall the added nodes
      _.each(mutation.addedNodes, function(node) {

        if (node.matches(selector)) {
            if (!resolved) {
              cards.push(node);
              tryResolve();
            } else {
              pubsub.publish('trello:card:added', node);
            }
        }


        // var title = card.querySelector('.list-card-title');
        // if (title) {
          
        //   //observe title when the card is opened for editting
        //   card.addEventListener('click', function() {
        //     cardTitleObserver.observe(title, { childList: true });
        //   });
        // }
      });

      //go through the remove nodes, potentially to cleanup
    });
  });

  function init(lists) {

    promise = new Promise(function(Resolve, Reject) {

      resolve = Resolve;
      reject = Reject;

      _.each(lists, function(list) {
          _.each(list.querySelectorAll(selector), function(card) {
              cards.push(card);
              tryResolve();
          });

          observer.observe(list.querySelector('.list-cards'), { childList: true });
      });
    });

    return promise;
  }

  function setNumberCards(count) {
    initialCount = count;
    tryResolve();
  }

  function tryResolve() {
    if (cards.length === initialCount) {
      resolved = true;
      resolve(cards);
    } else if (cards.length > initialCount) {
      reject('More lists than expected!!');
    }
  }

  return {
    init: init,
    setNumberCards: setNumberCards
  };

});