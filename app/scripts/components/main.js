define([
], function(
) {

    var observer = new MutationObserver(function(mutations){

        mutations.forEach(function(mutation){
            if(mutation.addedNodes.length > 0) {

                mutation.addedNodes.forEach(function(node){
                    pubsub.publish('card:added', node);
                });
            }
        });
    });
    var init = function(lists) {
        lists.forEach(function(list){
            observer.observe(list, {childList: true});
        });
    }
    


    
});