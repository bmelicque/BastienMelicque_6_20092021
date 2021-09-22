const mongoose = require('mongoose');
const {isEmail} = require('validator');

const userSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        validate: [isEmail],
        lowercase: true,
        trimp: true,
        unique: true
    },
    password: {
        type: String,
        minLength: 6,
        required: true
    }
});

module.exports = mongoose.model('User', userSchema);