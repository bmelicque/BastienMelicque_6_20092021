const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cryptoJS = require('crypto-js');

const User = require('../models/user');

// On signup, the email is hashed to respect GDPR (no personal data stored on the server)
// Emails have a unicity constraint within the database
// The password is encrypted for security reasons
exports.signup = (req, res, next) => {
    const hashedEmail = cryptoJS.SHA3(req.body.email).toString();
    bcrypt.hash(req.body.password, 10)
    .then(hashedPassword => {
        const user = new User({
            email: hashedEmail,
            password: hashedPassword
        });
        user.save()
        .then(() => res.status(201).json({message: 'Utilisateur créé avec succès !'}))
        .catch(error => res.status(400).json({error}))
    })
    .catch(error => res.status(500).json({error}))
}

// Hashes the provided email to see if it exists in the database
// Then compares the provided password with the encrypted one in the database
// On success, provides a secured token to the user
exports.login = (req, res, next) => {
    const hashedEmail = cryptoJS.SHA3(req.body.email).toString();
    User.findOne({email: hashedEmail})
    .then(user => {
        if (!user) {
            return res.status(401).json({message: 'Utilisateur non trouvé !'});
        }

        bcrypt.compare(req.body.password, user.password)
        .then(valid => {
          if (!valid) {
            return res.status(401).json({ error: 'Mot de passe incorrect !' });
          }
          res.status(200).json({
            userId: user._id,
            token: jwt.sign(
                {userId: user._id},
                process.env.TOKEN_SECRET,
                {expiresIn: '24h'}
            )});
        })
        .catch(error => res.status(500).json({ error }));

    })
    .catch(error => res.status(500).json({error}))
}