module.exports = function(chartConfig, popatrisk_config, options)
{
  var gc = undefined;
  if(chartConfig.type == "bar")
  {
    console.log('buildHazardChart.js');
    console.log(chartConfig);
    //var groups = [[]];
    //var columns = [];
    if(options != undefined && options.groups != undefined && options.columns != undefined)
    {
      gc = {
        "groups": options.groups,
        "columns": options.columns,
        "order": undefined
      };
    }
    else
    {
      gc = sparc2.charts.buildGroupsAndColumnsForCountry(chartConfig, popatrisk_config);
    }
    var barConfig = undefined;
    if(chartConfig.subtype=="bullet")
    {
      barConfig =
      {
        bullet: true,
        width: function(d, i)
        {
          return d.id == "rp25" ? 8 : 16;
        },
        offset: function(d, i)
        {
          return 0;  // Stacks bar chartActuals on top of each other
        }
      };
      if(options != undefined && options.bullet_width != undefined)
      {
        barConfig["width"] = options.bullet_width;
      }
    }
    else
    {
      barConfig = {
        width: {
          ratio: 0.6
        }
      };
    }
    var axisConfig = {"x":{}, "y": {}};
    if(chartConfig.axis != undefined && chartConfig.axis.x != undefined)
    {
      if(chartConfig.axis.x.type == "months")
      {
        axisConfig["x"]["tick"] = {
          format: function (x){return months_short_3[x].toTitleCase();}
        };
      }
    }
    axisConfig["y"]["label"] = chartConfig.axis.y.label;
    axisConfig["y"]["tick"] = {format: d3.format("s,")};

    var tooltipFormatNameFn = undefined;
    var tooltipNameFnName = extract("tooltip.name", chartConfig);
    if(angular.isString(tooltipNameFnName))
    {
      var tooltipCollections = extract("config.charts.tooltips", geodash);
      if(Array.isArray(tooltipCollections))
      {
        for(var i = 0; i < tooltipCollections.length; i++)
        {
          var tooltipCollection = tooltipCollections[i];
          if(angular.isDefined(tooltipCollection))
          {
            tooltipFormatNameFn = extract(tooltipNameFnName, tooltipCollection);
            if(angular.isDefined(tooltipFormatNameFn))
            {
              break;
            }
          }
        }
      }
    }
    var tooltipFormatValueFn = undefined;
    var tooltipValueFnName = extract("tooltip.value", chartConfig);
    if(angular.isString(tooltipValueFnName))
    {
      var tooltipCollections = extract("config.charts.tooltips", geodash);
      if(Array.isArray(tooltipCollections))
      {
        for(var i = 0; i < tooltipCollections.length; i++)
        {
          var tooltipCollection = tooltipCollections[i];
          if(angular.isDefined(tooltipCollection))
          {
            tooltipFormatValueFn = extract(tooltipValueFnName, tooltipCollection);
            if(angular.isDefined(tooltipFormatValueFn))
            {
              break;
            }
          }
        }
      }
    }
    var tooltipConfig = {
      format: {
        name: tooltipFormatNameFn,
        value: tooltipFormatValueFn
      }
    };
    var chartID = (chartConfig.element || chartConfig.id);
    var chartActual = c3.generate({
      bindto: "#"+ chartID,
      data: {
        columns: gc.columns,
        groups: gc.groups,
        type: 'bar',
        colors: chartConfig.colors,
        order: (gc.order || 'desc')
      },
      axis : axisConfig,
      bar: barConfig,
      tooltip: tooltipConfig
    });

    $("#"+ chartID).data('chart', chartActual);
  }
};
