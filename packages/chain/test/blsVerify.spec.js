const {ethers:{deployContract, getContractFactory, getSigners}}  = require('hardhat')
const {expect} = require('expect')
const mcl = require('./mcl')
const {randHex} = require('./utils')

describe('dlsVerify', () => {
  let contract, owner, anyone
  before(async () => {
    await mcl.init();
  })
  beforeEach(async () => {
    [owner, anyone] = await getSigners()

  })
  function stringToHex(str){
    let hex = '';
    for(let i=0;i<str.length;i++) {
      hex += ''+str.charCodeAt(i).toString(16);
    }
    return '0x' + hex;
  }

  describe('verify', () => {
    it('verify single signature', async function () {
      contract = await deployContract('BlsVerify', [])
      mcl.setMappingMode(mcl.MAPPING_MODE_TI);
      mcl.setDomain('testing evmbls');
      const message = stringToHex('hello world')
      const { pubkey, secret } = mcl.newKeyPair();
      const { signature, M } = mcl.sign(message, secret);
      let sig_ser = mcl.g1ToBN(signature);
      let pubkey_ser = mcl.g2ToBN(pubkey);
      let message_ser = mcl.g1ToBN(M);
      // await contract.works('it' , 'works');
      let res = await contract.verifySignature(sig_ser, pubkey_ser, message_ser);
      expect(res).toEqual(true)
    });
  })
})
