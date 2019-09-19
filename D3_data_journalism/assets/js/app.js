// Step 1: Set up our chart
//= ================================
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 70
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Step 2: Create an SVG wrapper,
// append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
// =================================
var svg = d3
  .select("body")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// // Step 3:
// // Import data from the data.csv file
// // =================================

d3.csv("assets/data/data.csv", function(error, Data) {
  if (error) throw error;
  console.log(Data)

  // Step 4: Parse the data
  // Format the data and convert to numerical

Data.forEach(function(record) {
    record.poverty =+ record.poverty;
    record.age =+ record.age;
    record.income =+ record.income;
    record.healthcare =+ record.healthcare;
    record.obesity =+ record.obesity;
    record.smokes =+ record.smokes;
});

// //Step 4: Create Scaling functions & axis functions for Healthcare vs. Poverty
  var xScale = d3.scaleLinear()
    .domain([d3.min(Data,d => d.poverty)-1,d3.max(Data, d => d.poverty)])
    .range([0, width]);

  var yScale = d3.scaleLinear()
    .domain([0, d3.max(Data, d => d.healthcare)])
    .range([height, 0]);

  var bottomAxis = d3.axisBottom(xScale);
  var leftAxis = d3.axisLeft(yScale);

// Append Axes to the chart

  chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

  chartGroup.append("g")
      .call(leftAxis);

// //Step 5: Create Circles
  
   var circlesGroup = chartGroup.selectAll("circle")
    .data(Data)
    .enter()
    .append("circle")
    .attr("cx", d => xScale(d.poverty))
    .attr("cy", d => yScale(d.healthcare))
    .attr("r", "15")
    .attr("fill", "skyblue")
    .attr("opacity", ".5")
    .attr("data-state", d=>d.abbr);

// //Step 6: Insert Abbr. to circles
    var textGroup = chartGroup.selectAll(".state")
      .data(Data)
      .enter()
      .append("text")
     .html(d=> d.abbr)
     .attr("x", d => xScale(d.poverty))
     .attr("y", d => yScale(d.healthcare))
     .style("text-anchor", "middle")
     .style("font-size","10px")
     .style("font-family",  "Gill Sans", "Gill Sans MT")
     .style("fill", "black");

 // Create axes labels
    var lacksHC = chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Lacks Healthcare (%)");

    var inPoverty = chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      .attr("class", "axisText")
      .text("In poverty (%)");
  });