export class TokenSent {
  static signature = 'TokenSent(uint256,address,string,string,uint256,uint256,address,uint256,uint256,uint256)'
  static topic = '0x7de319335b0d847898705ba3c425976749af5816f4679e17883c70af43b54322'

  /**
   * @param {uint256} originatingChainId
   * @param {address} token
   * @param {string} name
   * @param {string} symbol
   * @param {uint256} decimals
   * @param {uint256} amount
   * @param {address} owner
   * @param {uint256} fromChainId
   * @param {uint256} toChainId
   * @param {uint256} sendCounter
   */
  constructor(originatingChainId, token, name, symbol, decimals, amount, owner, fromChainId, toChainId, sendCounter) {
    this.originatingChainId = originatingChainId
    this.token = token
    this.name = name
    this.symbol = symbol
    this.decimals = decimals
    this.amount = amount
    this.owner = owner
    this.fromChainId = fromChainId
    this.toChainId = toChainId
    this.sendCounter = sendCounter
  }
}