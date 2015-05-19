define([
],
function(
) {


  function getBits(name) {
    m = name.match(/^([^| ]+)[| ]*([0-9.]*)@?([0-9.]*)/);
    if(m === null) {
      throw 'Could not parse name: ' + name;
    }

    return m;
  };

  function symbol(name) {
    var bits = getBits(name);
    return bits[1].toUpperCase();
  }

  function quantity(name) {
    var bits = getBits(name);

    if ( bits[2] !== '' && bits[3] !== '') {
      return bits[2];
    } else {
      return '';
    }
  }

  function price(name) {
    var bits = getBits(name);

    if ( bits[2] !== '' && bits[3] !== '') {
      return bits[3];
    } else {
      return bits[2];
    }
  }

  return {
    symbol: symbol,
    quantity: quantity,
    price: price
  }

});