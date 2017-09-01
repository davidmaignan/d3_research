
import {Enum} from 'enumify';

let Map = require("collections/map");

class Group {
  constructor(id, name, sensorList){
    this.id = id;
    this.name = name;
    this.sensorList = sensorList;
  }
}

class Component {
  constructor(id, name){
    this.id = id;
    this.name = name;
    this.dependencies = new Map();
  }

  getId(){
    return this.id;
  }

  addDependency(component){
    this.dependencies.add(component.getId(), component)
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
