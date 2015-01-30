define([
    'amplify'
], function(
    pubsub
) {

    var Ticker = function(symbol, price, quantity) {
        var bid,
            offer;

        //read only access to properties;
        this.symbol = function() {
            return symbol;
        }

        this.owns = function() {
            return quantity !== undefined;
        }

        this.bid = function() { 
            return bid;
        };

        this.offer = function() {
            return offer;
        };

        this.updateQuote = function(Quote) {
            bid = Quote.BidRealtime;
            offer = Quote.OfferRealtime;
        };
    }

    return Ticker;
});