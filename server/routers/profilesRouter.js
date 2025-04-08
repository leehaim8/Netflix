const { Router } = require('express');
const { profilesController } = require('../controllers/profilesController');
const { authMiddleware } = require('../middleware/authMiddleware')

const profilesRouter = new Router();

profilesRouter.get('/:userId', authMiddleware.authToken, profilesController.getProfileByUser);
profilesRouter.post('/addProfile/:userId', authMiddleware.authToken, profilesController.createProfile);
profilesRouter.put('/updateProfile/:id', authMiddleware.authToken, profilesController.updateProfile);
profilesRouter.delete('/deleteProfile/:id', authMiddleware.authToken, profilesController.deleteProfile);

module.exports = { profilesRouter };