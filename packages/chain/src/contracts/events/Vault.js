export class Transfer {
  static signature = 'Transfer(uint64,address,string,string,uint8,uint256,address,uint64,uint64,uint256)'
  static topic = '0x99073eada924242ed3a1b5a4dafd3d70d1755a1b93a755fdfeb0f7b246a25050'

  /**
   * @param {uint64} origin
   * @param {address} token
   * @param {string} name
   * @param {string} symbol
   * @param {uint8} decimals
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