import * as d3 from "d3";
import selection_attrs from "../../node_modules/d3-selection-multi/src/selection/attrs";
import selection_styles from "../../node_modules/d3-selection-multi/src/selection/styles";

var initMenu = () => {
  var showHideContainer = (e) => {
    console.log("#" + e.srcElement.id +"-container")
  	document.querySelectorAll(".diagram-container").forEach((elt) => elt.classList.add('hide'))
    document.querySelector("#" + e.srcElement.id +"-container").classList.remove('hide')
  }

//[].forEach.call(nodeList,function(e){e.addEventListener('click',callback,false)})
//forEach($coin => $coin.addEventListener('dragstart', handleDragStart));

  document.querySelectorAll(".nav-link").forEach($btn => $btn.addEventListener('click', showHideContainer))
}


export { initMenu }
