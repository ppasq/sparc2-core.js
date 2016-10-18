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
