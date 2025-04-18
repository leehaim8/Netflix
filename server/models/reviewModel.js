const mongoose = require("mongoose");
const { Schema } = mongoose;

const reviewSchema = new mongoose.Schema({
    profileId: { type: String, required: true },
    itemId: { type: String, required: true },
    text: { type: String, required: true },
    isPublic: { type: Boolean, default: true },
    stars: { type: Number, min: 0, max: 5, default: 0 }
}, { collection: "reviews" });

const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;
