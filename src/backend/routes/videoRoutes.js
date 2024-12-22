const express = require('express')
const {getVideos} = require('../controllers/videoController')
const protect = require('../middleware/authMiddleware')

const router = express.Router()
router.get('/', protect, getVideos)

module.exports = router
