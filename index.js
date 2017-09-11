import 'jquery'
import 'bootstrap/dist/js/bootstrap.min.js'

import * as d3 from "d3";
import selection_attrs from "./node_modules/d3-selection-multi/src/selection/attrs";
import selection_styles from "./node_modules/d3-selection-multi/src/selection/styles";
import { groupSet, componentSet, modele } from './assets/services/DataService.js'
import {initArc } from './assets/vue/ArcDiagonal.js'

d3.selection.prototype.attrs = selection_attrs
d3.selection.prototype.styles = selection_styles

//
// let configuration = {
//   "width": 2500,
//   "height": 2000,
//   "node":{
//     "x": 0,
//     "y": 160
//   }
// }
//
// let groupTopLevel = groupSet.filter(g => g.isTopLevel())
// groupTopLevel = groupTopLevel.toArray()
//
// var nodes = []
// var links = []

// groupSet.forEach(g => {
//   nodes.push(g)
//
//   g.groups.forEach(subGroup => {
//     links.push({'source': g, 'target': subGroup})
//   })
//
//   g.components.forEach(c => {
//     links.push({'source': g, 'target': c})
//   })
// })
// componentSet.forEach(component => {
//   nodes.push(component)
//   component.dependencies.forEach(dependency => {
//     links.push({'source': component, 'target': dependency})
//   })
// })
// let linkGroupTopLevel = []
// function flattenGroupComponent(grp){
//   let list = require("collections/set")
//   list = new Set()
//
//   flattenGroupComponentList(list, grp)
//
//   return list
// }
// function flattenGroupComponentList(list, g){
//   g.groups.forEach((grp) => {
//     flattenGroupComponentList(list, grp)
//   })
//
//   g.components.forEach((cmp) => {
//     flattenComponentListRec(list, cmp)
//   })
// }
// function flattenComponentListRec(list, component){
//   list.add(component)
//   component.dependencies.forEach((cmp) => {
//     flattenComponentListRec(list, cmp)
//   })
// }

// initArc()

let configuration = {
  "width": 2500,
  "height": 2000,
  "node":{
    "x": 0,
    "y": 160,
    "radius": 6
  }
}

const svg  = d3.select("svg")
        .attr("id", "arc")
        .attr("width", configuration.width)
        .attr("height", configuration.height);
const color = d3.scaleOrdinal(d3.schemeCategory10);

let link, node, text

node = svg.append("g").selectAll(".node")

node
    .data(modele.getNodes())
  .enter().append("svg:g")
    .attr("class", "node")
    .attr("id", function(d) { return "node-" + d.key; })
    .attr("transform", function(d) { return "rotate(" + (d.id - 90) + ")translate(" + d.id + ")"; })
  .append("svg:text")
    .attr("dx", function(d) { return d.x < 180 ? 8 : -8; })
    .attr("dy", ".31em")
    .attr("text-anchor", function(d) { return d.x < 180 ? "start" : "end"; })
    .attr("transform", function(d) { return d.x < 180 ? null : "rotate(180)"; })
    .text(function(d) { return d.key; })
