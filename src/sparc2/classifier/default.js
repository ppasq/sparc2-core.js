module.exports = function(layer, style, classes)
{
  if(angular.isDefined(layer) && angular.isDefined(classes))
  {
    if(layer.id == "popatrisk")
    {
      classes = classes.map(function(x, i, arr)
      {
        var value = extract(["popatrisk_natural_adjusted", i + 1], geodash.breakpoints, 0);
        var prev = extract(["popatrisk_natural_adjusted", i ], geodash.breakpoints, 0);
        if(angular.isDefined(value))
        {
          if(value >= 1000000)
          {
            x['label'] = Math.floor(prev / 1000000) + "M - " + Math.floor(value / 1000000) + "M";
            x['title'] = prev + " - " + value;
          }
          else if(value >= 1000)
          {
            x['label'] = Math.floor(prev / 1000) + "K - " + Math.floor(value / 1000) + "K";
            x['title'] = prev + " - " + value;
          }
          else if(value > 0)
          {
            x['label'] = prev + " - " + value;
            x['title'] = prev + " - " + value;
          }
          else
          {
            x['label'] = "Zero"
            x['title'] = "Zero"
          }
        }
        return x;
      });
    }
    else
    {
      classes = classes.map(function(x, i, arr)
      {
        if(! angular.isDefined(extract("title", x)))
        {
          x['title'] = extract("label", x) || extract("value", x);
        }

        return x;
      });
    }
  }
  return classes;
};
