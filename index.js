import 'jquery'
import 'bootstrap/dist/js/bootstrap.min.js'

import * as d3 from "d3";
import selection_attrs from "./node_modules/d3-selection-multi/src/selection/attrs";
import selection_styles from "./node_modules/d3-selection-multi/src/selection/styles";
import { groupSet, componentSet } from './assets/services/DataService.js'

console.log(componentSet.length)

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

var nodes = []
var links = []

groupSet.forEach(g => {
  nodes.push(g)

  g.groups.forEach(subGroup => {
    links.push({'source': g, 'target': subGroup})
  })

  g.components.forEach(c => {
    links.push({'source': g, 'target': c})
  })
})

componentSet.forEach(component => {
  nodes.push(component)
  component.dependencies.forEach(dependency => {
    links.push({'source': component, 'target': dependency})
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
    flattenGroupComponentList(list, grp)
  })

  g.components.forEach((cmp) => {
    flattenComponentListRec(list, cmp)
  })
}
function flattenComponentListRec(list, component){
  list.add(component)
  component.dependencies.forEach((cmp) => {
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

const svg  = d3.select("svg")
        .attr("id", "arc")
        .attr("width", configuration.width)
        .attr("height", configuration.height);
const color = d3.scaleOrdinal(d3.schemeCategory10);
let link = svg.append("g").selectAll(".link")
let node = svg.append("g").selectAll(".node")
let text = svg.append("g").selectAll(".text")
const popover = d3.select("body")
       	.append("div")
        .attr('class', 'popover')
       	.style("position", "absolute")
       	.style("z-index", "10")
       	.style("visibility", "hidden")
const mouseover = (d) => {
  popover.style("visibility", "visible")

  let x = parseInt(d3.select(`circle[id='${d.name}']`).attr("cx"))

  popover.style("left", x + 50)
  popover.style("top", "300px")
  popover.html(`<ul><li>id: ${d.id}</li><li>${d.name}</li></ul>`)

  node.each((n) => {n.target = n.source = false;})
  node.classed("hover", false).filter((l) => {return l === d}).classed("hover", true)
  text.classed("hover", false).filter((l) => {return l === d}).classed("hover", true)

  link.classed("hover-parent", function(l) { if (l.target === d) return l.source.source = true; })
      .classed("hover-child", function(l) { if (l.source === d) return l.target.target = true; })
      .filter(function(l) { return l.target === d || l.source === d; })
      .raise();

  node.classed("hover-child", function(n) { return n.target; })
      .classed("hover-parent", function(n) { return n.source; });
}
const mouseout = (node) => {
  popover.style("visibility", "hidden")
}

node = node.data(nodes)
       .enter()
       .append("circle")
       .attr("class", (node) => {
         return `node ${node.getClassName()} ${node.constructor}`
        })
       .attr("id", function(d, i) { return d.name; })
       .attr("cx", function(d, i) { return i * 20 })
       .attr("cy", function(d, i) { return configuration.node.y; })
       .attr("r",  function(d, i) { return radius; })
       .on("mouseover", mouseover)
       .on('mouseout', mouseout)

let radians = d3.scaleLinear()
    .range([Math.PI / 2, 3 * Math.PI / 2]);
let arc = d3.lineRadial()
    .angle(function(d) { return radians(d); });

text = text.data(nodes)
  .enter()
  .append("text")
  .attrs({
    "id": (node) => {return `${node.getClassName()}-text`},
    "class": (node) => {
      return `text ${node.getClassName()}`
     },
    "transform": "rotate(-90 80 6.5)",
    "x": "-60",
    "y": (d, i) => {return i * 20 - 70},
  })
  .text(node => {
    return node.name
  })
  .on("mouseover", mouseover)
  .on('mouseout', mouseout)
link = link.data(links)
  .enter()
  .append("path")
  .attr("class", (link) => {
    return `link ${link.source.getClassName()}-source ${link.target.getClassName()}-target`
   })
  .attr("transform", function(d, i) {
      d.source.x = parseInt(d3.select(`circle[id='${d.source.name}']`).attr("cx"))
      d.target.x = parseInt(d3.select(`circle[id='${d.target.name}']`).attr("cx"))

      var xshift = d.source.x + (d.target.x - d.source.x) / 2;
      var yshift = 160;
      return "translate(" + xshift + ", " + yshift + ")";
  })
  .attr("d", function(d, i) {
      var xdist = Math.abs(d.source.x - d.target.x);
      arc.radius(xdist / 2);

      var points = d3.range(0, Math.ceil(xdist / 3));
      radians.domain([0, points.length - 1]);

      return arc(points);
  })
