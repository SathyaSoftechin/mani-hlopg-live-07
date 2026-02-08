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

  /* ---------------- Image URL Helper (SAFE) ---------------- */
  const getFullImageUrl = (imagePath) => {
    if (!imagePath) return defaultPGImg;
    if (imagePath.startsWith("http")) return imagePath;
    if (imagePath.startsWith("/uploads")) {
      return `https://hlopg.com${imagePath}`;
    }
    return `https://hlopg.com/uploads/${imagePath}`;
  };

  /* ---------------- Fetch Hostels ---------------- */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/hostel/gethostels");

        if (res.data.success && Array.isArray(res.data.hostels)) {
          const processed = res.data.hostels.map((h) => {
            let imageUrl = defaultPGImg;

            try {
              if (Array.isArray(h.images) && h.images.length > 0) {
                imageUrl = getFullImageUrl(h.images[0]);
              } else if (typeof h.images === "string") {
                const parsed = JSON.parse(h.images);
                if (Array.isArray(parsed) && parsed.length > 0) {
                  imageUrl = getFullImageUrl(parsed[0]);
                }
              } else if (h.img) {
                imageUrl = getFullImageUrl(h.img);
              }
            } catch {
              imageUrl = defaultPGImg;
            }

            return {
              ...h,
              id: h.hostel_id || h.id,
              displayImage: imageUrl,
            };
          });

          setHostels(processed);
        } else {
          setHostels([]);
        }
      } catch (err) {
        console.error("Error fetching hostels:", err);
        setHostels([]);
      }
    };

    fetchData();
  }, []);

  /* ---------------- Cities ---------------- */
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
            sharing: "Multiple Sharing",
            facilities: h.facilities || [],
            pg_type: h.pg_type || "Hostel",
          })),
        };
      })
    );
  }, [hostels]);

  /* ---------------- Scroll Logic ---------------- */
  const updateArrowVisibility = (index) => {
    const el = pgRefs.current[index];
    if (!el) return;

    setArrowVisibility((prev) => {
      const copy = [...prev];
      copy[index] = {
        left: el.scrollLeft > 0,
        right: el.scrollLeft + el.clientWidth < el.scrollWidth - 1,
      };
      return copy;
    });
  };

  const scrollPG = (index, dir) => {
    const el = pgRefs.current[index];
    if (!el) return;

    el.scrollBy({
      left: dir === "next" ? el.clientWidth : -el.clientWidth,
      behavior: "smooth",
    });

    setTimeout(() => updateArrowVisibility(index), 300);
  };

  /* ---------------- Render ---------------- */
  return (
    <div className="home">
      {/* ===== App Popup ===== */}
      {showAuthModal && (
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          authType={authType}
        />
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
            {city.pgList.length > 0 && (
              <div
                className="know-more-btn"
                onClick={() =>
                  navigate(
                    `/city/${city.name.match(/in (\w+)/i)?.[1].toLowerCase()}`
                  )
                }
              >
                See More...
              </div>
            )}
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
                      <div className="pg-image">
                        <img
                          src={pg.img}
                          alt={pg.name}
                          onError={(e) => {
                            e.currentTarget.src = defaultPGImg;
                          }}
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

                        <div className="pg-type-badge">
                          <FaHome />
                          <span>{pg.pg_type} PG</span>
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
    </div>
  );
}

export default Home;
