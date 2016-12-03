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
