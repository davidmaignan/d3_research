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

const svg  = d3.select("svg")
        .attr("id", "arc")
        .attr("width", configuration.width)
        .attr("height", configuration.height);
const color = d3.scaleOrdinal(d3.schemeCategory10);

let link, node, text

node = svg.append("g").selectAll(".node")
