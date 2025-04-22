import React, { useState } from 'react';
import './Header.css';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { useNavigate, useLocation } from 'react-router-dom';

function Header(props) {
    const location = useLocation();
    const pathSegments = location.pathname.split('/');
    const profileId = pathSegments[pathSegments.length - 1];
    const [showDropdown, setShowDropdown] = useState(false);
    const navigate = useNavigate();
    const userId = sessionStorage.getItem("userId");

    const navLinks = [
        { label: 'Home', path: `/homepage/${profileId}` },
        { label: 'TV Shows', path: `/tvShows/${profileId}` },
        { label: 'Movies', path: `/movies/${profileId}` },
        { label: 'New & Popular', path: `/newAndPopular/${profileId}` },
        { label: 'My List', path: `/myList/${profileId}` },
        { label: 'Browse' },
    ];

    const handleProfileClick = () => {
        setShowDropdown(prev => !prev);
    };

    const handleSignOut = () => {
        document.cookie = 'token=; path=/; max-age=0';
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('userId');
        navigate('/');
    };

    return (
        <nav>
            <div className="header-navbar-left">
                <div className="header-logo" onClick={() => navigate('/home')}></div>
                <ul className="header-nav-links">
                    {navLinks.map((link,index) => (
                        <li
                            key={index}
                            className={location.pathname === link.path ? 'header-active' : ''}
                            onClick={() => navigate(link.path)}
                        >
                            {link.label}
                        </li>
                    ))}
                </ul>
            </div>
            <div className="header-navbar-right">
                <SearchIcon className="header-icon" />
                <NotificationsNoneIcon className="header-icon" />
                <div className="header-profile" onClick={handleProfileClick}>
                    <img
                        src={`http://localhost:8080/Public/${props.image}`}
                        alt="Profile"
                        className="header-avatar-profile"
                    />
                    <ArrowDropDownIcon className="header-dropdown-icon" />
                    {showDropdown && (
                        <div className="header-dropdown-menu">
                            <p onClick={() => navigate(`/userprofile/${userId}`)}>Manage Profiles</p>
                            <p onClick={handleSignOut}>Sign out</p>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Header;
