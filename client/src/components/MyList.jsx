import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from './Header/Header';
import HomePageFooter from './HomePageFooter/HomePageFooter';
import Modal from './Modal/Modal'

function MyList() {
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

    const [profile, setProfile] = useState({});
    const [favorites, setFavorites] = useState([]);
    const [modalData, setModalData] = useState(null);
    const loader = useRef(null);

    useEffect(() => {
        const fetchProfile = async () => {
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
                console.error('Error fetching profile:', err);
            }
        };

        if (profileId) fetchProfile();
    }, [profileId, token, navigate]);

    const fetchFavorites = useCallback(async () => {
        try {
            const res = await fetch(`https://netflix-472l.onrender.com/api/profiles/favorites/${profileId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (res.status === 401 || res.status === 403) {
                navigate('/');
                return;
            }

            if (!res.ok) {
                throw new Error('Failed to fetch favorites');
            }

            const data = await res.json();
            setFavorites(data);
        } catch (err) {
            console.error('Error fetching favorites:', err);
        }
    }, [profileId, token, navigate]);

    useEffect(() => {
        fetchFavorites();
    }, [fetchFavorites]);

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

        } catch (err) {
            console.error('Error adding to favorites:', err);
        }
    };

    return (
        <div className="app">
            {profile.image && <Header image={profile.image} />}
            <main className="new-and-popular">
                <h1 className="page-title">FAVORITES</h1>
                {favorites.length === 0 ? (
                    <p className="no-favorites-message">No favorite movies.</p>
                ) : (
                    <div className="grid-container">
                        {favorites.map((item, index) => (
                            <div
                                className="movie-item"
                                key={`${item.id}_${item.poster}`}
                                onClick={() => handleShowModal(item)}
                                style={{ cursor: 'pointer' }}
                            >
                                <img
                                    src={`https://image.tmdb.org/t/p/w300${item.poster}`}
                                    alt={item.title || item.name}
                                />
                            </div>
                        ))}
                    </div>
                )}
                <div ref={loader} className="loading"></div>
            </main>
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
            <HomePageFooter />
        </div>
    );
}

export default MyList;
