define([
    'superagent'
], function(
    request
) {

    var get = function(tickers, cb) {

        var str = '';
        for(var i in tickers) {
            str = str + '"' + tickers + '",';
        }
        str = str.substring(0, str.length - 1);

        request
            .get('https://query.yahooapis.com/v1/public/yql')
            .query({
                q: 'select AskRealtime, BidRealtime, Symbol from yahoo.finance.quotes where symbol IN (' + str + ')',
                format: 'json',
                env: 'store://datatables.org/alltableswithkeys'
            })
            .set('Accept', 'application/json')
            .end(function(err, response){

                //munge this into a standardish response
                //
                if(err !== null) {
                    cb(err);
                } else {
                    var query = response.body.query,
                        data = {};

                    if(query.count === 0) {
                        data.results = [];
                    } else if( query.count === 1) {
                        data.results = [query.results.quote];
                    } else {
                        data.results = query.results.quote;
                    }

                    data.timestamp = query.created;
                    data.count = query.count;

                    cb(null, data);
                }
            });
    }
    
    return {
        get: get
    }
});