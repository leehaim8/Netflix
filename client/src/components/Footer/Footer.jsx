import React from "react";
import "./Footer.css";

function Footer() {
    const links = [
        "FAQ",
        "Help Center",
        "Netflix Shop",
        "Terms of Use",
        "Privacy",
        "Cookie Preferences",
        "Corporate Information",
        "Do Not Sell or Share My Personal Information",
        "Ad Choices",
    ];

    return (
        <footer >
            <div className="footer-top">
                <p>Questions? Call <span className="phone-number">1-844-505-2993</span></p>
            </div>

            <div className="footer-links">
                {links.map((text, index) => (
                    <span key={index} className="footer-link">{text}</span>
                ))}
            </div>

            <div className="footer-bottom">
                <select className="language-select">
                    <option>English</option>
                </select>
            </div>
        </footer>
    );
};

export default Footer;
