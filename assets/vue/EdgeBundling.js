import * as d3 from "d3";
import selection_attrs from "../../node_modules/d3-selection-multi/src/selection/attrs";
import selection_styles from "../../node_modules/d3-selection-multi/src/selection/styles";
import { modele } from '../services/DataService.js'

d3.selection.prototype.attrs = selection_attrs
d3.selection.prototype.styles = selection_styles

const diameter = 1300,
    radius = diameter / 2,
    innerRadius = radius - 320;
const cluster = d3.cluster()
    .size([360, innerRadius]);
const line = d3.radialLine()
    .curve(d3.curveBundle.beta(.5))
    .radius(function(d) { return d.y; })
    .angle(function(d) { return d.x / 180 * Math.PI; })

let root = d3.hierarchy(modele.getEdgeData()).sum(function(d) { return d.size; });

cluster(root)

let svg2 = d3.select("#edgediagram-container").select("svg")
    .attr("width", diameter)
    .attr("height", diameter)
    .append("g")
    .attr("transform", "translate(" + radius + "," + radius + ")");
let link = svg2.selectAll(".link"),
    node = svg2.selectAll(".node"),
    mapLinks = {},
    linkEdge = []

let mouseover = (d) => {
  node.each((n) => {n.target = n.source = false;})
  link.classed("hover-parent", function(l) { if (l.target === d) return l.source.source = true; })
      .classed("hover-child", function(l) { if (l.source === d) return l.target.target = true; })
      .filter(function(l) { return l.target === d || l.source === d; })
      .raise();
  node.classed("hover-child", function(n) { return n.target; })
      .classed("hover-parent", function(n) { return n.source; });
}

var initEdge = () => {
  node = node.data(root.descendants())
    .enter().append("text")
    .attr("class", "node")
    .attr("dy", "0.31em")
    .attr("transform", function(d) { return "rotate(" + (d.x - 90) + ")translate(" + (d.y + 8) + ",0)" + (d.x < 180 ? "" : "rotate(180)"); })
    .attr("text-anchor", function(d) { return d.x < 180 ? "start" : "end"; })
    .text(function(d) { return d.data.name; })
    .on("mouseover", mouseover)
  root.descendants().forEach(function(n){
    mapLinks[n.data.name] = n
  })
  modele.getLinks().forEach(function(l){
    linkEdge.push(mapLinks[l.source.name].path(mapLinks[l.target.name]))
  })
  link = link.data(linkEdge)
      .enter().append("path")
        .each(function(d) {
          console.log("test")
           d.source = d[0], d.target = d[d.length - 1]; })
        .attr("class", "link")
        .attr("d", line);
}

export { initEdge }
