import React, { useEffect, useState } from 'react';
import './Row.css';

const Row = (props) => {
    const [movies, setMovies] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch(`http://localhost:8080${props.fetchUrl}`);
            const data = await res.json();
            setMovies(data.results);
        };
        fetchData();
    }, [props.fetchUrl]);
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