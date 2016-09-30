module.exports = function(options)
{
  var view = options.view;
  var offset = options.offset;
  var littleEndian = geodash.config.transport.littleEndian;

  var fields = ["prob_class_name_size", "prob_classes", "admin2", "all_breakpoints_natural", "all_breakpoints_natural_adjusted"];

  var header = {};
  for(var i = 0; i < fields.length; i++)
  {
    header[fields[i]] = view.getInt32(offset+(4*i), littleEndian);
  }
  return header;
};
