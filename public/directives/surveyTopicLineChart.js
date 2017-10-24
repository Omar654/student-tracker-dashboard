angular.module('app')
.directive('topicLineChart', function () {
  return {
    restrict: 'AE',
    template: "<div id='topicLineChart'></div>",
    scope: {
        topicdata: '='
    },
    controller: function ($scope, surveyService) {

      var filteredData = $scope.topicdata;

    //   let averages = (dataArr) => {
    //     let arr = []
    //     let obj = {}
    //     let max = 0;
    //     let min = 13;
    //     for (let i = 0; i < dataArr.length; i++) {
    //       let u = dataArr[i].unit
    //       if (u > max) max = u
    //       if (u < min) min = u
    //       let d = dataArr[i]
    //       if (!obj[u]) obj[u] = {}
    //       obj[u].overall = obj[u].overall ? obj[u].overall + d.overall : d.overall 
    //       obj[u].overallCount = obj[u].overallCount ? obj[u].overallCount += 1 : 1
    //     }
    //     for (let i = min; i <= max; i++) {
    //       obj[i].overall = (obj[i].overall / obj[i].overallCount).toFixed(2)
    //       obj[i].unit = i
    //       arr.push(obj[i])
    //     }
    //     console.log(arr)
    //     return arr
    //   }
    //   let averageData = averages(filteredData)

      function makeDataObject(arr) {
        let allDataArr = [];
        for (let i = 0; i < arr.length; i++) {
          allDataArr.push({
            'date': i + 1,
            //'dateTaken': new Date(arr[i].date),
            'number': Number(arr[i].overall),
            'instructor': arr[i].instructor
          })
        }
        console.log(allDataArr)
        return allDataArr;
      }

      var data = makeDataObject($scope.topicdata);

      var margin = {
        top: 20,
        right: 40,
        bottom: 20,
        left: 40
      }

      var width = document.getElementById('topicDiv').offsetWidth - margin.right - margin.left;
      var height = document.getElementById('topicDiv').offsetHeight - margin.top - margin.bottom - 50;
      var bisectDate = d3.bisector(function (d) {
        return d.date;
      }).left

      var x = d3.scaleTime()
        .range([0, width]);

      var y = d3.scaleLinear()
        .range([height, 0]);

      var xAxis = d3.axisBottom(x)
      // .ticks(d3.timeMinute.every(30))
      // .tickFormat(d3.timeFormat("%I:%M"));

      var yAxis = d3.axisLeft(y)
        .ticks(5);

      var line = d3.line()
        .x(function (d) {
          return x(d.date);
        })
        .y(function (d) {
          return y(d.number);
        });

      var areaFunction = d3.area()
        .x(function (d) {
          return x(d.date);
        })
        .y0(height)
        .y1(function (d) {
          return y(d.number);
        });

      var svg = d3.select("#topicLineChart").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function (d) {
          return "<strong>number:</strong> <span style='color:#21AAE1'>" + d.number + "</span>";
        })

      svg.call(tip)

      var areaGradient = svg.append('defs')
        .append("linearGradient")
        .attr('id', 'areaGradient')
        .attr("x1", "0%").attr("y1", "0%")
        .attr("x2", "0%").attr("y2", "100%");

      areaGradient.append("stop")
        .attr("offset", "0%")
        .attr("stop-color", "#21AAE1")
        .attr("stop-opacity", 0.5);

      areaGradient.append("stop")
        .attr("offset", "50%")
        .attr("stop-color", "#21AAE1")
        .attr("stop-opacity", 0.1);

      areaGradient.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", "#21AAE1")
        .attr("stop-opacity", 0);

      let day = new Date().toISOString().substring(0, 10),
        endTime = new Date(`${day}T23:10:00.000Z`).getTime()

      x.domain([new Date($scope.topicdata[0][0]), new Date(endTime)]);

      let maxDomain = 20;
      if ((d3.max(data, function (d) {
          return d.number;
        }) * 1.1) > 20) {
        maxDomain = d3.max(data, function (d) {
          return d.number;
        }) * 1.1
      }

      y.domain([0, maxDomain])

      svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

      svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)

      svg.append("path")
        .datum(data)
        .attr("class", "line")
        .attr("d", line);

      svg.append("path")
        .attr("class", "area")
        .style("fill", "url(#areaGradient)")
        .attr("d", areaFunction(data));

      var focus = svg.append("g")
        .attr("class", "focus")
        .style("display", "none");

      focus.append("circle")
        .attr("r", 3);

      focus.append("rect")
        .attr("width", 55)
        .attr("height", 30)
        .attr("x", -28)
        .attr("y", -49.7)
        .attr('fill', 'rgba(0, 0, 0, 0.8)')
        .attr("rx", 2)
        .attr("ry", 2)

      focus.append("path") //shape for triangle                       
        .attr('fill', 'rgba(0, 0, 0, 0.8)')
        .attr("d", "M -5, -20, L 5, -20, L 0, -10 Z")

      focus.append("text")
        .attr("dx", -12)
        .attr("dy", -31)
        .attr("offset", "100%")
        .attr('fill', '#21AAE1')
        .style('font-size', '11px')

      focus.append("line")
        .attr("class", "x-hover-line hover-line")
        .attr("y1", 0)
        .attr("y2", height)

      focus.append("line")
        .attr("class", "y-hover-line hover-line")
        .attr("x1", width)
        .attr("x2", width);

      let overlayWidth = (width * (($scope.topicdata.length - 1) / 100)) - 1

      svg.append("rect")
        .attr("class", "overlay")
        .attr("width", overlayWidth)
        .attr("height", height)
        .on("mouseover", function () {
          focus.style("display", null);
        })
        .on("mouseout", function () {
          focus.style("display", "none");
        })
        .on("mousemove", function mousemove() {
          var x0 = x.invert(d3.mouse(this)[0]),
            i = bisectDate(data, x0, 1),
            d0 = data[i - 1],
            d1 = data[i],
            d = x0 - d0.date > d1.date - x0 ? d1 : d0;
          focus.attr("transform", "translate(" + x(d.date) + "," + y(d.number) + ")");
          focus.select("text").text(d.number);
        });

      // ********UPDATE**********

      let updateTopicLineChart = (someData) => {
          var newData = makeDataObject(someData)
          console.log(newData)

        let maxDomain = 20;
        if ((d3.max(newData, function (d) {
            return d.number;
          }) * 1.1) > 20) {
          maxDomain = (d3.max(newData, function (d) {
            return d.number;
          }) * 1.1) + 5
        }

        var yD = d3.scaleLinear()
          .range([height, 0]).domain([0, maxDomain])

        yAxis = d3.axisLeft(yD)
          .ticks(5);

        var newLine = d3.line()
          .x(function (d) {
            return x(d.date);
          })
          .y(function (d) {
            return yD(d.number);
          });

        var areaFunction = d3.area()
          .x(function (d) {
            return x(d.date);
          })
          .y0(height)
          .y1(function (d) {
            return yD(d.number);
          });

        var ya = d3.select('#topicLineChart')
          .selectAll('.y.axis')

        var lines = d3.select('#topicLineChart')
          .selectAll('.line')
          .datum(newData)

        var focus = svg.append("g")
          .attr("class", "focus")
          .style("display", "none");

        focus.append("circle")
          .attr("r", 2);

        focus.append("rect")
          .attr("width", 55)
          .attr("height", 30)
          .attr("x", -28)
          .attr("y", -49.7)
          .attr('fill', 'rgba(0, 0, 0, 0.8)')
          .attr("rx", 2)
          .attr("ry", 2)

        focus.append("path") //shape for triangle                       
          .attr('fill', 'rgba(0, 0, 0, 0.8)')
          .attr("d", "M -5, -20, L 5, -20, L 0, -10 Z")

        focus.append("text")
          .attr("dx", -12)
          .attr("dy", -31)
          .attr("offset", "100%")
          .attr('fill', '#21AAE1')
          .style('font-size', '11px')

        focus.append("line")
          .attr("class", "x-hover-line hover-line")
          .attr("y1", 0)
          .attr("y2", height)

        focus.append("line")
          .attr("class", "y-hover-line hover-line")
          .attr("x1", width)
          .attr("x2", width);

        let overlayWidth = (width * (($scope.topicdata.length - 1) / 100)) - 1

        svg.append("rect")
          .attr("class", "overlay")
          .attr("width", overlayWidth)
          .attr("height", height)
          .on("mouseover", function () {
            focus.style("display", null);
          })
          .on("mouseout", function () {
            focus.style("display", "none");
          })
          .on("mousemove", function mousemove() {
            var x0 = x.invert(d3.mouse(this)[0]),
              i = bisectDate(newData, x0, 1),
              d0 = newData[i - 1],
              d1 = newData[i],
              d = x0 - d0.date > d1.date - x0 ? d1 : d0;
            focus.attr("transform", "translate(" + x(d.date) + "," + yD(d.number) + ")");
            focus.select("text").text(d.number);
          });


        var gradient = d3.select('#topicLineChart').selectAll(".area")


        gradient.transition()
          .duration(1000)
          .attr("d", areaFunction(newData))
          .style("fill", "url(#areaGradient)")
        lines.transition()
          .duration(1000)
          .attr("d", newLine)

        ya.transition().duration(1000).call(yAxis)

      }


      $scope.$watch('topicdata', function (newValue, oldValue) {
        updateTopicLineChart($scope.topicdata)
      })
    }
  }
})