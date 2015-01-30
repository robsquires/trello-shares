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

    cardObserver.init(document.querySelectorAll('.list-cards'));

    var cards = {},
        tickers = {};
    pubsub.subscribe('card:added', function(card){
        
        var m = card.querySelector('.list-card-title').textContent.match(/#[0-9]+ (.*)/);
        if(m === null) {
            return;
        }

        var title = m[1];
        var m = title.match(/^(([^ |,]+)[^ |,]+)/);
        if(m === null) {
            pubsub.publish('ticker:error', ticker);
            return;
        }

        var symbol = m[1],
            details = m[3];

        var ticker = new Ticker(symbol);
        cards[symbol] = card;

        pubsub.publish('ticker:new', ticker);
    });

    pubsub.subscribe('ticker:quoted', function(ticker){
        var card = cards[ticker.symbol()];

        var div = document.createElement('div');
        div.innerText = ticker.bid();
        
        card.appendChild(div);
    });

    pubsub.subscribe('ticker:new', function(ticker){

        yahoo.get([ticker.symbol()], function(err, data){

            data.results.forEach(function(quote){
                ticker.updateQuote(quote);
                pubsub.publish('ticker:quoted', ticker);
            });
        });
    });

    pubsub.subscribe('ticker:error', function(ticker){
        console.log('err', ticker);
        
        var card = cards[ticker];
        card.backgroundColor = 'red';
    });






    // yahoo.get(['ARM.L', 'IAG.L', 'AZN.L'], function(err, data){
    //     console.log(err);
    //     console.log(data.query);
    // });
    
});