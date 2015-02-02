define([
], function(
) {
    'use strict';

    var Ticker = function(id, symbol, price, quantity) {

      this.id = id;
      this.symbol = symbol;

      this.setPrice(price);
      this.setQuantity(quantity);


      this.bid = null;
      this.offer = null;
      this.change = null;
      this.changePct = null;
      this.quoteChange = null;
      this.quoteChangePct = null;

      Object.defineProperty(this, 'owns', {
        get: function() {
          return this.quantity !== null;
        }
      });

      //computed values
      Object.defineProperty(this, 'marketPrice', {
        get: function() {
          return this.owns ? this.bid : this.offer;
        }
      });
    };

    Ticker.prototype = {

      updateQuote: function(quote) {
        this.bid = parseFloat(quote.BidRealtime);
        this.offer = parseFloat(quote.AskRealtime);
        this.quoteChange = parseFloat(quote.ChangeRealtime);
        this.quoteChangePct = quote.ChangeinPercent;

        refresh.call(this);
      },

      movement: function() {
        return this.change < 0 ? -1 : 1;
      },

      setQuantity: function(quantity) {
        this.quantity = quantity !== null ? parseInt(quantity, 10) : null;
        refresh.call(this);
      },

      setPrice: function(price) {
        this.price = price !== null ? parseFloat(price) : null;
        refresh.call(this);
      }
    };


    var refresh = function() {
      if (this.owns) {
        this.change = parseFloat(this.offer - this.price);
        this.changePct = (this.change / this.price * 100).toFixed(2).toString() + '%';
      } else {
        this.change = this.quoteChange;
        this.changePct = this.quoteChangePct;
      }
    };
    return Ticker;
  });