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
