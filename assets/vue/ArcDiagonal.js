import * as d3 from "d3";
import selection_attrs from "../../node_modules/d3-selection-multi/src/selection/attrs";
import selection_styles from "../../node_modules/d3-selection-multi/src/selection/styles";
import { modele } from '../services/DataService.js'

d3.selection.prototype.attrs = selection_attrs
d3.selection.prototype.styles = selection_styles

let configuration = {
  "width": 2500,
  "height": 2000,
  "node":{
    "x": 0,
    "y": 160,
    "radius": 6
  }
}

const svg  = d3.select("#arcdiagram-container").select("svg")
        .attr("width", configuration.width)
        .attr("height", configuration.height);
const color = d3.scaleOrdinal(d3.schemeCategory10);

let link, node, text

const popover = d3.select("body")
       	.append("div")
        .attr('class', 'popover')
       	.style("position", "absolute")
       	.style("z-index", "10")
       	.style("visibility", "hidden")
        .style("max-width", "450px")
const mouseover = (d) => {
  popover.style("visibility", "visible")
  let nodeOvered = node.filter((l) => {return l === d})

  popover.style("left", `${nodeOvered.attr("cx")}px`)
  popover.style("top", "300px")
  popover.html(popInfo(d))

  node.each((n) => {n.target = n.source = false;})
  node.classed("hover", false).filter((l) => {return l === d}).classed("hover", true)
  text.classed("hover", false).filter((l) => {return l === d}).classed("hover", true)

  link.classed("hover-parent", function(l) { if (l.target === d) return l.source.source = true; })
      .classed("hover-child", function(l) { if (l.source === d) return l.target.target = true; })
      .filter(function(l) { return l.target === d || l.source === d; })
      .raise();

  text.classed("hover-child", function(n) { return n.target; })
      .classed("hover-parent", function(n) { return n.source; });

  node.classed("hover-child", function(n) { return n.target; })
      .classed("hover-parent", function(n) { return n.source; });
}
const mouseout = (node) => {
  popover.style("visibility", "hidden")
}
const popInfo = (d) => {
  let html = `<h4>${d.name}</h4>`
  html += `<div class="alert alert-success" role="alert"><strong>Status</strong> OK</div>`
  html += "<dl class='row'>"
  html += `<dt class='col-sm-3'>Status</dt><dd class='col-sm-9'>${d.id}</dd>`
  html += `<dt class='col-sm-3'>id</dt><dd class='col-sm-9'>${d.id}</dd>`
  html += `<dt class='col-sm-3'>nom</dt><dd class='col-sm-9'>${d.name}</dd>`
  html += `<dt class='col-sm-3'>Parents</dt><dd class='col-sm-9'>${d.name}</dd>`
  html += `<dt class='col-sm-3'>Enfants</dt><dd class='col-sm-9'>${d.printDependencies()}</dd>`

  return html + '</ul>'
}

var initArc = () => {
  link = svg.append("g").selectAll(".link")
  node = svg.append("g").selectAll(".node")
  text = svg.append("g").selectAll(".text")

  node = node.data(modele.getNodes())
         .enter()
         .append("circle")
         .attr("class", (node) => {
           return `node ${node.getClassName()} ${node.constructor}`
          })
         .attr("id", function(d, i) { return d.name; })
         .attr("cx", function(d, i) { return i * 20 })
         .attr("cy", function(d, i) { return configuration.node.y; })
         .attr("r",  function(d, i) { return configuration.node.radius; })
         .on("mouseover", mouseover)
         .on('mouseout', mouseout)
  text = text.data(modele.getNodes())
   .enter()
   .append("text")
   .attrs({
     "id": (node) => {return `${node.getClassName()}-text`},
     "class": (node) => {
       return `text ${node.getClassName()}`
      },
     "transform": "rotate(-90 80 6.5)",
     "x": "-60",
     "y": (d, i) => {return i * 20 - 70}, //@todo parameterize values
   })
   .text(node => {
     return node.name
   })
   .on("mouseover", mouseover)
   .on('mouseout', mouseout)


  let radians = d3.scaleLinear().range([Math.PI / 2, 3 * Math.PI / 2]);
  let arc = d3.lineRadial().angle(function(d) { return radians(d); });
  link = link.data(modele.getLinks())
   .enter()
   .append("path")
   .attr("class", (link) => {
     return `link ${link.source.getClassName()}-source ${link.target.getClassName()}-target`
    })
   .attr("transform", function(d, i) {
       d.source.x = parseInt(d3.select(`circle[id='${d.source.name}']`).attr("cx"))
       d.target.x = parseInt(d3.select(`circle[id='${d.target.name}']`).attr("cx"))

       var xshift = d.source.x + (d.target.x - d.source.x) / 2;
       var yshift = 160;
       return "translate(" + xshift + ", " + yshift + ")";
   })
   .attr("d", function(d, i) {
       var xdist = Math.abs(d.source.x - d.target.x);
       arc.radius(xdist / 2);

       var points = d3.range(0, Math.ceil(xdist / 3));
       radians.domain([0, points.length - 1]);

       return arc(points);
   })
}

var updateArc = (updatedData) => {
  console.log(updatedData)
  modele.update(updatedData)
}


export { initArc, updateArc }
