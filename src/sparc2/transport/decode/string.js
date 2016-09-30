module.exports = function(options)
{
  var view = options.view;
  var littleEndian = geodash.config.transport.littleEndian;

  var offset = options.offset;
  var count = options.count;

  var decoded = "";
  for(var i = 0; i < count; i++)
  {
    decoded += String.fromCharCode(view.getInt32(offset+(4*i), littleEndian));
  }
  return decoded;
};
