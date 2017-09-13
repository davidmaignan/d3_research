import {schema, fixtures} from '../fixtures.js';
import {Group, Component, Sensor, Model} from '../model/Model.js'

let groupMap, componentMap, sensorMap, modele

//validate the json fixtures
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

sensorMap = require("collections/map");
sensorMap = new Map()

for (let i in fixtures.sensors){
  let s = fixtures.sensors[i]
  let id = parseInt(s.id)
  sensorMap.set(s.name, new Sensor(s.id, s.name, s.sensorType, s.url, s.timeout))
}

componentMap = new Map();

for(let i in fixtures.components){
  let c = fixtures.components[i]

  componentMap.set(c.name, new Component(parseInt(c.id), c.name, c.dependencies))
}

componentMap.forEach((component) => {
  let dependenciesIds = component.getDependenciesIds()
  let dependencies = componentMap.filter(cmp => dependenciesIds.includes(cmp.getId()))

  component.addDependencies(dependencies)
})

groupMap = new Map();
for (let i in fixtures.groups) {
  let g = fixtures.groups[i]

  groupMap.set(g.name, new Group(g.groupId, g.name, g.componentIds, g.groupIds))
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

modele = new Model(groupMap, componentMap, sensorMap)

export { groupMap, componentMap, modele }
