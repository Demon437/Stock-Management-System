import express from 'express'

import {
    addProduct,
    getProducts,
    updateProduct,
    getProduct,
    deleteProduct
} from '../controllers/productController.js'

const router = express.Router()

router.post('/add', addProduct)
router.get('/', getProducts)
router.put("/:id", updateProduct)
router.get("/:id", getProduct)
router.delete("/:id", deleteProduct)

export default router