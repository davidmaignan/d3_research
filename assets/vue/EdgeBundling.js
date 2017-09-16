import * as d3 from "d3";
import selection_attrs from "../../node_modules/d3-selection-multi/src/selection/attrs";
import selection_styles from "../../node_modules/d3-selection-multi/src/selection/styles";

d3.selection.prototype.attrs = selection_attrs
d3.selection.prototype.styles = selection_styles

const diameter = 1300,
    radius = diameter / 2,
    radiusX = radius + 100,
    innerRadius = radius - 350;
const cluster = d3.cluster()
    .size([360, innerRadius]);
const line = d3.radialLine()
    .curve(d3.curveBundle.beta(.5))
    .radius(function(d) { return d.y; })
    .angle(function(d) { return d.x / 180 * Math.PI; })

let svg = d3.select("#edgediagram-container").select("svg")
    .attr("width", 1700)
    .attr("height", diameter)
    .append("g")
    .attr("transform", "translate(" + radiusX + "," + radius + ")");
let link, text, node, circle, mapLinks, linkEdge, arc

let mouseover = (d) => {
  text.each((n) => {n.target = n.source = false;})
  link.classed("hover-parent", function(l) { if (l.target === d) return l.source.source = true; })
      .classed("hover-child", function(l) { if (l.source === d) return l.target.target = true; })
      .filter(function(l) { return l.target === d || l.source === d; })
      .raise();
  text.classed("hover-child", function(n) { return n.target; })
      .classed("hover-parent", function(n) { return n.source; });
}
let initEdge = (modele) => {
  link = svg.selectAll(".link"),
      text = svg.selectAll(".text-edge"),
      circle = svg.selectAll(".circle")
      mapLinks = {},
      linkEdge = []

  let root = d3.hierarchy(modele.getEdgeData()).sum(function(d) { return d.size; });
  cluster(root)

  arc = []

  root.descendants().map((a, b) => {
    if(a.data.name !== "root"){
      arc[a.data.groupId] = []
    }
  })
  root.descendants().map((a, b) => {
    if(a.data.name !== "root"){
      let dt = {'x': a.x, 'y': a.y}
      arc[a.data.groupId].push({'x': a.x, 'y': a.y})
    }
  })

  // console.log(root.descendants().length)

  let arcGenerator = (percent) => {
    // let startAngle = Math.asin((750 - radiusX) / radius)
    // let endAngle = Math.asin((1200 - radiusX) / radius)

    let arc =  d3.arc()
        .innerRadius(innerRadius + 10)
        .outerRadius(radius)
        .startAngle(0)
        .endAngle( percent * 2 * Math.PI / 100 + 0.025);

    svg.append("path")
        .attr("class", "arc")
        .attr("d", arc);
  }
  //
  arcGenerator(10)

  text = text.data(root.descendants())
    .enter()
    .append("text")
    .attr("class", "text-edge")
    .attr("dy", "0.31em")
    .attr("transform", function(d) { return "rotate(" + (d.x - 90) + ")translate(" + (d.y + 8) + ",0)" + (d.x < 180 ? "" : "rotate(180)"); })
    .attr("text-anchor", function(d) { return d.x < 180 ? "start" : "end"; })
    .text(function(d) { return d.data.name + "(" + d.data.groupId + ")"; })
    .on("mouseover", mouseover)


  root.descendants().forEach(function(n){
    mapLinks[n.data.name] = n
  })
  modele.getEdgeData().links.forEach(function(l){
    linkEdge.push(mapLinks[l.source.name].path(mapLinks[l.target.name]))
  })
  link = link.data(linkEdge)
      .enter().append("path")
        .each(function(d) {
           d.source = d[0], d.target = d[d.length - 1]; })
        .attr("class", "link")
        .attr("d", line);

  circle = circle.data(root.descendants())
    .enter()
    .append("circle")
    .attr("class", "circle")
    .attr("dy", "0.31em")
    .attr('r', 5)
    .attr("transform", function(d) { return "rotate(" + (d.x - 90) + ")translate(" + (d.y) + ",0)" })
    .text(function(d) { return d.data.name + "(" + d.data.groupId + ")"; })
    .on("mouseover", mouseover)
}
let resetEdge = () => {
  svg.selectAll("*").remove();
}
let updateEdge = (modele) => {
  initEdge(modele)
}
let searchEdgeNode = (searchText) => {
  svg.selectAll(".text-edge").classed('selected', function(n){
    if(searchText.length === 0) return false
    return n.data.name.toLowerCase().search(searchText.toLowerCase()) > -1
  })
}

// group = svg.selectAll('.group')

export { initEdge, resetEdge, updateEdge, searchEdgeNode }
