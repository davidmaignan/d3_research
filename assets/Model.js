
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
    this.size = 0;
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

  getName(){
    return this.name
  }

  setTopLevel(value){
    this.topLevel = value
  }

  isTopLevel(){
    return this.topLevel;
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
}

class Component {
  constructor(id, name, dependenciesIds){
    this.id = id
    this.name = name
    this.dependenciesIds = dependenciesIds
    this.dependencies = new Set()
    this.size = 0
  }

  getId(){
    return this.id
  }

  getSize(){
    return this.size
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

class SensorType extends Enum {}


export {Group, Component, Sensor, SensorType}
