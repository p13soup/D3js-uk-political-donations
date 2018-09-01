// GLOBALS
var w = 1000,h = 900;
var padding = 2;
var nodes = [];
var force, node, data, maxVal;
var brake = 0.2;
var radius = d3.scale.sqrt().range([10, 20]);
var columnWidth=20;
var defaultHeight = 30;
var columnHeightScale;


var fill = d3.scale.ordinal().range(["#bd00bb", "#47bd00", "#05e8e5"]);

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
			.duration(2500)
			.attr("r", function(d) { return d.radius; });

}

function display(data) {

	maxVal = d3.max(data, function(d) { return parseInt(d.amount); });
	console.log(maxVal);
	columnHeightScale = d3.scale.linear().domain([0,maxVal]).range([0,900]);

	var radiusScale = d3.scale.sqrt()
		.domain([0, maxVal])
			.range([10, 20]);

	data.forEach(function(d, i) {
		var y = radiusScale(d.amount);
		var node = {
				radius: radiusScale(d.amount) / 5,
				amount: d.amount,
				donor: d.donor,
				party: d.party,
				partyLabel: d.partyname,
				entity: d.entity,
				entityLabel: d.entityname,
				color: d.color,
				x: Math.random() * w,
				y: -y
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

	nodes.sort(function(a,b){
		return parseInt(b.amount)-parseInt(a.amount)
	});

	nodeGroup.selectAll("rect").data(nodes)
			.enter().append("rect")
					.attr("x", function(data,i){
						return (columnWidth+5)*i;
					})
					.attr("width", columnWidth)
					.attr("height",function(d){
						return columnHeightScale(d.amount);
					})
					.attr("y",function(d){
						return h-columnHeightScale(d.amount);
					})
					.style("fill", function(d) { return fill(d.party); })
					/*.attr("selectH", defaultHeight)
					.style("opacity","transparent")*/
					.attr("class", function(d) { return "node " + d.party; })
					.attr("amount", function(d) { return d.amount; })
					.attr("donor", function(d) { return d.donor; })
					.attr("entity", function(d) { return d.entity; })
					.attr("party", function(d) { return d.party; })
					.on("mouseover", mouseover)
					.on("mouseout", mouseout);

}


function mouseover(d, i) {
	// tooltip popup
	var mosie = d3.select(this);
	var amount = mosie.attr("amount");
	var donor = d.donor;
	var party = d.partyLabel;
	var entity = d.entityLabel;
	var offset = $("svg").offset();
	var height = d.height;
	var width = d.width;
	var label = d.donor;
	


	// image url that want to check
	var imageFile = "https://raw.githubusercontent.com/ioniodi/D3js-uk-political-donations/master/photos/" + donor + ".ico";
	
	
	// *******************************************
	

	
	var infoBox = "<p> Source: <b>" + donor + "</b> " +  "<span><img src='" + imageFile + "' height='42' width='42' onError='this.src=\"https://github.com/favicon.ico\";'></span></p>" 	
	
	 							+ "<p> Recipient: <b>" + party + "</b></p>"
								+ "<p> Type of donor: <b>" + entity + "</b></p>"
								+ "<p> Total value: <b>&#163;" + comma(amount) + "</b></p>";
	
	
	mosie.classed("active", true);
	d3.select(".tooltip")
  	.style("right", (parseInt(d3.select(this).attr("x") +width) + offset.left) + "px")
    .style("top", (parseInt(d3.select(this).attr("y") +height) + offset.top) + "px")
		.html(infoBox)
			.style("display","block");
	
	var msg = new SpeechSynthesisUtterance(d3.select(this).attr("donor"));
	speechSynthesis.speak(msg);
	var msg = new SpeechSynthesisUtterance(mosie.attr("amount"));
	speechSynthesis.speak(msg);

	
	d3.select(".lastSeenContainer").append("img").attr("src","https://raw.githubusercontent.com/ioniodi/D3js-uk-political-donations/master/photos/" + donor + ".ico")
			.attr("donor", donor);
		
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
	
	
    return d3.csv("data/7500up.csv", display);

});

