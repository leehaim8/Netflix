const { Router } = require('express');
const { mediaController } = require('../controllers/mediaController');
const { authMiddleware } = require('../middleware/authMiddleware')

const mediaRouter = new Router();

mediaRouter.post('/addMedia', authMiddleware.authToken, authMiddleware.authRole("admin"),mediaController.addMedia);

module.exports = { mediaRouter };