import 'jquery'
import 'bootstrap/dist/js/bootstrap.min.js'

import * as d3 from "d3";
import selection_attrs from "./node_modules/d3-selection-multi/src/selection/attrs";
import selection_styles from "./node_modules/d3-selection-multi/src/selection/styles";
import { groupSet } from './assets/services/DataService.js'
import { Group } from './assets/Model.js'

d3.selection.prototype.attrs = selection_attrs
d3.selection.prototype.styles = selection_styles

let configuration = {
  width: 800,
  height: 800
}

let groupTopLevel = groupSet.filter(g => g.isTopLevel())
groupTopLevel = groupTopLevel.toArray()

let linkGroupTopLevel = []

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

for(let i = 0; i < groupTopLevel.length - 1; i++){
  let group1 = flattenGroupComponent(groupTopLevel[i])
  for(let j = i + 1; j < groupTopLevel.length; j++){
    let group2 = flattenGroupComponent(groupTopLevel[j])
    if(group1.intersection(group2).length > 0) {
      // console.log(groupTopLevel[i].id, groupTopLevel[j].id)
      linkGroupTopLevel.push({source: groupTopLevel[i].id, target: groupTopLevel[j].id})
    }
  }
}

class Test{
  constructor(id, label, name, fixed){
    this.id = id
    this.label = label
    this.name = name
    this.r = 10
    if (this.id === 0) {
      d.fx = wid
      d.fy = d.y;
    }
  }
}

let node0 = new Test(0, "root", "root", true)
let node1 = new Test(1, "node1", "node1")
let node2 = new Test(2, "node2", "node2")
let node3 = new Test(3, "node3", "node3")
let node4 = new Test(4, "node4", "node4")

let nodeList = []
let linkList = []

var json = {
  "nodes": [
    node0, node1, node2, node3
  ],
  "links": [
    {source: node0, target: node1},
    {source: node0, target: node2},
    {source: node0, target: node3}
  ]
}
var linkBatch0 = [
  {source: node1, target: node2},
  {source: node1, target: node3},
]
var json2 = {
  "nodes": [
    {
      "name": "root",
      "label": "",
      "test": 0
    },
    {
      "name": "TS.WCM",
      "label": "",
      "test": 1
    },
    {
      "name": "TS.API",
      "label": "Database",
      "test": 2
    },
    {
      "name": "Datalex",
      "label": "",
      "test": 3
    },
    {
      "name": "Soft Voyage",
      "label": "",
      "test": 4
    },
    {
      "name": "Backend",
      "label": "",
      "test": 6
    },
    {
      "name": "Radixx DB",
      "label": "",
      "test": 7
    },
    {
      "name": "External Web sites",
      "label": "",
      "test": 9
    },
    {
      "name": "TS API Flight",
      "label": "",
      "test": 10
    },
    {
      "name": "TS WCM Feeds",
      "label": "",
      "test": 17
    },
  ],
  "links": [
    {
      "source": 0,
      "target": 1,
    },
    {
      "source": 0,
      "target": 2,
    },
    {
      "source": 0,
      "target": 3,
    },
    {
      "source": 0,
      "target": 4,
    },
    {
      "source": 0,
      "target": 6,
    },
    {
      "source": 0,
      "target": 7,
    },
    {
      "source": 0,
      "target": 9,
    },
    {
      "source": 0,
      "target": 10,
    },
    {
      "source": 0,
      "target": 17,
    }
  ]
}

var colors = d3.scaleOrdinal(d3.schemeCategory10);
var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height"),
    node,
    link,
    edgepaths,
    edgelabels;

svg.append('defs').append('marker')
    .attrs({'id':'arrowhead',
        'viewBox':'-0 -5 10 10',
        'refX':13,
        'refY':0,
        'orient':'auto',
        'markerWidth':13,
        'markerHeight':13,
        'xoverflow':'visible'})
    .append('svg:path')
    .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
    .attr('fill', '#ddd')
    .style('stroke','none');

var simulation = d3.forceSimulation()
    // .force('x', d3.forceX().x(300))
    // .force('y', d3.forceY().y(100))
    .force("link", d3.forceLink().distance(50).strength(1))
    .force("charge", d3.forceManyBody().strength(10))
    .force("center", d3.forceCenter(width / 2, height / 2))
    .force("collision", d3.forceCollide().radius((f) => {
      return 50
    }))
    .on("tick", ticked);

