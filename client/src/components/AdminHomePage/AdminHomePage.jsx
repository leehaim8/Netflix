import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminHomePage.css';

const initialState = {
    title: '',
    type: 'movie',
    overview: '',
    releaseDate: '',
    genres: '',
    backdropPath: '',
    posterPath: '',
    numberOfSeasons: '',
    voteAverage: '',
    popularity: '',
    originalLanguage: '',
    adult: false,
    tmdbId: '',
    tags: '',
    cast: '',
};

function AdminHomePage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState(initialState);

    const tokenFromCookie = document.cookie
        .split('; ')
        .find(row => row.startsWith('token='))
        ?.split('=')[1];

    const tokenFromSession = sessionStorage.getItem('token');
    const token = tokenFromCookie || tokenFromSession;

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:8080/api/media/addMedia', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Failed to add media');

            setFormData({
                title: '',
                type: '',
                overview: '',
                releaseDate: '',
                genres: '',
                backdropPath: '',
                posterPath: '',
                numberOfSeasons: '',
                voteAverage: '',
                popularity: '',
                originalLanguage: '',
                adult: false,
                tmdbId: '',
                tags: '',
                cast: ''
            });
            
        } catch (err) {
            console.error(err);
            alert(err.message || 'Something went wrong');
        }
    };

    const handleSignOut = () => {
        document.cookie = 'token=; path=/; max-age=0';
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('userId');
        navigate('/');
    };

    const handleReset = () => setFormData(initialState);

    return (
        <div className="admin-page-wrapper">
            <div className="header">
                <div className="logo"></div>
                <button className="logout-button" onClick={handleSignOut}>
                    Logout
                </button>
            </div>
            <div className="admin-container">
                <h2 className="admin-title">Add New Movie/Tv show</h2>
                <form onSubmit={handleSubmit} className="admin-form">
                    <div className="form-group">
                        <label>Title</label>
                        <input name="title" value={formData.title} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Type</label>
                        <select name="type" value={formData.type} onChange={handleChange}>
                            <option value="movie">Movie</option>
                            <option value="tv">TV Show</option>
                        </select>
                    </div>
                    <div className="form-group full-width">
                        <label>Overview</label>
                        <textarea name="overview" value={formData.overview} onChange={handleChange} rows={3} />
                    </div>
                    <div className="form-group">
                        <label>Release Date</label>
                        <input type="date" name="releaseDate" value={formData.releaseDate} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>Genres</label>
                        <input name="genres" value={formData.genres} onChange={handleChange} placeholder="Comedy, Drama..." />
                    </div>
                    <div className="form-group">
                        <label>Backdrop Image URL</label>
                        <input name="backdropPath" value={formData.backdropPath} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>Poster Image URL</label>
                        <input name="posterPath" value={formData.posterPath} onChange={handleChange} />
                    </div>
                    {formData.type === 'tv' && (
                        <div className="form-group">
                            <label>Number of Seasons</label>
                            <input name="numberOfSeasons" value={formData.numberOfSeasons} onChange={handleChange} />
                        </div>
                    )}
                    <div className="form-group">
                        <label>Rating</label>
                        <input name="voteAverage" value={formData.voteAverage} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>Popularity</label>
                        <input name="popularity" value={formData.popularity} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>Original Language</label>
                        <input name="originalLanguage" value={formData.originalLanguage} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>TMDB ID</label>
                        <input name="tmdbId" value={formData.tmdbId} onChange={handleChange} />
                    </div>
                    <div className="form-group full-width">
                        <label>Tags</label>
                        <input name="tags" value={formData.tags} onChange={handleChange} placeholder="Exciting, Feel-good..." />
                    </div>
                    <div className="form-group full-width">
                        <label>Cast</label>
                        <input name="cast" value={formData.cast} onChange={handleChange} placeholder="Actor 1, Actor 2..." />
                    </div>
                    <div className="form-actions">
                        <button type="button" onClick={handleReset}>Reset</button>
                        <button type="submit">Submit</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AdminHomePage;
