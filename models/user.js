// Required
const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

// Schema
const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true},
    password: { type: String, required: true},
})

// Plugins
// Unique Informations validator (unique: true)
userSchema.plugin(uniqueValidator)


// EXPORTS
module.exports = mongoose.model('User', userSchema)