// Required
const express = require('express')
const router = express.Router()

// Controller Required
const userController = require('../controllers/user')

// Roads

// Signup
router.post('/signup', userController.signup)

// Login
router.post('/login', userController.login)

// EXPORTS
module.exports = router