let index = 0
// var ajout = d3.interval(() => {
//   if(index < 4){
//     nodeList.push(eval("node"+index))
//     if(index > 0){
//       linkList.push({source: node0, target: eval("node"+index)})
//     }
//     console.log(nodeList, linkList)
//   } else {
//     clearInterval(ajout)
//   }
//
//   index++
// }, 5000);

update(json.links, json.nodes);

function update(links, nodes) {
    // link = svg.selectAll(".link")
    //     .data(links)
    //     .enter()
    //     .append("line")
    //     .attr("class", "link")
    //     .attr('marker-end','url(#arrowhead)')
    //
    // link.append("title")
    //     .text(function (d) {return "to define";});
    // edgepaths = svg.selectAll(".edgepath")
    //     .data(links)
    //     .enter()
    //     .append('path')
    //     .attrs({
    //         'class': 'edgepath',
    //         'fill-opacity': 0,
    //         'stroke-opacity': 0,
    //         'id': function (d, i) {return 'edgepath' + i}
    //     })
    //     .style("pointer-events", "none");
    // edgelabels = svg.selectAll(".edgelabel")
    //     .data(links)
    //     .enter()
    //     .append('text')
    //     .style("pointer-events", "none")
    //     .attrs({
    //         'class': 'edgelabel',
    //         'id': function (d, i) {return 'edgelabel' + i},
    //         'font-size': 10,
    //         'fill': '#aaa'
    //     });
    // edgelabels.append('textPath')
    //     .attr('xlink:href', function (d, i) {return '#edgepath' + i})
    //     .style("text-anchor", "middle")
    //     .style("pointer-events", "none")
    //     .attr("startOffset", "50%")
    //     .text(function (d) {return d.type});

    node = svg.selectAll(".node")
    node = node.data(nodes, function(d) { return d.id})

    let nodeEnter = node
        .enter()
        .append("g")
        .attr("class", "node")
        .call(d3.drag().on("start", dragstarted).on("drag", dragged))

    node.exit().remove()
    nodeEnter.merge(node)
    nodeEnter.on("mouseover", (d) => {
      // console.log(d)
    })
    nodeEnter.append("circle")
        .attrs({
          "r": (data, i) => {
            return 25 + 10 * (i % 3)
          },
          "x": 500,
          "y": 500
        })
        .style("fill", function (d, i) {return "#ededed";})
    nodeEnter.append("title")
        .text(function (d) {return d.id;});
    nodeEnter.append("text")
        .attrs({
          "dx": -10,
          "dy": -20,
          "font-family": "arial",
          "font-size": 10,
          "color": "#ddd"
        })
        .text(function (d) {return "." ;});

    link = svg.selectAll(".link")
    link = link.data(links, function(d) {
      return d.source.id + "-" + d.target.id;
    });
    link.exit().remove();

    let linkEnter = link
      .enter()
      .append("line")
      .attr("class", "link")
    linkEnter.merge(link)

    node = svg.selectAll(".node")
    link = svg.selectAll(".link")

    simulation.nodes(nodes)
    simulation.force("link").links(links);
    simulation.alpha(1).restart();
}

function ticked() {
    link.attr("x1", function (d) {return d.source.x;})
        .attr("y1", function (d) {return d.source.y;})
        .attr("x2", function (d) {return d.target.x;})
        .attr("y2", function (d) {return d.target.y;});

    node.attr("transform", function (d) {return "translate(" + d.x + ", " + d.y + ")";});

    // edgepaths.attr('d', function (d) {
    //     return 'M ' + d.source.x + ' ' + d.source.y + ' L ' + d.target.x + ' ' + d.target.y;
    // });
    //
    // edgelabels.attr('transform', function (d) {
    //     if (d.target.x < d.source.x) {
    //         var bbox = this.getBBox();
    //
    //         let rx = bbox.x + bbox.width / 2;
    //         let ry = bbox.y + bbox.height / 2;
    //         return 'rotate(180 ' + rx + ' ' + ry + ')';
    //     }
    //     else {
    //         return 'rotate(0)';
    //     }
    // });
}
function dragstarted(d) {
    if (!d3.event.active) simulation.alphaTarget(0.3).restart()
    d.fx = d.x;
    d.fy = d.y;
}
function dragged(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
}

document.querySelector("#add").addEventListener("click", (event) => {
  json.nodes.push(node4)

  node1.open = true

  json.links.push({source: node1, target: node4})

  update(json.links, json.nodes);
})
document.querySelector("#remove").addEventListener("click", (event) => {
  json.nodes.pop()
  json.links.pop()

  console.log(json.nodes)

  update(json.links, json.nodes);
})
