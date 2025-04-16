import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../Header/Header';
import HomePageFooter from '../HomePageFooter/HomePageFooter';
import CoverPhoto from '../CoverPhoto/CoverPhoto';
import Row from '../Row/Row';
import Modal from '../Model/Model';
import './HomePage.css';

function HomePage() {
    const location = useLocation();
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
                const res = await fetch(`http://localhost:8080/api/profiles/byId/${profileId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await res.json();
                setProfile(data);
            } catch (err) {
                console.error('Error fetching profiles:', err);
            }
        };

        if (profileId) {
            fetchProfiles();
        }
    }, [profileId, token]);

    const handleShowModal = (item) => {
        setModalData(item);
    };

    const handleCloseModal = () => {
        setModalData(null);
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
                    />
                )}
            </main>

            <HomePageFooter />
        </div>
    );
};

export default HomePage;
