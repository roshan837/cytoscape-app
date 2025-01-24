export const style = [
  {
    selector: 'node',
    style: {
      'background-image': getIcon,
      'label': 'data(id)',
      'text-max-width': '80px',
      'text-wrap': 'ellipsis',
      'text-valign': 'bottom',
      'font-size': '10px'
    }
  },
  { selector: ':parent', style: { 'text-valign': 'top' } },
  { selector: "node.cy-expand-collapse-collapsed-node", style: { "background-color": "lightGreen" } },
  { selector: 'edge', style: { 'width': 1, 'line-color': '#000', 'curve-style': 'straight' } },
  { selector: 'edge.meta', style: { 'width': 1, 'line-color': 'red' } },
  { selector: ':selected', style: { 'overlay-color': "#000", 'background-color': "lightBlue" } },
  { selector: 'node.expanded-node-parent', style: { 'background-image': 'unset' } },
]

function getIcon(node) {
  const icon = ['userIcon', 'web', 'workloadEvent', 'server', 'database']
  const id = node.data().id.split('-')[1] - 1
  return `./${icon[id % icon.length]}.svg`;
}
function onButtonClick() {
  console.log('Button clicked')
}
export function getTooltip(data) {
  const content = document.createElement('div')
  content.innerHTML = `
  <div class="cytoscape-popper">
    <h3>${data.id}</h3>
      <div>
        <span>Label:</span> ${data.id} <br/>
        <span>Parent:</span> ${data?.parent ?? 'None'}<br/>
        <button>More</button>
      </div>
    </div>
  `
  content.getElementsByTagName('button')[0].addEventListener('click', onButtonClick)
  return content
}


function generateNodes(numNodes) {
  const nodes = [];
  const parentNodes = [];
  for (let i = 1; i <= numNodes; i++) nodes.push({ data: { id: `node-${i}` }, group: "nodes" })

  // Randomly select 20% of the nodes as parents
  const parentCount = Math.floor(numNodes * 0.2);
  while (parentNodes.length < parentCount) {
    const randomIndex = Math.floor(Math.random() * numNodes);
    const parentNode = nodes[randomIndex].data.id;
    if (!parentNodes.includes(parentNode)) parentNodes.push(parentNode);
  }

  nodes.forEach(node => {
    const randomParent = parentNodes[Math.floor(Math.random() * parentNodes.length)];
    if (randomParent === node.data.id || Math.random() > 0.8) return // increase to increase chance of having parent
    node.data.parent = randomParent;
  });

  return nodes;
}

function generateEdges(nodes) {
  const edges = [];
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      if (Math.random() < .01) { // increase to increase edges
        if (nodes[i].data.id === nodes[j].data.parent || nodes[j].data.id === nodes[i].data.parent) continue // to avoid connecting parent and child
        edges.push({ data: { source: nodes[i].data.id, target: nodes[j].data.id, id: `${i}-${j}` }, group: "edges" });
      }
    }
  }
  return edges;
}
const numNodes = 100 // number of nodes
const nodes = generateNodes(numNodes)
const edges = generateEdges(nodes)

export const elements = [...nodes, ...edges]
