// @TODO: YOUR CODE HERE!
var svgWidth = 800;
var svgHeight = 500;

var margin = {
    top: 20,
    right: 40,
    bottom: 120,
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

// inital parameters
var chosenXAxis = "poverty";
// var chosenYAxis = "healthcare";

// function to update scale var upon click on axis label
function xScale(dataset, chosenXAxis) {
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(dataset, d => d[chosenXAxis])*0.95, d3.max(dataset, d => d[chosenXAxis])*1.05])
        .range([0, width])
    return xLinearScale;
}
// function yScale(dataset, chosenYAxis) {
//     var yLinearScale = d3.scaleLinear()
//         .domain([d3.min(dataset, d[chosenYAxis])-1, d3.max(dataset, d => d[chosenYAxis])+1])
//         .range([height, 0]);
//     return yLinearScale;
// }

// function to update axis var upone click on axis label
function renderXAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);

    xAxis.transition()
        .duration(1000)
        .call(bottomAxis);

    return xAxis;
}

// function renderYAxes(newYScale, yAxis) {
//     var leftAxis = d3.axisLeft(newYScale);

//     yAxis.transition()
//         .duration(1000)
//         .call(leftAxis);
    
//     return yAxis;
// }

// function for updating circles with a transition to new data
function renderXCircles(circlesGroup, newXScale, chosenXAxis) {
    circlesGroup.transition()
        .duration(1000)
        .attr("cx", d => newXScale(d[chosenXAxis]));
    return circlesGroup;
}

function renderCirclesGroupText(circlesGroupText, newXScale, chosenXAxis) {
    circlesGroupText.transition()
        .duration(1000)
        .attr("x", d => newXScale(d[chosenXAxis]));
    return circlesGroupText;
}
// function rednerYCircles(circlesGroup, newYScale, chosenYAxis) {
//     circlesGroup.transition()
//         .duration(1000)
//         .attr("cy", d => newYScale(d[chosenYAxis]));
//     return circlesGroup;
// }

// function to update circles group with new tooltip
function updateToolTip(chosenXAxis, circlesGroup) {
    var label; 
    if (chosenXAxis === "poverty") {
        label = "In Poverty (%)";
    }
    else if (chosenXAxis === "age") {
        label = "Age (median)";
    }
    else {
        label = "Household Income (median)";
    }
    var toolTip = d3.tip()
         .attr("class", "d3-tip")
         .offset([80, 60])
         .html(function(d){
             return(`${d.state}<br>${label}: ${d[chosenXAxis]}%<br>Healthcare: ${d.healthcare}%`);
        });

    // var toolTip = d3.tip()
    //     .attr("class", "d3-tip")
    //     .offset([80, -60])
    //     .html(function(d){
    //         return(`${d.state}<br>${label}: ${d[chosenXAxis]}%<br>Healthcare: ${d.healthcare}%`);
    //     });
    circlesGroup.call(toolTip);

    //mouse over and mouse out event 
    circlesGroup.on("mouseover", function(data) {
        toolTip.show(data)
    })
        .on("mouseout", function(data, index){
            toolTip.hide(data);
        })
    return circlesGroup;
}


// import data from the csv file 
d3.csv("./assets/data/data.csv").then(function(dataset, err) {
    if (err) throw err;
    // parse data
    console.log(dataset);
    dataset.forEach(function(data) {
        data.age = +data.age;
        data.healthcare = +data.healthcare;
        data.income = +data.income;
        data.obesity = +data.obesity;
        data.poverty = +data.poverty;
        data.smoke = +data.smoke; 
    });

    // scale the axis functions
    var xLinearScale = xScale(dataset, chosenXAxis);
    //    var yLinearScale = yScale(dataset, chosenYAxis);

    /// create y scale function 
    var yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(dataset, d => d.healthcare)])
        .range([height, 0]);

    // create inital axis function
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // append axes to chart 
    var xAxis = chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);
    // var yAxis = chartGroup.append("g")
    //     .classed("y-axis", true)
    //     .call(leftAxis);
    chartGroup.append("g")
        .call(leftAxis);

    // create data points
    var circlesGroup = chartGroup.append("g")
        .selectAll("circle")
        .data(dataset)
        .enter()
        .append("circle")
        .attr("class", "stateCircle")
        .attr("cx", d => xLinearScale(d[chosenXAxis]))
        .attr("cy", d => yLinearScale(d.healthcare))
        .attr("r", "10")
        
    var circlesGroupText = circlesGroup.select("text")
        .data(dataset)
        .enter()
        .append("text")
        .attr("class", "stateText")
        .attr("x", d => xLinearScale(d[chosenXAxis]))
        .attr("y", d => yLinearScale(d.healthcare)*1.02)
        .attr("font-size", "10px")
        .text(d =>d.abbr);


    // crate x axis label
    var labelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${width/2}, ${height + margin.top +30 })`)
    var inPovertyLabel = labelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 0)
        .attr("class", "axisText")
        .attr("value", "poverty")
        .classed("active", true)
        .text("In Poverty (%)");
    
    var ageLabel = labelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("class", "axisText")
        .attr("value", "age")
        .classed("inactive", true)
        .text("Age (median)")

    var householdIncomeLabel = labelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 40)
        .attr("class", "axisText")
        .attr("value", "income")
        .classed("inactive", true)
        .text("Household Income (median)")

    // create y axis label


    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left )
        .attr("x", 0 - (height/2) -60 )
        .attr("dy", "1em")
        .attr("class", "axisText")
        .text("Lacks Healthcare (%)");

    // set the labels for the inital setup
    var circlesGroup = updateToolTip(chosenXAxis, circlesGroup);
    
    labelsGroup.selectAll("text")
        .on("click", function(){
            var value = d3.select(this).attr("value");
            if (value !== chosenXAxis) {
                chosenXAxis = value;
                // update x scale for new data
                xLinearScale = xScale(dataset, chosenXAxis);
                // update x axis with transition
                xAxis = renderXAxes(xLinearScale, xAxis);
                // update circles with new x values
                circlesGroup = renderXCircles(circlesGroup, xLinearScale, chosenXAxis); 
                // update circles abbr value
                circlesGroupText = renderCirclesGroupText(circlesGroupText, xLinearScale, chosenXAxis);
                console.log(circlesGroupText)
                // update tooltips with new info
                circlesGroup = updateToolTip(chosenXAxis, circlesGroup);        
                // change classes to change bold text
                if (chosenXAxis === "poverty") {
                    inPovertyLabel.classed("active", true)
                        .classed("inactive", false);
                    ageLabel.classed("active", false)
                        .classed("inactive", true);
                    householdIncomeLabel.classed("active", false)
                        .classed("inactive", true);
                }
                else if (chosenXAxis === "age") {
                    ageLabel.classed("active", true)
                        .classed("inactive", false);
                    inPovertyLabel.classed("active", false)
                        .classed("inactive", true);
                    householdIncomeLabel.classed("active", false)
                        .classed("inactive", true);
                }
                else if (chosenXAxis === "income") {
                    householdIncomeLabel.classed("active", true)
                        .classed("inactive", false);
                    ageLabel.classed("active", false)
                        .classed("inactive", true);
                    inPovertyLabel.classed("active", false)
                        .classed("inactive", true);
                }

    // if (chosenYAxis === "lacks_healthcare") {
    //     lacksHealthcareLabel.classed("active", true)
    //         .classed("inactive", false);
    //     ageLabel.classed("active", false)
    //         .classed("inactive", true);
    //     householdIncomeLabel.classed("active", false)
    //         .classed("inactive", true);
    }
});

}).catch(function(error) {
    console.log(error);
});
