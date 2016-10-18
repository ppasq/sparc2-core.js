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
