const fs = require('fs');
const Sauce = require('../models/sauce');

exports.getAllSauces = async (req, res, next) => {
    try {
        const sauces = await Sauce.find();
        res.status(200).json(sauces);
    } catch (error) {
        res.status(400).json({error});
    }
}

exports.getOneSauce = async (req, res, next) => {
    try {
        const sauce = await Sauce.findOne({_id: req.params.id});
        res.status(200).json(sauce);
    } catch (error) {
        res.status(404).json({error});
    }
}

exports.createSauce = async (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    });
    try {
        await sauce.save();
        res.status(201).json({ message: 'Sauce enregistrée !'});
    } catch (error) {
        res.status(500).json({error});
    }
}

exports.modifySauce = async (req, res, next) => {
    try {
        // Deletes existing image if a new one is provided
        if (req.file) {
            const sauce = await Sauce.findOne({_id: req.params.id});
            const filename = sauce.imageUrl.split('images/')[1];
            fs.unlinkSync(`images/${filename}`);
        }

        const sauceObject = (req.file) ? {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : {...req.body};

        await Sauce.updateOne({_id: req.params.id}, {
            ...sauceObject,
            _id: req.params.id
        });
        res.status(200).json({message: 'Sauce modifiée !'});
    }
    catch (error) {
        res.status(400).json({error});
    }
}

exports.deleteSauce = async (req, res, next) => {
    try {
        const sauce = await Sauce.findOne({_id: req.params.id});
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlinkSync(`images/${filename}`);

        try {
            await Sauce.deleteOne({ _id: req.params.id });
            res.status(200).json({ message: 'Sauce supprimée !'});
        } catch (error) {
            res.status(400).json({error});
        }
    } catch (error) {
        res.status(500).json({error});
    }
}

exports.likeSauce = async (req, res, next) => {
    try {
        const sauce = await Sauce.findOne({_id: req.params.id});

        const userId = req.body.userId;
        
        sauce.usersLiked = sauce.usersLiked.filter(user => user !== userId);
        sauce.usersDisliked = sauce.usersDisliked.filter(user => user !== userId);
        
        if (req.body.like === 1) sauce.usersLiked.push(userId);
        else if (req.body.like === -1) sauce.usersDisliked.push(userId);
        
        sauce.likes = sauce.usersLiked.length;
        sauce.dislikes = sauce.usersDisliked.length;
        
        await Sauce.updateOne({_id: req.params.id}, sauce);

        res.status(200).json({message: 'Sauce (dis)likée !'})
    } catch (error) {
        res.status(400).json({error})
    }
}