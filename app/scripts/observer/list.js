define([
  'underscore',
  'amplify'
],
function(
  _,
  pubsub
) {
  'use strict';

  var lists = [],
      initialCount,
      selector = '.list:not(.add-list)',
      resolve, reject;

  var observer = new MutationObserver(function(mutations) {
    _.each(mutations, function(mutation) {
      _.each(mutation.addedNodes, function(node) {
        if (node.matches(selector)) {
          lists.push(node);

          tryResolve();
        }
      });
    });
  });

  function init(board) {

    var promise = new Promise(function(Resolve, Reject) {

      resolve = Resolve;
      reject = Reject;

      lists = Array.prototype.slice.call(board.querySelectorAll(selector));
      observer.observe(board, { childList: true });
    });

    return promise;
  }

  function setNumberLists(count) {

    initialCount = count;
    tryResolve();
  }

  function tryResolve() {

    if (lists.length === initialCount) {
      resolve(lists);
    }
  }

  return {
    init: init,
    setNumberLists: setNumberLists
  };

});