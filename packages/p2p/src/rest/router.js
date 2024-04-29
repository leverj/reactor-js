import {Router} from 'express'


export const router = Router()
router.use('/dkg/start', canvas)
router.use('/node/add', canvas)
router.use('/events/start', canvas)
router.use('/events/stop', canvas)
export default router
