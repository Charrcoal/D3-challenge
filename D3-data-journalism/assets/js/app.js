// @TODO: YOUR CODE HERE!
var svgWidth = 800;
var svgHeight = 500;

var margin = {
    top: 20,
    right: 40,
    bottom: 120,
    left:120
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
var chosenYAxis = "healthcare";

// function to update scale var upon click on axis label
function xScale(dataset, chosenXAxis) {
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(dataset, d => d[chosenXAxis])*0.95, d3.max(dataset, d => d[chosenXAxis])*1.05])
        .range([0, width])
    return xLinearScale;的d 
}
function yScale(dataset, chosenYAxis) {
    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(dataset, d => d[chosenYAxis])*0.85, d3.max(dataset, d => d[chosenYAxis])*1.05])
        .range([height, 0]);
    return yLinearScale;
}

// function to update axis var upone click on axis label
function renderXAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);

    xAxis.transition()
        .duration(1000)
        .call(bottomAxis);

    return xAxis;
}

function renderYAxes(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);

    yAxis.transition()
        .duration(1000)
        .call(leftAxis);
    
    return yAxis;
}

// function for updating circles with a transition to new data
function renderCircles(circlesGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {
    circlesGroup.transition()
        .duration(1000)
        .attr("cx", d => newXScale(d[chosenXAxis]))
        .attr("cy", d => newYScale(d[chosenYAxis]))
    return circlesGroup;
}

function renderCirclesGroupText(circlesGroupText, newXScale, chosenXAxis, newYScale, chosenYAxis) {
    circlesGroupText.transition()
        .duration(1000)
        .attr("x", d => newXScale(d[chosenXAxis]))
        .attr("y", d => newYScale(d[chosenYAxis]*0.99));
    return circlesGroupText;
}

// function to update circles group with new tooltip
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {
    var xLabel;
    var yLabel; 
    if (chosenXAxis === "poverty") {
        xLabel = "In Poverty (%)";
    }
    else if (chosenXAxis === "age") {
        xLabel = "Age (median)";
    }
    else if (chosenXAxis === "income") {
        xLabel = "Household Income (median)";
    }
    if (chosenYAxis === "healthcare") {
        yLabel = "Lacks Healthcare (%)";
    }
    else if (chosenYAxis === "smokes") {
        yLabel = "Smokes (%)";
    }
    else if (chosenYAxis === "obesity") {
        yLabel = "Obese (%)"
    }
    var toolTip = d3.tip()
         .attr("class", "d3-tip")
         .offset([80, 60])
         .html(function(d){
             if (chosenXAxis === "poverty"){
                return(`${d.state}<br>${chosenXAxis}: ${d[chosenXAxis]}%<br>${chosenYAxis}: ${d[chosenYAxis]}%`);
             }
             else {
                return(`${d.state}<br>${chosenXAxis}: ${d[chosenXAxis]}<br>${chosenYAxis}: ${d[chosenYAxis]}%`);
             }
        });


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
        data.smokes = +data.smokes; 
    });

    // scale the axis functions
    var xLinearScale = xScale(dataset, chosenXAxis);
    //    var yLinearScale = yScale(dataset, chosenYAxis);

    /// create y scale function 
    var yLinearScale = yScale(dataset, chosenYAxis);

    // create inital axis function
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // append axes to chart 
    var xAxis = chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);
    var yAxis = chartGroup.append("g")
        .classed("y-axis", true)
        .attr("transform", "rotate(-90)")
        .attr("transform", `translate(0, 0)`)
        .call(leftAxis);

    // create data points
    var circlesGroup = chartGroup.append("g")
        .selectAll("circle")
        .data(dataset)
        .enter()
        .append("circle")
        .attr("class", "stateCircle")
        .attr("cx", d => xLinearScale(d[chosenXAxis]))
        .attr("cy", d => yLinearScale(d[chosenYAxis]))
        .attr("r", "12");
        
    var circlesGroupText = circlesGroup.select("text")
        .data(dataset)
        .enter()
        .append("text")
        .attr("class", "stateText")
        .attr("x", d => xLinearScale(d[chosenXAxis]))
        .attr("y", d => yLinearScale(d[chosenYAxis]*0.99))
        .attr("font-size", "10px")
        .text(d => d.abbr);


    // crate x axis label
    var xLabelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${width/2}, ${height + margin.top +30 })`)
    var inPovertyLabel = xLabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 0)
        .attr("class", "axisText")
        .attr("value", "poverty")
        .classed("active", true)
        .text("In Poverty (%)");
    
    var ageLabel = xLabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("class", "axisText")
        .attr("value", "age")
        .classed("inactive", true)
        .text("Age (median)")

    var householdIncomeLabel = xLabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 40)
        .attr("class", "axisText")
        .attr("value", "income")
        .classed("inactive", true)
        .text("Household Income (median)")

    // create y axis label
    var yLabelsGroup = chartGroup.append("g")
        .attr("transform", `translate(-${margin.left}, ${height/2})`)
    var healthcareLabel = yLabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 70)
        .attr("transform", "rotate(-90)")
        .attr("class", "axisText")
        .attr("value", "healthcare")
        .classed("active", true)
        .text("Lacks Healthcare (%)");

    var smokesLabel = yLabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 50)
        .attr("transform", "rotate(-90)")
        .attr("class", "axisText")
        .attr("value", "smokes")
        .classed("inactive", true)
        .text("Smokes (%)")

    var obeseLabel = yLabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 30)
        .attr("transform", "rotate(-90)")
        .attr("class", "axisText")
        .attr("value", "obesity")
        .classed("inactive", true)
        .text("Obese (%)")

    // set the labels for the inital setup
    var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);
    
    xLabelsGroup.selectAll("text")
        .on("click", function(){
            var value = d3.select(this).attr("value");
            if (value !== chosenXAxis) {
                chosenXAxis = value;
                // update x scale for new data
                xLinearScale = xScale(dataset, chosenXAxis);
                yLinearScale = yScale(dataset, chosenYAxis);
                // update x axis with transition
                xAxis = renderXAxes(xLinearScale, xAxis);
                // update circles with new x values
                circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis); 
                // update circles abbr value
                circlesGroupText = renderCirclesGroupText(circlesGroupText, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);
                // update tooltips with new info
                circlesGroup = updateToolTip(chosenXAxis, chosenYAxis,circlesGroup);        
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
             }
        });
        yLabelsGroup.selectAll("text")
        .on("click", function(){
            var value = d3.select(this).attr("value");
            if (value !== chosenYAxis) {
                chosenYAxis = value;
                // update x scale for new data
                yLinearScale = yScale(dataset, chosenYAxis);
                // update x axis with transition
                yAxis = renderYAxes(yLinearScale, yAxis);
                // update circles with new x values
                circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis); 
                // update circles abbr value
                circlesGroupText = renderCirclesGroupText(circlesGroupText, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);
                // update tooltips with new info
                circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);        
                // change classes to change bold text
                if (chosenYAxis === "healthcare") {
                    healthcareLabel.classed("active", true)
                        .classed("inactive", false);
                    smokesLabel.classed("active", false)
                        .classed("inactive", true);
                    obeseLabel.classed("active", false)
                        .classed("inactive", true);
                }
                else if (chosenYAxis === "smokes") {
                    smokesLabel.classed("active", true)
                        .classed("inactive", false);
                    healthcareLabel.classed("active", false)
                        .classed("inactive", true);
                    obeseLabel.classed("active", false)
                        .classed("inactive", true);
                }
                else if (chosenYAxis === "obesity") {
                    obeseLabel.classed("active", true)
                        .classed("inactive", false);
                    smokesLabel.classed("active", false)
                        .classed("inactive", true);
                    healthcareLabel.classed("active", false)
                        .classed("inactive", true);
                }
             }
        });
}).catch(function(error) {
    console.log(error);
});
