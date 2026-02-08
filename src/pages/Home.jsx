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

  /* ================= IMAGE HANDLER ================= */
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
        if (res.data?.success && Array.isArray(res.data.hostels)) {
          setHostels(
            res.data.hostels.map((h) => ({
              ...h,
              id: h.hostel_id || h.id,
              displayImage: getFullImageUrl(h.images?.[0] || h.img),
            }))
          );
        } else {
          setHostels([]);
        }
      } catch {
        setHostels([]);
      }
    };
    fetchData();
  }, []);

  /* ================= LIKED HOSTELS ================= */
  useEffect(() => {
    const fetchLiked = async () => {
      try {
        const token = localStorage.getItem("hlopgToken");
        if (!token) return;
        const res = await api.get("/hostel/liked-hostels", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data?.success && Array.isArray(res.data.data)) {
          setLikedPgIds(res.data.data.map((h) => h.hostel_id || h.id));
        }
      } catch {}
    };
    fetchLiked();
  }, []);

  /* ================= CITIES ================= */
  const cities = [
    { name: "Hyderabad", bg: hyderabadBg },
    { name: "Delhi", bg: hyderabadBg },
    { name: "Chennai", bg: chennaiBg },
    { name: "Bangalore", bg: bangaloreBg },
  ];

  const getFacilities = (data) => {
    if (!data || typeof data !== "object") return [];
    const map = {
      wifi: { name: "WiFi", icon: <FaWifi /> },
      parking: { name: "Parking", icon: <FaCar /> },
      ac: { name: "AC", icon: <FaSnowflake /> },
      fan: { name: "Fan", icon: <FaFan /> },
      bed: { name: "Bed", icon: <FaBed /> },
      food: { name: "Food", icon: <FaUtensils /> },
      clean: { name: "Cleaning", icon: <FaBroom /> },
      geyser: { name: "Hot Water", icon: <FaShower /> },
      lights: { name: "Lights", icon: <FaLightbulb /> },
      cupboard: { name: "Cupboard", icon: <FaChair /> },
    };

    return Object.entries(data)
      .filter(([_, v]) => v)
      .map(([k]) => map[k])
      .filter(Boolean)
      .slice(0, 6);
  };

  /* ================= LIKE ================= */
  const toggleLike = async (pg, e) => {
    e.stopPropagation();
    const token = localStorage.getItem("hlopgToken");
    if (!token) {
      setSelectedHostelId(pg.id);
      setShowAuthModal(true);
      return;
    }

    try {
      const res = await api.post(
        "/hostel/like-hostel",
        { hostel_id: pg.id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data?.success) {
        setLikedPgIds((prev) =>
          res.data.liked
            ? [...new Set([...prev, pg.id])]
            : prev.filter((id) => id !== pg.id)
        );
      }
    } catch {}
  };

  /* ================= RENDER ================= */
  return (
    <div className="home">
      {/* ===== HERO ===== */}
      <div className="hero">
        <div className="overlay">
          <h1 className="title">HloPG</h1>
          <p className="subtitle">
            Finding a PG shouldn’t feel like a struggle
          </p>
        </div>
      </div>

      {/* ===== CITY SECTIONS ===== */}
      {cities.map((city) => {
        const cityHostels = hostels.filter((h) =>
          h.city?.toLowerCase().includes(city.name.toLowerCase())
        );

        return (
          <div key={city.name} className="city-section">
            <div className="city-header">
              <h2>{city.name}</h2>
              {cityHostels.length > 0 && (
                <span
                  className="know-more-btn"
                  onClick={() =>
                    navigate(`/city/${city.name.toLowerCase()}`)
                  }
                >
                  See More...
                </span>
              )}
            </div>

            <div className="pg-track">
              {cityHostels.slice(0, 4).map((pg) => (
                <div key={pg.id} className="home-pg-card">
                  <div
                    className="pg-card-click"
                    onClick={() => navigate(`/hostel/${pg.id}`)}
                  >
                    <div className="pg-image">
                      <img src={pg.displayImage} alt={pg.hostel_name} />
                      <FaHeart
                        className={`wishlists ${
                          likedPgIds.includes(pg.id)
                            ? "liked"
                            : "unliked"
                        }`}
                        onClick={(e) => toggleLike(pg, e)}
                      />
                    </div>

                    <div className="pg-details">
                      <div className="pg-header">
                        <h3 className="pg-name">
                          {pg.hostel_name || "PG"}
                        </h3>
                        <div className="pg-rating">
                          <FaStar />
                          <span>{pg.rating || 4.5}</span>
                        </div>
                      </div>

                      <p className="pg-location">
                        {pg.area || pg.city}
                      </p>

                      <div className="sharing-price-section">
                        <FaUserFriends />
                        <span>Multiple Sharing</span>
                        <span className="price">
                          ₹{pg.price || pg.rent || 8952}
                        </span>
                      </div>

                      <div className="facilities-grid">
                        {getFacilities(pg.facilities).map((f, i) => (
                          <div key={i} className="facility-item">
                            <span className="facility-icon">{f.icon}</span>
                            <span className="facility-name">{f.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
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
