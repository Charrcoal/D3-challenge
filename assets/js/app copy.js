// @TODO: YOUR CODE HERE!
var svgWidth = 800;
var svgHeight = 500;

var margin = {
    top: 20,
    right: 40,
    bottom: 80,
    left:50
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// create a svg wrapper and append svg group to hold the chart
var svg = d3.select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// import data from the csv file 
d3.csv("./assets/data/data.csv").then(function(dataset) {
    // parse data
    console.log(dataset);
    dataset.forEach(function(data) {
        //data.state = +data.state;
        //data.abbr = +data.abbr;
        data.age = +data.age;
        data.healthcare = +data.healthcare;
        data.income = +data.income;
        data.obesity = +data.obesity;
        data.poverty = +data.poverty;
        data.smoke = +data.smoke; 
    });

    // scale the axis
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(dataset, d => d.poverty)-1, d3.max(dataset, d => d.poverty)+1])
        .range([0, width]);

    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(dataset, d => d.healthcare)-1, d3.max(dataset, d => d.healthcare)+1])
        .range([height, 0]);
    // create axis function
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // append axes to chart 
    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);
    chartGroup.append("g")
        .call(leftAxis);

    // create data points
    var circlesGroup = chartGroup.selectAll("circle")
        .data(dataset)
        .enter()
        .append("circle")
        .attr("class", "stateCircle")
        .attr("cx", d => xLinearScale(d.poverty))
        .attr("cy", d => yLinearScale(d.healthcare))
        .attr("r", "10")
        // .append("text")
        // .attr("class", "stateText")
        // .attr("x", d => xLinearScale(d.poverty))
        // .attr("y", d => yLinearScale(d.healthcare))
        // .attr("font-size", "100px")
        .text(d => d.abbr);

    // add tool tip 
    var toolTip = d3.selectAll("circle")
        .append("div")
        .attr("class", "d3-tip")
    // mouseover and mouse out events
    circlesGroup.on("mouseover", function(d){
        toolTip.style("display", "block");
        toolTip.html(`${d.state}<br>Poverty: ${d.poverty}%<br>Healthcare: ${d.healthcare}%`)
            .style("left", d3.event.pageX + "px")
            .style("top", d3.event.pageY +"px");
        console.log(`${d.state}<br>Poverty: ${d.poverty}%<br>Healthcare: ${d.healthcare}%`);
    })
        // .on("mouseout", function(){
        //     toolTip.style("display", "none")
        // })

    // crate axis label
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left )
        .attr("x", 0 - (height/2) -60 )
        .attr("dy", "1em")
        .attr("class", "axisText")
        .text("Lacks Healthcare (%)");

    chartGroup.append("text")
        .attr("transform", `translate(${width/2}, ${height + margin.top +30 })`)
        .attr("class", "axisText")
        .text("In Poverty (%)");
}).catch(function(error) {
    console.log(error);
});

// healthcare vs. poverty 

// smokers vs. age


// // initial chart 
// var  chosenXAxis = "in_poverty";

// // function used for updating x-scale upon click on axis label
// function xScale(poverty, chosenXAxis) {
//     var xLinearScale = d3.scaleLinear()
//         .domain([d3.min(poverty, d => d[chosenXAxis])*0.8,
//         d3.max(poverty, d => d[chosenXAxis])*1.2
//     ])
//     .range([0, width]);
//     return xLinearScale;
// }
