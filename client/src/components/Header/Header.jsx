import React, { useState } from 'react';
import './Header.css';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { useNavigate } from 'react-router-dom';

function Header(props) {
    const [showDropdown, setShowDropdown] = useState(false);
    const navigate = useNavigate();

    const handleProfileClick = () => {
        setShowDropdown((prev) => !prev);
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
                <div className="header-logo"></div>
                <ul className="header-nav-links">
                    <li className="header-active">Home</li>
                    <li>TV Shows</li>
                    <li>Movies</li>
                    <li>New & Popular</li>
                    <li>My List</li>
                    <li>Browse</li>
                </ul>
            </div>
            <div className="header-navbar-right">
                <SearchIcon className="header-icon" />
                <NotificationsNoneIcon className="header-icon" />
                <div className="header-profile" onClick={handleProfileClick}>
                    <img src={`http://localhost:8080/Public/${props.image}`} alt="Profile" className="header-avatar-profile" />
                    <ArrowDropDownIcon className="header-dropdown-icon" />
                    {showDropdown && (
                        <div className="header-dropdown-menu">
                            <p>Manage Profiles</p>
                            <p>Account</p>
                            <p>Help Center</p>
                            <p onClick={handleSignOut}>Sign out</p>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Header;
