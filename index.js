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
      console.log(groupTopLevel[i].id, groupTopLevel[j].id)
      linkGroupTopLevel.push({source: groupTopLevel[i].id, target: groupTopLevel[j].id})
    }
  }
}

console.log(groupTopLevel, linkGroupTopLevel)

var json = {
  "nodes": [
    {
      "name": "root",
      "label": "",
      "id": 0
    },
    {
      "name": "TS.WCM",
      "label": "",
      "id": 1
    },
    {
      "name": "TS.API",
      "label": "Database",
      "id": 2
    },
    {
      "name": "Datalex",
      "label": "",
      "id": 3
    },
    {
      "name": "Soft Voyage",
      "label": "",
      "id": 4
    },
    {
      "name": "Backend",
      "label": "",
      "id": 6
    },
    {
      "name": "Radixx DB",
      "label": "",
      "id": 7
    },
    {
      "name": "External Web sites",
      "label": "",
      "id": 9
    },
    {
      "name": "TS API Flight",
      "label": "",
      "id": 10
    },
    {
      "name": "TS WCM Feeds",
      "label": "",
      "id": 17
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
    .force("link", d3.forceLink().id(function (d) {return d.id;}).distance(100).strength(1))
    .force("charge", d3.forceManyBody().strength(-100))
    .force("center", d3.forceCenter(width / 2, height / 2))
    .force("collision", d3.forceCollide().radius(50))

update(json.links, json.nodes);

function update(links, nodes) {
    link = svg.selectAll(".link")
        .data(links)
        .enter()
        .append("line")
        .attr("class", "link")
        .attr('marker-end','url(#arrowhead)')

    link.append("title")
        .text(function (d) {return "to define";});

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
        .data(nodes)
        .enter()
        .append("g")
        .attr("class", "node")
        .call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                //.on("end", dragended)
        );

    node.on("mouseover", (d) => {
      console.log(d)
    })

    node.append("circle")
        .attr("r", (data, i) => {
            return 25 + 10 * (i % 3)
        })
        .style("fill", function (d, i) {return "#ededed";})

    node.append("title")
        .text(function (d) {return d.id;});

    node.append("text")
        .attrs({
          "dx": -10,
          "dy": -3,
          "font-family": "sans",
          "font-size": 15
        })
        .text(function (d) {return d.name ;});

    simulation
        .nodes(nodes)
        .on("tick", ticked);

    simulation.force("link")
        .links(links);
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
