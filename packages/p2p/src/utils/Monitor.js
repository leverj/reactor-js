export default class Monitor {
  constructor() { this.peers = {} }

  updateLatency(peerId, latency) {
    if (!this.peers[peerId]) this.peers[peerId] = {}
    this.peers[peerId].latency = latency
  }

  getPeersStatus() { return Object.entries(this.peers).map(([peerId, {latency}]) => ({peerId, latency})) }

  filter(peerIds) { return peerIds.filter(peerId => this.peers[peerId]?.latency !== -1)}

  print() { console.table(this.peers) }
}