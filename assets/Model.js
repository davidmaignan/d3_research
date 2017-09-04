
import {Enum} from 'enumify';

let Set = require("collections/set");

class Group {
  constructor(id, name, sensorList){
    this.id = id;
    this.name = name;
    this.sensorList = sensorList;
  }
}

class Component {
  constructor(id, name, dependenciesIds){
    this.id = id;
    this.name = name;
    this.dependenciesIds = dependenciesIds;
    this.dependencies = new Set();
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
    this.id = id;
    this.name = name;
    this.type = type;
    this.url = url;
    this.timeout = timeout;
  }
}

class SensorType extends Enum {}

SensorType.initEnum(['http', 'httpWebFullPage', 'json'])

export {Group, Component, Sensor, SensorType}
