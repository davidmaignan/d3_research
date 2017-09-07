import 'jquery'
import 'bootstrap/dist/js/bootstrap.min.js'

import * as d3 from "d3";
import selection_attrs from "./node_modules/d3-selection-multi/src/selection/attrs";
import selection_styles from "./node_modules/d3-selection-multi/src/selection/styles";
import { groupSet } from './assets/services/DataService.js'

d3.selection.prototype.attrs = selection_attrs
d3.selection.prototype.styles = selection_styles

let groupTopLevel = groupSet.filter(g => g.isTopLevel() === true)

console.log(groupSet)

function flattenGroupComponent(grp){
  let list = require("collections/set")
  list = new Set()

  flattenGroupComponentList(list, grp)

  return list
}

function flattenGroupComponentList(list, grp){

  grp.groups.forEach((grp) => {
    flattenGroupComponentList(list, grp)
  })

  grp.components.forEach((cmp) => {
    flattenComponentListRec(list, cmp)
  })
}

function flattenComponentListRec(list, cmp){
  list.add(cmp)
  cmp.dependencies.forEach((cmp) => flattenComponentListRec(list, cmp))
}







function test(){

  var width = 600, height = 400;
  var colorScale = ['orange', 'lightblue', '#B19CD9'];
  var xCenter = [100, 300, 500]
  var numNodes = 100;
  var nodes = d3.range(numNodes).map(function(d, i) {
    return {
      radius: Math.random() * 25,
      category: i % 3
    }
  });

  var links = [
    {source: 0, target: 1},
    {source: 1, target: 6},
    {source: 3, target: 4},
    {source: 4, target: 5},
  ]

  var links2 = [
    {source: 0, target: 6},
  ]

  var simulation = d3.forceSimulation(nodes)
    .force('charge', d3.forceManyBody().strength(5))
    .force('x', d3.forceX().x(function(d) {
      return xCenter[d.category];
    }))
    .force('collision', d3.forceCollide().radius(function(d) {
      return d.radius;
    }))
    .force('link', d3.forceLink().links(links))
    .on('tick', ticked);

  function ticked() {
    var u = d3.select('svg g')
      .selectAll('circle')
      .data(nodes);

    u.enter()
      .append('circle')
      .attr('r', function(d) {
        return d.radius;
      })
      .style('fill', function(d) {
        return colorScale[d.category];
      })
      .merge(u)
      .attr('cx', function(d) {
        return d.x;
      })
      .attr('cy', function(d) {
        return d.y;
      })

    u.exit().remove();

    var v = d3.select('svg g')
      .selectAll('line')
      .data(links)

    v.enter()
      .append('line')
      .merge(v)
      .attr('x1', function(d) {
        return d.source.x
      })
      .attr('y1', function(d) {
        return d.source.y
      })
      .attr('x2', function(d) {
        return d.target.x
      })
      .attr('y2', function(d) {
        return d.target.y
      })

    v.exit().remove()
  }
}

function test2(){
  var width = 700, height = 400;

    var nodes = [
      {id: 0},
      {id: 1},
      {id: 2},
      {id: 3},
      {id: 4},
      {id: 5}
    ]

    var links = [
      {source: 0, target: 1},
      {source: 0, target: 2},
      {source: 0, target: 3},
      {source: 0, target: 4},
      {source: 0, target: 5},
    ]

    var nodes2 = [
      {id: 6},
      {id: 7},
      {id: 8},
      {id: 9},
    ]

    var links2 = [
      {source: 0, target: 6},
      {source: 6, target: 7},
      {source: 6, target: 8},
      {source: 6, target: 9},
      {source: 0, target: 5},
    ]

    nodes = nodes.concat(nodes2)
    links = links.concat(links2)

  var simulation = d3.forceSimulation(nodes)
  .force('charge', d3.forceManyBody().strength(-1000))
  .force('center', d3.forceCenter(width / 2, height / 2))
  .force('link', d3.forceLink().distance(10).links(links))
  .on('tick', ticked);

  function ticked(){
    var u = d3.select('svg')
    .selectAll('circle')
    .data(nodes)

    u.enter()
    .append('circle')
    .attr('r', 5)
    .merge(u)
    .attr('cx', function(d) {
      return d.x
    })
    .attr('cy', function(d) {
      return d.y
    })

    u.exit().remove()

    var v = d3.select('.links')
    .selectAll('line')
    .data(links)

    v.enter()
      .append('line')
      .merge(v)
      .attr('x1', function(d) {
        return d.source.x
      })
      .attr('y1', function(d) {
        return d.source.y
      })
      .attr('x2', function(d) {
        return d.target.x
      })
      .attr('y2', function(d) {
        return d.target.y
      }).
      attr('distance', 100)

      v.exit().remove()
  }

  function update(){
    var u = d3.select('svg')
    .selectAll('circle')
    .data(nodes)

    u.enter()
    .append('circle')
    .attr('r', 5)
    .merge(u)
    .attr('cx', function(d) {
      return d.x
    })
    .attr('cy', function(d) {
      return d.y
    })

    u.exit().remove()

    // Update and restart the simulation.
    var simulation = d3.forceSimulation(nodes)
    simulation.alpha(1).restart();
  }

  let circles = d3.select('.nodes').selectAll('circles').data(nodes)

  circles.enter().append('circle')
  .attr('x', 100)
  .attr('y', 100)
  .attr('r', 10)
}

