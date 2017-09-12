
import {Enum} from 'enumify'

let Set = require("collections/set")

class Group {
  constructor(id, name, compnenentIds, groupIds){
    this.id = id
    this.name = name
    this.compnenentIds = compnenentIds
    this.groupIds = groupIds
    this.components = new Set()
    this.groups = new Set()
    this.topLevel = true
  }

  getGroupIds(){
    return this.groupIds
  }
  getComponentIds(){
    return this.compnenentIds
  }
  getId(){
    return this.id
  }
  addComponents(componentList){
    componentList.forEach((c) =>{
      this.addComponent(c)
    })
  }
  addComponent(component){
    this.components.add(component)
  }
  addGroups(groupList){
    groupList.forEach((g) =>{
      this.addGroup(g)
    })
  }
  addGroup(group){
    this.groups.add(group)
  }
  setTopLevel(bool){
    this.topLevel = bool
  }
  isTopLevel(){
    return this.topLevel
  }
  printDependencies(){
    return this.components.map((d) => {return d.name}).join("<br>")
  }
  linked(target){
    return {'source': this, 'target': target}
  }
  getLinks(){
    let links = this.groups.map((g) => {return this.linked(g)})

    this.components.reduce((ar, c) => {ar.push(this.linked(c)); return ar}, links)

    return links
  }
}

class Component {
  constructor(id, name, dependenciesIds){
    this.id = id
    this.name = name
    this.dependenciesIds = dependenciesIds
    this.dependencies = new Set()
  }
  getId(){
    return this.id
  }
  getDependenciesIds(){
    return this.dependenciesIds
  }
  addDependencies(componentList){
    componentList.forEach((c) =>{
      this.addDependency(c)
    })
  }
  addDependency(component){
    this.dependencies.add(component)
  }
  printDependencies(){
    return this.dependencies.map((d) => {return d.name}).join("<br>")
  }
  linked(target){
    return {'source': this, 'target': target}
  }
  getLinks(){
    return this.dependencies.reduce((ar, g) => {ar.push(this.linked(g)); return ar}, [])
  }
}

class Sensor {
  constructor(id, name, type, url, timeout){
    this.id = id
    this.name = name
    this.type = type
    this.url = url
    this.timeout = timeout
  }
}

class Model {
  constructor(groups, components, sensors){
    this.groups = groups
    this.components = components
    this.sensors = sensors
  }

  getNodes(){
    return this.groups.toArray().concat(this.components.toArray())
  }

  getLinks(){
    let links = this.groups.reduce((result, g) => {return result.concat(g.getLinks())}, [])

    return this.components.reduce((result, c) => {return result.concat(c.getLinks())}, links)
  }

  getEdgeData(){
    let datas = {}

    datas = {
      "name": "root",
      "children": this.getNodes()
    }

    return datas

    // return {
    //   "name": "A1",
    //   "children": [
    //     {
    //       "name": "B1",
    //       "children": [
    //         {
    //           "name": "C1",
    //           "value": 100
    //         },
    //         {
    //           "name": "C2",
    //           "value": 300
    //         },
    //         {
    //           "name": "C3",
    //           "value": 200
    //         }
    //       ]
    //     },
    //     {
    //       "name": "B2",
    //       "value": 200
    //     }
    //   ]
    // };
  }
}

Group.prototype.toString = function() {
  return this.id.toString()
}

var replaceAll = function() {
  return this.name.replace(/[ .]/g, "-")
}

Group.prototype.getClassName = replaceAll
Component.prototype.getClassName = replaceAll

class SensorType extends Enum {}

export {Group, Component, Sensor, SensorType, Model}
