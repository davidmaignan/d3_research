import { Group, Component, Model } from './assets/model/Model.js'

// Unit tests for the Model, Group, Components
// npm install
// ./nodes_modules/.bin/karma start

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

      groupMap.set(groupA.id, groupA)
      groupMap.set(groupB.id, groupB)
      groupMap.set(groupC.id, groupC)
      groupMap.set(groupD.id, groupD)

      componentMap.set(component2.id, component2)
      componentMap.set(component1.id, component1)
      componentMap.set(component3.id, component3)

      groupA.addGroup(groupB)
      groupA.addGroup(groupC)
      groupA.addComponent(component1)
      groupD.addGroup(groupA)
      groupD.addComponent(component2)
      component1.addDependency(component2)
      component1.addDependency(component3)
      component2.addDependency(component3)

      modele = new Model(
        groupMap,
        componentMap,
        new Map()
      )
    })
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
    describe("Component:getNodes, getLinks", function() {
      it("return an array of the nodes", function() {
        expect(modele.getNodes().length).to.equal(7);
      });

      it("return an array of the links between each nodes", function() {
          expect(modele.getLinks().length).to.equal(8);
      });
    })
    describe("Model:getEdgeData, getNodes, update", function() {
      it("Model:getEdgeData: retourne un tableau de lien", function() {
        expect(modele.getEdgeData()).to.have.keys('name', 'children', "links");
        expect(modele.getEdgeData().name).to.be.a('string')
        expect(modele.getEdgeData().children).to.be.an('array')
      });
      describe("Model:getComponent", function() {
        it("return a new component when it doesn't exist", function() {
          let expected = modele.getNodes().length + 1

          let cmp = modele.getComponent({
            id: 4,
            name: "mock cmp",
            sensorIds: null,
            dependencies: [ ],
            status: "up"
          })
          expect(modele.getNodes().length).to.be.equals(8)
        })
        it("return an existing component", function() {
          let cmp = modele.getComponent({
            id: 1,
            name: "cmp 1",
            sensorIds: null,
            dependencies: [ ],
            status: "up"
          })

          expect(modele.getNodes().length).to.be.equals(7)
        })
      })
      describe("Model:getGroup", function() {
        it("return a new group when it doesn't exist", function() {
          let expected = modele.getNodes().length + 1
          let grp = modele.getGroup({
            groupId: 5,
            name: "mock grp",
            componenentIds: [],
            groupIds: [ ]
          })
          expect(modele.groups.map(g => g.id)).to.be.eql([1,2,3,4,5])
          expect(modele.getNodes().length).to.be.equals(8)
        })
        it("return an existing group", function() {
          let grp = modele.getGroup({
            groupId: 4,
            name: "mock grp",
            componenentIds: [],
            groupIds: [ ]
          })
          expect(modele.groups.map(g => g.id)).to.be.eql([1,2,3,4])
          expect(modele.getNodes().length).to.be.equals(7)
        })
      })
      describe("Model:update", function() {
        it("update a component (name, status, dependencies)." +
         "and it creates a new component when it does not exists", function() {
            let fetchData = { isSuccess: true,
              errors: [ ],
              content: {
                groups: [],
                components: [
                  {
                    id: 1,
                    name: "cmp 1",
                    sensorIds: null,
                    dependencies: [3, 4],
                    status: "up"
                  },
                  {
                    id: 4,
                    name: "new component 4",
                    sensorIds: null,
                    dependencies: [],
                    status: "up"
                  }
                ]
              }
            }
            modele.update(fetchData)

            expect(modele.getNodes().length).to.be.equal(8)
            let expectedIds = [3,4]
            let depIds = modele.components.get(1).dependenciesMap.map(d => d.id)
            expect(depIds).to.be.eql(expectedIds)
        })
        it("update a group (name, componentIds, groupIds)." +
         "and it creates a new group and component when they do not exists", function() {
            let fetchData = { isSuccess: true,
              errors: [ ],
              content: {
                components: [],
                groups: [
                  {
                    groupId: 1,
                    name: "TS.WCM2",
                    componentIds: [1,5],
                    groupIds: [
                      11,
                      12,
                      13,
                      14,
                      15
                    ]
                  },
                ]
              }
            }

            modele.update(fetchData)

            expect(modele.getNodes().length).to.be.equal(13)
            expect(modele.groups.get(1).groups.map(g => g.id)).is.eql([11,12,13,14,15])
            expect(modele.groups.get(1).name).to.be.equal("TS.WCM2")
            expect(modele.groups.get(1).groupIds).to.be.eql([11,12,13,14,15])
            expect(modele.groups.get(1).componentIds).to.be.eql([1,5])
            expect(modele.groups.get(1).componentMap.map(g => g.id)).is.eql([1,5])
        })
      })
      describe("Model:getNodesGrouped, getSortedAlphabetically", function () {
        it("returned the components sorted by groups", function() {
          let result = modele.getNodesGrouped()
          result = result.reduce((r, a) => {
            r[a[0]] = a[1].map(e => e.id)
            return r
          }, [])
          let expected = [[3], [1], undefined, undefined, [2]]
          expect(result).to.be.eql(expected)
        })

        it("return an array sorted", function(){
          let result = modele.getSortedAlphabetically(
            [component3, component1, component2, new Component(0, "cmp 0", [])]
          )
          for(let i = 0; i < 3; i++){
            //Note: cmp 0 at index 0, cmp 1 at index 1 ...
            expect(result[i].id).to.be.equal(i)
          }
        })
      })

      it("return the sizing (%) of each group", function(){
        // modele.
      })


  })
})
