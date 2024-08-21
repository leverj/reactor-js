export class Transfer {
  static signature = 'Transfer(bytes32,uint64,address,string,string,uint8,uint256,address,uint64,uint64,uint256)'
  static topic = '0x225befdad5da5115af4962e80b572a17f383a2d8bd750c1edfd940806a518b02'

  /**
   * @param {bytes32} hash
   * @param {uint64} origin
   * @param {address} token
   * @param {string} name
   * @param {string} symbol
   * @param {uint8} decimals
   * @param {uint256} amount
   * @param {address} owner
   * @param {uint64} from
   * @param {uint64} to
   * @param {uint256} tag
   */
  constructor(hash, origin, token, name, symbol, decimals, amount, owner, from, to, tag) {
    this.hash = hash
    this.origin = origin
    this.token = token
    this.name = name
    this.symbol = symbol
    this.decimals = decimals
    this.amount = amount
    this.owner = owner
    this.from = from
    this.to = to
    this.tag = tag
  }
}