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

const PLAYSTORE_LINK = "https://play.google.com/";
const APPSTORE_LINK = "https://www.apple.com/app-store/";

function Home() {
  const navigate = useNavigate();
  const pgRefs = useRef([]);
  const [arrowVisibility, setArrowVisibility] = useState([]);
  const [hostels, setHostels] = useState([]);
  const [likedPgIds, setLikedPgIds] = useState([]);

  /* ---------------- Fix Image URL Helper ---------------- */
  const getFullImageUrl = (imagePath) => {
    if (!imagePath) return defaultPGImg;

    if (imagePath.startsWith("http")) {
      return imagePath;
    }

    if (imagePath.startsWith("/uploads")) {
      return `https://hlopg.com${imagePath}`;
    }

    if (imagePath) {
      return `https://hlopg.com/uploads/${imagePath}`;
    }

    return defaultPGImg;
  };

  /* ---------------- Fetch Hostels ---------------- */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/hostel/gethostels");
        console.log("Hostels response:", res.data);

        if (res.data.success && Array.isArray(res.data.hostels)) {
          const processedHostels = res.data.hostels.map((hostel) => {
            let images = [];
            if (hostel.images && Array.isArray(hostel.images)) {
              images = hostel.images.map((img) => getFullImageUrl(img));
            } else if (hostel.img) {
              images = [getFullImageUrl(hostel.img)];
            } else {
              images = [defaultPGImg];
            }

            return {
              ...hostel,
              images: images,
              displayImage: images[0],
              id: hostel.hostel_id || hostel.id,
            };
          });

          setHostels(processedHostels);
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

  /* ---------------- Fetch Liked Hostels ---------------- */
  useEffect(() => {
    const fetchLiked = async () => {
      try {
        const token = localStorage.getItem("hlopgToken");
        if (!token) {
          setLikedPgIds([]);
          return;
        }

        const res = await api.get("/hostel/liked-hostels", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.success && Array.isArray(res.data.data)) {
          const likedIds = res.data.data.map((pg) => pg.hostel_id || pg.id);
          setLikedPgIds(likedIds);
        } else {
          setLikedPgIds([]);
        }
      } catch (err) {
        console.error("Error fetching liked hostels:", err);
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
    if (hostels.length > 0) {
      setCities((prevCities) =>
        prevCities.map((city) => {
          const cityName =
            city.name.match(/in (\w+)/i)?.[1]?.toLowerCase() || "";

          const filtered = hostels.filter((h) => {
            if (!h.city) return false;
            return (
              h.city.toLowerCase().includes(cityName) ||
              cityName.includes(h.city.toLowerCase())
            );
          });

          return {
            ...city,
            pgList: filtered.map((h) => ({
              id: h.hostel_id || h.id,
              img: h.displayImage || defaultPGImg,
              name: h.hostel_name || h.name || "Unnamed Hostel",
              location: h.area || h.city || h.address || "Unknown Location",
              rating: h.rating || 4.5,
              price: h.price
                ? `₹${h.price}`
                : h.rent
                ? `₹${h.rent}`
                : "₹5000",
              fullHostelData: h,
              sharing: getSharingDisplay(h.sharing_data),
              facilities: getFacilitiesList(h.facilities),
              description: h.description || "",
              pg_type: h.pg_type || "Hostel",
              status: h.status || "ACTIVE",
              city: h.city,
              pincode: h.pincode,
              state: h.state,
              rules: h.rules ? parseRules(h.rules) : [],
              food_menu: h.food_menu || {},
            })),
          };
        })
      );
    }
  }, [hostels]);

  /* ---------------- Helper: Get Sharing Display ---------------- */
  const getSharingDisplay = (sharingData) => {
    if (!sharingData) return "Not specified";

    try {
      const sharing =
        typeof sharingData === "string"
          ? JSON.parse(sharingData)
          : sharingData;

      if (typeof sharing === "object" && sharing !== null) {
        const entries = Object.entries(sharing);
        if (entries.length > 0) {
          return entries
            .map(([type, price]) => {
              const typeText =
                type === "single"
                  ? "1-Sharing"
                  : type === "double"
                  ? "2-Sharing"
                  : type === "triple"
                  ? "3-Sharing"
                  : type === "four"
                  ? "4-Sharing"
                  : type === "five"
                  ? "5-Sharing"
                  : type === "six"
                  ? "6-Sharing"
                  : `${type}-Sharing`;

              return `${typeText} - ₹${price}`;
            })
            .join(", ");
        }
      }
    } catch (e) {
      console.log("Error parsing sharing data:", e);
    }
    return "Multiple Sharing Options";
  };

  /* ---------------- Helper: Get Facilities List ---------------- */
  const getFacilitiesList = (facilitiesData) => {
    const facilities = [];

    if (facilitiesData) {
      try {
        const facilitiesObj =
          typeof facilitiesData === "string"
            ? JSON.parse(facilitiesData)
            : facilitiesData;

        const facilityMap = {
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
          water: { name: "24/7 Water", icon: <FaShower /> },
          clean: { name: "Cleaning", icon: <FaBroom /> },
        };

        Object.entries(facilitiesObj).forEach(([key, value]) => {
          if (value && facilityMap[key]) {
            facilities.push(facilityMap[key]);
          }
        });
      } catch (e) {
        console.log("Error parsing facilities:", e);
      }
    }

    if (facilities.length === 0) {
      facilities.push(
        { name: "Beds", icon: <FaBed /> },
        { name: "Food", icon: <FaUtensils /> },
        { name: "Clean", icon: <FaBroom /> },
        { name: "Wash", icon: <FaShower /> }
      );
    }

    return facilities.slice(0, 6);
  };

  /* ---------------- Helper: Parse Rules ---------------- */
  const parseRules = (rulesData) => {
    if (!rulesData) return [];

    try {
      if (typeof rulesData === "string") {
        return JSON.parse(rulesData);
      }
      return rulesData;
    } catch (e) {
      return [];
    }
  };

  /* ---------------- Scroll Arrows ---------------- */
  const updateArrowVisibility = (cityIndex) => {
    const container = pgRefs.current[cityIndex];
    if (!container) return;

    const { scrollLeft, scrollWidth, clientWidth } = container;
    setArrowVisibility((prev) => {
      const next = [...prev];
      next[cityIndex] = {
        left: scrollLeft > 0,
        right: scrollLeft + clientWidth < scrollWidth - 1,
      };
      return next;
    });
  };

  const scrollPG = (cityIndex, direction) => {
    const container = pgRefs.current[cityIndex];
    if (!container) return;

    const scrollAmount = container.clientWidth;
    container.scrollBy({
      left: direction === "next" ? scrollAmount : -scrollAmount,
      behavior: "smooth",
    });

    setTimeout(() => updateArrowVisibility(cityIndex), 300);
  };

  useEffect(() => {
    cities.forEach((_, i) => updateArrowVisibility(i));
  }, [cities]);

  /* ---------------- Like/Unlike Hostel ---------------- */
  const toggleLike = async (pg, e) => {
    e.stopPropagation();

    try {
      const token = localStorage.getItem("hlopgToken");
      if (!token) {
        navigate("/RoleSelection"); // ✅ DIRECT ROLE PAGE
        return;
      }

      const res = await api.post(
        "/hostel/like-hostel",
        {
          hostel_id: pg.id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (res.data.success) {
        if (res.data.liked === true) {
          setLikedPgIds((prev) => [...prev, pg.id]);
        } else {
          setLikedPgIds((prev) => prev.filter((id) => id !== pg.id));
        }
      }
    } catch (err) {
      console.error("❌ Error liking hostel:", err);
    }
  };

  /* ---------------- APP DOWNLOAD POPUP ---------------- */
  const [showPopup, setShowPopup] = useState(false);
  const scrollPosRef = useRef(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      scrollPosRef.current = window.scrollY;
      document.body.classList.add("no-scroll");
      setShowPopup(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const closePopup = () => {
    setShowPopup(false);
    document.body.classList.remove("no-scroll");
    window.scrollTo(0, scrollPosRef.current);
  };

  /* ---------------- Card Click ---------------- */
  const handlePgCardClick = (pg) => {
    const token = localStorage.getItem("hlopgToken");

    if (!token) {
      navigate("/RoleSelection"); // ✅ DIRECT ROLE PAGE
    } else {
      navigate(`/hostel/${pg.id}`);
    }
  };

  /* ---------------- Render ---------------- */
  return (
    <div className="home">
      {/* ===== App Download Popup ===== */}
      {showPopup && (
        <div className="app-popup-overlay">
          <div className="app-popup-card">
            <button className="popup-close" onClick={closePopup}>
              ✕
            </button>

            <img src={logo} alt="logo" className="popup-app-img" />

            <h2>
              Download Our <span className="brand-text">HLOPG</span> Mobile App
            </h2>

            <p>Find hostels faster, easier & smarter with our app.</p>

            <div className="popup-buttons">
              <a href={PLAYSTORE_LINK} target="_blank" rel="noopener noreferrer">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                  alt="Google Play"
                />
              </a>

              <a href={APPSTORE_LINK} target="_blank" rel="noopener noreferrer">
                <img
                  src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
                  alt="App Store"
                />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ===== Hero Section ===== */}
      <div className="hero">
        <div className="overlay">
          <h1 className="title">HloPG</h1>
          <p className="subtitle">
            Because finding a PG shouldn't feel like a struggle.
          </p>
        </div>
      </div>

      {/* ===== City Sections ===== */}
      {cities.map((city, index) => {
        const cityRouteName =
          city.name.match(/in (\w+)/i)?.[1]?.toLowerCase() || "unknown";

        return (
          <div key={index} className="city-section">
            <div className="city-header">
              <h2>{city.name.replace("Hostel's in ", "")}</h2>

              {city.pgList.length > 0 && (
                <div
                  className="know-more-btn"
                  onClick={() => navigate(`/city/${cityRouteName}`)}
                >
                  See More...
                </div>
              )}
            </div>

            {city.pgList.length > 0 ? (
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

                <div className="pg-scroll-wrapper">
                  <div
                    className="pg-scroll"
                    ref={(el) => (pgRefs.current[index] = el)}
                    onScroll={() => updateArrowVisibility(index)}
                  >
                    <div className="pg-track">
                      {city.pgList.map((pg) => (
                        <div
                          key={pg.id}
                          className="home-pg-card fixed-width-card"
                        >
                          <div
                            className="pg-card-click"
                            onClick={() => handlePgCardClick(pg)}
                          >
                            <div className="pg-image">
                              <img
                                src={pg.img}
                                alt={pg.name}
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = defaultPGImg;
                                }}
                              />

                              <FaHeart
                                className={`wishlists ${
                                  likedPgIds.includes(pg.id)
                                    ? "liked"
                                    : "unliked"
                                }`}
                                onClick={(e) => toggleLike(pg, e)}
                              />
                            </div>

                            <div className="pg-details new-details">
                              <div className="pg-header new-header">
                                <h3 className="pg-name new-name">{pg.name}</h3>
                                <div className="pg-rating new-rating">
                                  <FaStar className="star" />
                                  <span>{pg.rating}</span>
                                </div>
                              </div>

                              <p className="pg-location new-location">
                                {pg.location}, {pg.city || ""}
                              </p>

                              {pg.pg_type && (
                                <div className="pg-type-badge">
                                  <FaHome />
                                  <span>{pg.pg_type} PG</span>
                                </div>
                              )}

                              <div className="sharing-price-section">
                                <div className="sharing-info">
                                  <FaUserFriends />
                                  <span className="sharing-text">
                                    {pg.sharing}
                                  </span>
                                </div>
                              </div>

                              <div className="facilities-section">
                                <h4 className="facilities-title">
                                  Facilities:
                                </h4>
                                <div className="facilities-grid">
                                  {pg.facilities.map((facility, i) => (
                                    <div key={i} className="facility-item">
                                      <span className="facility-icon">
                                        {facility.icon}
                                      </span>
                                      <span className="facility-name">
                                        {facility.name}
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
              </div>
            ) : (
              <div className="no-hostels-message">
                <p>
                  No hostels found in{" "}
                  {city.name.match(/in (\w+)/i)?.[1] || "this city"}. Check back
                  soon!
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default Home;
