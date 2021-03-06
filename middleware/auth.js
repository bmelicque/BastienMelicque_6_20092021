const jwt = require('jsonwebtoken');

// Compares the provided ID with the one in the token to ensure security
module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
        const userId = decodedToken.userId;
        if (req.body.userId && req.body.userId !== userId) {
            throw 'User ID non valable';
        } else {
            next();
        }
    } catch (error) { 
        res.status(403).json({error: error | 'Requête non authentifiée'})
    }
}