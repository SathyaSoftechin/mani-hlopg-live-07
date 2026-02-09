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
  FaSnowflake,
  FaUserFriends,
  FaHome,
  FaDumbbell,
  FaFan,
  FaLightbulb,
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
const BASE_URL = "https://hlopg.com";

function Home() {
  const navigate = useNavigate();
  const pgRefs = useRef([]);

  const [hostels, setHostels] = useState([]);
  const [likedPgIds, setLikedPgIds] = useState([]);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [selectedHostelId, setSelectedHostelId] = useState(null);
  const [authType, setAuthType] = useState("login");
  const [arrowVisibility, setArrowVisibility] = useState([]);

  /* ---------------- IMAGE URL FIX ---------------- */
  const getFullImageUrl = (path) => {
    if (!path) return defaultPGImg;
    if (path.startsWith("http")) return path;

    const normalized = path.startsWith("/") ? path : `/${path}`;
    return `${BASE_URL}${normalized}`;
  };

  /* ---------------- FETCH HOSTELS ---------------- */
  useEffect(() => {
    const fetchHostels = async () => {
      try {
        const res = await api.get("/hostel/gethostels");

        if (res.data?.success && Array.isArray(res.data.hostels)) {
          const formatted = res.data.hostels.map((h) => {
            let images = [];

            if (h.images) {
              try {
                const parsed =
                  typeof h.images === "string"
                    ? JSON.parse(h.images)
                    : h.images;

                if (Array.isArray(parsed)) {
                  images = parsed.map((img) => getFullImageUrl(img));
                }
              } catch (e) {
                console.error("Image parse error", e);
              }
            }

            if (images.length === 0 && h.img) {
              images = [getFullImageUrl(h.img)];
            }

            if (images.length === 0) {
              images = [defaultPGImg];
            }

            return {
              ...h,
              id: h.hostel_id || h.id,
              images,
              displayImage: images[0],
            };
          });

          setHostels(formatted);
        }
      } catch (err) {
        console.error("Fetch hostel error", err);
      }
    };

    fetchHostels();
  }, []);

  /* ---------------- FETCH LIKED HOSTELS ---------------- */
  useEffect(() => {
    const fetchLiked = async () => {
      try {
        const token = localStorage.getItem("hlopgToken");
        if (!token) return;

        const res = await api.get("/hostel/liked-hostels", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data?.success) {
          setLikedPgIds(
            res.data.data.map((h) => h.hostel_id || h.id)
          );
        }
      } catch (e) {
        console.error(e);
      }
    };

    fetchLiked();
  }, []);

  /* ---------------- FACILITIES ---------------- */
  const getFacilitiesList = (data) => {
    try {
      const obj = typeof data === "string" ? JSON.parse(data) : data;

      const map = {
        wifi: { name: "WiFi", icon: <FaWifi /> },
        parking: { name: "Parking", icon: <FaCar /> },
        ac: { name: "AC", icon: <FaSnowflake /> },
        gym: { name: "Gym", icon: <FaDumbbell /> },
        fan: { name: "Fan", icon: <FaFan /> },
        bed: { name: "Bed", icon: <FaBed /> },
        lights: { name: "Lights", icon: <FaLightbulb /> },
        food: { name: "Food", icon: <FaUtensils /> },
        clean: { name: "Cleaning", icon: <FaBroom /> },
      };

      return Object.entries(obj || {})
        .filter(([_, v]) => v && map[_])
        .map(([k]) => map[k])
        .slice(0, 6);
    } catch {
      return [];
    }
  };

  /* ---------------- LIKE HOSTEL ---------------- */
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
    } catch (e) {
      console.error(e);
    }
  };

  /* ---------------- CITIES ---------------- */
  const cities = [
    { name: "Hyderabad", bg: hyderabadBg },
    { name: "Chennai", bg: chennaiBg },
    { name: "Mumbai", bg: mumbaiBg },
    { name: "Bangalore", bg: bangaloreBg },
  ].map((c) => ({
    ...c,
    pgList: hostels.filter(
      (h) =>
        h.city &&
        h.city.toLowerCase().includes(c.name.toLowerCase())
    ),
  }));

  /* ---------------- RENDER ---------------- */
  return (
    <div className="home">
      {/* Hero */}
      <div className="hero">
        <h1>HloPG</h1>
        <p>Because finding a PG shouldn’t be hard.</p>
      </div>

      {cities.map((city, index) => (
        <div key={index} className="city-section">
          <h2>{city.name}</h2>

          <div
            className="pg-scroll"
            ref={(el) => (pgRefs.current[index] = el)}
          >
            {city.pgList.map((pg) => (
              <div
                key={pg.id}
                className="home-pg-card"
                onClick={() => navigate(`/hostel/${pg.id}`)}
              >
                <div className="pg-image">
                  <img
                    src={pg.displayImage}
                    alt={pg.hostel_name}
                    onError={(e) => {
                      e.target.src = defaultPGImg;
                    }}
                  />

                  <FaHeart
                    className={
                      likedPgIds.includes(pg.id)
                        ? "liked"
                        : "unliked"
                    }
                    onClick={(e) => toggleLike(pg, e)}
                  />
                </div>

                <h3>{pg.hostel_name}</h3>
                <p>{pg.area || pg.city}</p>

                <div className="facilities">
                  {getFacilitiesList(pg.facilities).map(
                    (f, i) => (
                      <span key={i}>{f.icon}</span>
                    )
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        authType={authType}
      />
    </div>
  );
}

export default Home;
