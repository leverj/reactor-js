// import {keccak256} from 'ethers'
import {solidityPackedKeccak256, solidityPackedSha256, solidityPacked} from 'ethers'
// import {keccak256} from '@leverj/common/utils'
import {BnsVerifier} from '@leverj/reactor.chain/test'
import {G1ToNumbers, G2ToNumbers, newKeyPair, sign, stringToHex, hashToPoint} from '@leverj/reactor.mcl'
import {expect} from 'expect'

export const keccak256 = (subject) => solidityPackedKeccak256(['string'], [subject])
// export const keccak256 = (subject) => solidityPackedSha256(['string'], [subject])
// export const keccak256 = (subject) => solidityPacked(['string'], [subject])
/*
  19256537855536049672798305281883150825022424679985839117973083575249854643546n,
  9582682438563646556853481500839087674243666691718660210258932775784361785586n

  903571876979823619655986797471693459498360620515698363255510728474856927172n,
  21576183625895479019254605820457079868388179658658776676991300150644792658696n

  13394554684607988777599286805756247718062587605618301129665267955277467578443n,
  18586148740169964252282628469103313040234545149292653114331840822866150342155n
 */
describe('BnsVerifier', () => {
  const message = 'hello world'
  let contract

  before(async () => contract = await BnsVerifier())

  it('validate', async () => {
    const hash = keccak256(message)
    const {pubkey, secret} = newKeyPair()
    const {signature, M} = sign(hash, secret)
    // console.log('>'.repeat(50), M)
    console.log(G1ToNumbers(signature), G2ToNumbers(pubkey), G1ToNumbers(M))
    return
    //fixme: expect to not throw exception
    const res = await contract.validate(G1ToNumbers(signature), G2ToNumbers(pubkey), G1ToNumbers(M))
  })

  it('verify', async () => {
    const {pubkey, secret} = newKeyPair()
    const {signature, M} = sign(stringToHex(message), secret)
    // console.log('<'.repeat(50), M)
    // console.log(G1ToNumbers(signature), G2ToNumbers(pubkey), G1ToNumbers(M))
    // return
    const res = await contract.verify(G1ToNumbers(signature), G2ToNumbers(pubkey), G1ToNumbers(M))
    expect(res).toEqual(true)
  })
})
