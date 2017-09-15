import {Group, Component, Sensor, Model} from '../model/Model.js'

let Map = require("collections/map");

class ModelService {
  constructor(json, schema){
    this.json = json
    this.schema = schema
  }

  isValid(){
    //validate the json fixtures
    var Ajv = require('ajv');
    var ajv = Ajv({allErrors: true});
    var valid = ajv.validate(this.schema, this.json);

    if (valid) {
      console.log('Fixtures are valid. \\o/');
    } else {
      console.log('Fixtures are INVALID :( ');
      console.log(ajv.errors);
    }

    return valid
  }

  buildModel(){
    if(this.isValid()){
      let sensorMap = new Map()

      //To refactor:
      for (let i in this.json.sensors){
        let s = this.json.sensors[i]
        let id = parseInt(s.id)
        sensorMap.set(s.id, new Sensor(s.id, s.name, s.sensorType, s.url, s.timeout))
      }

      let componentMap = new Map();

      for(let i in this.json.components){
        let c = this.json.components[i]

        componentMap.set(c.id, new Component(parseInt(c.id), c.name, c.dependencies))
      }

      componentMap.forEach((component) => {
        let dependenciesIds = component.getDependenciesIds()
        let dependencies = componentMap.filter(cmp => dependenciesIds.includes(cmp.getId()))

        component.addDependencies(dependencies)
      })

      let groupMap = new Map();
      for (let i in this.json.groups) {
        let g = this.json.groups[i]

        groupMap.set(g.id, new Group(g.id, g.name, g.componentIds, g.groupIds))
      }

      groupMap.forEach((g) => {
        let componentIds = g.getComponentIds()
        let components = componentMap.filter(cmp => componentIds.includes(cmp.getId()))
        g.addComponents(components)


        let groupIds = g.getGroupIds()
        let groupList = groupMap.filter(g => groupIds.includes(g.getId()))

        groupList.forEach(g => g.setTopLevel(false)) //@todo refactor
        g.addGroups(groupList)
      })

      return new Model(groupMap, componentMap, sensorMap)
    }
  }
}

export { ModelService }
