const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new mongoose.Schema({
    emailOrPhone: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
}, { collection: "users" });

const User = mongoose.model("Users", userSchema);
module.exports = User;
