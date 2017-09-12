import 'jquery'
import 'bootstrap/dist/js/bootstrap.min.js'

import * as d3 from "d3";
import selection_attrs from "./node_modules/d3-selection-multi/src/selection/attrs";
import selection_styles from "./node_modules/d3-selection-multi/src/selection/styles";
import { groupSet, componentSet, modele } from './assets/services/DataService.js'
import { initArc } from './assets/vue/ArcDiagonal.js'
import { datas } from './assets/fixtures.js'

d3.selection.prototype.attrs = selection_attrs
d3.selection.prototype.styles = selection_styles

//
// let configuration = {
//   "width": 2500,
//   "height": 2000,
//   "node":{
//     "x": 0,
//     "y": 160
//   }
// }
//
// let groupTopLevel = groupSet.filter(g => g.isTopLevel())
// groupTopLevel = groupTopLevel.toArray()
//
// var nodes = []
// var links = []

// groupSet.forEach(g => {
//   nodes.push(g)
//
//   g.groups.forEach(subGroup => {
//     links.push({'source': g, 'target': subGroup})
//   })
//
//   g.components.forEach(c => {
//     links.push({'source': g, 'target': c})
//   })
// })
// componentSet.forEach(component => {
//   nodes.push(component)
//   component.dependencies.forEach(dependency => {
//     links.push({'source': component, 'target': dependency})
//   })
// })
// let linkGroupTopLevel = []
// function flattenGroupComponent(grp){
//   let list = require("collections/set")
//   list = new Set()
//
//   flattenGroupComponentList(list, grp)
//
//   return list
// }
// function flattenGroupComponentList(list, g){
//   g.groups.forEach((grp) => {
//     flattenGroupComponentList(list, grp)
//   })
//
//   g.components.forEach((cmp) => {
//     flattenComponentListRec(list, cmp)
//   })
// }
// function flattenComponentListRec(list, component){
//   list.add(component)
//   component.dependencies.forEach((cmp) => {
//     flattenComponentListRec(list, cmp)
//   })
// }
// initArc()

let configuration = {
  "width": 2500,
  "height": 2000,
  "node":{
    "x": 0,
    "y": 160,
    "radius": 6
  }
}



var diameter = 960,
    radius = diameter / 2,
    innerRadius = radius - 120;

var cluster = d3.cluster()
    .size([360, innerRadius]);

var line = d3.radialLine()
    .curve(d3.curveBundle.beta(0))
    .radius(function(d) { return d.y; })
    .angle(function(d) { return d.x / 180 * Math.PI; });

var svg = d3.select("svg")
    .attr("width", diameter)
    .attr("height", diameter)
    .append("g")
    .attr("transform", "translate(" + radius + "," + radius + ")");

var link = svg.selectAll(".link"),
    node = svg.selectAll(".node");

// d3.json(datas, function(error, classes) {
//   if (error) throw error;

var root = packageHierarchy(datas)
      .sum(function(d) { return d.size; });


cluster(root);

var data = {
  "name": "A1",
  "children": [
    {
      "name": "B1",
      "children": [
        {
          "name": "C1",
          "value": 100
        },
        {
          "name": "C2",
          "value": 300
        },
        {
          "name": "C3",
          "value": 200
        }
      ]
    },
    {
      "name": "B2",
      "value": 200
    }
  ]
};

var root2 = d3.hierarchy(data)

cluster(root2)

console.log(root2)
// cluster(root2)
// console.log(root2)

link = link
    .data(nodeLinks(root.leaves()))
    .enter().append("path")
      .each(function(d) { d.source = d[0], d.target = d[d.length - 1]; })
      .attr("class", "link")
      .attr("d", line);

  node = node
    .data(root2.leaves())
    .enter().append("text")
      .attr("class", "node")
      .attr("dy", "0.31em")
      .attr("transform", function(d) { return "rotate(" + (d.x - 90) + ")translate(" + (d.y + 8) + ",0)" + (d.x < 180 ? "" : "rotate(180)"); })
      .attr("text-anchor", function(d) { return d.x < 180 ? "start" : "end"; })
      .text(function(d) { return d.data.name; })


function mouseovered(d) {
  node
      .each(function(n) { n.target = n.source = false; });

  link
      .classed("link--target", function(l) { if (l.target === d) return l.source.source = true; })
      .classed("link--source", function(l) { if (l.source === d) return l.target.target = true; })
    .filter(function(l) { return l.target === d || l.source === d; })
      .raise();

  node
      .classed("node--target", function(n) { return n.target; })
      .classed("node--source", function(n) { return n.source; });
}
function mouseouted(d) {
  link
      .classed("link--target", false)
      .classed("link--source", false);

  node
      .classed("node--target", false)
      .classed("node--source", false);
}

// Lazily construct the package hierarchy from class names.
function packageHierarchy(classes) {
  var map = {};

  function find(name, data) {
    var node = map[name], i;
    if (!node) {
      node = map[name] = data || {name: name, children: []};
      if (name.length) {
        node.parent = find(name.substring(0, i = name.lastIndexOf(".")));
        node.parent.children.push(node);
        node.key = name.substring(i + 1);
      }
    }
    return node;
  }

  classes.forEach(function(d) {
    find(d.name, d);
  });

  console.log(map)

  return d3.hierarchy(map[""]);
}

// Lazily construct the package hierarchy from class names.
function packageHierarchy2(nodes) {
  var map = {};

  function find(name, data) {
    var node = map[name], i;
    if (!node) {
      node = map[name] = data || {name: name, children: []};
      if (name.length) {
        node.parent = find(name.substring(0, i = name.lastIndexOf(".")));
        node.parent.children.push(node);
        node.key = name.substring(i + 1);
      }
    }
    return node;
  }

  nodes.forEach(function(d) {
    find(d.name, d);
  });

  return d3.hierarchy(map[""]);
}

// Return a list of imports for the given array of nodes.
function packageImports(nodes) {
  var map = {},
      imports = [];

  // Compute a map from name to node.
  nodes.forEach(function(d) {
    map[d.data.name] = d;
  });

  // For each import, construct a link from the source to target node.
  nodes.forEach(function(d) {
    if (d.data.imports) d.data.imports.forEach(function(i) {
      imports.push(map[d.data.name].path(map[i]));
    });
  });

  return imports;
}

function nodeLinks(nodes){
  var map = {},
      links = [];

  nodes.forEach((d) =>{
    map[d.data.name] = d;
    d.children.forEach((c) =>{
      map[c.data.name] = c
      links.push(map[d.data.name].path(map[c.data.name]))
    })
  })

  return links
}

// packages = {
//     // Lazily construct the package hierarchy from class names.
//     root: function(classes) {
//       var map = {};
//
//       function find(name, data) {
//         var node = map[name], i;
//         if (!node) {
//           node = map[name] = data || {name: name, children: []};
//           if (name.length) {
//             node.parent = find(name.substring(0, i = name.lastIndexOf(".")));
//             node.parent.children.push(node);
//             node.key = name.substring(i + 1);
//           }
//         }
//         return node;
//       }
//
//       classes.forEach(function(d) {
//         find(d.name, d);
//       });
//
//       return map[""];
//     },
//
//     imports: function(nodes) {
//       var map = {},
//           imports = [];
//
//       nodes.forEach(function(d) {
//         map[d.name] = d;
//       });
//
//       // For each import, construct a link from the source to target node.
//       nodes.forEach(function(d) {
//         if (d.imports) d.imports.forEach(function(i) {
//           imports.push({source: map[d.name], target: map[i]});
//         });
//       });
//
//       return imports;
//     }
// };
