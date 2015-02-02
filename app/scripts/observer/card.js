define([
  'underscore',
  'amplify'
],
function(
  _,
  pubsub
) {
  'use strict';
  var titleObserver = new MutationObserver(function(mutations){
    _.each(mutations, function(mutation) {
      var card = mutation.target.parentElement;
      if(card) {
        pubsub.publish('card:added', card, true);
      }
      titleObserver.disconnect();
    });
  });
  
  var observer = new MutationObserver(function(mutations) {
    _.each(mutations, function(mutation) {
      _.each(mutation.addedNodes, function(card) {
        var title = card.querySelector('.list-card-title');
        if (title) {
          card.addEventListener('click', function() {
            titleObserver.observe(title, {
              childList: true
            });
          });
          pubsub.publish('card:added', card, false);
        }
      });
    });
  });
  
  var init = function() {
    var lists = document.querySelectorAll('.list-cards');
    _.each(lists, function(list){
      observer.observe(list, {childList: true});
    });
  };
  return {
    init: init
  };
});