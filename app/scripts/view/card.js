define([
  'view/badge'
],
function(
  BadgeView
) {

  var badgeUpdate = { bid:1, offer:1, quoteChange:1, quoteChangePct:1 };

  var CardView = function(card, ticker) {
    this.setTicker(ticker);
    this.card = card;
    this.title = this.card.querySelector('.list-card-title');

    this.badge = new BadgeView(this.card, this.ticker);
  };


  CardView.prototype = {

    update: function() {
      this.updateMovement();
      this.updateTitle();
      
      this.badge.update();
    },
    
    updateMovement: function() {

      if (!this.ticker.owns) {
        return;
      }

      if (this.ticker.movement() === -1) {
        this.card.classList.add('list-card--down');
      } else {
        this.card.classList.add('list-card--up');
      }
    },

    updateTitle: function() {
      var span = this.title.querySelector('span');

      this.title.innerHTML = span.outerHTML + this.ticker.symbol;
    },

    setCard: function(card) {
      this.card = card;
      this.title = this.card.querySelector('.list-card-title');
      this.badge.setCard(card);

      this.update();
    },

    setTicker: function(ticker) {
      var me = this;
      this.ticker = ticker;

      Object.observe(
        this.ticker,
        function(changes){
          
          changes.forEach(function(change){
            
            if (badgeUpdate[change.name]) {
              me.update();
            }
          });

        }
      );
    }
  }

  return CardView;

});