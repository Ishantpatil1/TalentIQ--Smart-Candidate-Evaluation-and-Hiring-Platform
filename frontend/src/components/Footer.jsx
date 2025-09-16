import React from 'react';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="bg-dark text-white text-center py-4 ">
            <div className="container">
                <p>&copy; {new Date().getFullYear()} TalentIQ. All Rights Reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;

