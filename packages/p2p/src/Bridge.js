import Node from './Node.js'
import {DistributedKey} from './DistributedKey.js'

class Bridge extends Node{
    constructor({ip = '0.0.0.0', port = 0, isLeader = false, peerIdJson}) {
        super({ip, port, isLeader, peerIdJson})
        this.distributedKey = new DistributedKey()
    }

    addNode(peerId, multiaddrs) {
        this.connect(multiaddrs[0])
    }


}

export default Bridge