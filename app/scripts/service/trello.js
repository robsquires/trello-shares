define([
  'superagent'
], function(
  request
) {
  'use strict';

  function cards(boardId) {
    
    var promise = new Promise(function(resolve, reject){
      request
      .get('https://trello.com/1/boards/' + boardId + '/cards')
      .query({ fields: 'idShort,name'})
      .set('Accept', 'application/json')
      .end(function(err, response){
        
        if(err) {
          reject();
        } else {
          resolve(response.body)
        }

      });
    });

    return promise;
  };

  function lists(boardId) {
    
    var promise = new Promise(function(resolve, reject){
      request
      .get('https://trello.com/1/boards/' + boardId + '/lists')
      .query({ fields: 'idShort, name'})
      .set('Accept', 'application/json')
      .end(function(err, response){
        
        if(err) {
          reject();
        } else {
          resolve(response.body)
        }

      });
    });

    return promise;
  };
  
  return {
    cards: cards,
    lists: lists
  };
});