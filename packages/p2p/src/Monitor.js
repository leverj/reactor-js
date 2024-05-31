import events, {PEER_LATENCY} from './events.js'
class Monitor {
  constructor() {
    events.on(PEER_LATENCY, _=> this.updateLatency.bind(this));
    setInterval(this.print.bind(this), 1000);
    this.peers = {};
  }

  updateLatency(peerId, latency) {
    if (!this.peers[peerId]) this.peers[peerId] = {}
    this.peers[peerId].latency = latency
  }

  print() {
    console.table('Peers:', this.peers);
  }

}