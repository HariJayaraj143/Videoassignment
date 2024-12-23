const express = require('express')
const {
  registerUser,
  loginUser,
  getUserProfile,
} = require('../controllers/authController')
const protect = require('../middleware/authMiddleware')

const router = express.Router()

// @route  POST /api/auth/register
// @desc   Register a new user
// @access Public
router.post('/register', registerUser)

// @route  POST /api/auth/login
// @desc   Authenticate a user and get a token
// @access Public
router.post('/login', loginUser)

// @route  GET /api/auth/me
// @desc   Get the logged-in user's profile
// @access Private
router.get('/me', protect, getUserProfile)

module.exports = router
