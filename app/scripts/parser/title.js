define([
],
function(
) {

  function id(title) {
    var span = title.querySelector('span').innerHTML;
    m = span.match(/#([0-9]+)/);
    if(m === null) {
      throw 'Could not parse id within title: ' + span;
    }
    return m[1];
  }

  function name(title) {
    var idText;
    try{
      idText = id(title);
    } catch(e) {
      idText = '';
    }


    m = title.text.match('#' + idText + '(.*)');
    if(m === null) {
      throw 'Could not parse title: ' + title.text;
    }
    return m[1];
  }

  function fromCard(card) {
    return card.querySelector('.list-card-title');
  }

  function updateId(title, id) {
    var span = title.querySelector('span');
    span.innerHTML = span.innerHTML + id;
  }

  return {
    fromCard: fromCard,
    name: name,
    id: id,
    updateId: updateId
  }

});