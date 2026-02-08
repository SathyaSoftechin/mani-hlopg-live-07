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

  /* ---------------- Image Helper ---------------- */
  const getFullImageUrl = (imagePath) => {
    if (!imagePath) return defaultPGImg;
    if (imagePath.startsWith("http")) return imagePath;
    if (imagePath.startsWith("/uploads"))
      return `https://hlopg.com${imagePath}`;
    return `https://hlopg.com/uploads/${imagePath}`;
  };

  /* ---------------- Fetch Hostels ---------------- */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/hostel/gethostels");
        if (res.data.success && Array.isArray(res.data.hostels)) {
          const processed = res.data.hostels.map((h) => {
            const images =
              Array.isArray(h.images) && h.images.length
                ? h.images.map(getFullImageUrl)
                : h.img
                ? [getFullImageUrl(h.img)]
                : [defaultPGImg];

            return {
              ...h,
              images,
              displayImage: images[0],
              id: h.hostel_id || h.id,
            };
          });
          setHostels(processed);
        } else {
          setHostels([]);
        }
      } catch (err) {
        console.error(err);
        setHostels([]);
      }
    };
    fetchData();
  }, []);

  /* ---------------- Fetch Likes ---------------- */
  useEffect(() => {
    const fetchLiked = async () => {
      try {
        const token = localStorage.getItem("hlopgToken");
        if (!token) return setLikedPgIds([]);

        const res = await api.get("/hostel/liked-hostels", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.success && Array.isArray(res.data.data)) {
          setLikedPgIds(res.data.data.map((p) => p.hostel_id || p.id));
        }
      } catch {
        setLikedPgIds([]);
      }
    };
    fetchLiked();
  }, []);

  /* ---------------- Cities ---------------- */
  const [cities, setCities] = useState([
    { name: "Hostel's in Hyderabad", bg: hyderabadBg, pgList: [] },
    { name: "Hostel's in Chennai", bg: chennaiBg, pgList: [] },
    { name: "Hostel's in Mumbai", bg: mumbaiBg, pgList: [] },
    { name: "Hostel's in Bangalore", bg: bangaloreBg, pgList: [] },
    { name: "Hostel's in Vizag", bg: bangaloreBg, pgList: [] },
  ]);

  useEffect(() => {
    if (!hostels.length) return;

    setCities((prev) =>
      prev.map((city) => {
        const cityName =
          city.name.match(/in (\w+)/i)?.[1]?.toLowerCase() || "";

        const filtered = hostels.filter(
          (h) =>
            h.city &&
            (h.city.toLowerCase().includes(cityName) ||
              cityName.includes(h.city.toLowerCase()))
        );

        return {
          ...city,
          pgList: filtered.map((h) => ({
            id: h.hostel_id || h.id,
            img: h.displayImage,
            name: h.hostel_name || h.name || "Unnamed Hostel",
            location: h.area || h.city || "Unknown",
            rating: h.rating || 4.5,
            price:
              h.price || h.rent ? `₹${h.price || h.rent}` : "₹5000",
            sharing: getSharingDisplay(h.sharing_data),
            facilities: getFacilitiesList(h.facilities),
            pg_type: h.pg_type || "Hostel",
            city: h.city,
          })),
        };
      })
    );
  }, [hostels]);

  /* ---------------- Helpers ---------------- */
  const getSharingDisplay = (data) => {
    if (!data) return "Not specified";
    try {
      const obj = typeof data === "string" ? JSON.parse(data) : data;
      return Object.entries(obj)
        .map(([k, v]) => `${k}-Sharing - ₹${v}`)
        .join(", ");
    } catch {
      return "Multiple Sharing Options";
    }
  };

  const getFacilitiesList = (data) => {
    const map = {
      wifi: { name: "WiFi", icon: <FaWifi /> },
      parking: { name: "Parking", icon: <FaCar /> },
      ac: { name: "AC", icon: <FaSnowflake /> },
      tv: { name: "TV", icon: <FaTv /> },
      gym: { name: "Gym", icon: <FaDumbbell /> },
      geyser: { name: "Hot Water", icon: <FaShower /> },
      fan: { name: "Fan", icon: <FaFan /> },
      bed: { name: "Bed", icon: <FaBed /> },
      lights: { name: "Lights", icon: <FaLightbulb /> },
      cupboard: { name: "Cupboard", icon: <FaChair /> },
      food: { name: "Food", icon: <FaUtensils /> },
      clean: { name: "Cleaning", icon: <FaBroom /> },
    };

    try {
      const obj = typeof data === "string" ? JSON.parse(data) : data;
      const list = Object.entries(obj || {})
        .filter(([k, v]) => v && map[k])
        .map(([k]) => map[k]);

      return list.length
        ? list.slice(0, 6)
        : [
            { name: "Bed", icon: <FaBed /> },
            { name: "Food", icon: <FaUtensils /> },
            { name: "Clean", icon: <FaBroom /> },
            { name: "Wash", icon: <FaShower /> },
          ];
    } catch {
      return [];
    }
  };

  /* ---------------- Scroll ---------------- */
  const updateArrowVisibility = (i) => {
    const el = pgRefs.current[i];
    if (!el) return;
    setArrowVisibility((p) => {
      const n = [...p];
      n[i] = {
        left: el.scrollLeft > 0,
        right: el.scrollLeft + el.clientWidth < el.scrollWidth - 1,
      };
      return n;
    });
  };

  const scrollPG = (i, dir) => {
    const el = pgRefs.current[i];
    if (!el) return;
    el.scrollBy({
      left: dir === "next" ? el.clientWidth : -el.clientWidth,
      behavior: "smooth",
    });
  };

  /* ---------------- Like ---------------- */
  const toggleLike = async (pg, e) => {
    e.stopPropagation();
    const token = localStorage.getItem("hlopgToken");
    if (!token) {
      setSelectedHostelId(pg.id);
      setAuthType("login");
      setShowAuthModal(true);
      return;
    }

    const res = await api.post(
      "/hostel/like-hostel",
      { hostel_id: pg.id },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (res.data.success) {
      setLikedPgIds((prev) =>
        res.data.liked ? [...new Set([...prev, pg.id])] : prev.filter((i) => i !== pg.id)
      );
    }
  };

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

  /* ---------------- Render ---------------- */
  return (
    <div className="home">
      {cities.map((city, index) => (
        <div key={index} className="city-section">
          <div className="city-header">
            <h2>{city.name.replace("Hostel's in ", "")}</h2>
          </div>

          <div className="pg-container">
            <button
              className={`arrow left ${arrowVisibility[index]?.left ? "show" : "hide"}`}
              onClick={() => scrollPG(index, "prev")}
            >
              <FaChevronLeft />
            </button>

            <button
              className={`arrow right ${arrowVisibility[index]?.right ? "show" : "hide"}`}
              onClick={() => scrollPG(index, "next")}
            >
              <FaChevronRight />
            </button>

            <div
              className="pg-scroll"
              ref={(el) => (pgRefs.current[index] = el)}
              onScroll={() => updateArrowVisibility(index)}
            >
              <div className="pg-track">
                {city.pgList.map((pg) => (
                  <div key={pg.id} className="home-pg-card">
                    <div
                      className="pg-card-click"
                      role="button"
                      tabIndex={0}
                      onClick={() => handlePgCardClick(pg)}
                      onKeyDown={(e) =>
                        (e.key === "Enter" || e.key === " ") &&
                        handlePgCardClick(pg)
                      }
                    >
                      <div className="pg-image">
                        <img
                          src={pg.img}
                          alt={pg.name}
                          loading="lazy"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = defaultPGImg;
                          }}
                        />
                        <div onClick={(e) => e.stopPropagation()}>
                          <FaHeart
                            className={`wishlists ${
                              likedPgIds.includes(pg.id) ? "liked" : "unliked"
                            }`}
                            onClick={(e) => toggleLike(pg, e)}
                          />
                        </div>
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

                        <div className="pg-type-badge">
                          <FaHome />
                          <span>
                            {pg.pg_type.toLowerCase().includes("pg")
                              ? pg.pg_type
                              : `${pg.pg_type} PG`}
                          </span>
                        </div>

                        <div className="sharing-price-section">
                          <FaUserFriends />
                          <span className="sharing-text" title={pg.sharing}>
                            {pg.sharing}
                          </span>
                        </div>

                        <div className="facilities-section">
                          <h4 className="facilities-title">Facilities</h4>
                          <div className="facilities-grid">
                            {pg.facilities.map((f, i) => (
                              <div key={i} className="facility-item">
                                <span className="facility-icon">{f.icon}</span>
                                <span className="facility-name">{f.name}</span>
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
