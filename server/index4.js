//A a

//var dataset = [80, 100, 56, 120, 180, 30, 40, 120, 160];
var dataset = [1,2,3,4,5]


var svgWidth = 500
var svgHeight = 300; 
var barPadding = 5;
var barWidth = (svgWidth / dataset.length);


var svg = d3.select('svg')
	.attr("width",svgWidth)
	.attr("height", svgHeight);


var yScale = d3.scaleLinear()
	.domain([0, d3.max(dataset)])
	.range([0, svgHeight]);


var barChart = svg.selectAll("rect")
	.data(dataset)
    .enter()
    .append("rect")
 	.attr("y", function(d) {
 		return svgHeight- yScale(d)
 	})
 	.attr("height", function(d) {
 		return yScale(d);
 	})
 	.attr("width", barWidth - barPadding)
 	.attr("class","bar")
 	.attr("transform", function (d, i){
 		var translate = [barWidth * i, 0];
 		return "translate("+ translate +")";
 	});
 
 	var text = svg.selectAll("text")
 		.data(dataset)
 		.enter()
 		.append("text")
 		.text(function(d){
 			return d;
 		})
 		.attr("y",function(d, i){
 			return svgHeight - d - 10;
 		})
 		.attr("x",function(d, i){
 			return barWidth * i + barWidth / 2;
 		})
 		.attr("fill", "#A64C38");
