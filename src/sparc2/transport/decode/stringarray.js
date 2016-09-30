module.exports = function(options)
{
  var view = options.view;
  var littleEndian = geodash.config.transport.littleEndian;

  var offset = options.offset;
  var bytesPerTerm = options.bytesPerTerm;
  var count = options.count;

  var decoded = [];
  var k = 0;
  for(var i = 0; i < count; i++)
  {
    var str = "";
    for(var j = 0; j < bytesPerTerm; j++)
    {
      str += String.fromCharCode(view.getInt32(offset+(4*k), littleEndian));
      k++;
    }
    decoded.push(str.trim())
  }
  return decoded;
};
