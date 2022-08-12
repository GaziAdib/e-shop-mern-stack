import asyncHandler from 'express-async-handler';
import Order from '../models/orderModel.js'



// Create New Order
// POST /api/orders

const addOrderItems = asyncHandler(async (req, res) => {
    const { orderItems,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice
     } = req.body

     if(orderItems && orderItems.length === 0) {
         res.status(400)
         throw new Error('No Order Items')
     } else {
         const order = new Order({
            orderItems,
            user: req.user._id,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice
         })


         const createdOrder = await order.save()

         res.status(201).json(createdOrder)
     }

})





// Get Order By ID to show On front END
// GET Order By ID
// GET /api/orders/:id

const getOrderById = asyncHandler(async (req, res) => {
   
const order = await Order.findById(req.params.id).populate('user', 'name email')

    if(order) {
        res.json(order)
    }
    else {
        res.status(404)
        throw new Error('Order Not Found')
    }
})






// UPDATE Order to Paid
// route /api/orders/:id/pay

const updateOrderToPaid = asyncHandler(async (req, res) => {
   
    const order = await Order.findById(req.params.id)

        if(order) {
            order.isPaid = true
            order.paidAt = Date.now()
            order.paymentResult = {
                id: req.body.id,
                status: req.body.status,
                update_time: req.body.update_time,
                email_address: req.body.payer.email_address
            }

            const updatedOrder = await order.save()

            res.json(updatedOrder)
        }
        else {
            res.status(404)
            throw new Error('Order Not Found')
        }
    })
    


 // Update Order Delivered 
 // GET /api/orders/:id/deliver
 
 const updateOrderToDelivered = asyncHandler(async (req, res) => {
   
    const order = await Order.findById(req.params.id)

        if(order) {
            order.isDelivered = true
            order.deliveredAt = Date.now()
            const updatedOrder = await order.save()

            res.json(updatedOrder)
        }
        else {
            res.status(404)
            throw new Error('Order Not Found')
        }
    })
    










// GET Logged IN User Orders
// route /api/orders/:id/myorders

const getMyOrders = asyncHandler(async (req, res) => {
   
const orders = await Order.find({ user: req.user._id })

res.json(orders)
      
})




// GET All Orders
// route GET /api/orders
// admin

const getOrders = asyncHandler(async (req, res) => {
   
    const orders = await Order.find({}).populate('user', 'id name')
    
    res.json(orders)
          
    })
          







export { addOrderItems, getOrderById, updateOrderToPaid, getMyOrders, getOrders, updateOrderToDelivered }
