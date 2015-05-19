define([
  'superagent'
], function(
  request
) {
  'use strict';
  var get = function(tickers) {

    return new Promise(function(resolve, reject) {
      var str = '';

      for(var i in tickers) {
        var ticker = tickers[i];
        str = str + '"' + ticker + '",';
      }

      str = str.substring(0, str.length - 1);

      //https://query.yahooapis.com/v1/public/yql
      request
        .get('https://query.yahooapis.com/v1/public/yql')
        .query({
          q: 'select ChangePercentRealtime, ChangeRealtime, ChangeinPercent, Change, AskRealtime, BidRealtime, Symbol, LastTradePriceOnly, Currency from yahoo.finance.quotes where symbol IN (' + str + ')',
          format: 'json',
          env: 'store://datatables.org/alltableswithkeys'
        })
        .set('Accept', 'application/json')
        .end(function(err, response){
          //munge this into a standardish response
          
          if(err !== null) {
            reject(err);
          } else {
            var query = response.body.query,
                data = {
                timestamp: query.created,
                count: query.count
              };

            if (query.count === 0) {
              data.results = [];
            } else if (query.count === 1) {
              if (query.results.quote.LastTradePriceOnly === null) {
                data.count = 0;
                data.results = [];
              } else {
                data.results = [query.results.quote];
              }
            } else {
              data.results = query.results.quote;
            }
            resolve(data);
          }
        });
    });
  };
  
  return {
    get: get
  };
});