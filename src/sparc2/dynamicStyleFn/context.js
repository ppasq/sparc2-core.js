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
