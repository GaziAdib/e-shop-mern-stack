import express from 'express';
const router = express.Router()
import { authorUser, deleteUser, getUserById, getUserProfile, getUsers, registerUser, updateUser, updateUserProfile } from '../controllers/userControllers.js';
import {admin, protect} from '../middleware/authMiddleware.js'


//post data for user registration
router.route('/').post(registerUser)

// post user data to login routes
router.post('/login', authorUser)

// get Profile based on login
router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile)

// admin get All useers
router.route('/').get(protect, admin,  getUsers)

//delete user from admin
router.route('/:id').delete(protect, admin, deleteUser)

// get user by id for admin
router.route('/:id').get(protect, admin, getUserById)

// update user by id for admin
router.route('/:id').put(protect, admin, updateUser)


export default router;