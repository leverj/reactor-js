import {expect} from 'expect'


export const getEventCountIn = (tx) => tx.logs.length
export const extractAllFrom = (name, tx) => tx.logs.filter(_ => _.eventName === name).map(_ => _.args.toObject())
export const extractFirstFrom = (name, tx) => extractAllFrom(name, tx)[0]

export const getAllOf = async (name, tx, contract) => contract.getPastEvents(
  name, {fromBlock: tx.receipt.blockNumber}
).then(_ => _.filter(_ => _.transactionHash === tx.receipt.transactionHash).map(_ => _.returnValues))
export const getFirstOf = async (eventName, tx, contract) => (await getAllOf(eventName, tx, contract))[0]

export const expectFirstOfToMatch = (name, tx, expected = {}) => expectEventToMatch(extractFirstFrom(name, tx), expected)
export const expectEventToMatch = (actual, expected = {}) => {
  for (let [key, value] of Object.entries(expected)) {
    expect(key in actual).toBeTruthy()
    expectToMatch(actual[key], value)
  }
}
const expectToMatch = (actual, expected) => {
  if (typeof actual == 'object')
    for (let [key, value] of Object.entries(expected)) expectToMatch(actual[key], value)
  else
    expect(actual).toEqual(expected)
}
