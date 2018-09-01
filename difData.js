
// GLOBALS
var w = 300,h = 600;
var padding = 2;
var nodes = [];
var force, node, data, maxVal;
var brake = 0.2;
var radius = d3.scale.sqrt().range([10, 20]);
var columnWidth=20;
var columnHeightScale;
var colHeight = 20;

var fill = d3.scale.ordinal().range(["#e71212","#0a8ef3"]);

var svg = d3.select("#chart").append("svg")
	.attr("id", "svg")
	.attr("width", w)
	.attr("height", h);

var nodeGroup = svg.append("g");

var tooltip = d3.select("#chart")
 	.append("div")
	.attr("class", "tooltip")
	.attr("id", "tooltip");

var comma = d3.format(",.0f");


function start() {

		node.transition()
			.duration(2500);

}

function display(data) {
	
	maxVal = d3.max(data, function(d) { return parseInt(d.doctVisits); });
	console.log(maxVal);
	columnHeightScale = d3.scale.linear().domain([0,maxVal]).range([0,500]);

	data.forEach(function(d, i) {
		var node = {
				doctVisits: d.doctVisits,
				age: d.age,
				gender: d.gender
      };
			
      nodes.push(node)
	});

	
	console.log(nodes);
		
	createColumn(nodes);
	d3.select("svg").attr("width", function(){
		return nodes.length*(columnWidth+5);
	})
	
}


function createColumn(nodes){

	nodeGroup.selectAll("rect").data(nodes)
			.enter().append("rect")
					.attr("x", function(data,i){
						return (columnWidth+5)*i;
					})
					.attr("width", columnWidth)
					.attr("height",function(d){
						return columnHeightScale(d.doctVisits);
					})
					.style("fill", function(d) { return fill(d.gender); })
					.attr("y",function(d){
						return h-columnHeightScale(d.doctVisits);
					})
					.attr("age", function(d) { return d.age; })
					.attr("gender", function(d) { 
						var gender;
						if (d.gender==1){
							return "male";
						}
						else{
							return "female";
						}							
					})
					.attr("doctVisits", function(d) { return d.doctVisits; })
					.on("mouseover", mouseover)
					.on("mouseout", mouseout);

}


function mouseover(d, i) {
	// tooltip popup
	var mosie = d3.select(this);
	var age = mosie.attr("age");
	var doctorVisits = d.doctVisits;
	var gender=d.gender;
	var offset = $("svg").offset();
	var height = d.height;
	var width = d.width;

	
	// *******************************************
	

	
	var infoBox = "<p> Age: <b>" + age + "</b> "+"</p>" 	
	
	 							+ "<p> Doctor Visits: <b>" + doctorVisits + "</b></p>"
								+ "<p> Gender: <b>" + gender + "</b></p>";
	
	
	mosie.classed("active", true);
	d3.select(".tooltip")
  	.style("right", (parseInt(d3.select(this).attr("x") +width) + offset.left) + "px")
    .style("top", (parseInt(d3.select(this).attr("y") +height) + offset.top) + "px")
		.html(infoBox)
			.style("display","block");

		
}
	
function mouseout() {
	// no more tooltips
		var mosie = d3.select(this);

		mosie.classed("active", false);

		d3.select(".tooltip")
			.style("display", "none");
		}
		
$(document).ready(function() {
		d3.selectAll(".switch").on("click", function(d) {
      var id = d3.select(this).attr("id");
      return transition(id);
    });
	
	
    return d3.csv("data.csv", display);

});

