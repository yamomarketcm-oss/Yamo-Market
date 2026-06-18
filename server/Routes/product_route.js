import express from "express"
import { createProduct, deleteProduct, getAllProducts, getsProductId, getsProductShopId, updateProduct } from "../Controllers/productcontroller.js"

const router = express.Router()

router.post('/createproduct', createProduct)
router.put('/updateproduct/:product_id', updateProduct)
router.get('/getproduct/:product_id', getsProductId)
router.get('/shop-product/:shop_id', getsProductShopId)
router.get('/getallproducts', getAllProducts)
router.delete('/deleteproduct/:shop_id/:product_id', deleteProduct)

export default router;