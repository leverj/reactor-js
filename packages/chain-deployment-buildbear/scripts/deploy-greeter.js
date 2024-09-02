import {deployContract, getSigners, run} from '../test/hardhat.js'

async function deploy() {
  const [deployer] = await getSigners()
  console.log(`Deploying contracts using ${deployer.address}`)
  const greeter = await deployContract('Greeter', [])
  console.log('contract deployed at', greeter.target)
  await run(`verify:verify`, {address: greeter.target})
}

await deploy().then(() => process.exit(0)).catch((error) => {
  console.error(error)
  process.exit(1)
})
