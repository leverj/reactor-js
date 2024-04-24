import bls1 from 'bls-wasm'
import bls2 from 'bls-eth-wasm'
import * as bls3 from './mcl-bls-wrapper.js'

async function Bls1(){
  await bls1.init(4)
  const P2 = new bls1.PublicKey()
  //https://eips.ethereum.org/EIPS/eip-197
  //P2.setStr('1 11559732032986387107991004021392285783925812861821192530917403151452391805634 10857046999023057135944570762232829481370756359578518086990519993285655852781 4082367875863433681332203403145435568316851327593401208105741076214120093531 8495653923123431417604973247489272438418190587263600148770280649306958101930')
  P2.setStr('1 10857046999023057135944570762232829481370756359578518086990519993285655852781 11559732032986387107991004021392285783925812861821192530917403151452391805634 8495653923123431417604973247489272438418190587263600148770280649306958101930 4082367875863433681332203403145435568316851327593401208105741076214120093531')
  bls1.setGeneratorOfPublicKey(P2)
  return bls1
}

async function Bls2(){
  await bls2.init()
  return bls2
}

async function Mcl() {
  await bls3.init()
  return bls3
}

const bls = await Bls1()
// const bls = Mcl()
// const bls = Bls2()
export default bls
// export default Bls2()
