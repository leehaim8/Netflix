const { Router } = require('express');
const { reviewsController } = require('../controllers/reviewController');
const { authMiddleware } = require('../middleware/authMiddleware')

const reviewRouter = new Router();

reviewRouter.post('/:profileId/:itemId', authMiddleware.authToken, reviewsController.addReview);

module.exports = { reviewRouter };