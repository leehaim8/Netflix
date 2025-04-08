const { Router } = require('express');
const { usersController } = require('../controllers/usersController');
const { authMiddleware } = require('../middleware/authMiddleware')

const usersRouter = new Router();

usersRouter.post('/register', usersController.register);
usersRouter.post('/login', usersController.login);
// usersRouter.get('/:userID', authMiddleware.authToken, authMiddleware.authRole("student"), usersController.getCoursesOfUser);
// usersRouter.post('/:userID/:courseID', authMiddleware.authToken, authMiddleware.authRole("student"), usersController.addCoursesToUser);
// usersRouter.delete('/:userID/:courseID', authMiddleware.authToken, authMiddleware.authRole("student"), usersController.deleteCoursesToUser);

module.exports = { usersRouter };