const API_KEY = process.env.API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';
const Media = require("../models/mediaModel");

const movieController = {
    async getMovieAndTvById(req, res) {
        const { id } = req.params;
        const { name } = req.query;
        const checkNameMatch = (tmdbData) => {
            const tmdbName = tmdbData.title || tmdbData.name || '';
            return tmdbName.toLowerCase() === name.toLowerCase();
        };

        try {
            let response = await fetch(`${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=en-US&append_to_response=credits`);
            if (response.ok) {
                const data = await response.json();
                if (checkNameMatch(data)) {
                    return res.json(data);
                }
            }

            response = await fetch(`${BASE_URL}/tv/${id}?api_key=${API_KEY}&language=en-US&append_to_response=credits`);
            if (response.ok) {
                const data = await response.json();
                if (checkNameMatch(data)) {
                    return res.json(data);
                }
            }

            const media = await Media.findOne({ id });
            if (media) {
                return res.json(media);
            }

            return res.status(404).json({ error: 'No matching movie or tv show found with that ID and name' });

        } catch (error) {
            console.error('Error fetching from TMDB:', error);
            res.status(500).json({ error: 'Server error while fetching data' });
        }
    },
    async getPopularMoviesAndTv(req, res) {
        try {
            const tmdbResponse = await fetch(`${BASE_URL}/trending/all/week?api_key=${API_KEY}`);
            const tmdbData = await tmdbResponse.json();
            const tmdbResults = tmdbData.results || [];

            const dbResults = await Media.find({});

            const allMedia = [
                ...tmdbResults.map(item => ({
                    ...item,
                    releaseDate: item.release_date || item.first_air_date || '0000-00-00'
                })),
                ...dbResults.map(item => ({
                    ...item.toObject(),
                    releaseDate: item.release_date || '0000-00-00'
                }))
            ];

            const sorted = allMedia.sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));

            res.json(sorted.slice(0, 4));

        } catch (err) {
            console.error('Error fetching popular content:', err);
            res.status(500).json({ message: 'Failed to fetch popular content' });
        }
    },
    async getNewMoviesAndTv(req, res) {
        try {
            const [moviesRes, tvRes, dbItems] = await Promise.all([
                fetch(`${BASE_URL}/movie/now_playing?api_key=${API_KEY}`),
                fetch(`${BASE_URL}/tv/on_the_air?api_key=${API_KEY}`),
                Media.find({})
            ]);

            const moviesData = await moviesRes.json();
            const tvData = await tvRes.json();

            const tmdbItems = [...moviesData.results, ...tvData.results]

            const combined = [...tmdbItems]
                .sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime())

            res.json({ results: combined });
        } catch (err) {
            console.error('Error in getNewMoviesAndTv:', err);
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
            const genreMap = { Animation: 16, Drama: 18 };
            const genreName = req.params.genreName;
            const genreId = genreMap[genreName];
            if (!genreId) return res.status(400).json({ message: 'Unknown genre' });

            const [moviesRes, tvRes, dbResults] = await Promise.all([
                fetch(`${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreId}`),
                fetch(`${BASE_URL}/discover/tv?api_key=${API_KEY}&with_genres=${genreId}`),
                Media.find({ genres: genreName })
            ]);

            const [moviesData, tvData] = await Promise.all([
                moviesRes.json(),
                tvRes.json()
            ]);

            const combined = [
                ...(Array.isArray(moviesData.results) ? moviesData.results : []),
                ...(Array.isArray(tvData.results) ? tvData.results : []),
                ...(Array.isArray(dbResults) ? dbResults : [])
            ];

            res.json({ results: combined });
        } catch (err) {
            res.status(500).json({ message: `Failed to fetch ${req.params.genreName}` });
        }
    },
    async getPopularTv(req, res) {
        try {
            const [apiRes, dbResults] = await Promise.all([
                fetch(`${BASE_URL}/trending/tv/week?api_key=${API_KEY}`),
                Media.find({ media_type: 'tv' })
            ]);
            const apiData = await apiRes.json();
            const combined = [
                ...(Array.isArray(apiData.results) ? apiData.results : []),
                ...(Array.isArray(dbResults) ? dbResults : [])
            ];
            res.json(combined.slice(0, 4));
        } catch (err) {
            res.status(500).json({ message: 'Failed to fetch popular TV shows' });
        }
    },
    async getNewTv(req, res) {
        try {
            const [apiRes, dbResults] = await Promise.all([
                fetch(`${BASE_URL}/tv/on_the_air?api_key=${API_KEY}`),
                Media.find({ media_type: 'tv' })
            ]);
            const apiData = await apiRes.json();
            const combined = [
                ...(Array.isArray(apiData.results) ? apiData.results : []),
                ...(Array.isArray(dbResults) ? dbResults : [])
            ];
            res.json({ results: combined });
        } catch (err) {
            res.status(500).json({ message: 'Failed to fetch new TV shows' });
        }
    },
    async getTop10Tv(req, res) {
        try {
            const response = await fetch(`${BASE_URL}/tv/top_rated?api_key=${API_KEY}`);
            const data = await response.json();
            const top10 = data.results.sort((a, b) => b.vote_average - a.vote_average).slice(0, 10);
            res.json({ results: top10 });
        } catch (err) {
            res.status(500).json({ message: 'Failed to fetch top 10 TV shows' });
        }
    },
    async getByGenreTv(req, res) {
        try {
            const genreMap = { Animation: 16, Drama: 18 };
            const genreName = req.params.genreName;
            const genreId = genreMap[genreName];
            if (!genreId) return res.status(400).json({ message: 'Unknown genre' });

            const [apiRes, dbResults] = await Promise.all([
                fetch(`${BASE_URL}/discover/tv?api_key=${API_KEY}&with_genres=${genreId}`),
                Media.find({ media_type: 'tv', genres: genreName })
            ]);

            const apiData = await apiRes.json();
            const combined = [
                ...(Array.isArray(apiData.results) ? apiData.results : []),
                ...(Array.isArray(dbResults) ? dbResults : [])
            ];

            res.json({ results: combined });
        } catch (err) {
            res.status(500).json({ message: `Failed to fetch ${req.params.genreName} TV shows` });
        }
    },
    async getPopularMovies(req, res) {
        try {
            const [apiRes, dbResults] = await Promise.all([
                fetch(`${BASE_URL}/trending/movie/week?api_key=${API_KEY}`),
                Media.find({ media_type: 'movie' })
            ]);

            const apiData = await apiRes.json();
            const combined = [
                ...(Array.isArray(apiData.results) ? apiData.results : []),
                ...(Array.isArray(dbResults) ? dbResults : [])
            ];

            res.json(combined.slice(0, 4));
        } catch (err) {
            res.status(500).json({ message: 'Failed to fetch popular movies' });
        }
    },
    async getNewMovies(req, res) {
        try {
            const [apiRes, dbResults] = await Promise.all([
                fetch(`${BASE_URL}/movie/now_playing?api_key=${API_KEY}`),
                Media.find({ media_type: 'movie' })
            ]);

            const apiData = await apiRes.json();
            const combined = [
                ...(Array.isArray(apiData.results) ? apiData.results : []),
                ...(Array.isArray(dbResults) ? dbResults : [])
            ];

            res.json({ results: combined });
        } catch (err) {
            res.status(500).json({ message: 'Failed to fetch new movies' });
        }
    },
    async getTop10Movies(req, res) {
        try {
            const response = await fetch(`${BASE_URL}/movie/top_rated?api_key=${API_KEY}`);
            const data = await response.json();
            const top10 = data.results.sort((a, b) => b.vote_average - a.vote_average).slice(0, 10);
            res.json({ results: top10 });
        } catch (err) {
            res.status(500).json({ message: 'Failed to fetch top 10 movies' });
        }
    },
    async getByGenreMovies(req, res) {
        try {
            const genreMap = { Animation: 16, Drama: 18 };
            const genreName = req.params.genreName;
            const genreId = genreMap[genreName];
            if (!genreId) return res.status(400).json({ message: 'Unknown genre' });

            const [apiRes, dbResults] = await Promise.all([
                fetch(`${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreId}`),
                Media.find({ media_type: 'movie', genres: genreName })
            ]);

            const apiData = await apiRes.json();
            const combined = [
                ...(Array.isArray(apiData.results) ? apiData.results : []),
                ...(Array.isArray(dbResults) ? dbResults : [])
            ]

            res.json({ results: combined });
        } catch (err) {
            res.status(500).json({ message: `Failed to fetch ${req.params.genreName} movies` });
        }
    },
    async getAllPopularAndNew(req, res) {
        const page = req.query.page || 1;

        try {
            const [popularRes, newMoviesRes, newTvRes] = await Promise.all([
                fetch(`${BASE_URL}/trending/all/week?api_key=${API_KEY}&page=${page}`),
                fetch(`${BASE_URL}/movie/now_playing?api_key=${API_KEY}&page=${page}`),
                fetch(`${BASE_URL}/tv/on_the_air?api_key=${API_KEY}&page=${page}`)
            ]);

            const [popularData, newMoviesData, newTvData] = await Promise.all([
                popularRes.json(),
                newMoviesRes.json(),
                newTvRes.json()
            ]);

            const dbMedia = await Media.find();

            const allItems = [
                ...(popularData.results || []).map(item => ({ ...item, media_type: item.media_type || (item.title ? 'movie' : 'tv') })),
                ...(newMoviesData.results || []).map(item => ({ ...item, media_type: 'movie' })),
                ...(newTvData.results || []).map(item => ({ ...item, media_type: 'tv' })),
                ...dbMedia.map(item => ({ ...item.toObject() })),
            ];

            const seen = new Set();
            const combined = [];

            for (const item of allItems) {
                if (!item.id || !item.media_type) continue;
                const key = `${item.id}_${item.media_type}`;
                if (seen.has(key)) continue;
                seen.add(key);
                combined.push(item);
            }

            const sorted = combined.filter(item => item.popularity !== undefined).sort((a, b) => b.popularity - a.popularity);
            const totalPages = Math.max(
                popularData.total_pages || 1,
                newMoviesData.total_pages || 1,
                newTvData.total_pages || 1
            );

            res.json({ results: sorted, totalPages });
        } catch (err) {
            console.error('API error:', err);
            res.status(500).json({ message: 'Failed to fetch combined popular and new content' });
        }
    }
};

module.exports = { movieController };
