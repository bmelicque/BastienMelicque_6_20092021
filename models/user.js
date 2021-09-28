const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        minLength: 6,
        required: true
    }
});

// unique validator makes pre-validation possible for 'unique' parameter
// and provides usable error messages
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);