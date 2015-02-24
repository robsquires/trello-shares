/* global describe, it */

(function () {
  'use strict';

  var subject;

  describe('Ticker Model', function () {

    beforeEach(function(done){
      require(['app/scripts/model/ticker'], function(tickerModel) {
        subject = tickerModel;
        done();
      });
    });

    it('should be a valid module', function(){
      expect(subject).toBeTruthy();
    });
  });

})();
