import express from "express"
import { createAds, deleteAds, getAllAds, getsAdsId, updateAds } from "../Controllers/adscontroller.js"
import { requireAdmin, requireAuth } from "../middleware.js"

const router = express.Router()

router.post('/createads', requireAuth, requireAdmin,  createAds)
router.put('/updatead/:ads_id', requireAuth, requireAdmin, updateAds)
router.get('/getad/:ads_id', getsAdsId)
router.get('/getallads', getAllAds)
router.delete('/deletead/:ads_id', requireAuth, requireAdmin, deleteAds)

export default router;