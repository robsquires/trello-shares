define([
],
function(
) {

  var states = ['gain', 'value'];

  var BadgeView = function(card, ticker) {
    this.setTicker(ticker);
    this.setCard(card);

    this.createBadge();
  };

  BadgeView.prototype = {

    createBadge: function() {
      this.badge = document.createElement('div');
      this.badge.addEventListener('click', function(event) {
          event.stopPropagation();
          // pubsub.publish('ui:togglePrice');
        });
      this.badge.classList.add('badge', 'badge-price');
    },

    updateMovement: function() {

      if(this.ticker.movement === -1) {
        this.badge.classList.add('badge-price--down');
      } else {
        this.badge.classList.add('badge-price--up');
      }

    },

    addBadgeToCard: function() {
      //set to view
      var allbadges = this.badges.querySelectorAll('.badge');
      if (allbadges.length > 0) {
        this.badges.insertBefore(this.badge, allbadges[0]);
      } else {
        this.badges.appendChild(this.badge);
      }
    },

    update: function() {

      if (!this.ticker.hasQuote) {
        return;
      }
      this.data = {}
      states.forEach(function(state){

        var data;
        switch(state) {
          case 'gain':
            data = { actual: '£' + this.ticker.change.toFixed(2), percentage: this.ticker.changePct };
            break;
          case 'value':
            data = { actual: '£' + this.ticker.change.toFixed(2), percentage: this.ticker.changePct };
            break;
        } 

        this.data[state] = data;
      }, this);

      var price = this.ticker.owns ? '£' + (this.ticker.investmentValue/100).toFixed(2) : this.ticker.marketPrice;
      var data = [price, '£' + this.ticker.change.toFixed(2), this.ticker.changePct];

      this.updateMovement();
      this.badge.innerHTML = '<div>' + data[0] + '</div>';

      var badge = this.badges.querySelector('.badge-price');
      if (!badge) {
        this.addBadgeToCard();
      }
    },

    setCard: function(card) {
      this.card = card;
      this.badges = card.querySelector('.badges');
    },

    setTicker: function(ticker) {
      this.ticker = ticker;
    }
  }

  return BadgeView;

});