define([
],
function(
) {


  function getBits(title) {
    m = title.match(/#([0-9]+) (.*)/);
    if(m === null) {
      throw 'Could not parse title: ' + title;
    }

    return m;
  }

  function id(title) {
    var bits = getBits(title);
    return bits[1];
  }

  function name(title) {
    var bits = getBits(title);
    return bits[2];
  }

  function fromCard(card) {
    return card.querySelector('.list-card-title').text;
  }

  return {
    fromCard: fromCard,
    name: name,
    id: id
  }

});