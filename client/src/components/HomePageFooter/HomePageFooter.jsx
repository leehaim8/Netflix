import React from 'react';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import YouTubeIcon from '@mui/icons-material/YouTube';

import './HomePageFooter.css';

function HomePageFooter() {
    const links = [
        "Audio Description",
        "Help Center",
        "Gift Cards",
        "Media Center",
        "Investor Relations",
        "Jobs",
        "Netflix Shop",
        "Terms of Use",
        "Privacy",
        "Legal Notices",
        "Cookie Preferences",
        "Corporate Information",
        "Contact Us",
        "Do Not Sell or Share My Personal Information",
        "Ad Choices",
    ];

    return (
        <footer className="homepage-footer">
            <div className="homepage-footer-icons">
                <FacebookIcon />
                <InstagramIcon />
                <TwitterIcon />
                <YouTubeIcon />
            </div>
            <div className="homepage-footer-links">
                {links.map((text, index) => (
                    <span key={index} className="homepage-footer-link">{text}</span>
                ))}
            </div>
            <div className="homepage-footer-bottom">
                <button className="homepage-footer-service-code">Service Code</button>
                <p className="homepage-footer-copyright">
                    © 1997 - 2024 Netflix, Inc.
                </p>
            </div>
        </footer>
    );
};

export default HomePageFooter;
