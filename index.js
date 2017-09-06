import 'jquery'
import 'bootstrap/dist/js/bootstrap.min.js'

import * as d3 from "d3";
import selection_attrs from "./node_modules/d3-selection-multi/src/selection/attrs";
import selection_styles from "./node_modules/d3-selection-multi/src/selection/styles";
import { groupSet } from './assets/services/DataService.js'

d3.selection.prototype.attrs = selection_attrs
d3.selection.prototype.styles = selection_styles

let groupTopLevel = groupSet.filter(g => g.isTopLevel()).toArray()
let dimensions = {"width": 700, "height": 500, "border": "1px solid #ddd"}
//
d3.select("body").append("svg").styles(dimensions)
//
let svg = d3.select("svg")
let x, y = 0;
let groupItems = svg.selectAll("g").data(groupTopLevel)
let groupEnter = groupItems.enter().append("g").attr(
  "transform", (d, i) => {
    if (i % 5 == 0) {
      x = 0
      y++
    }

    let posX = ++x * 110
    let posY = y * 200

    return `translate(${posX}, ${posY})`
  }
)

let circles = groupEnter.append("circle").attrs({
  r: 0,
  stroke: "black"
}).styles({
  opacity: .2
}).transition().attr("r", 20)

let texts = groupEnter.append("text").attrs({
  dx: -20,
  dy: -25
}).text((d) => d.getName())

// let nodes = d3.range(10).map((i) => return {index: i})

// svg.append("g").selectAll("circle").data(groupTopLevel).enter().append("circle")
//   .attrs({
//     r: 0,
//     stroke: "black",
//     cx: (d,i) => { if (i % 5 == 0) { x = 0 }  return ++x * 100} ,
//     cy: (d,i) => { if (i % 5 == 0) { y++ } return y * 100 }
//   })
//   .styles({
//     opacity: .2
//   })
//   .transition().attr("r", 20)
//
// var exit =  () => {
//     console.log("exit")
//     svg.selectAll("circle").data(valuesExit).transition().attr("r", 0);
// }
//

// button.addEventListener('click', exit)
