// Required
const bcrypt = require('bcrypt')
const salt = 10
const jwt = require('jsonwebtoken')


// Models
const User = require('../models/user')

// SignUp
exports.signup = (req, res, next) => {

    // Hash Password
    bcrypt.hash(req.body.password, salt)
    // If hashed
    .then(hash => {

        // Init new User Object
        const user = new User({
            email: req.body.email,
            password: hash
        })

        // Save User
        user.save()
            // If user create
            .then(() => res.status(201).json({message: 'User Create!'}))
            // Else
            .catch(error => res.status(400).json({error}))

        // Else
        .catch(error => res.status(500).json({error}))
    })
    
}

// Login
exports.login = (req, res, next) => {

    // Check if email exist
    User.findOne({
        email: req.body.email
    })
    .then(user => {

        // If not exist
        if(!user) {
            return res.status(401).json({error: 'User not found!'})
        }

        // Else, Compare password
        bcrypt.compare(req.body.password, user.password)
        .then(result => {

            // If password wrong
            if(!result){
                return res.stats(401).json({error: 'Wrong Password!'})
            }

            // Else
            res.status(200).json({
                userId: user._id, 
                token: jwt.sign({ userId: user._id}, process.env.PRIVATEKEY, {expiresIn: '24h'})
            })
        })
        // bcrypt Error
        .catch(error => res.status(500).json({error}))
    }).catch(error => res.status(500).json({error}))
}