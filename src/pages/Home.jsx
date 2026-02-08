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

  /* ================= IMAGE URL FIX ================= */
  const getFullImageUrl = (imagePath) => {
    if (!imagePath) return defaultPGImg;
    if (imagePath.startsWith("http")) return imagePath;
    if (imagePath.startsWith("/uploads")) return `https://hlopg.com${imagePath}`;
    return `https://hlopg.com/uploads/${imagePath}`;
  };

  /* ================= FETCH HOSTELS ================= */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/hostel/gethostels");
        if (res.data.success && Array.isArray(res.data.hostels)) {
          setHostels(
            res.data.hostels.map((h) => ({
              ...h,
              id: h.hostel_id || h.id,
              displayImage: h.images?.[0]
                ? getFullImageUrl(h.images[0])
                : getFullImageUrl(h.img),
            }))
          );
        }
      } catch {
        setHostels([]);
      }
    };
    fetchData();
  }, []);

  /* ================= LIKE TOGGLE ================= */
  const toggleLike = async (pg, e) => {
    e.stopPropagation();
    const token = localStorage.getItem("hlopgToken");
    if (!token) {
      setSelectedHostelId(pg.id);
      setAuthType("login");
      setShowAuthModal(true);
      return;
    }

    try {
      const res = await api.post(
        "/hostel/like-hostel",
        { hostel_id: pg.id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        setLikedPgIds((prev) =>
          res.data.liked
            ? [...new Set([...prev, pg.id])]
            : prev.filter((id) => id !== pg.id)
        );
      }
    } catch {}
  };

  /* ================= CARD CLICK ================= */
  const handlePgCardClick = (pg) => {
    const token = localStorage.getItem("hlopgToken");
    if (!token) {
      setSelectedHostelId(pg.id);
      setAuthType("login");
      setShowAuthModal(true);
    } else {
      navigate(`/hostel/${pg.id}`);
    }
  };

  /* ================= FACILITY ICON MAP ================= */
  const getFacilityIcon = (name) => {
    const map = {
      WiFi: <FaWifi />,
      Parking: <FaCar />,
      AC: <FaSnowflake />,
      TV: <FaTv />,
      Gym: <FaDumbbell />,
      Fan: <FaFan />,
      Bed: <FaBed />,
      Food: <FaUtensils />,
      Cleaning: <FaBroom />,
      "Hot Water": <FaShower />,
      Lights: <FaLightbulb />,
      Cupboard: <FaChair />,
    };
    return map[name] || <FaHome />;
  };

  /* ================= RENDER ================= */
  return (
    <div className="home">
      {/* ===== HERO ===== */}
      <div className="hero">
        <div className="overlay">
          <h1 className="title">HloPG</h1>
          <p className="subtitle">
            Because finding a PG shouldn't feel like a struggle.
          </p>
        </div>
      </div>

      {/* ===== HOSTEL CARDS ===== */}
      <div className="city-section">
        <div className="pg-container">
          <div className="pg-track">
            {hostels.map((pg) => (
              <div key={pg.id} className="home-pg-card">
                <div
                  className="pg-card-click"
                  onClick={() => handlePgCardClick(pg)}
                >
                  {/* IMAGE */}
                  <div className="pg-image">
                    <img
                      src={pg.displayImage || defaultPGImg}
                      alt={pg.hostel_name}
                      loading="lazy"
                      onError={(e) => (e.target.src = defaultPGImg)}
                    />

                    <FaHeart
                      className={`wishlists ${
                        likedPgIds.includes(pg.id) ? "liked" : "unliked"
                      }`}
                      onClick={(e) => toggleLike(pg, e)}
                    />
                  </div>

                  {/* DETAILS */}
                  <div className="pg-details">
                    <div className="pg-header">
                      <h3 className="pg-name">
                        {pg.hostel_name || "Unnamed Hostel"}
                      </h3>
                      <div className="pg-rating">
                        <FaStar className="star" />
                        <span>{pg.rating || 4.5}</span>
                      </div>
                    </div>

                    <p className="pg-location">
                      {pg.area || pg.city || "Unknown location"}
                    </p>

                    {/* SHARING */}
                    <div className="sharing-info">
                      <FaUserFriends />
                      <span>{pg.sharing || "Multiple sharing options"}</span>
                    </div>

                    {/* PRICE */}
                    <div className="price-row">
                      <span className="price">
                        ₹{pg.price || pg.rent || "5000"}
                      </span>
                      <span className="per">/month</span>
                    </div>

                    {/* FACILITIES */}
                    <div className="facilities-section">
                      <div className="facilities-grid">
                        {(pg.facilities || []).slice(0, 6).map((f, i) => (
                          <div key={i} className="facility-item">
                            <span className="facility-icon">
                              {getFacilityIcon(f.name || f)}
                            </span>
                            <span className="facility-name">
                              {f.name || f}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AUTH MODAL */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        authType={authType}
      />
    </div>
  );
}

export default Home;
