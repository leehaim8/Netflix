const { Router } = require('express');
const { mediaController } = require('../controllers/mediaController');
const { authMiddleware } = require('../middleware/authMiddleware')

const mediaRouter = new Router();

mediaRouter.post('/addMedia', authMiddleware.authToken, mediaController.addMedia);

module.exports = { mediaRouter };