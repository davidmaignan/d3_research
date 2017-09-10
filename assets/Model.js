
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

var replaceAll = function() {
  return this.name.replace(/[ .]/g, "-")
}

Group.prototype.getClassName = replaceAll
Component.prototype.getClassName = replaceAll

class SensorType extends Enum {}


export {Group, Component, Sensor, SensorType}
