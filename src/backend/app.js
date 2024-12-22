const express = require('express')
const connectDB = require('./config/db')
const authRoutes = require('./routes/authRoutes')
const videoRoutes = require('./routes/videoRoutes')

connectDB()

const app = express()
app.use(express.json())
app.use('/api/auth', authRoutes)
app.use('/api/videos', videoRoutes)

app.listen(5000, () => console.log('Server running on port 5000'))
