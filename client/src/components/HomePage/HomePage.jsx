import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../Header/Header';
import HomePageFooter from '../HomePageFooter/HomePageFooter';
import CoverPhoto from '../CoverPhoto/CoverPhoto';
import Row from '../Row/Row';
import Modal from '../Modal/Modal';
import './HomePage.css';

function HomePage() {
    const location = useLocation();
    const navigate = useNavigate();
    const pathSegments = location.pathname.split('/');
    const profileId = pathSegments[pathSegments.length - 1];

    const tokenFromCookie = document.cookie
        .split('; ')
        .find(row => row.startsWith('token='))
        ?.split('=')[1];

    const tokenFromSession = sessionStorage.getItem('token');
    const token = tokenFromCookie || tokenFromSession;

    const [modalData, setModalData] = useState(null);
    const [profile, setProfile] = useState([]);

    useEffect(() => {
        const fetchProfiles = async () => {
            try {
                const res = await fetch(`https://netflix-472l.onrender.com/api/profiles/byId/${profileId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (res.status === 401 || res.status === 403) {
                    navigate('/');
                    return;
                }

                const data = await res.json();
                setProfile(data);
            } catch (err) {
                console.error('Error fetching profiles:', err);
            }
        };

        if (profileId) {
            fetchProfiles();
        }
    }, [profileId, token, navigate]);

    const handleShowModal = (item) => {
        setModalData(item);
    };

    const handleCloseModal = () => {
        setModalData(null);
    };

    const handleAddToFavorites = async (item) => {
        const { id, name, title, original_title, poster_path } = item;
        const favorite = {
            id,
            title: name || title || original_title || 'Unknown Title',
            poster: `https://image.tmdb.org/t/p/w500${poster_path}`
        };

        try {
            const res = await fetch(`https://netflix-472l.onrender.com/api/profiles/addFavorite/${profileId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(favorite)
            });

            if (res.status === 401 || res.status === 403) {
                navigate('/');
                return;
            }

            if (!res.ok) {
                throw new Error('Failed to add favorite');
            }

            const result = await res.json();
            console.log('Favorite added:', result);
        } catch (err) {
            console.error('Error adding to favorites:', err);
        }
    };

    return (
        <div className="app">
            {profile.image && <Header image={profile.image} />}
            <main className="main-content">
                <CoverPhoto fetchUrl="api/moviesAndTv/popular" onMoreInfo={handleShowModal} />
                <Row title="New on Netflix" fetchUrl="/api/moviesAndTv/new" onItemClick={handleShowModal} />
                <Row title="Top 10 movies and Tv in the U.S. Today" fetchUrl="/api/moviesAndTv/top10" onItemClick={handleShowModal} />
                <Row title="Animation" fetchUrl="/api/moviesAndTv/genre/Animation" onItemClick={handleShowModal} />
                <Row title="Drama" fetchUrl="/api/moviesAndTv/genre/Drama" onItemClick={handleShowModal} />
                {modalData && (
                    <Modal
                        modalData={modalData}
                        onClose={handleCloseModal}
                        onReviewClick={() => {
                            window.location.href = `/review/${profileId}/${modalData.id}`;
                        }}
                        onAddToWatchlist={() => handleAddToFavorites(modalData)}
                    />
                )}
            </main>
            <HomePageFooter />
        </div>
    );
};

export default HomePage;
