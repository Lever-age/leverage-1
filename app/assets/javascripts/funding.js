$(function(){

  function getPropsInCollection(collection, prop) {
    var i,
      props = [];

    for (i = 0; i < collection.length; ++i) {
      if (props.indexOf(collection[i][prop]) === -1) {
        props.push(collection[i][prop]);
      }
    }
    return props;
  }

  function addOptions($select, options) {
    var optionsHtml = '',
      i;

    for (i = 0; i < options.length; i++) {
      optionsHtml += '<option value="' + options[i] + '">' + options[i] + '</option>';
    }

    $select.html( optionsHtml );
  }
  function columnFetchDonut(id, data) {
    nv.addGraph(function() {
      var chart = nv.models.pieChart()
          .x(function(d) { return d.label })
          .y(function(d) { return d.value })
          .showLabels(true)     //Display pie labels
          .labelThreshold(.05)  //Configure the minimum slice size for labels to show up
          .labelType("percent") //Configure what type of data to show in the label. Can be "key", "value" or "percent"
          .donut(true)          //Turn on Donut mode. Makes pie chart look tasty!
          .donutRatio(0.35)     //Configure how big you want the donut hole size to be.
          ;

        d3.select(id + " svg")
            .datum(data)
            .transition().duration(350)
            .call(chart);

      return chart;
    });
  }
  function columnFetchBar(id, data) {
    nv.addGraph(function() {
      var chart = nv.models.discreteBarChart()
          .x(function(d) { return d.label })    //Specify the data accessors.
          .y(function(d) { return d.value })
          .staggerLabels(true)    //Too many bars and not enough room? Try staggering labels.
          .tooltips(false)        //Don't show tooltips
          .showValues(true)       //...instead, show the bar value right on top of each bar.
          ;

      d3.select(id + " svg")
            // [ 
            //   {
            //     key: "Cumulative Return",
            //     values: [
            //       { 
            //         "label" : "H Label" , 
            //         "value" : -5.1387322875705
            //       }
            //     ]
            //   }
            // ]
          .datum(data)
          .call(chart);

      nv.utils.windowResize(chart.update);

      return chart;
    });    
  }

  function getCandDonutData(collection, name) {
    var i,
      chartData = [];

    for (i = 0; i < collection.length; ++i) {
      if (collection[i].candidate === name) {
        chartData.push({
          label: collection[i].donorType,
          value: collection[i].amount
        });
      }
    }
    return chartData;
  }
  function getCandBarData(collection, name) {
    var i,
      chartDataValues = [];

    for (i = 0; i < collection.length; ++i) {
      if (collection[i].candidate === name) {
        chartDataValues.push({
          label: collection[i].donorType,
          value: collection[i].amount
        });
      }
    }
    return [{
              key: "Candidate fundings",
              values: chartDataValues
            }];
  }

  $.get( "/funding", function(data) {
    var candidates = getPropsInCollection(data, 'candidate');
    var positions = getPropsInCollection(data, 'position');

    addOptions($('#candidate'), candidates);
    addOptions($('#position'), positions);

    columnFetchDonut('#candidate-donut-chart', getCandDonutData(data, candidates[0]));
    columnFetchBar('#candidate-bar-chart', getCandBarData(data, candidates[0]));

    columnFetchBar('#position-bar-chart', [ 
      {
        key: "Cumulative Return",
        values: [
          { 
            "label" : "H Label" , 
            "value" : 45
          },
          { 
            "label" : "B Label" , 
            "value" : 243
          }
        ]
      }
    ]);
    $('#candidate').on('change', function(){
      var name = $(this).val(),
        donutChartData = getCandDonutData(data, name),
        barChartData = getCandBarData(data, name);

      columnFetchDonut('#candidate-donut-chart', donutChartData);
      columnFetchBar('#candidate-bar-chart', barChartData);
    });

  });





});