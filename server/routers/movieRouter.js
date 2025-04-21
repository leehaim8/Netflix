const { Router } = require('express');
const { movieController } = require('../controllers/movieController');
const { authMiddleware } = require('../middleware/authMiddleware')

const movieRouter = new Router();

movieRouter.get('/popular', authMiddleware.authToken, authMiddleware.authRole("user"), movieController.getPopularMoviesAndTv);
movieRouter.get('/new', authMiddleware.authToken, authMiddleware.authRole("user"), movieController.getNewMoviesAndTv);
movieRouter.get('/top10', authMiddleware.authToken, authMiddleware.authRole("user"), movieController.getTop10MoviesAndTv);
movieRouter.get('/genre/:genreName', authMiddleware.authToken, authMiddleware.authRole("user"), movieController.getByGenreMoviesAndTv);

movieRouter.get('/tv/popular', authMiddleware.authToken, authMiddleware.authRole("user"), movieController.getPopularTv);
movieRouter.get('/tv/new', authMiddleware.authToken, authMiddleware.authRole("user"), movieController.getNewTv);
movieRouter.get('/tv/top10', authMiddleware.authToken, authMiddleware.authRole("user"), movieController.getTop10Tv);
movieRouter.get('/tv/genre/:genreName', authMiddleware.authToken, authMiddleware.authRole("user"), movieController.getByGenreTv);

movieRouter.get('/movie/popular', authMiddleware.authToken, authMiddleware.authRole("user"), movieController.getPopularMovies);
movieRouter.get('/movie/new', authMiddleware.authToken, authMiddleware.authRole("user"), movieController.getNewMovies);
movieRouter.get('/movie/top10', authMiddleware.authToken, authMiddleware.authRole("user"), movieController.getTop10Movies);
movieRouter.get('/movie/genre/:genreName', authMiddleware.authToken, authMiddleware.authRole("user"), movieController.getByGenreMovies);

movieRouter.get('/popularAndNew', authMiddleware.authToken, authMiddleware.authRole("user"), movieController.getAllPopularAndNew);
movieRouter.get('/byId/:id', authMiddleware.authToken, authMiddleware.authRole("user"), movieController.getMovieAndTvById);

module.exports = { movieRouter };
