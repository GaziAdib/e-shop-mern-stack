import mongoose from 'mongoose';
import dotenv from 'dotenv';
import users from './data/users.js';
import products from './data/products.js'
import User from './models/userModel.js';
import Product from './models/productModel.js';
import Order from './models/orderModel.js';
import connectDB from './config/db.js';

dotenv.config()

connectDB()


// import Data to MongoDB
const importData = async () => {
    try {
       await Order.deleteMany()
       await Product.deleteMany()
       await User.deleteMany()

     const createdUser =  await User.insertMany(users)
     const adminUser = createdUser[0]._id

     const sampleProducts = products.map(product => {
         return { ...product, user: adminUser }
     })

     await Product.insertMany(sampleProducts)

     console.log('Data imported!')
     process.exit()

    } catch (error) {
        console.error(`${error}`)
        process.exit(1)
    }
}




// Destroy Data from MongoDB Database
const destroyData = async () => {
    try {
       await Order.deleteMany()
       await Product.deleteMany()
       await User.deleteMany()


     console.log('Data Deleted!')
     process.exit()

    } catch (error) {
        console.error(`${error}`)
        process.exit(1)
    }
}

if(process.argv[2] === '-d') {
    destroyData()
} else {
    importData()
}