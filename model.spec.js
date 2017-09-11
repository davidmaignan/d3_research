import { Group, Component, Model } from './assets/Model.js'

describe("Model, Group et Component: getNodes & getLinks ", function() {

  let groupA = new Group(1, "group A", [], []),
      groupB = new Group(2, "group B", [], []),
      groupC = new Group(3, "group C", [], []),
      groupD = new Group(4, "group D", [], []),
      component1 = new Component(1, "cmp 1", []),
      component2 = new Component(2, "cmp 2", []),
      component3 = new Component(3, "cmp 3", [])

  let modele = new Model(
    [groupA, groupB, groupC, groupD],
    [component1, component2, component3],
    []
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

  describe("Model:getNodes", function() {
      it("retourne un tableau de lien", function() {
        expect(modele.getNodes().length).to.equal(7);
      });
  });

  describe("Model:getLinks", function() {
      it("retourne un tableau de lien", function() {
        expect(modele.getLinks().length).to.equal(8);
      });
  });

});
