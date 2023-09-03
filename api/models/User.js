const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    name: String,
    password: String,
    email: {type: String, unique: true},
});

const UserModel = mongoose.model('User',UserSchema);

module.exports = UserModel;