const { Router } = require('express');
const { movieController } = require('../controllers/movieController');

const movieRouter = new Router();

movieRouter.get('/popular', movieController.getPopularMoviesAndTv);
movieRouter.get('/new', movieController.getNewMoviesAndTv);
movieRouter.get('/top10', movieController.getTop10MoviesAndTv);
movieRouter.get('/genre/:genreName', movieController.getByGenreMoviesAndTv);

movieRouter.get('/tv/popular', movieController.getPopularTv);
movieRouter.get('/tv/new', movieController.getNewTv);
movieRouter.get('/tv/top10', movieController.getTop10Tv);
movieRouter.get('/tv/genre/:genreName', movieController.getByGenreTv);

movieRouter.get('/movie/popular', movieController.getPopularMovies);
movieRouter.get('/movie/new', movieController.getNewMovies);
movieRouter.get('/movie/top10', movieController.getTop10Movies);
movieRouter.get('/movie/genre/:genreName', movieController.getByGenreMovies);


module.exports = { movieRouter };
