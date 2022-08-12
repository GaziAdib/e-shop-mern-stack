import express from 'express';
const router = express.Router()
import { addOrderItems, getOrderById, updateOrderToPaid, getMyOrders, getOrders, updateOrderToDelivered } from '../controllers/orderController.js';
import { admin, protect } from '../middleware/authMiddleware.js'


// add Order Items and Details into Database
router.route('/').get(protect, admin, getOrders)
router.route('/myorders').get(protect, getMyOrders)
router.route('/').post(protect, addOrderItems)
router.route('/:id').get(protect, getOrderById)
router.route('/:id/pay').put(protect, updateOrderToPaid)
router.route('/:id/deliver').put(protect, admin, updateOrderToDelivered)






export default router;