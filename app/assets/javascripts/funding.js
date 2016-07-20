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

        //$(id + " svg").remove();
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
          label: collection[i].donor,
          value: collection[i].amount
        });
      }
    }
    return chartData;
  }

  function getPositionChartsData(collection, position) {
    var i,
      chartData = {
        type: [],
        total: [],
        ideological: [],
        transactional: []
      },
      totalIdeol = 0,
      totalTrans = 0,
      total = {},
      totalNames;

    for (i = 0; i < collection.length; ++i) {

      // Getting ideological vs transactional data
      if (collection[i].position === position) {
        if (collection[i].donor === 'ideological') {
          totalIdeol += parseFloat(collection[i].amount);
          chartData.ideological.push({
            label: collection[i].candidate,
            value: collection[i].amount
          });
        } else if (collection[i].donor === 'transactional') {
          totalTrans += parseFloat(collection[i].amount);
          chartData.transactional.push({
            label: collection[i].candidate,
            value: collection[i].amount
          });
        }
        if (total.hasOwnProperty(collection[i].candidate) ) {
          total[collection[i].candidate] += parseFloat(collection[i].amount);
        } else {
          total[collection[i].candidate] = parseFloat(collection[i].amount);
        }
      }

    }

    totalNames = Object.keys(total);
    for (i = 0; i < totalNames.length; i++) {
      chartData.total.push({
        label: totalNames[i],
        value: total[totalNames[i]]
      });
    }

    chartData.type = [
      {
        label: 'Ideological',
        value: totalIdeol
      },
      {
        label: 'transactional',
        value: totalTrans
      }
    ];

    console.log(chartData);

    return chartData;
  }

  function getCandBarData(collection, name) {
    var i,
      chartDataValues = [];

    for (i = 0; i < collection.length; ++i) {
      if (collection[i].candidate === name) {
        chartDataValues.push({
          label: collection[i].donor,
          value: collection[i].amount
        });
      }
    }
    return [{
              key: "Candidate fundings",
              values: chartDataValues
            }];
  }

  function drawPositionCharts(data, position) {
    var positionChartsData = getPositionChartsData(data, position);

    $('.current-position').text(position);

    columnFetchDonut('#candidate-donut-type-chart', positionChartsData.type);
    columnFetchDonut('#candidate-donut-total-chart', positionChartsData.total);
    columnFetchDonut('#candidate-donut-ideological-chart', positionChartsData.ideological);
    columnFetchDonut('#candidate-donut-transactional-chart', positionChartsData.transactional);
  }

  $.get( "/funding", function(data) {
    console.log(data);
    var candidates = getPropsInCollection(data, 'candidate');
    var positions = getPropsInCollection(data, 'position');

    addOptions($('#candidate'), candidates.sort());
    addOptions($('#position'), positions.sort());

    columnFetchDonut('#candidate-donut-chart', getCandDonutData(data, candidates[0]));
    columnFetchBar('#candidate-bar-chart', getCandBarData(data, candidates[0]));
    $('.current-candidate').text(candidates[0]);

    drawPositionCharts(data, positions[0]);

    $('#candidate').on('change', function(){
      var name = $(this).val(),
        donutChartData = getCandDonutData(data, name),
        barChartData = getCandBarData(data, name);

      $('.current-candidate').text(name);

      columnFetchDonut('#candidate-donut-chart', donutChartData);
      columnFetchBar('#candidate-bar-chart', barChartData);
    });
    $('#position').on('change', function(){
      var position = $(this).val();

      drawPositionCharts(data, position);
    });

  });





});