const mongoose = require("mongoose");
const { Schema } = mongoose;

const profileSchema = new mongoose.Schema({
    name: { type: String, required: true },
    userId: { type: String, required: true },
    image: { type: String, required: true },
    favorites: [
        {
            id: { type: String, required: true },
            title: { type: String, required: true },
            poster: { type: String, required: true }
        }
    ]
}, { collection: "profiles" });

const Profile = mongoose.model("Profile", profileSchema);
module.exports = Profile;
