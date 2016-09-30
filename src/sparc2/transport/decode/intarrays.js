module.exports = function(options)
{
  var view = options.view;
  var littleEndian = geodash.config.transport.littleEndian;

  var offset = options.offset;
  var keys = options.keys;
  var valuesPerKey = options.valuesPerKey;

  var intarray = [];
  var k = 0;
  for(var i = 0; i < keys.length; i++)
  {
    for(var j = 0; j < valuesPerKey; j++)
    {
      intarray.push(view.getInt32(offset+(4*k), littleEndian));
      k++;
    }
  }
  var decoded = {};
  for(var i = 0; i < keys.length; i++)
  {
    decoded[keys[i]] = intarray.slice(valuesPerKey*i,valuesPerKey*(i+1));
  }
  return decoded;
};
