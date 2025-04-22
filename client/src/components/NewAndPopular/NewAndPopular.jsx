import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../Header/Header';
import HomePageFooter from '../HomePageFooter/HomePageFooter';
import Modal from '../Modal/Modal';
import './NewAndPopular.css';

function NewAndPopular() {
    const navigate = useNavigate();
    const location = useLocation();
    const profileId = location.pathname.split('/').pop();

    const token =
        document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1] ||
        sessionStorage.getItem('token');

    const [profile, setProfile] = useState(null);
    const [mediaList, setMediaList] = useState([]);
    const [mediaIds, setMediaIds] = useState(new Set());
    const [pageNumber, setPageNumber] = useState(1);
    const [hasMoreItems, setHasMoreItems] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [modalData, setModalData] = useState(null);

    const loaderRef = useRef(null);

    const handleShowModal = (item) => {
        setModalData(item);
    };

    const handleCloseModal = () => {
        setModalData(null);
    };

    useEffect(() => {
        const getProfile = async () => {
            try {
                const res = await fetch(`https://netflix-472l.onrender.com/api/profiles/byId/${profileId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (!res.ok) throw new Error('Failed to fetch profile');
                const data = await res.json();
                setProfile(data);
            } catch (err) {
                console.error('Error fetching profile:', err);
            }
        };

        if (profileId && token) getProfile();
    }, [profileId, token]);

    const loadMoreItems = useCallback(async () => {
        if (isLoading || !token || !hasMoreItems) return;

        setIsLoading(true);
        try {
            const res = await fetch(`https://netflix-472l.onrender.com/api/moviesAndTv/popularAndNew?page=${pageNumber}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.status === 401 || res.status === 403) {
                navigate('/');
                return;
            }

            const data = await res.json();
            const newResults = data?.results || [];

            if (newResults.length === 0) {
                setHasMoreItems(false);
                return;
            }

            const filteredNew = newResults.filter(item => {
                const key = `${item.id}_${item.media_type}`;
                return !mediaIds.has(key);
            });

            if (filteredNew.length === 0) {
                setHasMoreItems(false);
                return;
            }

            setMediaList(prev => [...prev, ...filteredNew]);

            setMediaIds(prev => {
                const updated = new Set(prev);
                filteredNew.forEach(item => updated.add(`${item.id}_${item.media_type}`));
                return updated;
            });

            setPageNumber(prev => prev + 1);
        } catch (err) {
            console.error('Error loading media items:', err);
        } finally {
            setIsLoading(false);
        }
    }, [isLoading, token, pageNumber, hasMoreItems, mediaIds, navigate]);

    useEffect(() => {
        if (profile && mediaList.length === 0) {
            loadMoreItems();
        }
    }, [profile, mediaList.length, loadMoreItems]);

    useEffect(() => {
        const observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                loadMoreItems();
            }
        });

        const current = loaderRef.current;
        if (current) observer.observe(current);

        return () => {
            if (current) observer.unobserve(current);
        };
    }, [loadMoreItems]);

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
            {profile?.image && <Header image={profile.image} />}
            <main className="new-and-popular">
                <h1 className="page-title white-title">NEW & POPULAR</h1>
                <div className="grid-container">
                    {mediaList.map(item => (
                        <div
                            className="movie-item"
                            key={`${item.id}_${item.media_type}`}
                            onClick={() => handleShowModal(item)}
                            style={{ cursor: 'pointer' }}
                        >
                            <img
                                src={`https://image.tmdb.org/t/p/w300${item.poster_path}`}
                                alt={item.title || item.name}
                            />
                        </div>
                    ))}
                </div>
                {hasMoreItems && <div ref={loaderRef} className="loading"></div>}
                {!hasMoreItems && <p className="no-more"></p>}
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

export default NewAndPopular;
