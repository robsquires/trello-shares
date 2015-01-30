define([
    'underscore',
    'amplify'
],
function(
    _,
    pubsub
) {

    var observer = new MutationObserver(function(mutations) {

        _.each(mutations, function(mutation) {

            _.each(mutation.addedNodes, function(node) {
                pubsub.publish('card:added', node);
            });
        });
    });
    
    var init = function(lists) {

        _.each(lists, function(list){
            observer.observe(list, {childList: true});
        });
    }

    return {
        init: init
    }
});