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
    },
    async getReviews(req, res) {
        const itemId = req.params.itemId;

        try {
            const reviews = await Review.find({ itemId });
            res.json(reviews);
        } catch (err) {
            res.status(500).json({ message: 'Failed to fetch reviews' });
        }
    },
    async updateReviews(req, res) {
        const { reviewId } = req.params;
        const updateData = req.body;
        if (!reviewId) {
            return res.status(400).json({ message: "review ID is required" });
        }

        if (!updateData) {
            return res.status(400).json({ message: "One of the filed are missing!" });
        }

        try {
            const updatedReview = await Review.findOneAndUpdate({ _id: reviewId }, updateData, { new: true });

            if (!updatedReview) {
                return res.status(404).json({ message: "review not found" });
            }
            res.status(200).json({ review: updatedReview });
        } catch (error) {
            res.status(500).json({ message: "Internal Server Error" });
        }
    },
    async deleteReviews(req, res) {
        const { reviewId } = req.params;
        if (!reviewId) {
            return res.status(400).json({ message: "review ID is required" });
        }

        try {
            const deleteReview = await Review.findOneAndDelete({ _id: reviewId });
            if (!deleteReview) {
                return res.status(404).json({ message: "Review not found" });
            }

            res.status(200).json({ message: "Review deleted successfully" });
        } catch (error) {
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
};

module.exports = { reviewsController };
