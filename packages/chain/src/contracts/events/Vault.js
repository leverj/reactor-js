export class Transfer {
  static signature = 'Transfer(uint256,address,string,string,uint256,uint256,address,uint256,uint256,uint256)'
  static topic = '0x1881e722012e71177f7317f1e29bae5b9ad452e14c9fe6853f1646ffcc4f205d'

  /**
   * @param {uint256} origin
   * @param {address} token
   * @param {string} name
   * @param {string} symbol
   * @param {uint256} decimals
   * @param {uint256} amount
   * @param {address} owner
   * @param {uint256} from
   * @param {uint256} to
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