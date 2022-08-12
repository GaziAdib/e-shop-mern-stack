import express from 'express';
import { getProducts, getProductById, deleteProduct, createProduct, updateProduct, createProductReview, getTopProducts } from '../controllers/productController.js';
import {admin, protect} from '../middleware/authMiddleware.js'
const router = express.Router()


// product rated products
router.get('/top', getTopProducts)

// get All Products
router.route('/').get(getProducts)

// get only One Product
router.route('/:id').get(getProductById)

// admin get all products
router.route('/:id').delete(protect, admin, deleteProduct)

//admin create product route
router.route('/').post(protect, admin, createProduct)

//admin update product by id
router.route('/:id').put(protect, admin, updateProduct)

// product reviews
router.route('/:id/reviews').post(protect, createProductReview)



export default router;