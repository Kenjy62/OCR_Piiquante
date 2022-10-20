// Required
// Plugins
const dotenv = require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const app = express()
const path = require('path')
const morgan = require('morgan')
const helmet = require('helmet')

// Custom
const userRoads = require('./routes/user')
const sauceRoads = require('./routes/sauce')


// DB Connect
mongoose.connect('mongodb+srv://'+process.env.DBUSER+':'+process.env.DBPWD+'@cluster0.qunncwa.mongodb.net/piiquante?retryWrites=true&w=majority').then(() => console.log('MongoDB sucessfully!')).catch(() => console.log('MongoDB failed!'))

// App use
app.use(helmet({ crossOriginResourcePolicy: { policy: "same-site" } }))
app.use(morgan('dev'))
app.use(express.json())
app.use('/images', express.static(path.join(__dirname, 'images')))

// Headers

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin')
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
  next()
});


// API ROADS
app.use('/api/auth', userRoads)
app.use('/api/sauces', sauceRoads)


app.listen(process.env.PORT, () => {
  console.log(`Piiquante API listening on port ${process.env.PORT}`)
})
