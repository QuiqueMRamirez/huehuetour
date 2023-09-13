const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    name: String,
    password: {type: String, required: true, min: 8},
    photo: {type: String, required: true},
    email: {type: String, unique: true},
});

const UserModel = mongoose.model('User',UserSchema);

module.exports = UserModel;