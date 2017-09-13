
import {Enum} from 'enumify'

let Set = require("collections/set")
let Map = require("collections/map");

class Group {
  constructor(id, name, componenentIds, groupIds){
    this.id = id
    this.name = name
    this.compnenentIds = componenentIds
    this.groupIds = groupIds
    this.components = new Set()
    this.componentMap = new Map()
    this.groups = new Set()
    this.groupMap = new Map()
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
    this.componentMap.set(component.name, component)
    this.components.add(component)
  }
  addGroups(groupList){
    groupList.forEach((g) =>{
      this.addGroup(g)
    })
  }
  addGroup(group){
    this.groupMap.set(group.name, group)
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

    let linksMap = this.groupMap.map(g =>  {return this.linked(g)})

    this.componentMap.reduce((ar, c) => {ar.push(this.linked(c)); return ar}, linksMap)

    return linksMap
  }
}

class Component {
  constructor(id, name, dependenciesIds){
    this.id = id
    this.name = name
    this.dependenciesIds = dependenciesIds
    this.dependencies = new Set()
    this.dependenciesMap = new Map()
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
    this.dependenciesMap.set(component.name, component)
    this.dependencies.add(component)
  }
  printDependencies(){
    return this.dependencies.map((d) => {return d.name}).join("<br>")
  }
  linked(target){
    return {'source': this, 'target': target}
  }
  getLinks(){
    return this.dependenciesMap.reduce((ar, g) => {ar.push(this.linked(g)); return ar}, [])
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
    return {
      "name": "root",
      "children": this.getNodes()
    }
  }

  update(updatedData){
    console.log(this.components.length)

    updatedData.content.components.forEach(d => {



      // let component = this.getComponent(d.name)
      //
      // component.status = d.status
      // component.name = d.name
      //
      // console.log(component)
      //
      // component.dependenciesIds.filter(d => d.dependencies.indexOf(x) == -1);
      //
      // console.log(d.dependencies)
    })
  }

  getComponent(d){
    return this.components.get(d.name) || this.createComponent(d)
  }

  createComponent(d){
    this.components.set(d.name, new Component(d.id, d.name, d.dependencies))
    return this.components.get(d.name)
  }


}

Group.prototype.toString = function() {
  return this.id.toString()
}

var replaceAll = function() {
  return this.name.replace(/[ .-]/g, "-")
}

Group.prototype.getClassName = replaceAll
Component.prototype.getClassName = replaceAll
Sensor.prototype.getClassName = replaceAll

class SensorType extends Enum {}

export {Group, Component, Sensor, SensorType, Model}
