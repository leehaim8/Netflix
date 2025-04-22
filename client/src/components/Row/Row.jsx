import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Row.css';

const Row = (props) => {
    const navigate = useNavigate();
    const [movies, setMovies] = useState([]);

    const tokenFromCookie = document.cookie
        .split('; ')
        .find(row => row.startsWith('token='))
        ?.split('=')[1];

    const tokenFromSession = sessionStorage.getItem('token');
    const token = tokenFromCookie || tokenFromSession;

    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch(`https://netflix-472l.onrender.com${props.fetchUrl}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await res.json();

            if (res.status === 401 || res.status === 403) {
                navigate('/');
                return;
            }

            setMovies(data.results);
        };
        fetchData();
    }, [props.fetchUrl, token, navigate]);
    const isTop10 = props.title.includes("Top 10");

    return (
        <div className="row">
            <h2>{props.title}</h2>
            <div className={`row-posters ${isTop10 ? 'top10-row' : ''}`}>
                {movies.map((movie, index) => (
                    <div className={`poster-wrapper ${isTop10 ? 'top10-wrapper' : ''}`} key={index}>
                        {isTop10 && <div className="top10-number">{index + 1}</div>}
                        <img
                            className={`row-poster ${isTop10 ? 'top10-poster' : ''}`}
                            src={
                                movie.poster_path
                                    ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
                                    : movie.poster?.startsWith('http')
                                        ? movie.poster
                                        : `${movie.poster?.replace(/^\/?/, '')}`
                            }
                            alt={movie.name || movie.title}
                            onClick={() => props.onItemClick(movie)}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Row;