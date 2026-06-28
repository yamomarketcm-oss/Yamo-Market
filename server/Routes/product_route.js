import express from "express"
import { createProduct, deleteProduct, getAllProducts, getsProductId, getsProductShopId, updateProduct } from "../Controllers/productcontroller.js"
import { requireAdmin, requireAuth } from "../middleware.js"

const router = express.Router()

router.post('/createproduct', requireAuth, createProduct)
router.put('/updateproduct/:product_id', requireAuth, updateProduct)
router.get('/getproduct/:product_id', getsProductId)
router.get('/shop-product/:shop_id', getsProductShopId)
router.get('/getallproducts', getAllProducts)
router.delete('/deleteproduct/:shop_id/:product_id', requireAuth, deleteProduct)

export default router;