import 'jquery'
import 'bootstrap/dist/js/bootstrap.min.js'

import * as d3 from "d3";
import selection_attrs from "./node_modules/d3-selection-multi/src/selection/attrs";
import selection_styles from "./node_modules/d3-selection-multi/src/selection/styles";
import { groupSet, componentSet, modele } from './assets/services/DataService.js'
import { initArc, updateArc } from './assets/vue/ArcDiagonal.js'
import { initEdge } from './assets/vue/EdgeBundling.js'
import { datas, fetchData } from './assets/fixtures.js'
import { initMenu } from './assets/vue/menu.js'

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

initArc()
initEdge()
initMenu()

updateArc(fetchData)
