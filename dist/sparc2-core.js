(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';
/*global require, window, console, jQuery, $, angular, Bloodhound, location */
window.sparc2 = require("./sparc2");

},{"./sparc2":34}],2:[function(require,module,exports){
module.exports = function(options)
{
  var args = arguments;
  var zero_lc = args[0].toLowerCase();
  if(zero_lc == "togglemodal" || zero_lc == "showmodal")
  {
    var id = args[1];
    if(id == "geodash-modal-layer-more")
    {
      var layerType = args[2];
      var layer = args[3];
      return {
        "id": id,
        "static": {
          "layerID": layer.id,
        },
        "dynamic" : {
          "layer": [layerType, layer.id]
        }
      };
    }
    else
    {
        return "";
    }
  }
  else if(zero_lc == "hidemodal")
  {
    return { "id": args[1] };
  }
  else
  {
      return "";
  }
};

},{}],3:[function(require,module,exports){
'use strict';
/*global require, window, console, jQuery, $, angular, Bloodhound, location */
module.exports = {
  welcome: require("./welcome"),
  html5data: require("./html5data")
};

},{"./html5data":2,"./welcome":4}],4:[function(require,module,exports){
module.exports = function(options)
{
  options = options || {};
  /*var scope = options['$scope'] || options['scope'] || angular.element("#geodash-main").scope();
  var intentData = {
    "id": "geodash-modal-sparc-welcome",
    "modal": {
      "backdrop": "static",
      "keyboard": false
    },
    "dynamic": {},
    "static": {
      "welcome": extract("welcome", scope.config || scope.map_config)
    }
  };
  geodash.api.intend("toggleModal", intentData, scope);*/

  var id = "geodash-modal-sparc-welcome";
  var main_scope = geodash.util.getScope("geodash-main");
  var modal_scope = geodash.util.getScope(id);
  modal_scope.$apply(function (){
    modal_scope.push({
      "welcome": extract("welcome", main_scope.config || main_scope.map_config)
    });
    setTimeout(function(){
      $("#"+id).modal({'backdrop': 'static'});
    },0);
  });
};

},{}],5:[function(require,module,exports){
module.exports = function(response, url)
{
  var countries_typeahead = [];

  var countries = response.countries;
  for(var i = 0; i < countries.length; i++)
  {
    var country = countries[i];
    var id = extract("iso.alpha3", country) || extract("gaul.admin0_code", country);
    var title = extract("gaul.admin0_name", country) || extract("dos.short", country);
    var country_typeahead = {
      'id': id,
      'text': title,
      'obj': country
    };
    countries_typeahead.push(country_typeahead);
  }

  return countries_typeahead;
};

},{}],6:[function(require,module,exports){
module.exports = function(response, url)
{
  var hazards_typeahead = [];

  var hazards = response.hazards;
  for(var i = 0; i < hazards.length; i++)
  {
    var hazard = hazards[i];
    var hazard_typeahead = {
      'id': hazard['id'],
      'text': hazard['title'],
      'obj': hazard
    };
    hazards_typeahead.push(hazard_typeahead);
  }

  return hazards_typeahead;
};

},{}],7:[function(require,module,exports){
'use strict';
module.exports = {
  Countries: require("./Countries"),
  Hazards: require("./Hazards")
};

},{"./Countries":5,"./Hazards":6}],8:[function(require,module,exports){
'use strict';
/*global require, window, console, jQuery, $, angular, Bloodhound, location */
module.exports = {
  codec: require("./codec")
};

},{"./codec":7}],9:[function(require,module,exports){
'use strict';
/*global require, window, console, jQuery, $, angular, Bloodhound, location */
module.exports = {
  popatrisk: require("./popatrisk")
};

},{"./popatrisk":10}],10:[function(require,module,exports){
module.exports = function(hazard, feature, state, filters)
{
  var value = 0;
  var month_short3 = months_short_3[state["month"]-1];

  if(hazard == "cyclone")
  {
    var prob_class_max = state["filters"]["popatrisk"]["prob_class_max"];
    var category = state["filters"]["popatrisk"]["category"];
    for(var i = 0; i < feature.attributes.addinfo.length; i++)
    {
      var a = feature.attributes.addinfo[i];
      if(a["category"] == category)
      {
        if(a["prob_class_min"] >= prob_class_max)
        {
          value += a[month_short3];
        }
      }
    }
  }
  else if(hazard == "drought")
  {
    var prob_class_max = state["filters"]["popatrisk"]["prob_class_max"];
    for(var i = 0; i < feature.attributes.addinfo.length; i++)
    {
      var a = feature.attributes.addinfo[i];
      if(a["prob_class_min"] >= prob_class_max)
      {
        value += a[month_short3];
      }
    }
  }
  else if(hazard == "flood")
  {
    var rp = state["filters"]["popatrisk"]["rp"];
    value = feature.attributes["RP"+rp.toString(10)][month_short3];
  }
  else if(hazard == "landslide")
  {
    var prob_class_max = state["filters"]["popatrisk"]["prob_class_max"];
    for(var i = 0; i < feature.attributes.addinfo.length; i++)
    {
      var a = feature.attributes.addinfo[i];
      if(a["prob_class_min"] >= prob_class_max)
      {
        value += a[month_short3];
      }
    }
  }

  if(filters != undefined)
  {
    $.each(filters, function(i, x){
      value = sparc2.filters[x](value, state["filters"]["popatrisk"], feature);
    });
  }

  return value;
};

},{}],11:[function(require,module,exports){
module.exports = function(chartConfig, popatrisk_config, admin2_code)
{
  var groups = [[]];
  var columns = [];
  var order = undefined;

  if(chartConfig.hazard == "cyclone")
  {
    $.each(popatrisk_config["data"]["summary"]["admin2"][admin2_code]["prob_class"], function(prob_class, value){
      var data = value["by_month"];
      //
      columns.push([prob_class].concat(data));
      groups[0].push(prob_class);
    });

    groups[0].sort(function(a, b){
      return parseFloat(b.split("-")[0]) - parseFloat(a.split("-")[0]);
    });

    columns.sort(function(a, b){
      return parseFloat(a[0].split("-")[0]) - parseFloat(b[0].split("-")[0]);
    });

    order = function(data1, data2) {
      return parseFloat(data2.id.split("-")[0]) - parseFloat(data1.id.split("-")[0]);
    };
  }
  else if(chartConfig.hazard == "drought")
  {
    $.each(popatrisk_config["data"]["summary"]["admin2"][admin2_code]["prob_class"], function(prob_class, value){
      var data = value["by_month"];
      //
      columns.push([prob_class].concat(data));
      groups[0].push(prob_class);
    });

    groups[0].sort(function(a, b){
      return parseFloat(b.split("-")[0]) - parseFloat(a.split("-")[0]);
    });

    columns.sort(function(a, b){
      return parseFloat(a[0].split("-")[0]) - parseFloat(b[0].split("-")[0]);
    });

    order = function(data1, data2) {
      return parseFloat(data2.id.split("-")[0]) - parseFloat(data1.id.split("-")[0]);
    };
  }
  else if(chartConfig.hazard == "flood")
  {
    for(var i = 0; i < chartConfig.returnPeriods.length; i++)
    {
      var rp = chartConfig.returnPeriods[i];
      var data = popatrisk_config["data"]["summary"]["admin2"][admin2_code]["rp"][""+rp]["by_month"];
      //
      columns.push(['rp'+rp].concat(data));
      groups[0].push('rp'+rp);
    }
    columns.reverse();
  }
  else if(chartConfig.hazard == "landslide")
  {
    $.each(popatrisk_config["data"]["summary"]["admin2"][admin2_code]["prob_class"], function(prob_class, value){
      var data = value["by_month"];
      //
      columns.push([prob_class].concat(data));
      groups[0].push(prob_class);
    });

    var landslideClasses = ["low", "medium", "high", "very_high"];

    groups[0].sort(function(a, b){
      return landslideClasses.indexOf(b) - landslideClasses.indexOf(a);
    });

    columns.sort(function(a, b){
      return landslideClasses.indexOf(a[0]) - landslideClasses.indexOf(b[0]);
    });

    order = function(data1, data2) {
      return landslideClasses.indexOf(data2.id) - landslideClasses.indexOf(data1.id);
    };
  }
  return {'groups': groups, 'columns': columns, 'order': order};
};

},{}],12:[function(require,module,exports){
module.exports = function(chartConfig, popatrisk_config)
{
  var groups = [[]];
  var columns = [];
  var order = undefined;

  if(chartConfig.hazard == "cyclone")
  {
    $.each(popatrisk_config["data"]["summary"]["prob_class"], function(prob_class, value){
      var data = value["by_month"];
      //
      columns.push([prob_class].concat(data));
      groups[0].push(prob_class);
    });

    groups[0].sort(function(a, b){
      return parseFloat(b.split("-")[0]) - parseFloat(a.split("-")[0]);
    });

    columns.sort(function(a, b){
      return parseFloat(a[0].split("-")[0]) - parseFloat(b[0].split("-")[0]);
    });

    order = function(data1, data2) {
      return parseFloat(data2.id.split("-")[0]) - parseFloat(data1.id.split("-")[0]);
    };
  }
  else if(chartConfig.hazard == "drought")
  {
    $.each(popatrisk_config["data"]["summary"]["prob_class"], function(prob_class, value){
      var data = value["by_month"];
      //
      // console.log('buildGroupsAndColumnsForCountry.js');
      // console.log(data);
      // console.log(prob_class);
      // add % symbol to legend
      var percent = prob_class +'%'
      columns.push([percent].concat(data));
      groups[0].push(percent);
    });

    groups[0].sort(function(a, b){
      return parseFloat(b.split("-")[0]) - parseFloat(a.split("-")[0]);
    });

    columns.sort(function(a, b){
      return parseFloat(a[0].split("-")[0]) - parseFloat(b[0].split("-")[0]);
    });

    order = function(data1, data2) {
      return parseFloat(data2.id.split("-")[0]) - parseFloat(data1.id.split("-")[0]);
    };
  }
  else if(chartConfig.hazard == "flood")
  {
    for(var i = 0; i < chartConfig.groups.length; i++)
    {
      var group_prefix = chartConfig.group_prefix;
      var group_key = chartConfig.group_key;
      var g = chartConfig.groups[i];
      var group_modifier = chartConfig.group_modifier;
      var data = popatrisk_config["data"]["summary"][group_key][""+(g * group_modifier)]["by_month"];
      //
      columns.push([group_prefix+g].concat(data));
      groups[0].push(group_prefix+g);
    }
    columns.reverse();
  }
  else if(chartConfig.hazard == "landslide")
  {
    var landslideClasses = ["low", "medium", "high", "very_high"];

    $.each(popatrisk_config["data"]["summary"]["prob_class"], function(prob_class, value){
      var data = value["by_month"];
      //
      columns.push([prob_class].concat(data));
      groups[0].push(prob_class);
    });

    groups[0].sort(function(a, b){
      return landslideClasses.indexOf(b) - landslideClasses.indexOf(a);
    });

    columns.sort(function(a, b){
      return landslideClasses.indexOf(a[0]) - landslideClasses.indexOf(b[0]);
    });

    order = function(data1, data2) {
      return landslideClasses.indexOf(data2.id) - landslideClasses.indexOf(data1.id);
    };
  }

  return {'groups': groups, 'columns': columns, 'order': order};
};

},{}],13:[function(require,module,exports){
module.exports = function(chartConfig, popatrisk_config, options)
{
  var gc = undefined;
  if(chartConfig.type == "bar")
  {
    console.log('buildHazardChart.js');
    console.log(chartConfig);
    //var groups = [[]];
    //var columns = [];
    if(options != undefined && options.groups != undefined && options.columns != undefined)
    {
      gc = {
        "groups": options.groups,
        "columns": options.columns,
        "order": undefined
      };
    }
    else
    {
      gc = sparc2.charts.buildGroupsAndColumnsForCountry(chartConfig, popatrisk_config);
    }
    var barConfig = undefined;
    if(chartConfig.subtype=="bullet")
    {
      barConfig =
      {
        bullet: true,
        width: function(d, i)
        {
          return d.id == "rp25" ? 8 : 16;
        },
        offset: function(d, i)
        {
          return 0;  // Stacks bar chartActuals on top of each other
        }
      };
      if(options != undefined && options.bullet_width != undefined)
      {
        barConfig["width"] = options.bullet_width;
      }
    }
    else
    {
      barConfig = {
        width: {
          ratio: 0.6
        }
      };
    }
    var axisConfig = {"x":{}, "y": {}};
    if(chartConfig.axis != undefined && chartConfig.axis.x != undefined)
    {
      if(chartConfig.axis.x.type == "months")
      {
        axisConfig["x"]["tick"] = {
          format: function (x){return months_short_3[x].toTitleCase();}
        };
      }
    }
    axisConfig["y"]["label"] = chartConfig.axis.y.label;
    axisConfig["y"]["tick"] = {format: d3.format("s,")};

    var tooltipFormatNameFn = undefined;
    var tooltipNameFnName = extract("tooltip.name", chartConfig);
    console.log(tooltipNameFnName);

    if(angular.isString(tooltipNameFnName))
    {
      var tooltipCollections = extract("config.charts.tooltips", geodash);
      if(Array.isArray(tooltipCollections))
      {
        for(var i = 0; i < tooltipCollections.length; i++)
        {
          var tooltipCollection = tooltipCollections[i];
          if(angular.isDefined(tooltipCollection))
          {
            tooltipFormatNameFn = extract(tooltipNameFnName, tooltipCollection);
            if(angular.isDefined(tooltipFormatNameFn))
            {
              break;
            }
          }
        }
      }
    }
    var tooltipFormatValueFn = undefined;
    var tooltipValueFnName = extract("tooltip.value", chartConfig);
    console.log(tooltipValueFnName);
    if(angular.isString(tooltipValueFnName))
    {
      var tooltipCollections = extract("config.charts.tooltips", geodash);
      if(Array.isArray(tooltipCollections))
      {
        for(var i = 0; i < tooltipCollections.length; i++)
        {
          var tooltipCollection = tooltipCollections[i];
          if(angular.isDefined(tooltipCollection))
          {
            tooltipFormatValueFn = extract(tooltipValueFnName, tooltipCollection);
            if(angular.isDefined(tooltipFormatValueFn))
            {
              break;
            }
          }
        }
      }
    }
    var tooltipConfig = {
      format: {
        name: tooltipFormatNameFn,
        value: tooltipFormatValueFn
      }
    };
    var chartID = (chartConfig.element || chartConfig.id);
    var chartActual = c3.generate({
      bindto: "#"+ chartID,
      data: {
        columns: gc.columns,
        groups: gc.groups,
        type: 'bar',
        colors: chartConfig.colors,
        order: (gc.order || 'desc')
      },
      axis : axisConfig,
      bar: barConfig,
      tooltip: tooltipConfig
    });

    $("#"+ chartID).data('chart', chartActual);
  }
};

},{}],14:[function(require,module,exports){
'use strict';
/*global require, window, console, jQuery, $, angular, Bloodhound, location */
module.exports = {
  buildHazardChart: require("./buildHazardChart"),
  buildGroupsAndColumnsForCountry: require("./buildGroupsAndColumnsForCountry"),
  buildGroupsAndColumnsForAdmin2: require("./buildGroupsAndColumnsForAdmin2"),
  tooltips: require("./tooltips")
};

},{"./buildGroupsAndColumnsForAdmin2":11,"./buildGroupsAndColumnsForCountry":12,"./buildHazardChart":13,"./tooltips":20}],15:[function(require,module,exports){
module.exports = function(value, ratio, id, index)
{
  return geodash.codec.formatInteger(value, "delimited", " ");
};

},{}],16:[function(require,module,exports){
module.exports = function(value, ratio, id, index)
{
  // console.log("drought_name");
  // console.log(value);
  var percent = value +" %";
  return percent;
};

},{}],17:[function(require,module,exports){
module.exports = function(value, ratio, id, index)
{
  // return geodash.codec.formatInteger(value, "delimited", "."); // TEST this return a tooltip with values separated by dot
  return geodash.codec.formatInteger(value, "delimited", " ");
};

},{}],18:[function(require,module,exports){
module.exports = function(value, ratio, id, index)
{
  if(value == "rp25")
  {
    return "Every 25 Years (4%)"
  }
  else if(value == "rp100")
  {
    return "Every 100 Years (1%)"
  }
  else if(value == "rp1000")
  {
    return "Every 1000 Years (0.1%)"
  }
  else
  {
    return value;
  }
};

},{}],19:[function(require,module,exports){
arguments[4][15][0].apply(exports,arguments)
},{"dup":15}],20:[function(require,module,exports){
'use strict';
/*global require, window, console, jQuery, $, angular, Bloodhound, location */
module.exports = {
  cyclone_value: require("./cyclone_value"),
  drought_name: require("./drought_name"),
  drought_value: require("./drought_value"),
  flood_name: require("./flood_name"),
  flood_value: require("./flood_value"),
  landslide_value: require("./landslide_value")
};

},{"./cyclone_value":15,"./drought_name":16,"./drought_value":17,"./flood_name":18,"./flood_value":19,"./landslide_value":21}],21:[function(require,module,exports){
arguments[4][15][0].apply(exports,arguments)
},{"dup":15}],22:[function(require,module,exports){
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

},{}],23:[function(require,module,exports){
'use strict';

module.exports = {
  default: require("./default")
};

},{"./default":22}],24:[function(require,module,exports){
module.exports = function(f, state, dashboard, options)
{
  var style = {};
  var layerID = extract("layer", options);

  if(angular.isDefined(layerID))
  {
    var fl = geodash.api.getFeatureLayer(layerID);
    var normalizedFeature = geodash.normalize.feature(f);
    //

    var ldi_range = extract(["filters", layerID, "ldi_range"], state);
    var ldi = normalizedFeature.attributes.ldi;
    var erosion_propensity_range = extract(["filters", layerID, "erosion_propensity_range"], state);
    var erosion_propensity = normalizedFeature.attributes.erosion_propensity;
    var landcover_delta_negative_range = extract(["filters", layerID, "landcover_delta_negative_range"], state);
    var landcover_delta_negative = normalizedFeature.attributes.delta_negative;
    //
    if(
      (ldi == undefined || ldi_range == undefined || (ldi >= ldi_range[0] && ldi <= ldi_range[1])) &&
      (erosion_propensity == undefined || erosion_propensity_range == undefined || (erosion_propensity >= erosion_propensity_range[0] && erosion_propensity <= erosion_propensity_range[1])) &&
      (landcover_delta_negative == undefined || landcover_delta_negative_range == undefined || (landcover_delta_negative >= landcover_delta_negative_range[0] && landcover_delta_negative <= landcover_delta_negative_range[1]))
    )
    {
      var symbolizer = extract(["carto", "styles", 0, "symbolizers", 0], fl);
      var mask = extract("mask", options);
      var attr = extract("attribute", options);
      //
      var colorize = true;
      if(angular.isDefined(mask))
      {
        if(normalizedFeature.attributes[mask] == 1)
        {
          colorize = true;
        }
        else
        {
          style["fillColor"] = extract("dynamic.options.colors.outside", symbolizer); //symbolizer["colors"]["outside"]
          colorize = false;
        }
      }

      if(colorize)
      {
        var value = extract(["attributes", attr], normalizedFeature);
        var colors = options["classes"].map(function(x){ return x["color"]; });
        var breakpoints = geodash.breakpoints[options["breakpoints"]];
        var color = undefined;
        for(var i = 0; i < breakpoints.length -1; i++)
        {
          if(
            (value == breakpoints[i] && value == breakpoints[i+1]) ||
            (value >= breakpoints[i] && value < breakpoints[i+1])
          )
          {
            color = colors[i];
            break;
          }
        }
        style["fillColor"] = (color == undefined) ? colors[colors.length-1] : color;
      }
    }
    else
    {
      style["opacity"] = 0;
      style["fillOpacity"] = 0;
      style["strokeOpacity"] = 0;
      style["strokeColor"] = "rgba(0, 0, 0, 0)";
    }
  }

  return style;
};

},{}],25:[function(require,module,exports){
module.exports = function(f, state, dashboard, options)
{
  var layerID = "popatrisk";
  var style = {};
  //
  var fl = geodash.api.getFeatureLayer(layerID);
  var normalizedFeature = geodash.normalize.feature(f);
  //
  var popatrisk_range = extract(["filters", layerID, "popatrisk_range"], state);
  var ldi_range = extract(["filters", layerID, "ldi_range"], state);
  var ldi = normalizedFeature.attributes.ldi;
  var erosion_propensity_range = extract(["filters", layerID, "erosion_propensity_range"], state);
  var erosion_propensity = normalizedFeature.attributes.erosion_propensity;
  var landcover_delta_negative_range = extract(["filters", layerID, "landcover_delta_negative_range"], state);
  var landcover_delta_negative = normalizedFeature.attributes.delta_negative;

  var value = sparc2.calc.popatrisk(
    'cyclone',
    normalizedFeature,
    state,
    options.filters);

  if(
    value >= popatrisk_range[0] && value <= popatrisk_range[1] &&
    (ldi == undefined || (ldi >= ldi_range[0] && ldi <= ldi_range[1])) &&
    (erosion_propensity == undefined || (erosion_propensity >= erosion_propensity_range[0] && erosion_propensity <= erosion_propensity_range[1])) &&
    (landcover_delta_negative == undefined || (landcover_delta_negative >= landcover_delta_negative_range[0] && landcover_delta_negative <= landcover_delta_negative_range[1]))
  )
  {
    var colors = options["colors"]["ramp"];
    var breakpoints = geodash.breakpoints[options["breakpoints"]];
    var color = undefined;
    for(var i = 0; i < breakpoints.length -1; i++)
    {
      if(
        (value == breakpoints[i] && value == breakpoints[i+1]) ||
        (value >= breakpoints[i] && value < breakpoints[i+1])
      )
      {
        color = colors[i];
        break;
      }
    }
    style["fillColor"] = (color == undefined) ? colors[colors.length-1] : color;
  }
  else
  {
    style["opacity"] = 0;
    style["fillOpacity"] = 0;
    style["strokeOpacity"] = 0;
    style["strokeColor"] = "rgba(0, 0, 0, 0)";
  }
  return style;
};

},{}],26:[function(require,module,exports){
module.exports = function(f, state, dashboard, options)
{
  var layerID = "popatrisk";
  var style = {};
  //
  var fl = geodash.api.getFeatureLayer(layerID);
  var normalizedFeature = geodash.normalize.feature(f);
  //
  var popatrisk_range = extract(["filters", layerID, "popatrisk_range"], state);
  var ldi_range = extract(["filters", layerID, "ldi_range"], state);
  var ldi = normalizedFeature.attributes.ldi;
  var erosion_propensity_range = extract(["filters", layerID, "erosion_propensity_range"], state);
  var erosion_propensity = normalizedFeature.attributes.erosion_propensity;
  var landcover_delta_negative_range = extract(["filters", layerID, "landcover_delta_negative_range"], state);
  var landcover_delta_negative = normalizedFeature.attributes.delta_negative;

  var value = sparc2.calc.popatrisk(
    'drought',
    normalizedFeature,
    state,
    options.filters);

  if(
    value >= popatrisk_range[0] && value <= popatrisk_range[1] &&
    (ldi == undefined || (ldi >= ldi_range[0] && ldi <= ldi_range[1])) &&
    (erosion_propensity == undefined || (erosion_propensity >= erosion_propensity_range[0] && erosion_propensity <= erosion_propensity_range[1])) &&
    (landcover_delta_negative == undefined || (landcover_delta_negative >= landcover_delta_negative_range[0] && landcover_delta_negative <= landcover_delta_negative_range[1]))
  )
  {
    var colors = options["colors"]["ramp"];
    var breakpoints = geodash.breakpoints[options["breakpoints"]];
    var color = undefined;
    for(var i = 0; i < breakpoints.length -1; i++)
    {
      if(
        (value == breakpoints[i] && value == breakpoints[i+1]) ||
        (value >= breakpoints[i] && value < breakpoints[i+1])
      )
      {
        color = colors[i];
        break;
      }
    }
    style["fillColor"] = (color == undefined) ? colors[colors.length-1] : color;
  }
  else
  {
    style["opacity"] = 0;
    style["fillOpacity"] = 0;
    style["strokeOpacity"] = 0;
    style["strokeColor"] = "rgba(0, 0, 0, 0)";
  }
  return style;
};

},{}],27:[function(require,module,exports){
module.exports = function(f, state, dashboard, options)
{
  var layerID = "popatrisk";
  var style = {};
  //
  var fl = geodash.api.getFeatureLayer(layerID);
  var normalizedFeature = geodash.normalize.feature(f);
  //
  var popatrisk_range = extract(["filters", layerID, "popatrisk_range"], state);
  var ldi_range = extract(["filters", layerID, "ldi_range"], state);
  var ldi = normalizedFeature.attributes.ldi;
  var erosion_propensity_range = extract(["filters", layerID, "erosion_propensity_range"], state);
  var erosion_propensity = normalizedFeature.attributes.erosion_propensity;
  var landcover_delta_negative_range = extract(["filters", layerID, "landcover_delta_negative_range"], state);
  var landcover_delta_negative = normalizedFeature.attributes.delta_negative;

  var value = sparc2.calc.popatrisk(
    'flood',
    normalizedFeature,
    state,
    options.filters);

  if(
    value >= popatrisk_range[0] && value <= popatrisk_range[1] &&
    (ldi == undefined || (ldi >= ldi_range[0] && ldi <= ldi_range[1])) &&
    (erosion_propensity == undefined || (erosion_propensity >= erosion_propensity_range[0] && erosion_propensity <= erosion_propensity_range[1])) &&
    (landcover_delta_negative == undefined || (landcover_delta_negative >= landcover_delta_negative_range[0] && landcover_delta_negative <= landcover_delta_negative_range[1]))
  )
  {
    var colors = options["colors"]["ramp"];
    var breakpoints = geodash.breakpoints[options["breakpoints"]];
    var color = undefined;
    for(var i = 0; i < breakpoints.length -1; i++)
    {
      if(
        (value == breakpoints[i] && value == breakpoints[i+1]) ||
        (value >= breakpoints[i] && value < breakpoints[i+1])
      )
      {
        color = colors[i];
        break;
      }
    }
    style["fillColor"] = (color == undefined) ? colors[colors.length-1] : color;
  }
  else
  {
    style["opacity"] = 0;
    style["fillOpacity"] = 0;
    style["strokeOpacity"] = 0;
    style["strokeColor"] = "rgba(0, 0, 0, 0)";
  }
  return style;
};

},{}],28:[function(require,module,exports){
'use strict';
/*global require, window, console, jQuery, $, angular, Bloodhound, location */
module.exports = {
  context: require("./context"),
  cyclone: require("./cyclone"),
  drought: require("./drought"),
  flood: require("./flood"),
  landslide: require("./landslide"),
  ldi: require("./ldi")
};

},{"./context":24,"./cyclone":25,"./drought":26,"./flood":27,"./landslide":29,"./ldi":30}],29:[function(require,module,exports){
module.exports = function(f, state, dashboard, options)
{
  var layerID = "popatrisk";
  var style = {};
  //
  var fl = geodash.api.getFeatureLayer(layerID);
  var normalizedFeature = geodash.normalize.feature(f);
  //
  var popatrisk_range = extract(["filters", layerID, "popatrisk_range"], state);
  var ldi_range = extract(["filters", layerID, "ldi_range"], state);
  var ldi = normalizedFeature.attributes.ldi;
  var erosion_propensity_range = extract(["filters", layerID, "erosion_propensity_range"], state);
  var erosion_propensity = normalizedFeature.attributes.erosion_propensity;
  var landcover_delta_negative_range = extract(["filters", layerID, "landcover_delta_negative_range"], state);
  var landcover_delta_negative = normalizedFeature.attributes.delta_negative;

  var value = sparc2.calc.popatrisk(
    'landslide',
    normalizedFeature,
    state,
    options.filters);

  if(
    value >= popatrisk_range[0] && value <= popatrisk_range[1] &&
    (ldi == undefined || (ldi >= ldi_range[0] && ldi <= ldi_range[1])) &&
    (erosion_propensity == undefined || (erosion_propensity >= erosion_propensity_range[0] && erosion_propensity <= erosion_propensity_range[1])) &&
    (landcover_delta_negative == undefined || (landcover_delta_negative >= landcover_delta_negative_range[0] && landcover_delta_negative <= landcover_delta_negative_range[1]))
  )
  {
    var colors = options["colors"]["ramp"];
    var breakpoints = geodash.breakpoints[options["breakpoints"]];
    var color = undefined;
    for(var i = 0; i < breakpoints.length -1; i++)
    {
      if(
        (value == breakpoints[i] && value == breakpoints[i+1]) ||
        (value >= breakpoints[i] && value < breakpoints[i+1])
      )
      {
        color = colors[i];
        break;
      }
    }
    style["fillColor"] = (color == undefined) ? colors[colors.length-1] : color;
  }
  else
  {
    style["opacity"] = 0;
    style["fillOpacity"] = 0;
    style["strokeOpacity"] = 0;
    style["strokeColor"] = "rgba(0, 0, 0, 0)";
  }
  return style;
};

},{}],30:[function(require,module,exports){
module.exports = function(f, state, dashboard, options)
{
  var style = {};
  var layerID = extract("layer", options);

  if(angular.isDefined(layerID))
  {
    var fl = geodash.api.getFeatureLayer(layerID);
    var normalizedFeature = geodash.normalize.feature(f);
    //

    var ldi_range = extract(["filters", layerID, "ldi_range"], state);
    var ldi = normalizedFeature.attributes.ldi;
    var erosion_propensity_range = extract(["filters", layerID, "erosion_propensity_range"], state);
    var erosion_propensity = normalizedFeature.attributes.erosion_propensity;
    var landcover_delta_negative_range = extract(["filters", layerID, "landcover_delta_negative_range"], state);
    var landcover_delta_negative = normalizedFeature.attributes.delta_negative;
    //
    if(
      (ldi == undefined || ldi_range == undefined || (ldi >= ldi_range[0] && ldi <= ldi_range[1])) &&
      (erosion_propensity == undefined || erosion_propensity_range == undefined || (erosion_propensity >= erosion_propensity_range[0] && erosion_propensity <= erosion_propensity_range[1])) &&
      (landcover_delta_negative == undefined || landcover_delta_negative_range == undefined || (landcover_delta_negative >= landcover_delta_negative_range[0] && landcover_delta_negative <= landcover_delta_negative_range[1]))
    )
    {
      var symbolizer = extract(["carto", "styles", 0, "symbolizers", 0], fl);
      var mask = extract("mask", options);
      var attr = extract("attribute", options);
      //
      var colorize = true;
      if(angular.isDefined(mask))
      {
        if(normalizedFeature.attributes[mask] == 1)
        {
          colorize = true;
        }
        else
        {
          style["fillColor"] = extract("colors.outside", options); //symbolizer["colors"]["outside"]
          colorize = false;
        }
      }

      if(colorize)
      {
        var value = extract(["attributes", attr], normalizedFeature);
        var colors = options["classes"].map(function(x){ return x["color"]; });
        style["fillColor"] = extract([value - 1], colors) || extract(["colors", "outside"], options); //options["colors"]["ramp"];
        //style["fillColor"] = (color == undefined) ? colors[value-1] : color;
      }
    }
    else
    {
      style["opacity"] = 0;
      style["fillOpacity"] = 0;
      style["strokeOpacity"] = 0;
      style["strokeColor"] = "rgba(0, 0, 0, 0)";
    }
  }

  return style;
};

},{}],31:[function(require,module,exports){
'use strict';
/*global require, window, console, jQuery, $, angular, Bloodhound, location */
module.exports = {
  vam_filter_csi: require("./vam_filter_csi"),
  vam_filter_fcs: require("./vam_filter_fcs")
};

},{"./vam_filter_csi":32,"./vam_filter_fcs":33}],32:[function(require,module,exports){
module.exports = function(value, filters, f)
{
  // Adjust by VAM FCS Filter
  if(filters["csi"] != undefined)
  {
    var csi_modifier = 100.0;
    if(filters["csi"].length == 0)
    {
      csi_modifier = 0.0;
    }
    else
    {
      if(filters["csi"].join(",") != "no,low,medium,high")
      {
        var admin1_code = f.attributes.admin1_code;
        var matches = $.grep(geodash.initial_data.layers.vam.data.geojson.features, function(x, i){
            return x.properties.admin1_code == admin1_code;
        });
        if(matches.length > 0)
        {
          var match = matches[0];
          if(match.properties.vam.csi != undefined)
          {
            csi_modifier = 0;
            $.each(match.properties.vam.csi, function(k,v){
                if($.inArray(k,filters["csi"])!= -1)
                {
                  csi_modifier += v;
                }
            });
          }
        }
      }
    }
    value = value * (csi_modifier / 100.0);
  }
  return value;
};

},{}],33:[function(require,module,exports){
module.exports = function(value, filters, f)
{
  // Adjust by VAM FCS Filter
  if(filters["fcs"] != undefined)
  {
    var fcs_modifier = 100.0;
    if(filters["fcs"].length == 0)
    {
      fcs_modifier = 0.0;
    }
    else
    {
      if(filters["fcs"].join(",") != "poor,borderline,acceptable")
      {
        console.log("FCS Filter:", filters["fcs"]);
        var admin1_code = f.attributes.admin1_code;
        var matches = $.grep(geodash.initial_data.layers.vam.data.geojson.features, function(x, i){
            return x.properties.admin1_code == admin1_code;
        });
        if(matches.length > 0)
        {
          var match = matches[0];
          if(match.properties.vam.fcs != undefined)
          {
            fcs_modifier = 0;
            $.each(match.properties.vam.fcs, function(k,v){
                if($.inArray(k,filters["fcs"])!= -1)
                {
                  fcs_modifier += v;
                }
            });
          }
        }
      }
    }
    value = value * (fcs_modifier / 100.0);
  }
  return value;
};

},{}],34:[function(require,module,exports){
'use strict';
/*global require, window, console, jQuery, $, angular, Bloodhound, location */
module.exports = {
  api: require("./api"),
  bloodhound: require("./bloodhound"),
  calc: require("./calc"),
  charts: require("./charts"),
  classifier: require("./classifier"),
  dynamicStyleFn: require("./dynamicStyleFn"),
  filters: require("./filters"),
  loaders: require("./loaders"),
  popup: require("./popup"),
  transport: require("./transport"),
  typeahead: require("./typeahead")
};

},{"./api":3,"./bloodhound":8,"./calc":9,"./charts":14,"./classifier":23,"./dynamicStyleFn":28,"./filters":31,"./loaders":37,"./popup":40,"./transport":50,"./typeahead":55}],35:[function(require,module,exports){
module.exports = function(response)
{
  var contentType = response.headers("Content-Type");
  if(contentType == "application/json")
  {
    // Storing data used by GeoJSON layer
    geodash.initial_data.layers.context.data.geojson = response.data;

    // Storing data used in popups
    geodash.initial_data["data"]["context"] = { "admin1": {} };
    var features = extract("layers.context.data.geojson.features", geodash.initial_data, []);
    var propertyNames = ["ldi", "delta_mean", "delta_positive", "delta_negative", "delta_crop", "delta_forest", "erosion_propensity"];
    for(var i = 0; i < features.length; i++)
    {
      var feature = features[i];
      for(var j = 0; j < propertyNames.length; j++)
      {
        var propertyName = propertyNames[j];
        var admin1_code = "" + extract("properties.admin1_code", feature, "");
        var admin2_code = "" + extract("properties.admin2_code", feature, "");
        var value = extract(["properties", propertyName], feature, "");
        if(admin1_code.length > 0 && admin2_code.length > 0)
        {
          //if(angular.isDefined(geodash.initial_data.data.context.admin1[admin1_code]))
          geodash.util.setValue(["data", "context", "admin1", admin1_code, "admin2", admin2_code, propertyName], value, geodash.initial_data);
        }
      }
    }
  }
};

},{}],36:[function(require,module,exports){
module.exports = function(response)
{
  var contentType = response.headers("Content-Type");
  if(contentType == "application/json")
  {
    geodash.initial_data["layers"]["context"]["data"]["summary"] = response.data;
  }

  if(! angular.isDefined(geodash.breakpoints))
  {
    geodash.breakpoints = {};
  }

  if("all" in geodash.initial_data["layers"]["context"]["data"]["summary"])
  {
    $.each(geodash.initial_data["layers"]["context"]["data"]["summary"]["all"]["breakpoints"], function(k, v){
      geodash.breakpoints["context_"+k] = v;
    });
  }

};

},{}],37:[function(require,module,exports){
'use strict';

module.exports = {
  context_geojson: require("./context_geojson"),
  context_summary: require("./context_summary"),
  popatrisk_summary: require("./popatrisk_summary"),
  vam_geojson: require("./vam_geojson")
};

},{"./context_geojson":35,"./context_summary":36,"./popatrisk_summary":38,"./vam_geojson":39}],38:[function(require,module,exports){
module.exports = function(response)
{
  var contentType = response.headers("Content-Type");
  if(contentType == "application/json")
  {
    geodash.initial_data["layers"]["popatrisk"]["data"]["summary"] = response.data;
  }
  else
  {
    geodash.initial_data["layers"]["popatrisk"]["data"]["summary"]  = sparc2.transport.decode.summary(response.data);
  }

  if(! angular.isDefined(geodash.breakpoints))
  {
    geodash.breakpoints = {};
  }

  if("all" in geodash.initial_data["layers"]["popatrisk"]["data"]["summary"])
  {
    $.each(geodash.initial_data["layers"]["popatrisk"]["data"]["summary"]["all"]["breakpoints"], function(k, v){
      geodash.breakpoints["popatrisk_"+k] = v;
    });
  }
};

},{}],39:[function(require,module,exports){
module.exports = function(response)
{
  var contentType = response.headers("Content-Type");
  if(contentType == "application/json")
  {
    geodash.initial_data.layers.vam.data.geojson = response.data;
    geodash.initial_data["data"]["vam"] = {
      "admin1": {}
    };
    var features = extract("layers.vam.data.geojson.features", geodash.initial_data, []);
    for(var i = 0; i < features.length; i++)
    {
      var admin1_code = extract("properties.admin1_code", features[i]);
      var admin1_vam = extract("properties.vam", features[i]);
      if(angular.isDefined(admin1_code) && angular.isDefined(admin1_vam))
      {
        geodash.initial_data.data.vam.admin1[""+admin1_code] = admin1_vam;
      }
    }
  }
};

},{}],40:[function(require,module,exports){
'use strict';
/*global require, window, console, jQuery, $, angular, Bloodhound, location */
module.exports = {
  initChart: require("./initChart")
};

},{"./initChart":41}],41:[function(require,module,exports){
module.exports = function(featureLayer, feature, location, map, state)
{
  var panes = extract("popup.panes", featureLayer);
  if(Array.isArray(panes))
  {
    for(var i = 0; i < panes.length; i++)
    {
      var pane = panes[i];
      var charts = extract("charts", pane)
      if(Array.isArray(charts))
      {
        for(var j = 0; j < charts.length; j++)
        {
          var chartConfig = charts[j];
          var initialData = extract("layers.popatrisk", geodash.initial_data);
          var admin2_code = extract("attributes.admin2_code", feature);

          if(angular.isDefined(admin2_code))
          {
            var gc = sparc2.charts.buildGroupsAndColumnsForAdmin2(
              chartConfig,
              initialData,
              admin2_code);

            sparc2.charts.buildHazardChart(chartConfig, initialData, {
              groups: gc.groups,
              columns: gc.columns,
              bullet_width: function(d, i) { return d.id == "rp25" ? 6 : 12; }
            });
          }
        }
      }
    }
  }
};

},{}],42:[function(require,module,exports){
'use strict';
/*global require, window, console, jQuery, $, angular, Bloodhound, location */
module.exports = {
  intarray: require("./intarray"),
  intarrays: require("./intarrays"),
  string: require("./string"),
  stringarray: require("./stringarray"),
  summary: require("./summary")
};

},{"./intarray":43,"./intarrays":44,"./string":45,"./stringarray":46,"./summary":47}],43:[function(require,module,exports){
module.exports = function(options)
{
  var view = options.view;
  var littleEndian = geodash.config.transport.littleEndian;

  var offset = options.offset;
  var count = options.count;

  var decoded = [];
  for(var i = 0; i < count; i++)
  {
    decoded.push(view.getInt32(offset+(4*i), littleEndian));
  }
  return decoded;
};

},{}],44:[function(require,module,exports){
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

},{}],45:[function(require,module,exports){
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

},{}],46:[function(require,module,exports){
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

},{}],47:[function(require,module,exports){
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

},{}],48:[function(require,module,exports){
'use strict';
/*global require, window, console, jQuery, $, angular, Bloodhound, location */
module.exports = {
  summary: require("./summary")
};

},{"./summary":49}],49:[function(require,module,exports){
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

},{}],50:[function(require,module,exports){
'use strict';
/*global require, window, console, jQuery, $, angular, Bloodhound, location */
module.exports = {
  header: require("./header"),
  decode: require("./decode"),
  load: require("./load")
};

},{"./decode":42,"./header":48,"./load":51}],51:[function(require,module,exports){
module.exports = function(response)
{
  //var r = response.split(",");
  var r = response;
  var view = new DataView(new ArrayBuffer(r.length));
  for(var i = 0; i < r.length; i++)
  {
    //view.setInt8(i, parseInt(r[i], 16));
    view.setInt8(i, r.charCodeAt(i));
  }
  return view;
};

},{}],52:[function(require,module,exports){
module.exports = function(element, featurelayers, baselayers, servers, codecs)
{
  var datasets = [];
  var template_suggestion = extract(element.data('template-suggestion') || 'default', geodash.typeahead.templates.suggestion);
  var url = geodash.api.getEndpoint("sparc2_countries_json");
  var local = undefined;
  var prefetchOptions = {
    url: url,
    dataType: 'json',
    codec: "Countries",
    cache: false,
    codecs: codecs
  };
  var prefetch = geodash.bloodhound.prefetch(prefetchOptions);
  var remote = undefined;
  var engine = geodash.bloodhound.engine({
    "local": local,
    "prefetch": prefetch,
    "remote": remote
  });
  var templates = {
    suggestion: template_suggestion
  };
  var dataset = {
    name: "countries",
    engine: engine,
    minLength: 0,
    limit: 10,
    hint: false,
    highlight: true,
    display: geodash.typeahead.displayFn,
    source: function (query, syncResults, asyncResults)
    {
      // https://github.com/twitter/typeahead.js/pull/719#issuecomment-43083651
      // http://pastebin.com/adWHFupF
      //query == "" ? cb(data) : engine.ttAdapter()(query, cb);
      this.engine.ttAdapter()(query, syncResults, asyncResults);
    },
    templates: templates
  };
  datasets.push(dataset);

  return datasets;
};

},{}],53:[function(require,module,exports){
module.exports = function(element, featurelayers, baselayers, servers, codecs)
{
  var datasets = [];
  var template_suggestion = extract(element.data('template-suggestion') || 'default', geodash.typeahead.templates.suggestion);
  var url = geodash.api.getEndpoint("sparc2_hazards_json");
  var local = undefined;
  var prefetchOptions = {
    url: url,
    dataType: 'json',
    codec: "Hazards",
    cache: false,
    codecs: codecs
  };
  var prefetch = geodash.bloodhound.prefetch(prefetchOptions);
  var remote = undefined;
  var engine = geodash.bloodhound.engine({
    "local": local,
    "prefetch": prefetch,
    "remote": remote
  });
  var templates = {
    suggestion: template_suggestion
  };
  var dataset = {
    name: "hazards",
    engine: engine,
    minLength: 0,
    limit: 10,
    hint: false,
    highlight: true,
    display: geodash.typeahead.displayFn,
    source: function (query, syncResults, asyncResults)
    {
      // https://github.com/twitter/typeahead.js/pull/719#issuecomment-43083651
      // http://pastebin.com/adWHFupF
      //query == "" ? cb(data) : engine.ttAdapter()(query, cb);
      this.engine.ttAdapter()(query, syncResults, asyncResults);
    },
    templates: templates
  };
  datasets.push(dataset);

  return datasets;
};

},{}],54:[function(require,module,exports){
'use strict';
/*global require, window, console, jQuery, $, angular, Bloodhound, location */
module.exports = {
  Countries: require("./Countries"),
  Hazards: require("./Hazards")
};

},{"./Countries":52,"./Hazards":53}],55:[function(require,module,exports){
'use strict';
/*global require, window, console, jQuery, $, angular, Bloodhound, location */
module.exports = {
  datasets: require("./datasets")
};

},{"./datasets":54}]},{},[1]);
