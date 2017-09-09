import 'jquery'
import 'bootstrap/dist/js/bootstrap.min.js'

import * as d3 from "d3";
import selection_attrs from "./node_modules/d3-selection-multi/src/selection/attrs";
import selection_styles from "./node_modules/d3-selection-multi/src/selection/styles";
import { groupSet } from './assets/services/DataService.js'
import { Group } from './assets/Model.js'

d3.selection.prototype.attrs = selection_attrs
d3.selection.prototype.styles = selection_styles

var width  = 1500;           // width of svg image
var height = 600;           // height of svg image
var margin = 15;            // amount of margin around plot area
var pad = margin / 2;       // actual padding amount
var radius = 6;             // fixed node radius
var yfixed = pad + radius;  // y position for all nodes

let configuration = {
  "width": 2500,
  "height": 2000,
  "node":{
    "x": 0,
    "y": 160
  }
}

let groupTopLevel = groupSet.filter(g => g.isTopLevel())
groupTopLevel = groupTopLevel.toArray()

var nodes = new Set()
var links = new Set()

groupSet.forEach(g => {
  nodes.add(g)
  g.components.forEach(c => {
    nodes.add(c)
  })
})



let linkGroupTopLevel = []

function flattenGroupComponent(grp){
  let list = require("collections/set")
  list = new Set()

  flattenGroupComponentList(list, grp)

  return list
}
function flattenGroupComponentList(list, g){

  g.groups.forEach((grp) => {
    links.add({'source': g, 'target': grp})
    flattenGroupComponentList(list, grp)
  })

  g.components.forEach((cmp) => {
    links.add({'source': g, 'target': cmp})
    flattenComponentListRec(list, cmp)
  })
}
function flattenComponentListRec(list, component){
  list.add(component)
  component.dependencies.forEach((cmp) => {
    links.add({'source': component, 'target': cmp})
    flattenComponentListRec(list, cmp)
  })
}

for(let i = 0; i < groupTopLevel.length - 1; i++){
  let group1 = flattenGroupComponent(groupTopLevel[i])
  for(let j = i + 1; j < groupTopLevel.length; j++){
    let group2 = flattenGroupComponent(groupTopLevel[j])
    if(group1.intersection(group2).length > 0) {
      // console.log(groupTopLevel[i].id, groupTopLevel[j].id)
      linkGroupTopLevel.push({source: groupTopLevel[i].id, target: groupTopLevel[j].id})
    }
  }
}

nodes = nodes.toArray()

links.toArray().forEach(function(d, i) {
    d.source = nodes[d.source.id];
    d.target = nodes[d.target.id];
});

var svg  = d3.select("svg")
        .attr("id", "arc")
        .attr("width", configuration.width)
        .attr("height", configuration.height);

var color = d3.scaleOrdinal(d3.schemeCategory10);

var nodeContainer = svg.append("g")
       .attrs({
         "id": "nodeContainer",
         "transform": `translate(10, 10)`,
       })

var popover = d3.select("body")
       	.append("div")
        .attr('class', 'popover')
       	.style("position", "absolute")
       	.style("z-index", "10")
       	.style("visibility", "hidden")

nodeContainer.selectAll(".node")
       .data(nodes)
       .enter()
       .append("circle")
       .attr("class", "node")
       .attr("id", function(d, i) { return d.name; })
       .attr("cx", function(d, i) { return i * 20 })
       .attr("cy", function(d, i) { return configuration.node.y; })
       .attr("r",  function(d, i) { return radius; })
       .on("mouseover", function(c){
         popover.style("visibility", "visible")
         popover.style("left", c.x)
         popover.style("top", "200px")
         popover.html(`<ul><li>id: ${c.id}</li><li>${c.name}</li></ul>`)

         let circle = d3.select(`circle[id='${c.name}']`)
         console.log(circle)
         circle.style('fill', 'red')

       }).
       on('mouseout', c => {popover.style("visibility", "hidden")})
       .style("fill",   function(d, i) { return color(d.group); })

nodeContainer.selectAll(".text")
  .data(nodes)
  .enter()
  .append("text")
  .attrs({
    "class": "text",
    "font-family": "arial",
    "font-size": "12px",
    "fill": "#aaa",
    "transform": "rotate(-90 80 6.5)",
    "x": "-60",
    "y": (d, i) => {return i * 20 - 70},
  })
  .text(node => {
    return node.name
  })

// scale to generate radians (just for lower-half of circle)
var radians = d3.scaleLinear()
    .range([Math.PI / 2, 3 * Math.PI / 2]);

// path generator for arcs (uses polar coordinates)
var arc = d3.lineRadial()
    .angle(function(d) { return radians(d); });


nodeContainer.selectAll(".link")
  .data(links.toArray())
  .enter()
  .append("path")
  .styles({
    "fill": "none",
    "stroke": "#888888",
    "stroke-weight": "1px",
    "stroke-opacity": 0.5
  })
  .attr("class", "link")
  .attr("transform", function(d, i) {
      d.source.x = parseInt(d3.select(`circle[id='${d.source.name}']`).attr("cx"))
      d.target.x = parseInt(d3.select(`circle[id='${d.target.name}']`).attr("cx"))

      var xshift = d.source.x + (d.target.x - d.source.x) / 2;
      var yshift = 160;
      return "translate(" + xshift + ", " + yshift + ")";
  })
  .attr("d", function(d, i) {
      // get x distance between source and target
      var xdist = Math.abs(d.source.x - d.target.x);

      // set arc radius based on x distance
      arc.radius(xdist / 2);

      // want to generate 1/3 as many points per pixel in x direction
      var points = d3.range(0, Math.ceil(xdist / 3));

      // set radian scale domain
      radians.domain([0, points.length - 1]);

      // return path for arc
      return arc(points);
  });
