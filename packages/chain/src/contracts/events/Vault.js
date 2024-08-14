export class Transfer {
  static signature = 'Transfer(uint64,address,string,string,uint256,uint256,address,uint64,uint64,uint256)'
  static topic = '0xa0c4fa9afe14737524442437065b853fb01b9c456979fc71ab6f9a173046f8d1'

  /**
   * @param {uint64} origin
   * @param {address} token
   * @param {string} name
   * @param {string} symbol
   * @param {uint256} decimals
   * @param {uint256} amount
   * @param {address} owner
   * @param {uint64} from
   * @param {uint64} to
   * @param {uint256} sendCounter
   */
  constructor(origin, token, name, symbol, decimals, amount, owner, from, to, sendCounter) {
    this.origin = origin
    this.token = token
    this.name = name
    this.symbol = symbol
    this.decimals = decimals
    this.amount = amount
    this.owner = owner
    this.from = from
    this.to = to
    this.sendCounter = sendCounter
  }
}