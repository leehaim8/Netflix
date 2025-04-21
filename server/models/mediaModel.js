const mongoose = require("mongoose");
const { Schema } = mongoose;

const mediaSchema = new mongoose.Schema({
    title: { type: String, required: true },
    type: { type: String, enum: ['movie', 'tv'], required: true },
    overview: String,
    releaseDate: Date,
    genres: [String],
    backdropPath: String,
    posterPath: String,
    numberOfSeasons: Number,
    voteAverage: Number,
    popularity: Number,
    originalLanguage: String,
    adult: Boolean,
    tmdbId: String,
    tags: [String],
    cast: [String]
}, { collection: "media" });

const Media = mongoose.model("Media", mediaSchema);
module.exports = Media;
