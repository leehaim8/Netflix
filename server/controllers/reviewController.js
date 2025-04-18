const Review = require("../models/reviewModel");

const reviewsController = {
    async addReview(req, res) {
        const { profileId, itemId } = req.params;
        const { text, isPublic, stars } = req.body;

        if (!text) {
            return res.status(400).json({ message: 'Missing review text' });
        }

        try {
            const newReview = new Review({
                profileId,
                itemId,
                text,
                isPublic: isPublic === true,
                stars: stars ?? 0
            });

            await newReview.save();
            res.status(201).json({ message: 'Review created', review: newReview });
        } catch (err) {
            console.error('Error creating review:', err);
            res.status(500).json({ message: 'Server error', error: err.message });
        }
    }
};

module.exports = { reviewsController };
