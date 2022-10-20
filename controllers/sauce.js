//Required
const fs = require('fs')

// Models Required
const Sauce = require('../models/sauce')

// Create Sauce
exports.create = (req, res) => {
    const object = JSON.parse(req.body.sauce)
    const sauce = new Sauce({
        ...object,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: []
    })
    sauce.save()
        .then(() => res.status(201).json({message: 'Sauce Save!'}))
        .catch(error => console.log(error))
}

// Get One Sauce
exports.getOne = (req, res) => {
    Sauce.findOne({_id: req.params.id})
        .then(sauce => {
            res.status(200).json(sauce)
        })
        .catch(error => res.status(404).json({error: error}))
}

// Get All Sauces
exports.getAll = (req, res) => {
    Sauce.find()
        .then(sauces => {
            res.status(200).json(sauces)
        })
        .catch(error => {
            res.status(404).json({error})
        })
}

// Set reaction
exports.setReaction = (req, res) => {
    const userId = req.body.userId
    const sauceId = req.params.id
    const state = req.body.like

    switch(state) {
        // If like
        case 1:
            // Add Like to Sauce ID
            Sauce.updateOne({_id: sauceId}, {$inc: {likes: 1}, $push: { usersLiked: userId }})
                .then(() => res.status(200).json({message: 'Like Added'}))
                .catch(error => res.status(400).json({error: error}))
        break;

        // If Remove Like/Dislike
        case 0:
            Sauce.findOne({_id: sauceId})
                .then(sauce => {
                    // Remove Like
                    if(sauce.usersLiked.includes(userId)){
                        Sauce.updateOne({_id: sauceId}, {$inc: {likes: -1}, $pull : {usersLiked: userId}})
                        .then(() => res.status(200).json({message: 'Remove Like'}))
                        .catch(error => res.status(400).json({error: error}))
                    } else if(sauce.usersDisliked.includes(userId)){
                        // Remove Dislike
                        Sauce.updateOne({_id: sauceId}, {$inc: {dislikes: -1}, $pull : {usersDisliked: userId}})
                        .then(() => res.status(200).json({message: 'Remove Dislike'}))
                        .catch(error => res.status(400).json({error: error}))
                    }
                })
        break;
        
        // Add Dislike
        case -1: 
        Sauce.updateOne({ _id: sauceId }, { $inc: { dislikes: 1 }, $push: { usersDisliked: userId } })
            .then(() => res.status(200).json({ message: "Dislike Added" }))
            .catch((error) => res.status(400).json({ error })); 
    }
}

// Update Sauce 
exports.update = (req, res) => {

    // Create new sauce object, if new image or not
    const Object = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : {...req.body }

    Sauce.updateOne({_id: req.params.id}, {...Object, _id: req.params.id})
        .then(res.status(200).json({message: 'Sauce Update!'}))
        .catch(error => res.status(400).json({error: error}))
}


// Delete Sauce
exports.delete = (req, res) => {
    // Find if Sauce ID EXIST
    Sauce.findOne({_id: req.params.id})
        .then((sauce) => {
            // Unlink Image
            const file = sauce.imageUrl.split('/images/')[1]
            fs.unlink(`images/${file}`, () => {
                // Delete Sauce
                Sauce.deleteOne({_id: req.params.id})
                    .then(() => res.status(200).json({message: "Sauce Delete"}))
                    .catch(error => res.status(400).json({error: error}))
            })
        })
        .catch(error => res.status(400).json({error: error}))
}