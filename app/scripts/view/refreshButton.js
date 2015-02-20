define([
  'amplify',
],
function(
  pubsub
) {

  var RefreshButtonView = function(header) {

    this.button = document.createElement('button');
    var buttons = header.querySelector('.board-header-btns');
    buttons.appendChild(this.button);

    this.button.addEventListener('click', function(){
      pubsub.publish('updateData');
    });
  };

  RefreshButtonView.prototype = {

  }

  return RefreshButtonView;

});