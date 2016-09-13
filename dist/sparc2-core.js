(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';
/*global require, window, console, jQuery, $, angular, Bloodhound, location */
window.sparc2 = require("./sparc2");

},{"./sparc2":24}],2:[function(require,module,exports){
module.exports = function()
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
  var main_scope = geodash.api.getScope("geodash-main");
  var modal_scope = geodash.api.getScope(id);
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
        if(a["prob_class_max"] >= prob_class_max)
        {
          console.log("matched prob_class", prob_class_max);
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
      if(a["prob_class_max"] >= prob_class_max)
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
      if(a["prob_class_max"] >= prob_class_max)
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
    var chartActual = c3.generate({
      bindto: "#"+ (chartConfig.element || chartConfig.id),
      data: {
        columns: gc.columns,
        groups: gc.groups,
        type: 'bar',
        colors: chartConfig.colors,
        order: (gc.order || 'desc')
      },
      axis : axisConfig,
      bar: barConfig
    });
  }
};

},{}],14:[function(require,module,exports){
'use strict';
/*global require, window, console, jQuery, $, angular, Bloodhound, location */
module.exports = {
  buildHazardChart: require("./buildHazardChart"),
  buildGroupsAndColumnsForCountry: require("./buildGroupsAndColumnsForCountry"),
  buildGroupsAndColumnsForAdmin2: require("./buildGroupsAndColumnsForAdmin2")
};

},{"./buildGroupsAndColumnsForAdmin2":11,"./buildGroupsAndColumnsForCountry":12,"./buildHazardChart":13}],15:[function(require,module,exports){
module.exports = function(f, state, map_config, options)
{
  var fl = geodash.api.getFeatureLayer("context");
  var style = {};
  var filters = state["filters"]["context"];
  var currentStyleID = state["styles"]["context"];
  var currentStyleList = $.grep(fl["cartography"], function(style, i){return style.id == currentStyleID;});
  var currentStyle = (currentStyleList.length == 1) ? currentStyleList[0] : fl["cartography"][0];
  //
  var colorize = true;
  if("mask" in currentStyle)
  {
    if(f.properties[currentStyle["mask"]] == 1)
    {
      colorize = true;
    }
    else
    {
      style["fillColor"] = currentStyle["colors"]["outside"]
      colorize = false;
    }
  }

  if(colorize)
  {
    var value = f.properties[currentStyle["attribute"]];
    var colors = currentStyle["colors"]["ramp"];
    var breakPointsName = currentStyle["breakpoints"] || "natural_adjusted";
    var breakpoints = geodash.initial_data.layers.context["data"]["summary"]["all"]["breakpoints"][breakPointsName];
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

  return style;
};

},{}],16:[function(require,module,exports){
module.exports = function(f, state, map_config, options)
{
  var fl = geodash.api.getFeatureLayer("popatrisk");
  var style = {};
  var filters = state["filters"]["popatrisk"];
  var popatrisk_range = filters["popatrisk_range"];
  var ldi_range = filters["ldi_range"];
  var ldi = f.properties.ldi;
  var erosion_propensity_range = filters["erosion_propensity_range"];
  var erosion_propensity = f.properties.erosion_propensity;
  var landcover_delta_negative_range = filters["landcover_delta_negative_range"];
  var landcover_delta_negative = f.properties.delta_negative;

  var value = sparc.calc.popatrisk(
    'cyclone',
    geodash.api.normalize_feature(f),
    state,
    options.filters);

  if(
    value >= popatrisk_range[0] && value <= popatrisk_range[1] &&
    (ldi == undefined || (ldi >= ldi_range[0] && ldi <= ldi_range[1])) &&
    (erosion_propensity == undefined || (erosion_propensity >= erosion_propensity_range[0] && erosion_propensity <= erosion_propensity_range[1])) &&
    (landcover_delta_negative == undefined || (landcover_delta_negative >= landcover_delta_negative_range[0] && landcover_delta_negative <= landcover_delta_negative_range[1]))
  )
  {
    var colors = fl["cartography"][0]["colors"]["ramp"];
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
  }
  return style;
};

},{}],17:[function(require,module,exports){
module.exports = function(f, state, map_config, options)
{
  var fl = geodash.api.getFeatureLayer("popatrisk");
  var style = {};
  var filters = state["filters"]["popatrisk"];
  var popatrisk_range = filters["popatrisk_range"];
  var ldi_range = filters["ldi_range"];
  var ldi = f.properties.ldi;
  var erosion_propensity_range = filters["erosion_propensity_range"];
  var erosion_propensity = f.properties.erosion_propensity;
  var landcover_delta_negative_range = filters["landcover_delta_negative_range"];
  var landcover_delta_negative = f.properties.delta_negative;

  var value = sparc.calc.popatrisk(
    'drought',
    geodash.api.normalize_feature(f),
    state,
    options.filters);

  if(
    value >= popatrisk_range[0] && value <= popatrisk_range[1] &&
    (ldi == undefined || (ldi >= ldi_range[0] && ldi <= ldi_range[1])) &&
    (erosion_propensity == undefined || (erosion_propensity >= erosion_propensity_range[0] && erosion_propensity <= erosion_propensity_range[1])) &&
    (landcover_delta_negative == undefined || (landcover_delta_negative >= landcover_delta_negative_range[0] && landcover_delta_negative <= landcover_delta_negative_range[1]))
  )
  {
    var colors = fl["cartography"][0]["colors"]["ramp"];
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
  }
  return style;
};

},{}],18:[function(require,module,exports){
module.exports = function(f, state, map_config, options)
{
  var fl = geodash.api.getFeatureLayer("popatrisk");
  var normalizedFeature = geodash.normalize.feature(f);
  var style = {};
  var filters = state["filters"]["popatrisk"];
  var popatrisk_range = filters["popatrisk_range"];
  var ldi_range = filters["ldi_range"];
  var ldi = normalizedFeature.attributes.ldi;
  var erosion_propensity_range = filters["erosion_propensity_range"];
  var erosion_propensity = normalizedFeature.attributes.erosion_propensity;
  var landcover_delta_negative_range = filters["landcover_delta_negative_range"];
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
  }
  return style;
};

},{}],19:[function(require,module,exports){
'use strict';
/*global require, window, console, jQuery, $, angular, Bloodhound, location */
module.exports = {
  context: require("./context"),
  cyclone: require("./cyclone"),
  drought: require("./drought"),
  flood: require("./flood"),
  landslide: require("./landslide")
};

},{"./context":15,"./cyclone":16,"./drought":17,"./flood":18,"./landslide":20}],20:[function(require,module,exports){
module.exports = function(f, state, map_config, options)
{
  var fl = geodash.api.getFeatureLayer("popatrisk");
  var style = {};
  var filters = state["filters"]["popatrisk"];
  var popatrisk_range = filters["popatrisk_range"];
  var ldi_range = filters["ldi_range"];
  var ldi = f.properties.ldi;
  var erosion_propensity_range = filters["erosion_propensity_range"];
  var erosion_propensity = f.properties.erosion_propensity;
  var landcover_delta_negative_range = filters["landcover_delta_negative_range"];
  var landcover_delta_negative = f.properties.delta_negative;

  var value = sparc.calc.popatrisk(
    'landslide',
    geodash.api.normalize_feature(f),
    state,
    options.filters);

  if(
    value >= popatrisk_range[0] && value <= popatrisk_range[1] &&
    (ldi == undefined || (ldi >= ldi_range[0] && ldi <= ldi_range[1])) &&
    (erosion_propensity == undefined || (erosion_propensity >= erosion_propensity_range[0] && erosion_propensity <= erosion_propensity_range[1])) &&
    (landcover_delta_negative == undefined || (landcover_delta_negative >= landcover_delta_negative_range[0] && landcover_delta_negative <= landcover_delta_negative_range[1]))
  )
  {
      var colors = fl["cartography"][0]["colors"]["ramp"];
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
  }
  return style;
};

},{}],21:[function(require,module,exports){
'use strict';
/*global require, window, console, jQuery, $, angular, Bloodhound, location */
module.exports = {
  vam_filter_csi: require("./vam_filter_csi"),
  vam_filter_fcs: require("./vam_filter_fcs")
};

},{"./vam_filter_csi":22,"./vam_filter_fcs":23}],22:[function(require,module,exports){
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

},{}],23:[function(require,module,exports){
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

},{}],24:[function(require,module,exports){
'use strict';
/*global require, window, console, jQuery, $, angular, Bloodhound, location */
module.exports = {
  api: require("./api"),
  bloodhound: require("./bloodhound"),
  calc: require("./calc"),
  charts: require("./charts"),
  dynamicStyleFn: require("./dynamicStyleFn"),
  filters: require("./filters"),
  typeahead: require("./typeahead")
};

},{"./api":3,"./bloodhound":8,"./calc":9,"./charts":14,"./dynamicStyleFn":19,"./filters":21,"./typeahead":28}],25:[function(require,module,exports){
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
  var remoteOptions = {
    url: url,
    dataType: 'json',
    codec: "Countries",
    rate: 1000,
    codecs: codecs
  };
  var remote = geodash.bloodhound.remote(remoteOptions);
  var engine = geodash.bloodhound.engine(local, prefetch, remote);
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

},{}],26:[function(require,module,exports){
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
  var remoteOptions = {
    url: url,
    dataType: 'json',
    codec: "Hazards",
    rate: 1000,
    codecs: codecs
  };
  var remote = geodash.bloodhound.remote(remoteOptions);
  var engine = geodash.bloodhound.engine(local, prefetch, remote);
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

},{}],27:[function(require,module,exports){
'use strict';
/*global require, window, console, jQuery, $, angular, Bloodhound, location */
module.exports = {
  Countries: require("./Countries"),
  Hazards: require("./Hazards")
};

},{"./Countries":25,"./Hazards":26}],28:[function(require,module,exports){
'use strict';
/*global require, window, console, jQuery, $, angular, Bloodhound, location */
module.exports = {
  datasets: require("./datasets")
};

},{"./datasets":27}]},{},[1]);
