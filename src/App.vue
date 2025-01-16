<template>
  <div id="cy"></div>
</template>
<script setup>
import { onMounted } from 'vue';
import cytoscape from 'cytoscape';
import expandCollapse from 'cytoscape-expand-collapse';
import fcose from 'cytoscape-fcose';
import { elements, style, getTooltip } from './data.js';
import popper from 'cytoscape-popper';
import tippy from 'tippy.js'

cytoscape.use(fcose)
expandCollapse(cytoscape)
cytoscape.use(popper(tippyFactory));
function tippyFactory(ref, content) {
  var dummyDomEle = document.createElement('div');

  var tip = tippy(dummyDomEle, {
    getReferenceClientRect: ref.getBoundingClientRect,
    trigger: 'manual',
    content: content,
    placement: 'bottom',
    interactive: true,
    offset: [0, 0],
    appendTo: document.body
  });
  return tip;
}
onMounted(setCytoscape)

function setCytoscape() {
  const cyGraph = cytoscape({ container: document.getElementById('cy'), layout: { name: 'fcose' }, elements, style })

  // expand-collapse functionality
  var api = cyGraph.expandCollapse({
    layoutBy: {
      name: "fcose",
      animate: true,
      randomize: false,
      fit: true
    },
    fisheye: true,
    animate: true,
    animationDuration: 150,
    undoable: false,
    expandCueImage: "none",
    collapseCueImage: "collapse.svg"
  });
  // api.collapseAll();

  // expand on click
  cyGraph.nodes().on('click', (e) => {
    var node = e.target;
    if (api.isExpandable(node)) api.expand(node)
  });
  // toggle class on expand/collapse
  cyGraph.nodes().on('expandcollapse.aftercollapse', (e) => {
    e.target.removeClass('expanded-node-parent')
  });
  cyGraph.nodes().on('expandcollapse.afterexpand', (e) => {
    e.target.addClass('expanded-node-parent')
  });


  // popper setup
  let tip = null;
  cyGraph.nodes().on('mouseover', (e) => {
    const node = e.target
    if (api.isCollapsible(node)) return
    tip = node.popper({ content: () => getTooltip(node.data()) })
    tip.show()
  });
  cyGraph.nodes().on('mouseout', (e) => {
    const node = e.target
    if (api.isCollapsible(node)) return
    tip?.destroy()
  });
}


</script>
<style>
.cytoscape-popper {
  padding: 1rem;
  border-radius: 1rem;
  border: 1px solid grey;
  background: #fff;
}
</style>
