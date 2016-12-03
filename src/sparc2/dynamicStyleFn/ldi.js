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
