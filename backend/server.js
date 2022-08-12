// import path module
import path from 'path';

// require the express
import express from 'express';

// DotEnv module
import dotenv from 'dotenv';

// import morgan
import morgan from 'morgan';

// import connectDB
import connectDB from './config/db.js';


// import Routes
import productRoutes from './routes/productRoutes.js';

// import user routes
import userRoutes from './routes/userRoutes.js';

//import oder Routes
import orderRoutes from './routes/orderRoutes.js';

// import File Upload Roues
import uploadRoutes from './routes/uploadRoutes.js';

// import middleware
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

dotenv.config();

connectDB()

// Instance of Express
const app = express();

// use of morgan to get status code 
if (process.env.NODE_ENV =='development') {
    app.use(morgan('dev'))
}

//body parse - accept json data in body
app.use(express.json())


//routes
app.use('/api/products', productRoutes)
app.use('/api/users', userRoutes)
app.use('/api/orders',  orderRoutes)
app.use('/api/upload', uploadRoutes)

// fetch client id from paypal
app.get('/api/config/paypal', (req, res) => res.send(process.env.PAYPAL_CLIENT_ID))


// static uploads folder static
const __dirname = path.resolve()
app.use('/uploads', express.static(path.join(__dirname, '/uploads')))


if(process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '/frontend/build')))
    app.get('*', (req, res) => res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html')))

} else {
    app.get('/', (req, res) => {
        res.send('API is running...')
    })
}




// middleware
app.use(notFound)

// middleware
app.use(errorHandler)


const PORT = process.env.PORT || 5000;

// Running Server At PORT
app.listen(PORT, console.log(`Server is running in ${process.env.NODE_ENV} mode on  port ${PORT}`));