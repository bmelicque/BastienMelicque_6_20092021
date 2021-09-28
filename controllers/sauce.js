const fs = require('fs');
const Sauce = require('../models/sauce');

// Gets all sauces from the database
exports.getAllSauces = (req, res, next) => {
    Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({error}))
}

// Gets the sauce corresponding to the id passed in the URL
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({error}))
}

// Adds a new sauce to the database, saves the corresponding picture
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    });
    sauce.save()
    .then(() => res.status(201).json({ message: 'Sauce enregistrée !'}))
    .catch(error => res.status(500).json({error}))
}

// Modifies the chosen sauce and its image (if needed)
exports.modifySauce = (req, res, next) => {
    // Deletes existing image if a new one is provided
    if (req.file) {
        Sauce.findOne({_id: req.params.id})
        .then(sauce => {
            const filename = sauce.imageUrl.split('images/')[1];
            fs.unlinkSync(`images/${filename}`);
        })
        .catch(error => res.status(404).json({error}))
    }
    // Saves a potential new image
    const sauceObject = (req.file) ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : {...req.body};
    Sauce.updateOne({_id: req.params.id}, {...sauceObject, _id: req.params.id})
    .then(() => res.status(200).json({message: 'Sauce modifiée !'}))
    .catch(error => res.status(400).json({error}))
}

// Deletes a sauce from the database and its image from the server
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
    .then(sauce => {
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
            Sauce.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Sauce supprimée !'}))
            .catch(error => res.status(400).json({ error }));
        })
    })
    .catch(error => res.status(500).json({error}))
}

// Manages likes and dislikes on a sauce
exports.likeSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
    .then(sauce => {
        const userId = req.body.userId;
        
        // Removes the user's id from both arrays in every case
        sauce.usersLiked = sauce.usersLiked.filter(user => user !== userId);
        sauce.usersDisliked = sauce.usersDisliked.filter(user => user !== userId);
        
        // (Re)adds the user's id to the wanted array
        if (req.body.like === 1) sauce.usersLiked.push(userId);
        else if (req.body.like === -1) sauce.usersDisliked.push(userId);

        // Updates the number of likes / dislikes
        sauce.likes = sauce.usersLiked.length;
        sauce.dislikes = sauce.usersDisliked.length;

        Sauce.updateOne({_id: req.params.id}, sauce)
        .then(() => res.status(200).json({message: 'Sauce (dis)likée !'}))
        .catch(error => res.status(400).json({error}))
    })
    .catch(error => res.status(404).json({error}))
}