define([
  'underscore',
  'amplify'
],
function(
  _,
  pubsub
) {
  'use strict';

  var observer = new MutationObserver(function(mutations){

    _.each(mutations, function(mutation) {

      var card = mutation.target.parentElement;
      if(card) {
        pubsub.publish('trello:card:titleChanged', card);
      }

      //disconnect so don't listen to anymore
      observer.disconnect();
    
    });
  
  });

  return observer;
});