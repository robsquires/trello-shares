define([
  'underscore'
],
function(
  _
) {
  'use strict';

  return function() {

    var found = false,
        resolve, reject,
        selector;

    function init(content, Selector) {
      selector = Selector;
      var promise = new Promise(function(Resolve, Reject) {
        
        var board = content.querySelector(selector);

        resolve = Resolve;
        reject = Reject;

        if (board) {
          //if got the board already resolve this mother!
          foundBoard(board);
        
        } else {
          //otherwise setup an observer to wait
          var observer = new MutationObserver(function(mutations) {
            _.each(mutations, function(mutation) {
              _.each(mutation.addedNodes, function(node) {

                if (node.matches(selector)) {
                  foundBoard(node);
                } else if (node.querySelector(selector)) {
                  foundBoard(node.querySelector(selector));
                }
                
              });
            });
          });
          observer.observe(content, { childList: true });
        }
      });

      setTimeout(checkBoard, 3000);

      return promise;
    }

    function foundBoard(board) {
      found = true;
      resolve(board);
    }

    function checkBoard() {
      if (!found) {
        reject('Could not find element - ' + selector);
      }
    }

    return {
      init: init
    };
  }

});