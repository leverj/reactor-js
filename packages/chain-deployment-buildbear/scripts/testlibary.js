import {ethers} from 'hardhat'
import {readFileSync} from 'node:fs'
import {configureChains} from 'wagmi'

const {chains, provider, webSocketProvider} = configureChains(
  [goerli, mainnet], // Should have chain according to forked chain
  [
    jsonRpcProvider({
      rpc: (chain) => ({HTTP: 'https://rpc.dev.buildbear.io/spiritual-wicket-systri-warrick-f9c2771d'}),
    }),
    publicProvider(),
  ],
)

// Deploy function
async function deploy() {
  const {default: ERC20ABI} = await import('./ERC20ABI.json', {assert: {type: 'json'}})
//     const provider = new Web3.providers.HttpProvider("https://rpc.dev.buildbear.io/spiritual-wicket-systri-warrick-f9c2771d");
//   const web3 = new Web3(provider);
// const blockNumber = await web3.eth.getBlockNumber();
// console.log(blockNumber);
//     const provider = new ethers.JsonRpcProvider("https://rpc.dev.buildbear.io/spiritual-wicket-systri-warrick-f9c2771d");
  const blockNumber = await provider.getBlockNumber()
  console.log(blockNumber)
//   [account] = await ethers.getSigners();
//   deployerAddress = account.address;
//   console.log(`Deploying contracts using ${deployerAddress}`);
//   const tokenVault = await ethers.getContractFactory("TokenVault");
//   const tokenVaultInstance = await tokenVault.deploy(
//     "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
//     "BuildBear",
//     "BB"
//   );
//   await tokenVaultInstance.deployed();
//   console.log("TokenVault contract deployed at", tokenVaultInstance.address);
//   console.log(
//     "1000 share token is equal to ",
//     1000 / Number(await tokenVaultInstance.convertToShares(1)),
//     "Asset"
//   );
  const weth = new ethers.Contract(
    '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    ERC20ABI,
    provider,
  )
  const blance = await weth.balanceOf('0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2')

  console.log(blance)
//   console.log("Minting 1000 weth tokens");
//   const test = await weth.deposit({ value: ethers.utils.parseEther("1000") });
//   console.log("Approving  1000 weth tokens to TokenVault");
//   const aaprove = await weth.approve(tokenVaultInstance.address, 1000);
//   console.log("Depositing 1000 weth tokens to TokenVault");
//   const dd = await tokenVaultInstance._deposit(1000);
//   console.log("Lending the 1000 weth users Tokens on Aave pool");
//   const invest = await tokenVaultInstance.lendOnAave(
//     "0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2",
//     1000
//   );
//   console.log("Advancing Time for 1 Year");
//   await ethers.provider.send("hardhat_mine", ["0x4AA25C2"]);
//   console.log("Withdrawing the weth token from Aave contract");
//   const withdraw = await tokenVaultInstance.withdrawFromAave(
//     "0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2"
//   );
//   console.log(
//     "1000 share token is equal to ",
//     1000 / Number(await tokenVaultInstance.convertToShares(1)),
//     "Asset"
//   );
}

deploy()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
