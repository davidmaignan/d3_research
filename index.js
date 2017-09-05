import * as d3 from "d3";
import selection_attrs from "./node_modules/d3-selection-multi/src/selection/attrs";
import selection_styles from "./node_modules/d3-selection-multi/src/selection/styles";
import {schema, fixtures} from './assets/fixtures.js';
import {Group, Component, Sensor} from './assets/Model.js'
import {Enum} from 'enumify'

d3.selection.prototype.attrs = selection_attrs
d3.selection.prototype.styles = selection_styles

//valide and load fixtures

var Ajv = require('ajv');
var ajv = Ajv({allErrors: true});
var valid = ajv.validate(schema, fixtures);
if (valid) {
  console.log('Fixtures are valid. \\o/');
} else {
  console.log('Fixtures are INVALID :( ');
  console.log(ajv.errors);
  throw new Error("fixtures json invalid!")
}


// let dimensions = {"width": 500, "height": 500, "border": "1px solid #ddd"}
// let datas = [{"name": "Luke", "occupation": "jedi", "age": 29}, {"name": "Leia", "occupation": "princess", "age": 29}]
// let values = [1,2,3,4];
// let valuesExit = [1,2,3];
// d3.select("body").append("svg").style("height", dimensions.height).style("width", dimensions.width).style("border", dimensions.border)
//
// let svg = d3.select("svg")
// let button = document.querySelector("#btn")
//
// svg.append("g").selectAll("circle").data(values).enter().append("circle")
//   .attrs({r: 0, stroke: "black", cx: (d,i) => d * 100 , cy: (d,i) => d * 100})
//   .styles({opacity: .2})
//   .transition().attr("r", 20)
//
// var exit =  () => {
//     console.log("exit")
//     svg.selectAll("circle").data(valuesExit).transition().attr("r", 0);
// }
//

// button.addEventListener('click', exit)



class SensorType extends Enum {}

SensorType.initEnum(fixtures.sensorsTypes)

console.log(SensorType.http)

let sensorSet = require("collections/set");
sensorSet = new Set();
//
for (let i in fixtures.sensors){
  let s = fixtures.sensors[i]
  let id = parseInt(s.id)
  console.log(id)
  sensorSet.add(new Sensor(s.id, s.name, s.sensorType, s.url, s.timeout))
}

let componentSet = require("collections/set")
componentSet = new Set();

for(let i in fixtures.components){
  let c = fixtures.components[i]

  componentSet.add(new Component(parseInt(c.id), c.name, c.dependencies))
}

componentSet.forEach((component) => {
  let dependenciesIds = component.getDependenciesIds()
  let dependencies = componentSet.filter(cmp => dependenciesIds.includes(cmp.getId()))

  component.addDependencies(dependencies)
})

let groupSet = require("collections/set")
groupSet = new Set();

for (let i in fixtures.groups) {
  let g = fixtures.groups[i]

  groupSet.add(new Group(g.groupId, g.name, g.componentIds, g.groupIds))
}

groupSet.forEach((g) => {
  let componentIds = g.getComponentIds()
  let components = componentSet.filter(cmp => componentIds.includes(cmp.getId()))
  g.addComponents(components)

  let groupIds = g.getGroupIds()
  let groupList = groupSet.filter(g => groupIds.includes(g.getId()))
  g.addGroups(groupList)

})

console.log(groupSet)

// let tmp = [1,2]
//
// let test = componentSet.filter(function(e) {
//   return tmp.includes(e.getId())
// })
//
// console.log(test)


// componentSet.forEach((component) => {
//   let dependencies = "test"
// })


// var createComponentRec = (obj) => {
//
//   let tmp = componentMap.one({"id": obj.id})
//
//   // console.log(tmp)
// }
//
// var createComponent = (list) => {
//   for(let i in list){
//     let c = list[i]
//     componentMap.set(i, new Component(c.id, c.name))
//   }
//
//   console.log(componentMap)
//
//   for(let i in list){
//     let c = list[i]
//     let component = componentMap.get(c.id.toString())
//     c.dependencies.forEach(j => {
//       let elt = componentMap.get(j.toString())
//       component.addDependency(elt)
//     })
//     // componentSet.add(new Component(c.id, c.name))
//   }
//
// }
//
//
//
// createComponent(fixtures.components)
//
// // console.log(componentSet)
//
//
// let groupSet = require("collections/set");
// for(let g in fixtures.groups){
//   let group = new Group(g.id, g.name)
// }

// var datas = fixtures
