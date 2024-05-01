import {Router} from 'express'
import Bridge from '../Bridge.js'

// const bridge = new Bridge({port})

async function startDkg(req, res) {
  // const {ip, port, isLeader, peerIdJson} = req.body
  // const bridge = new Bridge({ip, port, isLeader, peerIdJson})
  // await bridge.create()
  // await bridge.connectWhitelisted()
  // res.send({status: 'ok'})
}

export const router = Router()
router.post('/dkg/start', await startDkg)
export default router
