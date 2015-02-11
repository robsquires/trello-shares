define([
],
function(
) {

  var badgeUpdate = { bid:1, offer:1, quoteChange:1, quoteChangePct:1 };

  var CardView = function(card, ticker) {
    this.setTicker(ticker);

    this.card = card;
    this.badges = card.querySelector('.badges');
  };

  function updateBadge() {
    
    var badge = this.badges.querySelector('.badge-ticker');

    var price = this.ticker.owns ? '£' + ((this.ticker.price * this.ticker.quantity)/100).toFixed(2) : this.ticker.marketPrice;
    var data = [price, '£' + this.ticker.change.toFixed(2), this.ticker.changePct];

    if (!badge) {
      
      //create badge
      badge = document.createElement('div');
      badge.addEventListener('click', function(event) {
        event.stopPropagation();
        pubsub.publish('ui:togglePrice');
      });
        
      //set generic attributes
      badge.classList.add('badge', 'badge-ticker');
      badge.style.color = 'white';
      badge.style.padding = '1px 4px';
      badge.style.borderRadius = '2px';

      //set data-dependant attributes
      badge.innerHTML = '<div>' + data[0] + '</div>';
      badge.style.backgroundColor = this.ticker.movement() === -1 ? 'rgb(237, 80, 80)' : '#66AF52';

      //set to view
      var allbadges = this.badges.querySelectorAll('.badge');
      if (allbadges.length > 0) {
        this.badges.insertBefore(badge, allbadges[0]);
      } else {
        this.badges.appendChild(badge);
      }

    } else {
      badge.innerHTML = '<div>' + data[0] + '</div>';
      badge.style.backgroundColor = this.ticker.movement() === -1 ? 'rgb(237, 80, 80)' : '#66AF52';
    }
  }


  CardView.prototype = {
    setCard: function(card) {

      this.card = card;
      this.badges = card.querySelector('.badges');
      updateBadge.call(this);
    },

    setTicker: function(ticker) {
      var me = this;
      this.ticker = ticker;

      Object.observe(
        this.ticker,
        function(changes){
          
          changes.forEach(function(change){
            
            if (badgeUpdate[change.name]) {
              updateBadge.call(me);
            }
          });

        }
      );
    }
  }

  return CardView;

});