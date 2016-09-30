module.exports = function(f, state, map_config, options)
{
  var layerID = "context";
  var style = {};
  //
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
    var currentStyleID = state["styles"][layerID];
    var currentStyleList = $.grep(fl["cartography"], function(style, i){return style.id == currentStyleID;});
    var currentStyle = (currentStyleList.length == 1) ? currentStyleList[0] : fl["cartography"][0];
    //
    var colorize = true;
    if("mask" in currentStyle)
    {
      if(normalizedFeature.attributes[currentStyle["mask"]] == 1)
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
      var value = normalizedFeature.attributes[currentStyle["attribute"]];
      var colors = currentStyle["colors"]["ramp"];
      var breakPointsName = currentStyle["breakpoints"] || "natural_adjusted";
      var breakpoints = geodash.initial_data.layers[layerID]["data"]["summary"]["all"]["breakpoints"][breakPointsName];
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

  return style;
};
