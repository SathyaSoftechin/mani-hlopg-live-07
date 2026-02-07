import React from "react";
import "./Footer.css";
import {
  FaGooglePlay,
  FaApple,
  FaFacebookF,
  FaInstagram,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import logo from "../assets/logo.png";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        
        {/* ========== TOP ROW: Logo + Social Media ========== */}
        <div className="top-row">
          {/* Logo on LEFT */}
          <div className="footer-logo">
            <img src={logo} alt="Hlo PG Logo" />
            <h2>HloPG</h2>
          </div>
          
          {/* Social Media on RIGHT - WHITE ICONS */}
          <div className="footer-socials">
            <p className="socialmedia">Follow Us</p>
            <div className="social-icons">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                <FaFacebookF />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <FaInstagram />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <FaXTwitter />
              </a>
            </div>
          </div>
        </div>

        {/* ========== CONTENT ROW - ALL SECTIONS TOP ALIGNED ========== */}
        <div className="content-row">
          {/* Left Section - Description */}
          <div className="footer-left">
            <p className="footer-description">
              HLOPG helps you find well-maintained and comfortable PG hostels with ease.  
              We provide verified options to ensure a safe and hassle-free stay
            </p>
          </div>

          {/* Middle Sections - Links */}
          <div className="footer-links">
            {/* Top Cities Column */}
            <div>
              <h4>Top Cities</h4>
              <ul>
                <li>Hyderabad</li>
                <li>Chennai</li>
                <li>Bangalore</li>
                <li>Delhi</li>
                <li>Mumbai</li>
              </ul>
            </div>

            {/* Quick Links Column */}
            <div>
              <h4>Quick Links</h4>
              <ul>
                <li>About</li>
                <li>Contact</li>
                <li>FAQ's</li>
                <li>Privacy Policy</li>
                <li>Terms & Conditions</li>
              </ul>
            </div>

            {/* Contact Us Column */}
            <div>
              <h4>Contact Us</h4>
              <ul>
                <li>example@hlopg.com</li>
                <li>(123) 456-7890</li>
                <li>Get the app</li>
              </ul>
            </div>
          </div>

          {/* Right Section - Get the App */}
          <div className="footer-right">
            <h4>Get the app</h4>
            <div className="store-buttons">
              <a
                href="https://www.apple.com/in/app-store/"
                target="_blank"
                rel="noopener noreferrer"
                className="store-btn"
              >
                <FaApple /> Download on the<strong>Apple Store</strong>
              </a>
              <a
                href="https://play.google.com/store"
                target="_blank"
                rel="noopener noreferrer"
                className="store-btn"
              >
                <FaGooglePlay /> Get it on <strong>Google Play Store</strong>
              </a>
            </div>
            {/* <p className="store-text">
              For better experience, download the Hlopg app now
            </p> */}
          </div>
        </div>
      </div>

      {/* ========== BOTTOM SECTION ========== */}
      <div className="footer-bottom">
        <p>
          Copyright © 2026, hlopg.in All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;