define([
  'service/yahoo'
],
function(
  source
) {
  'use strict';

  var allSymbols = [],
      allResults = {},
      synced = 0;


  function add(symbol) {
    var sym = symbol.toUpperCase();

    //no duplicates
    if(allResults[sym] === undefined) {
      allResults[sym] = allSymbols.push(sym) - 1;
    }

  }

  function sync() {
    return new Promise(function(resolve, reject){

      var symbols = allSymbols.slice(0),
          results = JSON.parse(JSON.stringify(allResults));

      return source
        .get(symbols)
        .then(function(data){

          if(data.count === 0) {
            reject('Zero results returned');
          }
          data.results.forEach(function(result){

              //using delete maintains the keys,
              //slicing reindexes which breaks after first time this is called
              delete symbols[results[result.Symbol]];
              results[result.Symbol] = result;
          });

          symbols.forEach(function(symbol){
            results[symbol] = null;
          });

          resolve(results);
        });
    });
  }

  return {
    add: add,
    sync: sync
  }

});