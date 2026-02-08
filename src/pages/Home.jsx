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

  /* ================= IMAGE URL FIX ================= */
  const getFullImageUrl = (imagePath) => {
    if (!imagePath) return defaultPGImg;
    if (imagePath.startsWith("http")) return imagePath;
    if (imagePath.startsWith("/uploads"))
      return `https://hlopg.com${imagePath}`;
    return `https://hlopg.com/uploads/${imagePath}`;
  };

  /* ================= FETCH HOSTELS ================= */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/hostel/gethostels");

        if (res.data.success && Array.isArray(res.data.hostels)) {
          const processed = res.data.hostels.map((h) => {
            let image = defaultPGImg;

            try {
              if (Array.isArray(h.images) && h.images.length > 0) {
                image = getFullImageUrl(h.images[0]);
              } else if (typeof h.images === "string") {
                const parsed = JSON.parse(h.images);
                if (parsed?.length) image = getFullImageUrl(parsed[0]);
              } else if (h.img) {
                image = getFullImageUrl(h.img);
              }
            } catch {}

            return {
              ...h,
              id: h.hostel_id || h.id,
              displayImage: image,
            };
          });

          setHostels(processed);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  /* ================= CITIES ================= */
  const [cities, setCities] = useState([
    { name: "Hostel's in Hyderabad", bg: hyderabadBg, pgList: [] },
    { name: "Hostel's in Chennai", bg: chennaiBg, pgList: [] },
    { name: "Hostel's in Mumbai", bg: mumbaiBg, pgList: [] },
    { name: "Hostel's in Bangalore", bg: bangaloreBg, pgList: [] },
  ]);

  useEffect(() => {
    if (!hostels.length) return;

    setCities((prev) =>
      prev.map((city) => {
        const cityKey =
          city.name.match(/in (\w+)/i)?.[1]?.toLowerCase() || "";

        const filtered = hostels.filter(
          (h) => h.city && h.city.toLowerCase().includes(cityKey)
        );

        return {
          ...city,
          pgList: filtered.map((h) => ({
            id: h.id,
            img: h.displayImage,
            name: h.hostel_name || "Unnamed Hostel",
            location: h.area || h.city || "Unknown",
            city: h.city,
            rating: h.rating || 4.5,
            sharing: h.sharing_data || "Multiple Sharing",
            price: h.price || h.rent || "5000",
            facilities: h.facilities || {},
            pg_type: h.pg_type || "Hostel",
          })),
        };
      })
    );
  }, [hostels]);

  /* ================= FACILITY ICON FALLBACK ================= */
  const getFacilityIcon = (name) => {
    const map = {
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
      clean: <FaBroom />,
    };
    return map[name?.toLowerCase()] || <FaHome />;
  };

  /* ================= APP DOWNLOAD POPUP ================= */
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      document.body.classList.add("no-scroll");
      setShowPopup(true);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  const closePopup = () => {
    document.body.classList.remove("no-scroll");
    setShowPopup(false);
  };

  /* ================= RENDER ================= */
  return (
    <div className="home">
      {/* ===== App Download Popup ===== */}
      {showPopup && (
        <div className="app-popup-overlay">
          <div className="app-popup-card">
            <button className="popup-close" onClick={closePopup}>✕</button>
            <img src={logo} alt="logo" className="popup-app-img" />
            <h2>
              Download Our <span className="brand-text">HLOPG</span> Mobile App
            </h2>
            <p>Find hostels faster, easier & smarter.</p>
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

      {/* ===== Hero ===== */}
      <div className="hero">
        <div className="overlay">
          <h1 className="title">HloPG</h1>
          <p className="subtitle">
            Because finding a PG shouldn't feel like a struggle.
          </p>
        </div>
      </div>

      {/* ===== City Sections ===== */}
      {cities.map((city, index) => (
        <div key={index} className="city-section">
          <div className="city-header">
            <h2>{city.name.replace("Hostel's in ", "")}</h2>
          </div>

          <div className="pg-container">
            <div className="pg-scroll" ref={(el) => (pgRefs.current[index] = el)}>
              <div className="pg-track">
                {city.pgList.map((pg) => (
                  <div key={pg.id} className="home-pg-card">
                    <div className="pg-image">
                      <img
                        src={pg.img}
                        alt={pg.name}
                        onError={(e) => (e.currentTarget.src = defaultPGImg)}
                      />
                      <FaHeart className="wishlists unliked" />
                    </div>

                    <div className="pg-details">
                      <div className="pg-header">
                        <h3 className="pg-name">{pg.name}</h3>
                        <div className="pg-rating">
                          <FaStar className="star" />
                          <span>{pg.rating}</span>
                        </div>
                      </div>

                      <p className="pg-location">
                        {pg.location}, {pg.city}
                      </p>

                      <div className="sharing-price-section">
                        <div className="sharing-info">
                          <FaUserFriends />
                          <span>{pg.sharing}</span>
                        </div>
                        <div className="price-tag">
                          <span className="price">₹{pg.price}</span>
                          <span className="per-month">/month</span>
                        </div>
                      </div>

                      <div className="facilities-section">
                        <h4 className="facilities-title">Facilities:</h4>
                        <div className="facilities-grid">
                          {Object.keys(pg.facilities).slice(0, 6).map((key) => (
                            <div key={key} className="facility-item">
                              <span className="facility-icon">
                                {getFacilityIcon(key)}
                              </span>
                              <span className="facility-name">{key}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Home;
