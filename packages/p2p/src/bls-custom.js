import bls1 from 'bls-wasm'
import bls2 from 'bls-eth-wasm'
import * as bls3 from './mcl-bls-wrapper.js'

function Bls1(){
  bls1.init(4)
  return bls1
}

function Bls2(){
  bls2.init()
  return bls2
}

function Mcl() {
  bls3.init()
  return bls3
}

// const bls = Bls1()
const bls = Mcl()
// const bls = Bls2()
export default bls
// export default Bls2()
