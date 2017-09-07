import 'jquery'
import 'bootstrap/dist/js/bootstrap.min.js'

import * as d3 from "d3";
import selection_attrs from "./node_modules/d3-selection-multi/src/selection/attrs";
import selection_styles from "./node_modules/d3-selection-multi/src/selection/styles";
import { groupSet } from './assets/services/DataService.js'
import { Group } from './assets/Model.js'

d3.selection.prototype.attrs = selection_attrs
d3.selection.prototype.styles = selection_styles

let groupTopLevel = groupSet.filter(g => g.isTopLevel() === true)
let nodeFixtures = [new Group(0, "root", [], [] )]
nodeFixtures = nodeFixtures.concat(groupTopLevel.toArray())
let linkFixtures = [
  {source: 0, target: 1},
  {source: 0, target: 2},
  {source: 0, target: 3},
  {source: 0, target: 4},
  {source: 0, target: 5},
  {source: 0, target: 6},
  {source: 0, target: 7},
  {source: 0, target: 8},
  {source: 0, target: 9},
]
let configuration = {
  width: 800,
  height: 800
}

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

groupTopLevel = groupTopLevel.toArray()

for(let i = 0; i < groupTopLevel.length - 1; i++){
  let group1 = flattenGroupComponent(groupTopLevel[i])
  for(let j = i + 1; j < groupTopLevel.length; j++){
    let group2 = flattenGroupComponent(groupTopLevel[j])
    //console.log(i + ":" + j + ": " + (group1.intersection(group2).length > 0))
  }
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
  let config = { width: 800, height: 800}

  var svg = d3.select("body").append("svg").attrs({width: 500, height: 500})

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
        .attr('fill', '#efefef')
        .style('stroke','#eee');

  var simulation = d3.forceSimulation(nodeFixtures)
    .force('charge', d3.forceManyBody().strength(-20))
    .force('center', d3.forceCenter(config.width / 2, config.height / 2))
    .force('link', d3.forceLink().distance(40).links(linkFixtures))
    .on('tick', ticked);

    var g = svg.append("g"),
      link = g.append("g").attr("stroke", "#000").attr("stroke-width", 1).selectAll(".link"),
      node = g.append("g").attr("stroke", "#fff").attr("stroke-width", 1).selectAll(".node"),
      text = g.append("g").attr("stroke", "#fff").attr("stroke-width", 1).selectAll(".text");

  restart();

  function restart() {

    // Apply the general update pattern to the nodes.
    node = node.data(nodes, function(d) { return d.id;});
    node.exit().remove();
    node = node.enter().append("circle").attr("fill", function(d) { return "#efefef" }).attr("r",
      (d, i) => {
        console.log(d, i)
        return 5 + 1 * d.groups.length
      }
    ).merge(node);

    text = text.data(nodes, function(d) { return d.id;});

    text = text.enter().append("text").attr("fill", function(d) { return "#efefef" }).attr("r",
      (d, i) => {
        return 5 + 1 * d.groups.length
      }
    ).merge(text);

    node.merge(text)

    // Apply the general update pattern to the links.
    link = link.data(links, function(d) { return d.source.id + "-" + d.target.id; });
    link.exit().remove();
    link = link.enter().append("line").attr('marker-end','url(#arrowhead)').merge(link);

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

    text.attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; })
    }
}
function test5(){
  let json = {"nodes":[
    {"x":80, "r":4, "label":"Node 1"},
    {"x":200, "r":6, "label":"Node 2"},
    {"x":380, "r":8, "label":"Node 3"}
  ]}

  var width = 960,
    height = 500;

  var svg = d3.select("body").append("svg").attrs({width: 500, height: 500})

  var elem = svg.selectAll("g").data(json.nodes)

  var elemEnter = elem.enter()
          .append("g")
          .attr("transform", function(d){return "translate("+d.x+",80)"})

      /*Create the circle for each block */
  var circle = elemEnter.append("circle")
          .attr("r", function(d){return d.r} )
          .attr("stroke","black")
          .attr("fill", "white")

      /* Create the text for each block */
  elemEnter.append("text")
          .attr("dx", function(d){return -20})
          .text(function(d){return d.label})
}

