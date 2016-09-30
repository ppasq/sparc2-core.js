module.exports = function(response, offset)
{
  offset = offset || 0;

  var view = sparc2.transport.load(response);

  var h = sparc2.transport.header.summary({'view': view, 'offset': offset}); offset += 4*(Object.keys(h).length);

  var maxValue = view.getInt32(offset, geodash.config.transport.littleEndian); offset += 4*1;

  var natural = sparc2.transport.decode.intarray({
    'view': view,
    'offset': offset,
    'count': h["all_breakpoints_natural"]
  }); offset += 4 * h["all_breakpoints_natural"];

  var natural_adjusted = sparc2.transport.decode.intarray({
    'view': view,
    'offset': offset,
    'count': h["all_breakpoints_natural_adjusted"]
  }); offset += 4 * h["all_breakpoints_natural_adjusted"];

  var prob_classes = sparc2.transport.decode.stringarray({
    'view': view,
    'offset': offset,
    'count': h["prob_classes"],
    'bytesPerTerm': h["prob_class_name_size"]
  }); offset += 4 * h["prob_classes"] * h["prob_class_name_size"];

  var data_by_prob_class = sparc2.transport.decode.intarrays({
    'view': view,
    'offset': offset,
    'keys': prob_classes,
    'valuesPerKey': 12,
  }); offset += 4 * h["prob_classes"] * 12;

  for(var i = 0; i < prob_classes.length; i++)
  {
    var prob_class = prob_classes[i];
    data_by_prob_class[prob_class] = {
      "by_month": data_by_prob_class[prob_class]
    };
  }
  var admin2_codes = sparc2.transport.decode.intarray({
    'view': view,
    'offset': offset,
    'count': h["admin2"]
  }); offset += 4 * h["admin2"];

  var data_by_admin2_prob_class = {};
  var admin2_code = undefined;
  var prob_class = undefined;
  for(var i = 0; i < admin2_codes.length; i++)
  {
    admin2_code = admin2_codes[i];
    data_by_admin2_prob_class[""+admin2_code] = {"prob_class": {}};
    for(var j = 0; j < prob_classes.length; j++)
    {
      prob_class = prob_classes[j];
      var values = sparc2.transport.decode.intarray({
        'view': view,
        'offset': offset,
        'count': 12
      }); offset += 4 * 12;
      data_by_admin2_prob_class[""+admin2_code]["prob_class"][prob_class] =
      {
        "by_month": values
      }
    }
  }

  summary = {
    "header": h,
    "all": {
      "max": {
        "at_admin2_month": maxValue
      },
      "breakpoints": {
        "natural": natural,
        "natural_adjusted": natural_adjusted
      }
    },
    "prob_class": data_by_prob_class,
    "admin2": data_by_admin2_prob_class
  };
  
  return summary;
};
