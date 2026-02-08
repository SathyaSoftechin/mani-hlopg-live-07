import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import api from "../api";

// Image Imports
import pgDefaultImg from "../assets/pg1.png";
import { FaStar, FaRegStar, FaStarHalfAlt, FaUser } from "react-icons/fa";

const Dashboard = ({ user }) => {
  const token = localStorage.getItem("hlopgToken");

  /* ================= STATES ================= */
  const [pgs, setPgs] = useState([]);
  const [loadingPGs, setLoadingPGs] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [recentComplaints, setRecentComplaints] = useState([]);

  /* ================= FETCH MY PGs ================= */
  useEffect(() => {
    const fetchOwnerPGs = async () => {
      try {
        const res = await api.get("/hostel/owner/pgs", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.success) {
          const pgData = res.data.data || res.data.hostels || [];

          const processedPGs = pgData.map((pg) => {
            let displayImage = pgDefaultImg;

            if (pg.images && pg.images.length > 0) {
              const img = pg.images[0];

              if (img.startsWith("http")) {
                displayImage = img;
              } else if (img.startsWith("/")) {
                displayImage = `https://hlopg.com${img}`;
              } else {
                displayImage = `https://hlopg.com/uploads/${img}`;
              }
            } else if (pg.img) {
              if (pg.img.startsWith("http")) {
                displayImage = pg.img;
              } else if (pg.img.startsWith("/")) {
                displayImage = `https://hlopg.com${pg.img}`;
              } else {
                displayImage = `https://hlopg.com/uploads/${pg.img}`;
              }
            }

            return {
              ...pg,
              displayImage: displayImage,
              hostel_name: pg.hostel_name || pg.name,
            };
          });

          setPgs(processedPGs);
        }
      } catch (err) {
        console.error("PG fetch failed", err);
      } finally {
        setLoadingPGs(false);
      }
    };

    if (token) {
      fetchOwnerPGs();
    } else {
      setLoadingPGs(false);
    }
  }, [token]);

  /* ================= FETCH DASHBOARD DATA ================= */
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await api.get("/dashboard/owner", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.success) {
          setDashboardData(res.data.dashboard);
        }
      } catch (err) {
        console.warn("Dashboard API error:", err);

        // fallback sample data
        setDashboardData({
          totalBookings: 23,
          totalRevenue: 125000,
          bookingChart: [
            { month: "Jan", bookings: 12, revenue: 85000 },
            { month: "Feb", bookings: 18, revenue: 95000 },
            { month: "Mar", bookings: 15, revenue: 105000 },
            { month: "Apr", bookings: 22, revenue: 115000 },
            { month: "May", bookings: 25, revenue: 125000 },
            { month: "Jun", bookings: 28, revenue: 135000 },
          ],
        });
      }
    };

    if (token) {
      fetchDashboardData();
    }
  }, [token]);

  /* ================= FETCH RECENT COMPLAINTS ================= */
  useEffect(() => {
    const fetchRecentComplaints = async () => {
      try {
        const res = await api.get("/complaints/owner", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data?.data && Array.isArray(res.data.data)) {
          setRecentComplaints(res.data.data.slice(0, 3));
        }
      } catch (err) {
        console.warn("Complaints fetch failed, using sample data");

        setRecentComplaints([
          {
            id: 1,
            name: "Vikram Singh",
            message: "Water heater not working in room 201",
            status: "Pending",
          },
          {
            id: 2,
            name: "Neha Gupta",
            message: "WiFi connectivity issues in common area",
            status: "Resolved",
          },
          {
            id: 3,
            name: "Rajesh Nair",
            message: "Cleaning schedule not followed this week",
            status: "In Progress",
          },
        ]);
      }
    };

    if (token) {
      fetchRecentComplaints();
    }
  }, [token]);

  /* ================= RENDER STARS (FIXED FUNCTION) ================= */
  const renderStars = (rating = 0) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`full-${i}`} color="#FFD700" />);
    }

    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half" color="#FFD700" />);
    }

    while (stars.length < 5) {
      stars.push(<FaRegStar key={`empty-${stars.length}`} color="#FFD700" />);
    }

    return <div className="stars">{stars}</div>;
  };

  /* ================= LOADING STATE ================= */
  if (loadingPGs) {
    return (
      <div className="dashboard-container">
        <h3 className="welcome-text">Loading Dashboard...</h3>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Greeting */}
      <h3 className="welcome-text">
        Hi, <span className="highlight">{user?.name || "Owner"}</span>. Welcome
        to <span className="highlight">HloPG</span> Admin!
      </h3>

      {/* ================= MY PGs SECTION ================= */}
      <section className="my-pgs-section">
        <h4 className="section-title">My PG's</h4>

        {pgs.length === 0 ? (
          <div className="no-pgs">
            <p>No PGs found. Upload your first PG!</p>
          </div>
        ) : (
          <div className="pg-cards-grid">
            {pgs.map((pg) => (
              <div className="dashboard-pg-card" key={pg.hostel_id || pg.id}>
                <div className="pg-card-image">
                  <img
                    src={pg.displayImage}
                    alt={pg.hostel_name}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = pgDefaultImg;
                    }}
                  />
                </div>
                <div className="pg-card-name">{pg.hostel_name}</div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ================= BOOKINGS & AMOUNT CHART ================= */}
      {dashboardData && dashboardData.bookingChart && (
        <section className="bookings-section">
          <h4 className="section-title">Bookings & Revenue Trend</h4>

          <div className="chart-container">
            <div className="chart-header">
              <div className="chart-stats">
                <div className="chart-stat">
                  <span className="stat-label">Total Bookings</span>
                  <span className="stat-value">
                    {dashboardData.totalBookings || 0}
                  </span>
                </div>

                <div className="chart-stat">
                  <span className="stat-label">Total Revenue</span>
                  <span className="stat-value">
                    ₹{dashboardData.totalRevenue?.toLocaleString() || 0}
                  </span>
                </div>
              </div>
            </div>

            <div className="chart-wrapper">
              <div className="y-axis">
                <span>Revenue (₹)</span>
                <div className="y-labels">
                  <span>150K</span>
                  <span>120K</span>
                  <span>90K</span>
                  <span>60K</span>
                  <span>30K</span>
                  <span>0</span>
                </div>
              </div>

              <div className="chart-content">
                <div className="x-axis">
                  {dashboardData.bookingChart.map((item) => (
                    <span key={item.month} className="x-label">
                      {item.month}
                    </span>
                  ))}
                </div>

                <div className="chart-bars">
                  {dashboardData.bookingChart.map((item) => (
                    <div key={item.month} className="chart-bar-container">
                      <div
                        className="chart-bar revenue"
                        style={{
                          height: `${(item.revenue / 150000) * 100}%`,
                        }}
                        title={`Revenue: ₹${item.revenue.toLocaleString()}`}
                      ></div>

                      <div
                        className="chart-bar bookings"
                        style={{
                          height: `${(item.bookings / 30) * 100}%`,
                        }}
                        title={`Bookings: ${item.bookings}`}
                      ></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="chart-legend">
              <div className="legend-item">
                <div className="legend-color revenue"></div>
                <span>Revenue</span>
              </div>

              <div className="legend-item">
                <div className="legend-color bookings"></div>
                <span>Bookings</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ================= COMPLAINTS ================= */}
      <section className="complaints-section">
        <h4 className="section-title">Recent Complaints</h4>

        {recentComplaints.length === 0 ? (
          <p className="no-data">No complaints</p>
        ) : (
          <div className="complaints-cards-grid">
            {recentComplaints.map((complaint) => (
              <div className="complaint-card" key={complaint.id}>
                <div className="complaint-icon">
                  <FaUser />
                </div>

                <div className="complaint-content">
                  <div className="complaint-header">
                    <h5>{complaint.name}</h5>

                    <span
                      className={`status-badge ${complaint.status
                        ?.toLowerCase()
                        .replace(" ", "-")}`}
                    >
                      {complaint.status}
                    </span>
                  </div>

                  <p className="complaint-message">{complaint.message}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ================= REVIEWS ================= */}
      <section className="reviews-section">
        <h4 className="section-title">Recent Reviews</h4>

        <div className="reviews-cards-grid">
          <div className="review-card">
            <div className="review-header">
              <div className="review-avatar">
                <FaUser />
              </div>

              <div className="reviewer-info">
                <h5>Sneha R.</h5>
                {renderStars(4.5)}
              </div>
            </div>

            <p className="review-text">
              Great facilities and clean rooms. Staff is very cooperative.
            </p>
          </div>

          <div className="review-card">
            <div className="review-header">
              <div className="review-avatar">
                <FaUser />
              </div>

              <div className="reviewer-info">
                <h5>Mohit P.</h5>
                {renderStars(4)}
              </div>
            </div>

            <p className="review-text">
              Good food quality and timely service. Happy with the stay.
            </p>
          </div>

          <div className="review-card">
            <div className="review-header">
              <div className="review-avatar">
                <FaUser />
              </div>

              <div className="reviewer-info">
                <h5>Kiran V.</h5>
                {renderStars(4.2)}
              </div>
            </div>

            <p className="review-text">
              Comfortable stay at reasonable price. Would recommend to friends.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
