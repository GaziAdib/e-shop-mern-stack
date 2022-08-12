import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import generateToken from '../utils/generateToken.js';


// Auth the user 
// POST /api/users/login

const authorUser = asyncHandler(async (req, res) => {
   const { email, password } = req.body

   //res.send({email, password})

    const user = await User.findOne({ email })

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id),
        })
    } else {
        res.status(401)
        throw new Error('Invalid email or password')
    }

})





// Register New User

// Add New User
// POST /api/users

const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body

 
     const userExists = await User.findOne({ email })

     if(userExists) {
         res.status(400)
         throw new Error('User Already Exists')
     }

     const user = await User.create({
        name,
        email,
        password
     })

     if(user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id),
        })
     } else {
        res.status(400)
        throw new Error('Invalid User Data')
     }
 
   
 })
 





// GET user Profile 
// GET /api/users/profile

// private

const getUserProfile = asyncHandler(async (req, res) => {
    
    const user = await User.findById(req.user._id)

    if(user) {

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
        })
       
    } else {
        res.status(404)
        throw new Error('User Not Found!')
    }
 
 })




 // GET Update user Profile 
//  PUT /api/users/profile

// private Private

const updateUserProfile = asyncHandler(async (req, res) => {
    
    const user = await User.findById(req.user._id)

    if(user) {

        user.name = req.body.name || user.name
        user.email = req.body.email || user.email
        if(req.body.password) {
            user.password = req.body.password
        }

        const updatedUser = await user.save()

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
            token: generateToken(updatedUser._id),
        })
 
    } else {
        res.status(404)
        throw new Error('User Not Found!')
    }
 
 })






// GET all users 
// GET /api/users
// private / admin

// private

const getUsers = asyncHandler(async (req, res) => {
    
    const users = await User.find({})

    res.json(users)

 
 })




// DELETE USER
// DELETE /api/users/:id

const deleteUser = asyncHandler(async (req, res) => {
    
    const userFound = User.findById(req.params.id)

    if(userFound) {
        await userFound.deleteOne(userFound)
        res.json({ message: 'User Removed' })
    } else {
        res.status(404)
        throw new Error('User Not Found')
    }

 })







// GET user by id For Admin
// GET /api/user/:id
// private / admin

const getUserById = asyncHandler(async (req, res) => {
    
    const user = await User.findById(req.params.id).select('-password')

    if (user) {
        res.json(user)
    }
    else {
        res.status(404)
        throw new Error('User Not Found')
    }
   
 })


// update any user from Admin
// route PUT /api/users/:id
// private admin

 const updateUser = asyncHandler(async (req, res) => {
    
    const user = await User.findById(req.params.id)

    if(user) {

        user.name = req.body.name || user.name
        user.email = req.body.email || user.email
        user.isAdmin = req.body.isAdmin
    
        const updatedUser = await user.save()

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin
        })
 
    } else {
        res.status(404)
        throw new Error('User Not Found!')
    }
 
 })










export { authorUser, getUserProfile, registerUser, updateUserProfile, getUsers, deleteUser, getUserById, updateUser }
