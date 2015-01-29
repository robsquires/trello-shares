define([
    'jquery'
], function(
    $
) {

    var get = function(tickers, cb) {

        var str = '';
        for(var i in tickers) {
            str = str + '"' + tickers + '",';
        }
        str = str.substring(0, str.length - 1);

        $.ajax({
            url: "https://query.yahooapis.com/v1/public/yql",
       
            // Tell YQL what we want and that we want JSON
            data: {
                q: "select AskRealtime, BidRealtime, Symbol from yahoo.finance.quotes where symbol IN (" + str + ")",
                format: "json",
                env: 'store://datatables.org/alltableswithkeys'
            },
            // Work with the response
            success: function(response) {
                cb(null, response);
            },
            error: function(err) {
                cb(err);
            }
        });
    }
    
    return {
        get: get
    }
});