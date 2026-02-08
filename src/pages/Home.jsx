import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import {
  FaHeart,
  FaStar,
  FaBed,
  FaUtensils,
  FaBroom,
  FaShower,
  FaChevronLeft,
  FaChevronRight,
  FaWifi,
  FaCar,
  FaTv,
  FaSnowflake,
  FaUserFriends,
  FaHome,
  FaDumbbell,
  FaFan,
  FaLightbulb,
  FaChair,
} from "react-icons/fa";
import api from "../api";
import defaultPGImg from "../assets/pg1.jpg";
import hyderabadBg from "../assets/hyderabad.png";
import chennaiBg from "../assets/chennai.png";
import mumbaiBg from "../assets/mumbai.png";
import bangaloreBg from "../assets/bangalore.png";
import logo from "../assets/logo.png";
import AuthModal from "./AuthModal";

const PLAYSTORE_LINK = "https://play.google.com/";
const APPSTORE_LINK = "https://www.apple.com/app-store/";

function Home() {
  const navigate = useNavigate();
  const pgRefs = useRef([]);
  const [arrowVisibility, setArrowVisibility] = useState([]);
  const [hostels, setHostels] = useState([]);
  const [likedPgIds, setLikedPgIds] = useState([]);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [selectedHostelId, setSelectedHostelId] = useState(null);
  const [authType, setAuthType] = useState("login");
  const [showPopup, setShowPopup] = useState(false);

  /* ---------------------------------------------------- */
  /* IMAGE URL FIX – PREVENT BROKEN / BLANK IMAGES */
  /* ---------------------------------------------------- */
  const getFullImageUrl = (img) => {
    if (!img) return defaultPGImg;
    if (img.startsWith("http")) return img;
    if (img.startsWith("/uploads")) return `https://hlopg.com${img}`;
    return `https://hlopg.com/uploads/${img}`;
  };

  /* ---------------------------------------------------- */
  /* SAFE FACILITY NORMALIZER – PREVENT BLANK PAGE */
  /* ---------------------------------------------------- */
  const normalizeFacilities = (data) => {
    if (!data) return [];
    try {
      const obj = typeof data === "string" ? JSON.parse(data) : data;
      return Object.entries(obj)
        .filter(([_, v]) => v === true)
        .map(([k]) => k);
    } catch {
      return [];
    }
  };

  const getFacilityIcon = (key) => {
    const icons = {
      wifi: <FaWifi />,
      parking: <FaCar />,
      ac: <FaSnowflake />,
      tv: <FaTv />,
      gym: <FaDumbbell />,
      geyser: <FaShower />,
      fan: <FaFan />,
      bed: <FaBed />,
      lights: <FaLightbulb />,
      cupboard: <FaChair />,
      food: <FaUtensils />,
      water: <FaShower />,
      clean: <FaBroom />,
    };
    return icons[key] || <FaHome />;
  };

  /* ---------------------------------------------------- */
  /* FETCH HOSTELS – API UNCHANGED */
  /* ---------------------------------------------------- */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/hostel/gethostels");
        if (res.data?.success && Array.isArray(res.data.hostels)) {
          setHostels(
            res.data.hostels.map((h) => ({
              ...h,
              id: h.hostel_id || h.id,
              img: getFullImageUrl(h.displayImage || h.img),
            }))
          );
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchData();
  }, []);

  /* ---------------------------------------------------- */
  /* CITIES */
  /* ---------------------------------------------------- */
  const cities = [
    { name: "Hyderabad", bg: hyderabadBg },
    { name: "Chennai", bg: chennaiBg },
    { name: "Mumbai", bg: mumbaiBg },
    { name: "Bangalore", bg: bangaloreBg },
  ];

  const cityHostels = (city) =>
    hostels.filter((h) =>
      h.city?.toLowerCase().includes(city.toLowerCase())
    );

  /* ---------------------------------------------------- */
  /* POPUP */
  /* ---------------------------------------------------- */
  useEffect(() => {
    const t = setTimeout(() => {
      document.body.classList.add("no-scroll");
      setShowPopup(true);
    }, 5000);
    return () => clearTimeout(t);
  }, []);

  const closePopup = () => {
    setShowPopup(false);
    document.body.classList.remove("no-scroll");
  };

  /* ---------------------------------------------------- */
  /* LIKE HANDLER – API UNCHANGED */
  /* ---------------------------------------------------- */
  const toggleLike = async (pg, e) => {
    e.stopPropagation();
    const token = localStorage.getItem("hlopgToken");
    if (!token) {
      setSelectedHostelId(pg.id);
      setShowAuthModal(true);
      return;
    }
    await api.post(
      "/hostel/like-hostel",
      { hostel_id: pg.id },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setLikedPgIds((p) =>
      p.includes(pg.id) ? p.filter((id) => id !== pg.id) : [...p, pg.id]
    );
  };

  /* ---------------------------------------------------- */
  /* RENDER */
  /* ---------------------------------------------------- */
  return (
    <div className="home">
      {/* APP POPUP */}
      {showPopup && (
        <div className="app-popup-overlay">
          <div className="app-popup-card">
            <button className="popup-close" onClick={closePopup}>✕</button>
            <img src={logo} className="popup-app-img" alt="logo" />
            <h2>Download <span className="brand-text">HLOPG</span></h2>
            <p>Find hostels faster & smarter</p>
            <div className="popup-buttons">
              <a href={PLAYSTORE_LINK}><img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" /></a>
              <a href={APPSTORE_LINK}><img src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg" /></a>
            </div>
          </div>
        </div>
      )}

      {/* HERO */}
      <div className="hero">
        <div className="overlay">
          <h1 className="title">HloPG</h1>
          <p className="subtitle">Because finding a PG shouldn’t feel like a struggle.</p>
        </div>
      </div>

      {/* CITY SECTIONS */}
      {cities.map((city, idx) => (
        <div key={idx} className="city-section">
          <div className="city-header">
            <h2>{city.name}</h2>
            <div className="know-more-btn" onClick={() => navigate(`/city/${city.name.toLowerCase()}`)}>
              See More...
            </div>
          </div>

          <div className="pg-container">
            <div className="pg-scroll" ref={(el) => (pgRefs.current[idx] = el)}>
              <div className="pg-track">
                {cityHostels(city.name).map((pg) => (
                  <div key={pg.id} className="home-pg-card">
                    <div className="pg-image">
                      <img src={pg.img} onError={(e) => (e.target.src = defaultPGImg)} />
                      <FaHeart
                        className={`wishlists ${likedPgIds.includes(pg.id) ? "liked" : "unliked"}`}
                        onClick={(e) => toggleLike(pg, e)}
                      />
                    </div>

                    <div className="pg-details">
                      <div className="pg-header">
                        <h3 className="pg-name">{pg.hostel_name}</h3>
                        <div className="pg-rating">
                          <FaStar className="star" /> {pg.rating || 4.5}
                        </div>
                      </div>

                      <p className="pg-location">{pg.area}, {pg.city}</p>

                      <div className="sharing-price-section">
                        <FaUserFriends />
                        <span>{pg.sharing_data || "Multiple Sharing"}</span>
                        <strong>₹{pg.price || pg.rent}</strong>
                      </div>

                      <div className="facilities-grid">
                        {normalizeFacilities(pg.facilities).slice(0, 6).map((f) => (
                          <div key={f} className="facility-item">
                            {getFacilityIcon(f)} <span>{f}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => navigate(`/hostel/${selectedHostelId}`)}
        authType={authType}
      />
    </div>
  );
}

export default Home;