function test3() {
  var width = 700, height = 400;

  var nodes = [
    {id: 0, open: false }
  ]

  var child = [
      {id: 1},
      {id: 2},
      {id: 3},
      {id: 4}
    ]

  let centerX = width / 2;
  let centerY = height / 2;

  let svg = d3.select("svg")

  let ix = 0
  let jx = 0

  svg.select(".nodes").selectAll("circle").data(nodes).enter().append("circle")
    .attrs({
      r: 0,
      stroke: "black",
      cx: (d,i) => {
        if(i == 0){
          return centerX
        } else {
          let position = Math.cos(Math.PI * ix / 2)

          ix++
          return centerX + position * 50
        }
      } ,
      cy: (d,i) => {
        if(i == 0){
          return centerY
        } else {
          let position = Math.sin(Math.PI * jx / 2)
          jx++
          console.log(jx, position)
          return centerY + position * 50
        }
      }
    })
    .styles({
      opacity: .2
    })
    .transition().attr("r", 10)

    d3.selectAll('circle').on('click', (d, i) => {

      if(d.open === true){
        nodes.splice(1, 4)

        d.open = false

        svg.select(".nodes").selectAll('circle').data(nodes).exit().remove()

        return
      }

      d.open = true

      for(let elt in child){
        nodes.push(child[elt])
      }

      svg.select(".nodes").selectAll('circle').data(nodes).enter().append('circle')
      .attrs({
        r: 0,
        stroke: "black",
        cx: (d,i) => {
          if(i == 0){
            return centerX
          } else {
            let position = Math.cos(Math.PI * ix / 2)

            ix++
            return centerX + position * 50
          }
        } ,
        cy: (d,i) => {
          if(i == 0){
            return centerY
          } else {
            let position = Math.sin(Math.PI * jx / 2)
            jx++
            console.log(jx, position)
            return centerY + position * 50
          }
        }
      })
      .styles({
        opacity: .2
      })
      .transition().attr("r", 10)
    })

}

function test4() {

  var width = 700, height = 700

  var svg = d3.select("svg")
  svg.attrs({
    width: width,
    height: height
  })

  let groupTopLevel = groupSet.filter(g => g.isTopLevel())

  var nodes = groupTopLevel.toArray()

  let links = []

  // var links = [
  //   {source: 0, target: 1},
  //   {source: 0, target: 2},
  //   {source: 0, target: 3},
  //   {source: 0, target: 4},
  //   {source: 0, target: 5},
  // ]


  var simulation = d3.forceSimulation(nodes)
    .force('charge', d3.forceManyBody().strength(-10))
    .force('center', d3.forceCenter(width / 2, height / 2))
    .force('link', d3.forceLink().distance(5).links(links))
    .on('tick', ticked);

    var g = svg.append("g"),
      link = g.append("g").attr("stroke", "#000").attr("stroke-width", 1.5).selectAll(".link"),
      node = g.append("g").attr("stroke", "#fff").attr("stroke-width", 1.5).selectAll(".node");



  restart();

  function restart() {

    // Apply the general update pattern to the nodes.
    node = node.data(nodes, function(d) { return d.id;});
    node.exit().remove();
    node = node.enter().append("circle").attr("fill", function(d) { return "grey" }).attr("r", 8).merge(node);

    // Apply the general update pattern to the links.
    link = link.data(links, function(d) { return d.source.id + "-" + d.target.id; });
    link.exit().remove();
    link = link.enter().append("line").merge(link);

    // Update and restart the simulation.
    simulation.nodes(nodes);
    simulation.force("link").links(links);
    simulation.alpha(1).restart();
  }

  function ticked() {
  node.attr("cx", function(d) { return d.x; })
      .attr("cy", function(d) { return d.y; })

  link.attr("x1", function(d) { return d.source.x; })
      .attr("y1", function(d) { return d.source.y; })
      .attr("x2", function(d) { return d.target.x; })
      .attr("y2", function(d) { return d.target.y; });
}


  function ticked() {
    node.attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; })

    link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });
  }
}

// test4()

// test()
// test2()
// test3()
