const mongoose = require("mongoose");
const { Schema } = mongoose;

const mediaSchema = new mongoose.Schema({
    title: { type: String, required: true },
    type: { type: String, enum: ['movie', 'tv'], required: true },
    overview: String,
    release_date: Date,
    genres: [String],
    backdrop_path: String,
    poster_path: String,
    number_of_seasons: Number,
    vote_average: Number,
    popularity: Number,
    original_language: String,
    adult: Boolean,
    id: String,
    tags: [String],
    cast: [String]
}, { collection: "media" });

const Media = mongoose.model("Media", mediaSchema);
module.exports = Media;
