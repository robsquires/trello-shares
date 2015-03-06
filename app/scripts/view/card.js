define([
  'view/badge'
],
function(
  BadgeView
) {

  var badgeUpdate = { bid:1, offer:1 };

  var CardView = function(card, ticker) {
    this.setTicker(ticker);
    this.card = card;
    this.title = this.card.querySelector('.list-card-title');

    this.badge = new BadgeView(this.card, this.ticker);

    this.update();
  };


  CardView.prototype = {

    update: function(goneUp) {

      this.updateMovement(goneUp);
      this.updateTitle();
      
      this.badge.update();
    },
    
    updateMovement: function(goneUp) {

      if (!this.ticker.owns) {
        return;
      }

      var classList = this.card.classList;

      if (this.ticker.movement === -1) {
        classList.add('list-card--down');
        classList.remove('list-card--up');
      } else {
        classList.add('list-card--up');
        classList.remove('list-card--down');
      }
      if (goneUp === true) {
        classList.add('moved-up');
        classList.remove('moved-down');
      } else if (goneUp === false ) {
        classList.add('moved-down');
        classList.remove('moved-up');
      }

      setTimeout(function(){
        classList.remove('moved-up', 'moved-down');
      }, 5000);
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
              var goneUp = change.oldValue !== null ? change.oldValue > change.object[change.name] : null;
              me.update(goneUp);
            }
          });

        }
      );
    }
  }

  return CardView;

});