import express from "express"
import { requireAuth } from "../middleware.js"
import { createShop, deleteShop, getShop, getShopid, getShopSlug, ShopOwn, updateShop } from "../Controllers/shopcontroller.js"

const router = express.Router()

router.post('/registerShop', requireAuth, createShop)
router.get('/getshops', getShop)
router.get('/getshop/:shop_id', getShopid)
router.get('/getshopslug/:slug', getShopSlug)
router.get('/myshop', requireAuth, ShopOwn)
router.put('/updateshop/:shop_id', requireAuth, updateShop)
router.delete('/deleteshop/:shop_id', requireAuth, deleteShop)
export default router;