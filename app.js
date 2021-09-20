const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

mongoose.connect(`mongodb+srv://${process.env.DB_USER_PASS}@cluster0.ljsry.mongodb.net/piiquante?retryWrites=true&w=majority`, {useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log('Connexion à MongoDB réussie !'))
.catch(() => console.log('Connexion à MongoDB échouée !'));

module.exports = app;