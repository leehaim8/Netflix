const { Router } = require('express');
const { usersController } = require('../controllers/usersController');
const { authMiddleware } = require('../middleware/authMiddleware')

const usersRouter = new Router();

usersRouter.post('/register', usersController.register);
usersRouter.post('/login', usersController.login);
usersRouter.get('/verify', usersController.verify);

module.exports = { usersRouter };