define([
], function(
) {
    'use strict';

    var Ticker = function(symbol, price, quantity) {

      this.symbol = symbol;

      this.setPrice(price);
      this.setQuantity(quantity);

      this.hasQuote = false;


      this.bid = null;
      this.offer = null;
      this.change = null;
      this.changePct = null;
      this.quoteChange = null;
      this.quoteChangePct = null;
      this.currency = null;

      Object.defineProperty(this, 'owns', {
        get: function() {
          return this.quantity !== null;
        }
      });

      Object.defineProperty(this, 'marketPrice', {
        get: function() {
          return this.owns ? this.bid : this.offer;
        }
      });

      Object.defineProperty(this, 'initialInvestment', {
        get: function() {
          return this.quantity * this.price;
        }
      });

      Object.defineProperty(this, 'investmentChange', {
        get: function() {
          return this.quantity * this.change;
        }
      });

      Object.defineProperty(this, 'investmentValue', {
        get: function() {
          return this.initialInvestment + this.investmentChange;
        }
      });

      Object.defineProperty(this, 'change', {
        get: function() {
          return this.owns
            ? parseFloat(this.bid - this.price)
            : this.quoteChange;
        }
      });
      
      Object.defineProperty(this, 'changePct', {
        get: function() {
          return this.owns
            ? (this.change / this.price * 100).toFixed(2).toString() + '%'
            : this.quoteChangePct;
        }
      });

      Object.defineProperty(this, 'movement', {
        get: function() {
          return this.change < 0 ? -1 : 1;
        }
      });
    };

    Ticker.prototype = {

      updateQuote: function(quote) {

        this.hasQuote = true;

        this.bid = parseFloat(quote.BidRealtime !== null ? quote.BidRealtime : quote.LastTradePriceOnly);
        this.offer = parseFloat(quote.AskRealtime !== null ? quote.AskRealtime : quote.LastTradePriceOnly);
        this.quoteChange = parseFloat(quote.ChangeRealtime !== null ? quote.ChangeRealtime : quote.Change);
        this.quoteChangePct = quote.ChangePercentRealtime !== null ? quote.ChangePercentRealtime : quote.ChangeinPercent;
        this.currency = quote.Currency;
      },

      setQuantity: function(quantity) {
        this.quantity = quantity !== null ? parseInt(quantity, 10) : null;
      },

      setPrice: function(price) {
        this.price = price !== null ? parseFloat(price) : null;
      }
    };

    return Ticker;
  });