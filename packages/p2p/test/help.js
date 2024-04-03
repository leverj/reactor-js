import Node from '../src/Node.js'
const nodes = []
export const newNode = async (options) => await new Node(options).create().then(_ => _.start()).then(_ => {nodes.push(_); return _})
export const stopNodes = async () => {for (const node of nodes) await node.stop()}