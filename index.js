import * as d3 from "d3";
import selection_attrs from "./node_modules/d3-selection-multi/src/selection/attrs";
import selection_styles from "./node_modules/d3-selection-multi/src/selection/styles";
import {schema, fixtures} from './assets/fixtures.js';
import {Group, Component, Sensor} from './assets/Model.js'

d3.selection.prototype.attrs = selection_attrs
d3.selection.prototype.styles = selection_styles

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
