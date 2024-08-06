export class TokenSent {
  static signature = 'TokenSent(uint256,address,string,string,uint256,uint256,address,uint256,uint256,uint256)'
  static topic = '0x7de319335b0d847898705ba3c425976749af5816f4679e17883c70af43b54322'

  /**
   * @param {uint256} originatingChain
   * @param {address} token
   * @param {string} name
   * @param {string} symbol
   * @param {uint256} decimals
   * @param {uint256} amount
   * @param {address} owner
   * @param {uint256} fromChain
   * @param {uint256} toChain
   * @param {uint256} sendCounter
   */
  constructor(originatingChain, token, name, symbol, decimals, amount, owner, fromChain, toChain, sendCounter) {
    this.originatingChain = originatingChain
    this.token = token
    this.name = name
    this.symbol = symbol
    this.decimals = decimals
    this.amount = amount
    this.owner = owner
    this.fromChain = fromChain
    this.toChain = toChain
    this.sendCounter = sendCounter
  }
}