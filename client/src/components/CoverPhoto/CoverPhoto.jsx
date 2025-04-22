import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InfoOutlineIcon from '@mui/icons-material/InfoOutline';
import './CoverPhoto.css';

function CoverPhoto(props) {
  const navigate = useNavigate();
  const [CoverPhoto, setCoverPhotos] = useState([]);
  const [current, setCurrent] = useState(0);

  const tokenFromCookie = document.cookie
    .split('; ')
    .find(row => row.startsWith('token='))
    ?.split('=')[1];

  const tokenFromSession = sessionStorage.getItem('token');
  const token = tokenFromCookie || tokenFromSession;

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`https://netflix-472l.onrender.com/${props.fetchUrl}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (res.status === 401 || res.status === 403) {
        navigate('/');
        return;
      }

      const data = await res.json();
      setCoverPhotos(data);
    };

    fetchData();
  }, [props.fetchUrl, token, navigate]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % 4);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  if (!CoverPhoto.length) return null;

  const movie = CoverPhoto[current];
  const formattedTitle = (movie.title || movie.name || '').split(' ').join('\n');

  return (
    <header
      className="cover-photo"
      style={{
        backgroundSize: 'cover',
        backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
        backgroundPosition: 'center center',
      }}
    >
      <div className="cover-photo-contents">
        <div className="netflix-title">
          <span className="n-letter">N</span><span className="rest-title"> SERIES</span>
        </div>
        <h1 className="cover-photo-title">{formattedTitle}</h1>
        <p className="cover-photo-description">{movie.overview}</p>
        <button className="cover-photo-button" onClick={() => props.onMoreInfo(movie)}>
          <InfoOutlineIcon />
          <p>More info</p>
        </button>
      </div>
      <div className="cover-photo-fadeBottom" />
    </header>
  );
};

export default CoverPhoto;
