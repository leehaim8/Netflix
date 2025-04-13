const { Router } = require('express');
const { movieController } = require('../controllers/movieController');

const movieRouter = new Router();

movieRouter.get('/popular', movieController.getPopularMoviesAndTv);
movieRouter.get('/new', movieController.getNewMoviesAndTv);
movieRouter.get('/top10', movieController.getTop10MoviesAndTv);
movieRouter.get('/genre/:genreName', movieController.getByGenreMoviesAndTv);

module.exports = { movieRouter };
