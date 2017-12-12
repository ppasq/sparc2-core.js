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
      // add % symbol to column values 
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
