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
      // add % symbol to column values
      var prob_perc;
      if (prob_class == "0.01-0.1") {prob_perc = "0.1-10%"}
      if (prob_class == "0.1-0.2") {prob_perc = "10-20%"}
      if (prob_class == "0.2-0.3") {prob_perc = "20-30%"}
      if (prob_class == "0.3-0.4") {prob_perc = "30-40%"}
      if (prob_class == "0.4-0.5") {prob_perc = "40-50%"}
      if (prob_class == "0.5-0.6") {prob_perc = "50-60%"}
      if (prob_class == "0.6-0.7") {prob_perc = "60-70%"}
      if (prob_class == "0.7-0.8") {prob_perc = "70-80%"}
      if (prob_class == "0.8-0.9") {prob_perc = "80-90%"}
      if (prob_class == "0.9-1.0") {prob_perc = "90-100%"}
      columns.push([prob_perc].concat(data));
      groups[0].push(prob_perc);
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
      var prob_perc;
      if (prob_class == "0.01-0.05") {prob_perc = "1-5%"}
      if (prob_class == "0.06-0.10") {prob_perc = "5-10%"}
      if (prob_class == "0.11-0.19") {prob_perc = "10-20%"}
      if (prob_class == "0.20-1.0") {prob_perc = "20-100%"}

      columns.push([prob_perc].concat(data));
      groups[0].push(prob_perc);
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
