import * as d3 from "d3";
import selection_attrs from "./node_modules/d3-selection-multi/src/selection/attrs";
import selection_styles from "./node_modules/d3-selection-multi/src/selection/styles";
import {fixtures} from './assets/fixtures.js';
import {Group, Component, Sensor} from './assets/Model.js'

d3.selection.prototype.attrs = selection_attrs
d3.selection.prototype.styles = selection_styles

let dimensions = {"width": 500, "height": 500, "border": "1px solid #ddd"}
let datas = [{"name": "Luke", "occupation": "jedi", "age": 29}, {"name": "Leia", "occupation": "princess", "age": 29}]
let values = [1,2,3,4];
let valuesExit = [1,2,3];
d3.select("body").append("svg").style("height", dimensions.height).style("width", dimensions.width).style("border", dimensions.border)

let svg = d3.select("svg")
let button = document.querySelector("#btn")

svg.append("g").selectAll("circle").data(values).enter().append("circle")
  .attrs({r: 0, stroke: "black", cx: (d,i) => d * 100 , cy: (d,i) => d * 100})
  .styles({opacity: .2})
  .transition().attr("r", 20)

var exit =  () => {
    console.log("exit")
    svg.selectAll("circle").data(valuesExit).transition().attr("r", 0);
}

button.addEventListener('click', exit)


let sensorSet = require("collections/set");
sensorSet = new Set();

for (let i in fixtures.sensors){
  let s = fixtures.sensors[i]
  sensorSet.add(new Sensor(s.id, s.name, s.sensorType, s.url, s.timeout))
}

let componentMap = require("collections/map")
componentMap = new Map();

// for(let i in fixtures.components){
//   let c = fixtures.components[i]
//   // console.log(c)
//   componentSet.add(new Component(c.id, c.name))
//   console.log(c.dependencies)
//   c.dependencies.forEach((e) => {
//     // console.log(e)
//     // let cmp = componentSet.one({"id": e})
//     // console.log(cmp)
//   })
// }

var createComponentRec = (obj) => {

  let tmp = componentMap.one({"id": obj.id})

  console.log(tmp)
}

var createComponent = (list) => {
  for(let i in list){
    let c = list[i]
    componentMap.set(i, new Component(c.id, c.name))
  }

  console.log(componentMap)

  for(let i in list){
    let c = list[i]
    let component = componentMap.get(c.id.toString())
    c.dependencies.forEach(j => {
      let elt = componentMap.get(j.toString())
      component.addDependency(elt)
    })
    // componentSet.add(new Component(c.id, c.name))
  }

}

createComponent(fixtures.components)

// console.log(componentSet)


let groupSet = require("collections/set");
for(let g in fixtures.groups){
  let group = new Group(g.id, g.name)
}

// var datas = fixtures
