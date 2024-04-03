import Node from './src/Node.js'
const main = async () => {
  const node = await new Node({}).create()
  await node.start()
  await node.stop()
}
main().then().catch(console.error)

