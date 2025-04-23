const Media = require("../models/mediaModel");

const mediaController = {
    async addMedia(req, res) {
        try {
            const {
                title, type, overview, releaseDate, genres,
                backdropPath, posterPath, numberOfSeasons,
                voteAverage, popularity, originalLanguage,
                adult, tmdbId, tags, cast
            } = req.body;

            const media = new Media({
                title,
                type,
                overview,
                release_date: releaseDate,
                genres: genres?.split(',').map(g => g.trim()),
                backdrop_path: backdropPath,
                poster_path: posterPath,
                number_of_seasons: type === 'tv' ? Number(numberOfSeasons) : undefined,
                voteAverage,
                popularity,
                original_language: originalLanguage,
                adult,
                id:tmdbId,
                tags: tags?.split(',').map(t => t.trim()),
                cast: cast?.split(',').map(c => c.trim())
            });

            const saved = await media.save();
            res.status(201).json(saved);
        } catch (err) {
            console.error('Error creating program:', err);
            res.status(500).json({ message: 'Server error creating program' });
        }
    }
};

module.exports = { mediaController };
