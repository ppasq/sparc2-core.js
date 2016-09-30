module.exports = function(featureLayer, feature, location, map, state)
{
  var panes = extract("popup.panes", featureLayer);
  if(Array.isArray(panes))
  {
    for(var i = 0; i < panes.length; i++)
    {
      var pane = panes[i];
      var charts = extract("charts", pane)
      if(Array.isArray(charts))
      {
        for(var j = 0; j < charts.length; j++)
        {
          var chartConfig = charts[j];
          var initialData = extract("layers.popatrisk", geodash.initial_data);
          var admin2_code = extract("attributes.admin2_code", feature);

          if(angular.isDefined(admin2_code))
          {
            var gc = sparc2.charts.buildGroupsAndColumnsForAdmin2(
              chartConfig,
              initialData,
              admin2_code);

            sparc2.charts.buildHazardChart(chartConfig, initialData, {
              groups: gc.groups,
              columns: gc.columns,
              bullet_width: function(d, i) { return d.id == "rp25" ? 6 : 12; }
            });
          }
        }
      }
    }
  }
};
