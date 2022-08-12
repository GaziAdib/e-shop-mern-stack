import asyncHandler from 'express-async-handler';
import Product from '../models/productModel.js';


// get All products for all users
const getProducts = asyncHandler(async (req, res) => {

    const pageSize = 10
    const page = Number(req.query.pageNumber) || 1


    // api/products?q=keyword
    
    const keyword = req.query.keyword ? {
        name: {
            $regex: req.query.keyword,
            $options: 'i'
        }
    } : {}

    const count = await Product.countDocuments({ ...keyword })
    const products = await Product.find({ ...keyword }).limit(pageSize).skip(pageSize * (page-1));
    res.json({ products, page, pages: Math.ceil(count / pageSize) });
})


// get product for all users
const getProductById = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id)

   if (product) {
        res.json(product);
   }
    else {
        res.status(404)
        throw new Error('Product Not Found')
    }
})



// delete a product for admin

const deleteProduct = asyncHandler(async (req, res) => {

    const productFound = await Product.findById(req.params.id)

    if(productFound) {
        await productFound.deleteOne(productFound)
        res.json({ message: 'Product Removed'})
    } else {
        res.status(404)
        throw new Error('Product not found')
    }


})



// Create a Product  for admin
// POST /api/products
// privare admin

const createProduct = asyncHandler(async (req, res) => {

    const product = new Product({
        name: 'Sample name',
        price: 0,
        user: req.user._id,
        image: '/images/sample.jpg',
        brand: 'Sample brand',
        category: 'Sample category',
        countInStock: 0,
        numReviews: 0,
        description:'Sample description'
    })

    const createdProduct = await product.save()
    res.status(201).json(createdProduct)

})




// update product for admin

// put /api/products/:id

// private admin

const updateProduct = asyncHandler(async (req, res) => {

   const {name, price, description, image, brand, category, countInStock} = req.body

   const product = await Product.findById(req.params.id)

   if(product) {

        product.name = name
        product.price = price
        product.description = description
        product.image = image
        product.brand = brand
        product.category = category
        product.countInStock = countInStock

       const updatedProduct = await product.save()
        res.json(updatedProduct)
   
   } else {
        res.status(404)
        throw new Error('Product Not Found')
   }

})





// create new review
// route POST /api/products/:id/reviews

const createProductReview = asyncHandler(async (req, res) => {

    const {
        rating, comment
    } = req.body
 
    const product = await Product.findById(req.params.id)
 
    if(product) {
 
        const alreadyReviewed = product.reviews.find(r => r.user.toString() === req.user._id.toString())
        
        if(alreadyReviewed) {
            res.status(400)
            throw new Error('Product Already Reviewd!')
        }

        const review = {
            name: req.user.name,
            rating: Number(rating),
            comment,
            user: req.user._id
        }

        product.reviews.push(review)

        product.numReviews = product.reviews.length

        product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length

        await product.save()
        res.status(201).json({ message: 'Review Added' })

    } else {
         res.status(404)
         throw new Error('Product Not Found')
    }
 
 })




// Get Top Rated Products
// GET /api/products/top
// public 

const getTopProducts = asyncHandler(async (req, res) => {

   const products = await Product.find({}).sort({ rating: -1 }).limit(3)
   res.json(products)

})

 






export { getProducts, getProductById, deleteProduct, createProduct, updateProduct, createProductReview, getTopProducts }

