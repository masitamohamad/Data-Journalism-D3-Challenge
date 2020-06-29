// Step 1: Set up chart canvas
// ==============================================================================
var svgWidth = 900;
var svgHeight = 600;

var margin = {
    top: 50,
    right: 50,
    bottom: 50,
    left: 50
  };

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;
  
// Step 2: Create an SVG wrapper, append an SVG group that will hold our chart, 
// and shift the latter by left and top margins.
// ==============================================================================
var svg = d3.select("#scatter")
  .append("svg")
  .attr("height", svgHeight)
  .attr("width", svgWidth)

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Step 3: Import data from the data.csv file and bind that data to the DOM elements
// ==============================================================================
/* Sample data at index 0
    abbr: "AL"
    age: "38.6"
    ageMoe: "0.2"
    healthcare: "13.9"
    healthcareHigh: "15.1"
    healthcareLow: "12.7"
    id: "1"
    income: "42830"
    incomeMoe: "598"
    obesity: "33.5"
    obesityHigh: "35"
    obesityLow: "32.1"
    poverty: "19.3"
    povertyMoe: "0.5"
    smokes: "21.1"
    smokesHigh: "22.5"
    smokesLow: "19.8"
    state: "Alabama"
 */

d3.csv("assets/data/data.csv").then(function(censusData) {
    censusData.forEach(function(data) {
      data.poverty = +data.poverty;
      data.healthcare = +data.healthcare;
    });
// console.log(censusData[0].age);

// Step 4: Create the scales for the chart
// ==============================================================================
var xLinearScale = d3.scaleLinear().range([0, width])
var yLinearScale = d3.scaleLinear().range([height, 0])

// Step 5: Set up the x and y-axis domain (x-axis = Poverty, y-axis = Healthcare)
// ==============================================================================
// Find the min and max of the poverty and healthcare data
var povertyMin = d3.min(censusData, d => d.poverty);
var healthcareMin = d3.min(censusData, d => d.healthcare);
var povertyMax = d3.max(censusData, d => d.poverty);
var healthcareMax = d3.max(censusData, d => d.healthcare);

// console.log(povertyMax)

// Use the yMax value to set the linear scales domain
yLinearScale.domain([healthcareMin, healthcareMax]);
xLinearScale.domain([povertyMin, povertyMax]);

// Step 6: Create the axes
// ==============================================================================
var bottomAxis = d3.axisBottom(xLinearScale);
var leftAxis = d3.axisLeft(yLinearScale);

// Step 7: Append the axes to the chartGroup
// ==============================================================================
// Add x-axis
  chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

// Add y-axis
  chartGroup.append("g").call(leftAxis);

// Step 8: Circles generator 
// ==============================================================================
  var circlesGroup = chartGroup.selectAll("circle")
    .data(censusData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", "15")
    .attr("opacity", ".5")

    // Use CSS style:
    .attr("class", "stateCircle");

  // Append text to circles
  var circlesGroup = chartGroup.selectAll()
    .data(censusData)
    .enter()
    .append("text")
    .attr("x", d => xLinearScale(d.poverty))
    .attr("y", d => yLinearScale(d.healthcare))
    .text(d => (d.abbr))

    // use CSS style:
    .attr("class", "stateText");

// Step 7: Initialize tool tip
// ==============================================================================
  var toolTip = d3.tip()
      .attr("class", "d3-tip")
      .offset([80, -60])
      .html(function(d) {
        return (`${d.state}<br>Poverty: ${d.poverty}%<br>Healthcare: ${d.healthcare}%`);
      });

// Step 8: Create tooltip in the chart
// ==============================================================================
  chartGroup.call(toolTip);

// Step 9: Create event listeners to display and hide the tooltip
// ==============================================================================
  circlesGroup.on("mouseover", function(data) {
  toolTip.show(data, this);
  })
  // onmouseout event
  .on("mouseout", function(data, index) {
  toolTip.hide(data);
  });

// Step 10: Create axes labels
// ==============================================================================
  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    // New style called "axisText" created on the CSS style sheet:
    .attr("class", "axisText")
    .text("Lacks Healthcare (%");

  chartGroup.append("text")
    .attr("transform", `translate(${width / 2}, ${height + 40})`)
    .attr("class", "axisText")
  .text("In Poverty (%)");

// Step x: Animation
// ==============================================================================



// ==============================================================================
}).catch(function(error) {
  console.log(error);
});