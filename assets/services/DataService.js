import {schema, fixtures} from '../fixtures.js';
import {Group, Component, Sensor, Model} from '../model/Model.js'

//valide and load fixtures
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

let sensorSet = require("collections/set");
sensorSet = new Set()

for (let i in fixtures.sensors){
  let s = fixtures.sensors[i]
  let id = parseInt(s.id)
  sensorSet.add(new Sensor(s.id, s.name, s.sensorType, s.url, s.timeout))
}

let componentSet = require("collections/set")
componentSet = new Set();

let cmpCounter = 0;

for(let i in fixtures.components){
  cmpCounter++
  let c = fixtures.components[i]

  componentSet.add(new Component(parseInt(c.id), c.name, c.dependencies))
}

componentSet.forEach((component) => {
  let dependenciesIds = component.getDependenciesIds()
  let dependencies = componentSet.filter(cmp => dependenciesIds.includes(cmp.getId()))

  component.addDependencies(dependencies)
})

let groupSet = require("collections/set");
groupSet = new Set();

for (let i in fixtures.groups) {
  let g = fixtures.groups[i]

  groupSet.add(new Group(g.groupId, g.name, g.componentIds, g.groupIds))
}

groupSet.forEach((g) => {
  let componentIds = g.getComponentIds()
  let components = componentSet.filter(cmp => componentIds.includes(cmp.getId()))
  g.addComponents(components)

  let groupIds = g.getGroupIds()
  let groupList = groupSet.filter(g => groupIds.includes(g.getId()))

  groupList.forEach(g => g.setTopLevel(false)) //@todo refactor
  g.addGroups(groupList)
})

let modele = new Model(groupSet, componentSet, sensorSet)

export { groupSet, componentSet, modele }
