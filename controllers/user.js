const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

exports.signup = async (req, res, next) => {
    try {
        const hash = await bcrypt.hash(req.body.password, 10);
        const user = new User({
            email: req.body.email,
            password: hash
        });
        try {
            await user.save();
            res.status(201).json({message: 'Utilisateur créé avec succès !'});
        } catch (error) {
            res.status(400).json({error});
        }
    } catch (error) {
        res.status(500).json({error});
    }
}

exports.login = (req, res, next) => {
    try {
        const user = await User.findOne({email: req.body.email});
        if (!user) return res.status(401).json({message: 'Utilisateur non trouvé !'});
        res.status(200).json({
            userId: user._id,
            token: jwt.sign(
                {userId: user._id},
                process.env.TOKEN_SECRET,
                {expiresIn: '24h'}
            )
        })
    } catch (error) {
        res.status(500).json({error});
    }
}