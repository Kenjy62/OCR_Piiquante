//Required
const express = require('express')
const router = express.Router()

// Controller Required 
const sauceController = require('../controllers/sauce')

// Middleware
const auth = require('../middleware/auth')
const multer = require('../middleware/multer-config')

// Roads

// Get all Sauce
router.get('/', auth, sauceController.getAll)

// Post new sauce
router.post('/', auth, multer, sauceController.create)

// Get details of sauce
router.get('/:id', auth, sauceController.getOne)

// Update Sauce
router.put('/:id', auth, multer, sauceController.update)

// Delete Sauce
router.delete('/:id', auth, sauceController.delete)

// Set reaction
router.post('/:id/like', auth, sauceController.setReaction)


// EXPORTS
module.exports = router