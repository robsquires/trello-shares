define([
    'models/ticker'
],
function(
    Ticker
) {
    
    var build = function() {
        var cards = document.querySelectorAll('.list-cards');

        var tickers = [];
        for(var i in cards) {
            var card = cards[i];
            var ticker = card.querySelector('.list-card-title').textContent.match(/#[1-9]+ (.*)/)[1];

            tickers.push(new Ticker(ticker));
        }
        return tickers;
    };


    return {
        build: build
    }
});
    