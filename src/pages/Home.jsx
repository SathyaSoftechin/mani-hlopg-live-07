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

/* ================= SAFE CARD SANITIZER ================= */
const sanitizeHostelCard = (raw) => {
  return {
    id: raw?.id,
    name: typeof raw?.name === "string" ? raw.name : "Unnamed Hostel",
    img:
      typeof raw?.img === "string" && raw.img.length > 5
        ? raw.img
        : defaultPGImg,
    rating: typeof raw?.rating === "number" ? raw.rating : 4.5,
    location: typeof raw?.location === "string" ? raw.location : "",
    city: typeof raw?.city === "string" ? raw.city : "",
    pg_type: typeof raw?.pg_type === "string" ? raw.pg_type : "PG",
    sharingText:
      typeof raw?.sharing === "string"
        ? raw.sharing
        : "Multiple Sharing",
    facilities: Array.isArray(raw?.facilities)
      ? raw.facilities.filter(
          (f) =>
            f &&
            typeof f === "object" &&
            typeof f.name === "string"
        )
      : [],
  };
};

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
  const scrollPosRef = useRef(0);

  /* ================= IMAGE FIX ================= */
  const getFullImageUrl = (img) => {
    if (!img) return defaultPGImg;
    if (img.startsWith("http")) return img;
    if (img.startsWith("/uploads")) return `https://hlopg.com${img}`;
    return `https://hlopg.com/uploads/${img}`;
  };

  /* ================= FETCH HOSTELS ================= */
  useEffect(() => {
    api
      .get("/hostel/gethostels")
      .then((res) => {
        if (res.data?.success && Array.isArray(res.data.hostels)) {
          setHostels(
            res.data.hostels.map((h) => ({
              id: h.hostel_id || h.id,
              name: h.hostel_name || h.name,
              img: getFullImageUrl(h.img || h.images?.[0]),
              rating: h.rating,
              location: h.area || h.city,
              city: h.city,
              pg_type: h.pg_type,
              sharing: h.sharing_data
                ? Object.entries(
                    typeof h.sharing_data === "string"
                      ? JSON.parse(h.sharing_data)
                      : h.sharing_data
                  )
                    .map(([k, v]) => `${k}-Sharing ₹${v}`)
                    .join(", ")
                : "Multiple Sharing",
              facilities: (() => {
                try {
                  const f =
                    typeof h.facilities === "string"
                      ? JSON.parse(h.facilities)
                      : h.facilities;
                  const map = {
                    wifi: { name: "WiFi", icon: <FaWifi /> },
                    parking: { name: "Parking", icon: <FaCar /> },
                    ac: { name: "AC", icon: <FaSnowflake /> },
                    fan: { name: "Fan", icon: <FaFan /> },
                    bed: { name: "Bed", icon: <FaBed /> },
                    lights: { name: "Lights", icon: <FaLightbulb /> },
                    cupboard: { name: "Cupboard", icon: <FaChair /> },
                    food: { name: "Food", icon: <FaUtensils /> },
                    water: { name: "Water", icon: <FaShower /> },
                    clean: { name: "Cleaning", icon: <FaBroom /> },
                  };
                  return Object.keys(f || {})
                    .filter((k) => f[k] && map[k])
                    .map((k) => map[k]);
                } catch {
                  return [];
                }
              })(),
            }))
          );
        }
      })
      .catch(() => setHostels([]));
  }, []);

  /* ================= CITIES ================= */
  const cities = [
    { name: "Hyderabad", bg: hyderabadBg },
    { name: "Chennai", bg: chennaiBg },
    { name: "Mumbai", bg: mumbaiBg },
    { name: "Bangalore", bg: bangaloreBg },
  ];

  /* ================= POPUP ================= */
  useEffect(() => {
    const t = setTimeout(() => {
      scrollPosRef.current = window.scrollY;
      document.body.classList.add("no-scroll");
      setShowPopup(true);
    }, 5000);
    return () => clearTimeout(t);
  }, []);

  const closePopup = () => {
    setShowPopup(false);
    document.body.classList.remove("no-scroll");
    window.scrollTo(0, scrollPosRef.current);
  };

  /* ================= RENDER ================= */
  return (
    <div className="home">
      {showPopup && (
        <div className="app-popup-overlay">
          <div className="app-popup-card">
            <button className="popup-close" onClick={closePopup}>
              ✕
            </button>
            <img src={logo} alt="logo" className="popup-app-img" />
            <h2>
              Download Our <span className="brand-text">HLOPG</span> App
            </h2>
            <p>Find hostels faster & smarter.</p>
            <div className="popup-buttons">
              <a href={PLAYSTORE_LINK} target="_blank" rel="noreferrer">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                  alt="Play Store"
                />
              </a>
              <a href={APPSTORE_LINK} target="_blank" rel="noreferrer">
                <img
                  src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
                  alt="App Store"
                />
              </a>
            </div>
          </div>
        </div>
      )}

      <div className="hero">
        <div className="overlay">
          <h1 className="title">HloPG</h1>
          <p className="subtitle">
            Because finding a PG shouldn't feel like a struggle.
          </p>
        </div>
      </div>

      {cities.map((city, index) => {
        const cityPGs = hostels.filter(
          (h) =>
            h.city &&
            h.city.toLowerCase().includes(city.name.toLowerCase())
        );

        return (
          <div key={city.name} className="city-section">
            <div className="city-header">
              <h2>{city.name}</h2>
              {cityPGs.length > 0 && (
                <div
                  className="know-more-btn"
                  onClick={() =>
                    navigate(`/city/${city.name.toLowerCase()}`)
                  }
                >
                  See More...
                </div>
              )}
            </div>

            <div className="pg-container">
              <div
                className="pg-scroll"
                ref={(el) => (pgRefs.current[index] = el)}
              >
                <div className="pg-track">
                  {cityPGs.map((raw) => {
                    const pg = sanitizeHostelCard(raw);
                    return (
                      <div key={pg.id} className="home-pg-card">
                        <div
                          className="pg-card-click"
                          onClick={() =>
                            navigate(`/hostel/${pg.id}`)
                          }
                        >
                          <div className="pg-image">
                            <img
                              src={pg.img}
                              alt={pg.name}
                              onError={(e) =>
                                (e.currentTarget.src = defaultPGImg)
                              }
                            />
                            <FaHeart
                              className={`wishlists ${
                                likedPgIds.includes(pg.id)
                                  ? "liked"
                                  : "unliked"
                              }`}
                            />
                          </div>

                          <div className="pg-details">
                            <div className="pg-header">
                              <h3>{pg.name}</h3>
                              <div className="pg-rating">
                                <FaStar /> {pg.rating}
                              </div>
                            </div>

                            <p className="pg-location">
                              {pg.location}, {pg.city}
                            </p>

                            <div className="pg-type-badge">
                              <FaHome /> {pg.pg_type} PG
                            </div>

                            <div className="sharing-info">
                              <FaUserFriends />
                              <span>{pg.sharingText}</span>
                            </div>

                            <div className="facilities-grid">
                              {pg.facilities.map((f, i) => (
                                <div key={i} className="facility-item">
                                  {f.icon} {f.name}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        );
      })}

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        authType={authType}
      />
    </div>
  );
}

export default Home;
