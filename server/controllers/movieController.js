const API_KEY = process.env.API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

const movieController = {
    async getPopularMoviesAndTv(req, res) {
        try {
            const response = await fetch(`${BASE_URL}/trending/all/week?api_key=${API_KEY}`);
            const data = await response.json();
            res.json(data);
        } catch (err) {
            res.status(500).json({ message: 'Failed to fetch popular movies' });
        }
    },
    async getNewMoviesAndTv(req, res) {
        try {
            const [moviesRes, tvRes] = await Promise.all([
                fetch(`${BASE_URL}/movie/now_playing?api_key=${API_KEY}`),
                fetch(`${BASE_URL}/tv/on_the_air?api_key=${API_KEY}`)
            ]);

            const moviesData = await moviesRes.json();
            const tvData = await tvRes.json();

            const combined = [...moviesData.results, ...tvData.results];

            res.json({ results: combined });
        } catch (err) {
            res.status(500).json({ message: 'Failed to fetch new movies and tv shows' });
        }
    },
    async getTop10MoviesAndTv(req, res) {
        try {
            const [moviesRes, tvRes] = await Promise.all([
                fetch(`${BASE_URL}/movie/top_rated?api_key=${API_KEY}`),
                fetch(`${BASE_URL}/tv/top_rated?api_key=${API_KEY}`)
            ]);

            const moviesData = await moviesRes.json();
            const tvData = await tvRes.json();

            const combined = [...moviesData.results, ...tvData.results]
                .sort((a, b) => b.vote_average - a.vote_average)
                .slice(0, 10);

            res.json({ results: combined });
        } catch (err) {
            res.status(500).json({ message: 'Failed to fetch top 10 movies and tv shows' });
        }
    },
    async getByGenreMoviesAndTv(req, res) {
        try {
            const genreMap = {
                Animation: 16,
                Drama: 18,
            };

            const genreName = req.params.genreName;
            const genreId = genreMap[genreName];

            if (!genreId) {
                return res.status(400).json({ message: 'Unknown genre' });
            }

            const [moviesRes, tvRes] = await Promise.all([
                fetch(`${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreId}`),
                fetch(`${BASE_URL}/discover/tv?api_key=${API_KEY}&with_genres=${genreId}`)
            ]);

            const [moviesData, tvData] = await Promise.all([
                moviesRes.json(),
                tvRes.json()
            ]);

            const combined = [...moviesData.results, ...tvData.results].sort((a, b) => b.popularity - a.popularity);

            res.json({ results: combined });
        } catch (err) {
            res.status(500).json({ message: `Failed to fetch ${req.params.genreName}` });
        }
    }
};

module.exports = { movieController };
