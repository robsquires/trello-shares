define([
], function(
) {
    'use strict';

    var Ticker = function(id, symbol, price, quantity) {

      var bid = null,
          offer = null,
          change = null,
          changePct = null,
          quoteChange = null,
          quoteChangePct = null,
          owns = null,
          marketPrice = null;

      function updateQuote(quote) {
        bid = parseFloat(quote.BidRealtime);
        offer = parseFloat(quote.AskRealtime);
        quoteChange = parseFloat(quote.ChangeRealtime);
        quoteChangePct = quote.ChangeinPercent;

        refresh();
      }

      function movement() {
        return change < 0 ? -1 : 1;
      }

      function setQuantity(newQuantity) {
        quantity = newQuantity !== null ? parseInt(newQuantity, 10) : null;
        owns = quantity !== null;
        refresh();
      }

      function setPrice(newPrice) {
        price = newPrice !== null ? parseFloat(newPrice) : null;
        refresh();
      }

      /**
       * private functions
       */
      function refresh() {

        if (owns) {
          marketPrice = bid;
          change = parseFloat(offer - price);
          changePct = (change / price * 100).toFixed(2).toString() + '%';
        } else {
          marketPrice = offer;
          change = quoteChange;
          changePct = quoteChangePct;
        }
      }

      setPrice(price);
      setQuantity(quantity);
      
      return {
        /**
         * public props
         */
        id: id,
        symbol: symbol,
        price: price,
        quantity: quantity,
        
        change: change,
        changePct: changePct,
        quoteChange: quoteChange,
        quoteChangePct: quoteChangePct,

        /**
         * public methods
         */
        updateQuote: updateQuote,
        movement: movement,
        setQuantity: setQuantity,
        setPrice: setPrice
      };
    };

    return Ticker;
  });
