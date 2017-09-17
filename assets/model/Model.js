
import {Enum} from 'enumify'

let Set = require("collections/set")
let Map = require("collections/map");

class Group {
  constructor(id, name, componenentIds, groupIds){
    this.id = id
    this.name = name
    this.compnenentIds = componenentIds
    this.groupIds = groupIds
    this.componentMap = new Map()
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
    component.groupId = this.id
    this.componentMap.set(component.name, component)
  }
  addGroups(groupList){
    groupList.forEach((g) =>{
      this.addGroup(g)
    })
  }
  addGroup(group){
    this.groupMap.set(group.id, group)
  }
  setTopLevel(bool){
    this.topLevel = bool
  }
  isTopLevel(){
    return this.topLevel
  }
  printDependencies(){
    return this.componentMap.map((d) => {return d.name}).join("<br>")
  }
  linked(target){
    return {'source': this, 'target': target}
  }
  getLinks(){
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
    this.dependenciesMap = new Map()
    this.groupId = 0
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
    this.dependenciesMap.set(component.id, component)
  }
  printDependencies(){
    return this.dependenciesMap.map((d) => {return d.name}).join("<br>")
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
    this.hasNewNode = false
  }
  getNodes(){
    return this.groups.toArray().concat(this.components.toArray())
  }
  getLinks(){
    let links = this.groups.reduce((result, g) => {return result.concat(g.getLinks())}, [])

    return this.components.reduce((result, c) => {return result.concat(c.getLinks())}, links)
  }
  getComponentsAndLinks(){
    return {
      "nodes": this.components.toArray(),
      "links": this.components.reduce((result, c) => {return result.concat(c.getLinks())}, [])
    }
  }

  flattenGroupComponent(result, group){
    let startIndex = result["children"].length - 1 || 0


    let groupInfo = {
      "group": group,
      "indices": [startIndex, null]
    }

    group.groupMap.forEach((grp) => {
      this.flattenGroupComponent(result, grp)
    })

    this.flattenGroupComponentList(result, group)

    groupInfo["indices"][1] = result["children"].length -1

    result["groups"].set(group.id, groupInfo)
  }

  flattenGroupComponentList(result, g){
    g.componentMap.forEach((cmp) => {
      result["children"].push(cmp)
    })
  }


  getEdgeData(){
    let groupTopLevel = this.groups.filter(g => g.isTopLevel())

    let result = {
      "name": "root",
      "children": [],
      "groups": new Map(),
      "links": []
    }

    this.groups.filter(g => g.isTopLevel()).forEach(g => {
      this.flattenGroupComponent(result, g)
    })

    result["children"] = result["children"].concat(this.components.filter(c => c.groupId === 0).toArray())
    result["links"] = this.components.reduce((result, c) => {return result.concat(c.getLinks())}, [])

    let children = this.getNodesGrouped().reduce((r, e) => {
      e[1].forEach(c => c.groupId = e[0])

      return r.concat(this.getSortedAlphabetically(e[1]))
    },[])

    return result

    return {
      "name": "root",
      "children": children,
      "links": this.components.reduce((result, c) => {return result.concat(c.getLinks())}, [])
    }
  }
  getPieChartData(){
    return []
  }
  update(updatedData){
    this.hasNewNode = false
    //Update components
    updatedData.content.components.forEach(d => {
      let component = this.getComponent(d)

      component.name = d.name
      component.dependenciesIds = d.dependencies
      let dependencies = d.dependencies.reduce((r, c) => {
        let cmp = this.getComponent({id: c})
        r.set(c, cmp);
        return r
      }, new Map())

      component.dependenciesMap = dependencies
    })

    //update groups
    updatedData.content.groups.forEach(d => {
      let group = this.getGroup(d)

      group.name = d.name
      group.groupIds = d.groupIds
      group.componentIds = d.componentIds
      group.componentMap = d.componentIds.reduce((r, c) => {
        let cmp = this.getComponent({id: c})
        r.set(c, cmp);
        return r
      }, new Map())

      //@todo refactor c# to return an array[{id: xx}, {id: yy}]
      //@todo refactor c#: get rid of groupId use id instead!
      group.groups = d.groupIds.reduce((r, c) => {
        let grp = this.getGroup({groupId: c})
        r.set(c, grp);
        return r
      }, new Map())
    })
  }
  getGroup(d) {
    return this.groups.get(d.groupId) || this.createGroup(d)
  }
  createGroup(d){
    this.hasNewNode = true
    let newGroup = new Group(d.groupId, d.name, d.componenentIds, d.groupIds)
    this.groups.set(d.groupId, newGroup)
    return newGroup
  }
  getComponent(d){
    return this.components.get(d.id) || this.createComponent(d)
  }
  createComponent(d){
    this.hasNewNode = true
    let newComponent = new Component(d.id, d.name, d.dependencies)
    this.components.set(d.id, newComponent)
    return newComponent
  }
  getNodesGrouped(){
    return this.components.group(function(a, b){
      return a.groupId || 0
    })
  }
  getSortedAlphabetically(ar){
    return ar.sort((a, b) => {
      return a.name.localeCompare(b.name)
    })
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
