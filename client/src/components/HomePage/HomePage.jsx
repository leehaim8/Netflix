import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../Header/Header';
import HomePageFooter from '../HomePageFooter/HomePageFooter';
import CoverPhoto from '../CoverPhoto/CoverPhoto';
import Row from '../Row/Row';
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


    return (
        <div className="app">
            {profile.image && <Header image={profile.image} />}

            <main className="main-content">
                <CoverPhoto fetchUrl="api/moviesAndTv/popular"  />
                <Row title="New on Netflix" fetchUrl="/api/moviesAndTv/new" />
                <Row title="Top 10 movies and Tv in the U.S. Today" fetchUrl="/api/moviesAndTv/top10"  />
                <Row title="Animation" fetchUrl="/api/moviesAndTv/genre/Animation"  />
                <Row title="Drama" fetchUrl="/api/moviesAndTv/genre/Drama"  />

            </main>

            <HomePageFooter />
        </div>
    );
};

export default HomePage;
