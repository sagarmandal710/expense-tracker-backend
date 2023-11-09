const { Schema, model } = require('mongoose');

const userSchema = new Schema({
    userName: { type: String, required: true },
    mail: { type: String, required: true },
    password: { type: String, required: true }
});

module.exports = model("User", userSchema);