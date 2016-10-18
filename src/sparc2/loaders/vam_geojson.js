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
