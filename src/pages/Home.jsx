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

  /* ================= SAFE IMAGE HANDLER ================= */
  const getFullImageUrl = (imagePath) => {
    if (!imagePath) return defaultPGImg;
    if (imagePath.startsWith("http")) return imagePath;
    if (imagePath.startsWith("/uploads")) return `https://hlopg.com${imagePath}`;
    return `https://hlopg.com/uploads/${imagePath}`;
  };

  /* ================= FETCH HOSTELS ================= */
  useEffect(() => {
    const fetchHostels = async () => {
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
    fetchHostels();
  }, []);

  /* ================= LIKED HOSTELS ================= */
  useEffect(() => {
    const fetchLiked = async () => {
      try {
        const token = localStorage.getItem("hlopgToken");
        if (!token) return setLikedPgIds([]);
        const res = await api.get("/hostel/liked-hostels", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data?.success && Array.isArray(res.data.data)) {
          setLikedPgIds(res.data.data.map((h) => h.hostel_id || h.id));
        }
      } catch {
        setLikedPgIds([]);
      }
    };
    fetchLiked();
  }, []);

  /* ================= CITIES ================= */
  const [cities, setCities] = useState([
    { name: "Hostel's in Hyderabad", bg: hyderabadBg, pgList: [] },
    { name: "Hostel's in Chennai", bg: chennaiBg, pgList: [] },
    { name: "Hostel's in Mumbai", bg: mumbaiBg, pgList: [] },
    { name: "Hostel's in Bangalore", bg: bangaloreBg, pgList: [] },
  ]);

  useEffect(() => {
    if (!Array.isArray(hostels)) return;

    setCities((prev) =>
      prev.map((city) => {
        const cityName =
          city.name.match(/in (\w+)/i)?.[1]?.toLowerCase() || "";
        const filtered = hostels.filter(
          (h) => h.city?.toLowerCase().includes(cityName)
        );

        return {
          ...city,
          pgList: filtered.map((h) => ({
            id: h.id,
            img: h.displayImage,
            name: h.hostel_name || h.name || "Unnamed Hostel",
            location: h.area || h.city || "Unknown",
            rating: Number(h.rating) || 4.5,
            price: h.price ?? h.rent ?? 5000,
            sharing: "Multiple Sharing",
            facilities: Array.isArray(h.facilities) ? h.facilities : [],
            pg_type: h.pg_type || "PG",
            city: h.city || "",
          })),
        };
      })
    );
  }, [hostels]);

  /* ================= FACILITY ICON ================= */
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
      Wash: <FaShower />,
      Lights: <FaLightbulb />,
      Cupboard: <FaChair />,
    };
    return map[name] || <FaHome />;
  };

  /* ================= SCROLL ================= */
  const updateArrowVisibility = (i) => {
    const el = pgRefs.current[i];
    if (!el) return;
    setArrowVisibility((prev) => {
      const next = [...prev];
      next[i] = {
        left: el.scrollLeft > 0,
        right: el.scrollLeft + el.clientWidth < el.scrollWidth - 1,
      };
      return next;
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
      {/* HERO */}
      <div className="hero">
        <div className="overlay">
          <h1 className="title">HloPG</h1>
          <p className="subtitle">
            Because finding a PG shouldn't feel like a struggle.
          </p>
        </div>
      </div>

      {/* CITY SECTIONS */}
      {cities.map((city, index) => (
        <div key={index} className="city-section">
          <div className="city-header">
            <h2>{city.name.replace("Hostel's in ", "")}</h2>
          </div>

          {city.pgList.length > 0 && (
            <div className="pg-container">
              <button
                className={`arrow left ${
                  arrowVisibility[index]?.left ? "show" : "hide"
                }`}
                onClick={() => scrollPG(index, "prev")}
              >
                <FaChevronLeft />
              </button>

              <button
                className={`arrow right ${
                  arrowVisibility[index]?.right ? "show" : "hide"
                }`}
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
                        onClick={() => navigate(`/hostel/${pg.id}`)}
                      >
                        <div className="pg-image">
                          <img src={pg.img} alt={pg.name} />
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
                            <h3 className="pg-name">{pg.name}</h3>
                            <div className="pg-rating">
                              <FaStar />
                              {pg.rating}
                            </div>
                          </div>

                          <p className="pg-location">
                            {pg.location}, {pg.city}
                          </p>

                          <div className="sharing-price-section">
                            <FaUserFriends />
                            <span>{pg.sharing}</span>
                            <span className="price">₹{pg.price}</span>
                          </div>

                          <div className="facilities-grid">
                            {(Array.isArray(pg.facilities)
                              ? pg.facilities
                              : []
                            )
                              .slice(0, 6)
                              .map((f, i) => (
                                <div key={i} className="facility-item">
                                  {getFacilityIcon(f.name || f)}
                                  <span>{f.name || f}</span>
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
          )}
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
