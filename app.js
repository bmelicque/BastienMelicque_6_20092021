const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const path = require('path');
const userRoutes = require('./routes/user');
const sauceRoutes = require('./routes/sauce');

const app = express();

// Connexion to MongoDB
mongoose.connect(`mongodb+srv://${process.env.DB_USER_PASS}@cluster0.ljsry.mongodb.net/piiquante?retryWrites=true&w=majority`, {useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log('Connexion à MongoDB réussie !'))
.catch(() => console.log('Connexion à MongoDB échouée !'));

// Setting headers
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(express.json());

// Using APIs
app.use('/images', express.static(path.join(__dirname, '/images')));
app.use('/api/auth', userRoutes);
app.use('/api/sauces', sauceRoutes);

module.exports = app;