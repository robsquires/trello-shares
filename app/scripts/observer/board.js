define([
  'underscore'
],
function(
  _
) {
  'use strict';

  var found = false,
      selector = '#board',
      resolve, reject;

  function init(content) {
    
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
              }
              
            });
          });
        });
      }
    });

    setTimeout(checkBoard, 1000);

    return promise;
  }

  function foundBoard(board) {
    resolve(board);
  }

  function checkBoard() {
    if (!found) {
      reject('Could not find board');
    }
  }

  return {
    init: init
  };

});