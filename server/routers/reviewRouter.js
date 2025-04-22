const { Router } = require('express');
const { reviewsController } = require('../controllers/reviewController');
const { authMiddleware } = require('../middleware/authMiddleware')

const reviewRouter = new Router();

reviewRouter.post('/:profileId/:itemId', authMiddleware.authToken, authMiddleware.authRole("user"), reviewsController.addReview);
reviewRouter.get('/:itemId', authMiddleware.authToken, authMiddleware.authRole("user"), reviewsController.getReviews);
reviewRouter.put('/:reviewId', authMiddleware.authToken, authMiddleware.authRole("user"), reviewsController.updateReviews);
reviewRouter.delete('/:reviewId', authMiddleware.authToken, authMiddleware.authRole("user"), reviewsController.deleteReviews);

module.exports = { reviewRouter };