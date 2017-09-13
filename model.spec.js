import { Group, Component, Model } from './assets/model/Model.js'

// Unit tests for the Model, Group, Components
// npm install
// ./nodes_modules/.bin/karma start

describe("Group, Component: getLinks ", function() {
  let groupA = new Group(1, "group A", [], []),
      groupB = new Group(2, "group B", [], []),
      groupC = new Group(3, "group C", [], []),
      groupD = new Group(4, "group D", [], []),
      component1 = new Component(1, "cmp 1", []),
      component2 = new Component(2, "cmp 2", []),
      component3 = new Component(3, "cmp 3", [])

  let Map = require("collections/map"),
      groupMap = new Map(),
      componentMap = new Map()

  groupMap.set(groupA.name, groupA)
  groupMap.set(groupB.name, groupB)
  groupMap.set(groupC.name, groupC)
  groupMap.set(groupD.name, groupD)

  componentMap.set(component1.name, component1)
  componentMap.set(component2.name, component2)
  componentMap.set(component3.name, component3)

  let modele = new Model(
    groupMap,
    componentMap,
    new Map()
  )

  groupA.addGroup(groupB)
  groupA.addGroup(groupB) //check for duplicates
  groupA.addGroup(groupC)
  groupA.addComponent(component1)
  groupD.addGroup(groupA)
  groupD.addComponent(component2)
  groupD.addComponent(component2) //check for duplicates
  component1.addDependency(component2)
  component1.addDependency(component3)
  component2.addDependency(component3)

  describe("Group:getLink", function() {
      it("retourne un tableau de lien", function() {
        expect(groupA.getLinks().length).to.equal(3);
      });
  });

  describe("Component:getLink", function() {
      it("retourne un tableau de lien", function() {
        expect(component1.getLinks().length).to.equal(2);
      });
  });
});

describe("Model: getNodes, getLinks, getEdgeData, update", function() {
    let groupA, groupB, groupC, groupD, component1, component2, component3, modele
    let Map = require("collections/map"), groupMap, componentMap
    beforeEach(function(){
      groupA = new Group(1, "group A", [], []),
      groupB = new Group(2, "group B", [], []),
      groupC = new Group(3, "group C", [], []),
      groupD = new Group(4, "group D", [], []),
      component1 = new Component(1, "cmp 1", []),
      component2 = new Component(2, "cmp 2", []),
      component3 = new Component(3, "cmp 3", [])

      groupMap = new Map(),
      componentMap = new Map()

      groupMap.set(groupA.name, groupA)
      groupMap.set(groupB.name, groupB)
      groupMap.set(groupC.name, groupC)
      groupMap.set(groupD.name, groupD)

      componentMap.set(component1.name, component1)
      componentMap.set(component2.name, component2)
      componentMap.set(component3.name, component3)

      groupA.addGroup(groupB)
      groupA.addGroup(groupB) //check for duplicates
      groupA.addGroup(groupC)
      groupA.addComponent(component1)
      groupD.addGroup(groupA)
      groupD.addComponent(component2)
      groupD.addComponent(component2) //check for duplicates
      component1.addDependency(component2)
      component1.addDependency(component3)
      component2.addDependency(component3)

      modele = new Model(
        groupMap,
        componentMap,
        new Map()
      )
    })

    it("return an array of the nodes", function() {
      expect(modele.getNodes().length).to.equal(7);
    });

    it("return an array of the links between each nodes", function() {
        expect(modele.getLinks().length).to.equal(8);
    });

    describe("Model:getEdgeData", function() {
        it("retourne un tableau de lien", function() {
          expect(modele.getEdgeData()).to.have.keys('name', 'children');
          expect(modele.getEdgeData().name).to.be.a('string')
          expect(modele.getEdgeData().children).to.be.an('array')
        });
    });



  describe("Model: getComponent", function (){
    it("return a new component when doesn't exist", function() {
      let expected = modele.getNodes().length + 1

      let cmp = modele.getComponent({
        id: "1",
        name: "mock cmp",
        sensorIds: null,
        dependencies: [ ],
        status: "up"
      })

      expect(modele.getNodes().length).to.be.equals(8)
    })

    it("return an existing component", function() {
      let cmp = modele.getComponent({
        id: "1",
        name: "cmp 1",
        sensorIds: null,
        dependencies: [ ],
        status: "up"
      })

      expect(modele.getNodes().length).to.be.equals(7)
    })
  })
  //
  describe("Model:update", function() {
      it("update the components, groups (dependencies and status)", function() {
          let fetchData = { isSuccess: true,
            errors: [ ],
            content: {
              components: [
                {
                  id: "1",
                  name: "cmp 1",
                  sensorIds: null,
                  dependencies: [1,2],
                  status: "up"
                }
              ]
            }
          }
          modele.update(fetchData)
      });
  });
})
