const { Router } = require('express');
const { profilesController } = require('../controllers/profilesController');
const { authMiddleware } = require('../middleware/authMiddleware')

const profilesRouter = new Router();

profilesRouter.get('/byUser/:userId', authMiddleware.authToken, authMiddleware.authRole("user"), profilesController.getProfileByUser);
profilesRouter.get('/byId/:profileId', authMiddleware.authToken, authMiddleware.authRole("user"), profilesController.getProfileByProfileId);
profilesRouter.post('/addProfile/:userId', authMiddleware.authToken, authMiddleware.authRole("user"), profilesController.createProfile);
profilesRouter.put('/updateProfile/:id', authMiddleware.authToken, authMiddleware.authRole("user"), profilesController.updateProfile);
profilesRouter.delete('/deleteProfile/:id', authMiddleware.authToken, authMiddleware.authRole("user"), profilesController.deleteProfile);

profilesRouter.post('/addFavorite/:profileId', authMiddleware.authToken, authMiddleware.authRole("user"), profilesController.addFavorite);
profilesRouter.get('/favorites/:profileId', authMiddleware.authToken, authMiddleware.authRole("user"),profilesController.getFavorites);

module.exports = { profilesRouter };