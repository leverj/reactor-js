import {JsonRpcProvider} from 'ethers'
import inquirer from 'inquirer'
import ora from 'ora'
import {writeFileSync} from 'node:fs'
import {createSandbox, getSandbox} from './api.js'
import networks from './networks.json' assert {type: 'json'}

async function getBlockNumber(rpc) {
  const provider = new JsonRpcProvider(rpc)
  const chainId = await provider.getNetwork().then(_ => _.chainId)
  const largestPossibleReorg = (chainId === 1 || chainId === 5) ?  // mainnet || Goerli
    5 :
    (chainId === 137 || chainId === 80001 || chainId === 56) ?  // Polygon || Polygon Mumbai || BSC
      50 :
      200 // fallback max reorg
  return await provider.getBlockNumber() - largestPossibleReorg // lastsSafe block
}

async function waitForLiveNode(node) {
  async function checkLoop(spinner) {
    try {
      const response = await getSandbox(node.testnetId)
      if (response.status === 'live') spinner.succeed('Testnet is live')
      else if (response.status === 'started') {
        await setTimeout(2000)
        await checkLoop()
      } else spinner.fail('Testnet has stopped')
      return null
    } catch (err) {
      if (err.response.data.error === 'Node is started') {
        await setTimeout(2000)
        await checkLoop()
      } else console.log(err)
    }
  }
  const spinner = ora('Waiting for the Testnet to be live').start()
  await checkLoop(spinner)
}

async function run() {
  const {network, forkingChainId, blockNumber} = await inquirer.prompt([{
    type: 'list',
    name: 'network',
    message: 'Choose forking network',
    choices: networks.map(_ => _.name),
  }]).then(async (choice) => {
    const chain = networks.find(_ => _.name === choice.network)
    const {chainId, rpc, name} = chain
    return ({
      network: name,
      forkingChainId: chainId,
      blockNumber: await getBlockNumber(rpc),
    })
  })
  const createNodeSpinner = ora(`Creating a new ${network} fork on Buildbear...`).start()
  try {
    const response = await createSandbox(forkingChainId, blockNumber)
    if (response.status === 'success') {
      const {chainId, sandboxId, rpcUrl, faucetUrl, explorerUrl, verificationUrl} = response
      const node = {
        network,
        forkingChainId,
        chainId,
        testnetId: sandboxId,
        rpcUrl,
        faucetUrl,
        explorerUrl,
        verificationUrl,
      }
      createNodeSpinner.succeed('Testnet created successfully')
      console.log(node)
      await(async function (node) {
        await waitForLiveNode(node)
        const file = `${import.meta.dirname}/testnet.${node.forkingChainId}.json`
        writeFileSync(file, JSON.stringify(node, null, 2))
        console.log(`Testnet details stored in ${file}`)
      })(node)
    } else {
      console.error('Error in creating Testnet, Error: ', response)
    }
  } catch (e) {
    console.error('Error in creating Testnet, Error: ', e)
  }
}
await run()
