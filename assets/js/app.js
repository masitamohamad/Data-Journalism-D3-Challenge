

var svgWidth = 900;
var svgHeight = 600;

var margin = 50;

var height = svgHeight - margin - margin;
var width = svgWidth - margin - margin;

// data
var pizzasEatenByMonth = [15, 5, 25, 18, 12, 22, 0, 4, 15, 10, 21, 2];

var svg = d3.select("#scatter")
  .append("svg")
  .attr("height", svgHeight)
  .attr("width", svgWidth)

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin}, ${margin})`)

var xScale = d3.scaleLinear()
  .domain([0, pizzasEatenByMonth.length])
  .range([0, width])

var yScale = d3.scaleLinear()
  .domain([0, d3.max(pizzasEatenByMonth)])
  .range([height, 0])

var line = d3.line()
  .x((d, i) => xScale(i))  
  .y(d => yScale(d))

chartGroup.append("path")
  .attr("d", line(pizzasEatenByMonth))
  .attr("fill", "none")
  .attr("stroke", "green");

var circlesGroup = chartGroup.selectAll("circle")
  .data(pizzasEatenByMonth)
  .enter()
  .append("circle")
  .attr("cx", line)
  .attr("r", 5)
  .attr("fill", "red");

circlesGroup
  .transition()
  .duration(2000)
  .attr("cx", (d,i) => xScale(i))
  .attr("cy", d => yScale(d));


// Event listeners with transitions
circlesGroup.on("mouseover", function() {
  d3.select(this)
    .transition()
    .duration(500)
    .attr("r", 20)
    .attr("fill", "lightblue")
}).on("mouseout", function() {
  d3.select(this)
    .transition()
    .duration(1000)
    .attr("r", 5)
})