function test6(){

var json = {
  "nodes": [
    {
      "name": "Peter",
      "label": "Person",
      "id": 1
    },
    {
      "name": "Michael",
      "label": "Person",
      "id": 2
    },
    {
      "name": "Neo4j",
      "label": "Database",
      "id": 3
    },
    {
      "name": "Graph Database",
      "label": "Database",
      "id": 4
    }
  ],
  "links": [
    {
      "source": 1,
      "target": 2,
      "type": "KNOWS",
      "since": 2010
    },
    {
      "source": 1,
      "target": 3,
      "type": "FOUNDED"
    },
    {
      "source": 2,
      "target": 3,
      "type": "WORKS_ON"
    },
    {
      "source": 3,
      "target": 4,
      "type": "IS_A"
    }
  ]
}

  var colors = d3.scaleOrdinal(d3.schemeCategory10);

    var svg = d3.select("svg"),
        width = +svg.attr("width"),
        height = +svg.attr("height"),
        node,
        link;

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
        .attr('fill', '#999')
        .style('stroke','none');

    var simulation = d3.forceSimulation()
        .force("link", d3.forceLink().id(function (d) {return d.id;}).distance(100).strength(1))
        .force("charge", d3.forceManyBody())
        .force("center", d3.forceCenter(width / 2, height / 2));

    update(linkFixtures, nodeFixtures)

    function update(links, nodes) {
      console.log(links, nodes)
        link = svg.selectAll(".link")
            .data(links)
            .enter()
            .append("line")
            .attr("class", "link")
            .attr('marker-end','url(#arrowhead)')

        link.append("title")
            .text(function (d) {return d.type;});

        edgepaths = svg.selectAll(".edgepath")
            .data(links)
            .enter()
            .append('path')
            .attrs({
                'class': 'edgepath',
                'fill-opacity': 0,
                'stroke-opacity': 0,
                'id': function (d, i) {return 'edgepath' + i}
            })
            .style("pointer-events", "none");

        edgelabels = svg.selectAll(".edgelabel")
            .data(links)
            .enter()
            .append('text')
            .style("pointer-events", "none")
            .attrs({
                'class': 'edgelabel',
                'id': function (d, i) {return 'edgelabel' + i},
                'font-size': 10,
                'fill': '#aaa'
            });

        edgelabels.append('textPath')
            .attr('xlink:href', function (d, i) {return '#edgepath' + i})
            .style("text-anchor", "middle")
            .style("pointer-events", "none")
            .attr("startOffset", "50%")
            .text(function (d) {return d.type});

        node = svg.selectAll(".node")
            .data(nodes)
            .enter()
            .append("g")
            .attr("class", "node")

        node.append("circle")
            .attr("r", 5)
            .style("fill", function (d, i) {return colors(i);})

        node.append("title")
            .text(function (d) {return d.id;});

        node.append("text")
            .attr("dy", -3)
            .text(function (d) {return d.name+":"+d.label;});

        // simulation.nodes(nodes).on("tick", ticked);

        simulation.force("link")
            .links(links);
    }

    function ticked() {
        link
            .attr("x1", function (d) {return d.source.x;})
            .attr("y1", function (d) {return d.source.y;})
            .attr("x2", function (d) {return d.target.x;})
            .attr("y2", function (d) {return d.target.y;});

        node
            .attr("transform", function (d) {return "translate(" + d.x + ", " + d.y + ")";});

        edgepaths.attr('d', function (d) {
            return 'M ' + d.source.x + ' ' + d.source.y + ' L ' + d.target.x + ' ' + d.target.y;
        });

        edgelabels.attr('transform', function (d) {
            if (d.target.x < d.source.x) {
                var bbox = this.getBBox();

                rx = bbox.x + bbox.width / 2;
                ry = bbox.y + bbox.height / 2;
                return 'rotate(180 ' + rx + ' ' + ry + ')';
            }
            else {
                return 'rotate(0)';
            }
        });
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

}

// test6()
// test5()
// test4()
// test3()
// test2()
// test()
