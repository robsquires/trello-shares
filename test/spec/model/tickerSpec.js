/* global describe, it */

(function () {
  'use strict';

  var Ticker;

  //data
  var symbol = 'AAPL';

  describe('Ticker Model', function () {

    beforeEach(function(done){
      require(['app/scripts/model/ticker'], function(tickerModel) {
        Ticker = tickerModel;
        done();
      });
    });

    it('should be a valid module', function(){
      expect(Ticker).toBeTruthy();
    });

    describe('For a ticker which is not owned', function(){
      var ticker;
      
      beforeEach(function(){
        ticker = new Ticker(symbol);
      });

      it('owns should be false', function(){
        expect(ticker.owns).toBeFalsy();
      });

      it('hasQuote should be false', function(){
        expect(ticker.hasQuote).toBeFalsy();
      });

      describe('when a quote is set', function(){
        var quote;
        beforeEach(function(){
          quote = {
            BidRealtime: 110,
            AskRealtime: 115,
            ChangeRealtime: 10,
            ChangeinPercent: '10%'
          }
          ticker.updateQuote(quote);
        });

        it('owns should be false', function(){
          expect(ticker.owns).toBeFalsy();
        });

        it('hasQuote should be true', function(){
          expect(ticker.hasQuote).toBeTruthy();
        });

        it('marketPrice should be the ask price', function(){
          expect(ticker.marketPrice).toEqual(quote.AskRealtime);
        });

        it('change should be taken from the quote', function(){
          expect(ticker.change).toEqual(quote.ChangeRealtime);
        });

        it('changePct should be taken from the quote', function(){
          expect(ticker.changePct).toEqual(quote.ChangeinPercent);
        });
      });
    });

    describe('For a ticker which is owned', function(){
      var ticker, price, quantity;
      
      beforeEach(function(){
        price = 115;
        quantity = 2;
        ticker = new Ticker(symbol, price, quantity);
      });

      it('owns should be true', function(){
        expect(ticker.owns).toBeTruthy();
      });

      it('hasQuote should be false', function(){
        expect(ticker.hasQuote).toBeFalsy();
      });

      it('initialInvestment should be price * quantity', function(){
        expect(ticker.initialInvestment).toEqual(price * quantity);
      });

      describe('when a quote is set', function(){
        var quote;
        
        beforeEach(function(){
          quote = {
            BidRealtime: 110,
            AskRealtime: 115,
            ChangeRealtime: 10,
            ChangeinPercent: '10%'
          }
          ticker.updateQuote(quote);
        });

        it('owns should be true', function(){
          expect(ticker.owns).toBeTruthy();
        });

        it('hasQuote should be true', function(){
          expect(ticker.hasQuote).toBeTruthy();
        });
      
        it('marketPrice should be the bid price', function(){
          expect(ticker.marketPrice).toEqual(quote.BidRealtime);
        });

        it('change should be the difference between bid and price', function(){
          var change = quote.BidRealtime - price;
          expect(ticker.change).toEqual(change);
        });

        it('changePct should be the difference ratio of change to price, to 2dp', function(){
          var change = quote.BidRealtime - price,
              changePct = change / price * 100;

          expect(ticker.changePct).toEqual(changePct.toFixed(2) + '%');
        });

        it('movement should be derived from change', function(){
          expect(ticker.movement).toEqual(-1)
        });

        it('investmentValue should be offer * quantity', function(){
          expect(ticker.initialInvestment).toEqual(quote.AskRealtime * quantity);
        });
      });
    });
  
  });

})();
