const express = require('express');
const mongoose = require('mongoose');
const dotenv = require("dotenv");
dotenv.config();
const DB_USER_PASS = process.env.DB_USER_PASS;

const app = express();

mongoose.connect(`mongodb+srv://${DB_USER_PASS}@cluster0.ljsry.mongodb.net/piiquante?retryWrites=true&w=majority`, {useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log('Connexion à MongoDB réussie !'))
.catch(() => console.log('Connexion à MongoDB échouée !'));

module.exports = app;