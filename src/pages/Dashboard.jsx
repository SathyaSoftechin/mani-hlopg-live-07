// // // // // src/pages/Dashboard.jsx
// // // // import React, { useState, useEffect } from "react";
// // // // import {
// // // //   AreaChart,
// // // //   Area,
// // // //   XAxis,
// // // //   YAxis,
// // // //   CartesianGrid,
// // // //   Tooltip,
// // // //   ResponsiveContainer,
// // // // } from "recharts";
// // // // import "./Dashboard.css";
// // // // // import api, { BASE_URL } from "../api";
// // // // import api from "../api.jsx";



// // // // // Image Imports
// // // // import pg1 from "../assets/pg1.png";
// // // // // import pg2 from "../assets/pg2.png";
// // // // import userImg from "../assets/user.png";

// // // // const Dashboard = ({ user }) => {
// // // //   const token = localStorage.getItem("hlopgToken");

// // // //   /* ================= SAFE DEFAULT STATES ================= */
// // // //   const [pgs, setPgs] = useState([]);
// // // //   const [pgUpdate, setPgUpdate] = useState(null);

// // // //   const [membersIn, setMembersIn] = useState(null);
// // // //   const [membersOut, setMembersOut] = useState(null);

// // // //   const [bookingsCount, setBookingsCount] = useState(null);
// // // //   const [totalAmount, setTotalAmount] = useState(null);
// // // //   const [chartData, setChartData] = useState(null);

// // // //   const [complaints, setComplaints] = useState(null);
// // // //   const [reviews, setReviews] = useState(null);

// // // //   const [loadingPGs, setLoadingPGs] = useState(true);

// // // //   /* ================= MY PGs (WORKING & UNTOUCHED) ================= */
// // // //   useEffect(() => {
// // // //     const fetchOwnerPGs = async () => {
// // // //       try {
// // // //         const res = await api.get("/owner/pgs", {
// // // //           headers: { Authorization: `Bearer ${token}` },
// // // //         });
// // // //         setPgs(res.data?.data || []);
// // // //       } catch (err) {
// // // //         console.error("PG fetch failed", err);
// // // //       } finally {
// // // //         setLoadingPGs(false);
// // // //       }
// // // //     };

// // // //     fetchOwnerPGs();
// // // //   }, [token]);

// // // //   /* ================= DASHBOARD DATA (OPTIONAL) ================= */
// // // //   useEffect(() => {
// // // //     const fetchDashboardData = async () => {
// // // //       try {
// // // //         const res = await api.get("/dashboard/owner", {
// // // //           headers: { Authorization: `Bearer ${token}` },
// // // //         });

// // // //         const d = res.data || {};

// // // //         setPgUpdate(d.pgUpdate ?? null);
// // // //         setMembersIn(d.membersIn ?? null);
// // // //         setMembersOut(d.membersOut ?? null);
// // // //         setBookingsCount(d.bookingsCount ?? null);
// // // //         setTotalAmount(d.totalAmount ?? null);
// // // //         setChartData(d.bookingChart ?? null);
// // // //         setComplaints(d.complaints ?? null);
// // // //         setReviews(d.reviews ?? null);
// // // //       } catch (err) {
// // // //         console.warn("Dashboard API not ready yet");
// // // //         // ❗ DO NOTHING – keep UI alive
// // // //       }
// // // //     };

// // // //     fetchDashboardData();
// // // //   }, [token]);

// // // //   return (
// // // //     <div className="dashboard-container">
// // // //       {/* Greeting */}
// // // //       <h3 className="welcome-text">
// // // //         Hi, <span className="highlight">{user?.name || "Owner"}</span>. Welcome to{" "}
// // // //         <span className="highlight">HloPG</span> Admin!
// // // //       </h3>

// // // //       {/* ================= MY PGs ================= */}
// // // //       <section className="my-pgs-section">
// // // //         <h4 className="section-title">My PG’s</h4>

// // // //         {loadingPGs ? (
// // // //           <p>Loading PGs…</p>
// // // //         ) : (
// // // //           <div className="pg-cards">
// // // //             {pgs.length === 0 ? (
// // // //               <p>No PGs found</p>
// // // //             ) : (
// // // //               pgs.map((pg) => (
// // // //                 <div className="pg-card" key={pg._id}>
// // // //                   <img
// // // //                     src={
// // // //                       pg.images?.length
// // // //                         ? `${BASE_URL}${pg.images[0]}`
// // // //                         : pg1
// // // //                     }
// // // //                     alt={pg.hostel_name}
// // // //                   />
// // // //                   <p>{pg.hostel_name}</p>
// // // //                 </div>
// // // //               ))
// // // //             )}
// // // //           </div>
// // // //         )}
// // // //       </section>

// // // //       {/* ================= PG UPDATES ================= */}
// // // //       <section className="pg-updates">
// // // //         <h4 className="section-title">PG Daily Updates</h4>
// // // //         <div className="update-box">
// // // //           {pgUpdate ? <p>{pgUpdate}</p> : <p>Data needs to be fetched</p>}
// // // //         </div>
// // // //       </section>

// // // //       {/* ================= MEMBERS ================= */}
// // // //       <section className="members-lists">
// // // //         <div className="members-table">
// // // //           <h4 className="section-title">Members-in</h4>
// // // //           {membersIn ? (
// // // //             <table>
// // // //               <tbody>
// // // //                 {membersIn.map((m) => (
// // // //                   <tr key={m.id}>
// // // //                     <td>{m.name}</td>
// // // //                     <td>{m.age}</td>
// // // //                     <td>{m.shareType}</td>
// // // //                   </tr>
// // // //                 ))}
// // // //               </tbody>
// // // //             </table>
// // // //           ) : (
// // // //             <p>Data needs to be fetched</p>
// // // //           )}
// // // //         </div>

// // // //         <div className="members-table">
// // // //           <h4 className="section-title">Members-out</h4>
// // // //           {membersOut ? (
// // // //             <table>
// // // //               <tbody>
// // // //                 {membersOut.map((m) => (
// // // //                   <tr key={m.id}>
// // // //                     <td>{m.name}</td>
// // // //                     <td>{m.age}</td>
// // // //                     <td>{m.shareType}</td>
// // // //                   </tr>
// // // //                 ))}
// // // //               </tbody>
// // // //             </table>
// // // //           ) : (
// // // //             <p>Data needs to be fetched</p>
// // // //           )}
// // // //         </div>
// // // //       </section>

// // // //       {/* ================= BOOKINGS ================= */}
// // // //       <section className="bookings-section">
// // // //         {bookingsCount !== null ? (
// // // //           <>
// // // //             <p><b>Number of Bookings:</b> {bookingsCount}</p>
// // // //             <p><b>Amount Received:</b> ₹ {totalAmount}</p>

// // // //             {chartData && (
// // // //               <ResponsiveContainer width="100%" height={250}>
// // // //                 <AreaChart data={chartData}>
// // // //                   <CartesianGrid strokeDasharray="3 3" />
// // // //                   <XAxis dataKey="date" />
// // // //                   <YAxis />
// // // //                   <Tooltip />
// // // //                   <Area
// // // //                     type="monotone"
// // // //                     dataKey="count"
// // // //                     stroke="#5B5FF8"
// // // //                     fill="#5B5FF8"
// // // //                   />
// // // //                 </AreaChart>
// // // //               </ResponsiveContainer>
// // // //             )}
// // // //           </>
// // // //         ) : (
// // // //           <p>Data needs to be fetched</p>
// // // //         )}
// // // //       </section>

// // // //       {/* ================= COMPLAINTS ================= */}
// // // //       <section className="complaints-section">
// // // //         <h4 className="section-title">Complaints</h4>
// // // //         {complaints ? (
// // // //           <div className="cards">
// // // //             {complaints.map((c) => (
// // // //               <div className="card" key={c.id}>
// // // //                 <img src={userImg} alt="user" />
// // // //                 <div>
// // // //                   <h5>{c.name}</h5>
// // // //                   <p>{c.message}</p>
// // // //                 </div>
// // // //               </div>
// // // //             ))}
// // // //           </div>
// // // //         ) : (
// // // //           <p>Data needs to be fetched</p>
// // // //         )}
// // // //       </section>

// // // //       {/* ================= REVIEWS ================= */}
// // // //       <section className="reviews-section">
// // // //         <h4 className="section-title">Reviews</h4>
// // // //         {reviews ? (
// // // //           <div className="cards">
// // // //             {reviews.map((r) => (
// // // //               <div className="card" key={r.id}>
// // // //                 <img src={userImg} alt="user" />
// // // //                 <div>
// // // //                   <h5>{r.name}</h5>
// // // //                   <p>{r.comment}</p>
// // // //                   <div className="stars">⭐ {r.rating}</div>
// // // //                 </div>
// // // //               </div>
// // // //             ))}
// // // //           </div>
// // // //         ) : (
// // // //           <p>Data needs to be fetched</p>
// // // //         )}
// // // //       </section>
// // // //     </div>
// // // //   );
// // // // };

// // // // export default Dashboard;

// // // // src/pages/Dashboard.jsx
// // // import React, { useState, useEffect } from "react";
// // // import {
// // //   AreaChart,
// // //   Area,
// // //   XAxis,
// // //   YAxis,
// // //   CartesianGrid,
// // //   Tooltip,
// // //   ResponsiveContainer,
// // // } from "recharts";
// // // import "./Dashboard.css";
// // // import api from "../api";

// // // // Image Imports
// // // import pgDefaultImg from "../assets/pg1.png";
// // // import userImg from "../assets/user.png";
// // // import { FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa";

// // // const Dashboard = ({ user }) => {
// // //   const token = localStorage.getItem("hlopgToken");

// // //   /* ================= STATES ================= */
// // //   const [pgs, setPgs] = useState([]);
// // //   const [loadingPGs, setLoadingPGs] = useState(true);
// // //   const [dashboardData, setDashboardData] = useState(null);
// // //   const [loadingDashboard, setLoadingDashboard] = useState(true);
// // //   const [recentReviews, setRecentReviews] = useState([]);
// // //   const [recentComplaints, setRecentComplaints] = useState([]);

// // //   /* ================= FETCH MY PGs ================= */
// // //   useEffect(() => {
// // //     const fetchOwnerPGs = async () => {
// // //       try {
// // //         const res = await api.get("/hostel/owner/pgs", {
// // //           headers: { Authorization: `Bearer ${token}` },
// // //         });
        
// // //         if (res.data.success) {
// // //           const pgData = res.data.data || res.data.hostels || [];
// // //           const processedPGs = pgData.map(pg => ({
// // //             ...pg,
// // //             displayImage: pg.images?.[0] || pg.img || pgDefaultImg,
// // //             hostel_name: pg.hostel_name || pg.name,
// // //             area: pg.area || "N/A",
// // //             city: pg.city || "N/A"
// // //           }));
// // //           setPgs(processedPGs);
// // //         }
// // //       } catch (err) {
// // //         console.error("PG fetch failed", err);
// // //       } finally {
// // //         setLoadingPGs(false);
// // //       }
// // //     };

// // //     fetchOwnerPGs();
// // //   }, [token]);

// // //   /* ================= FETCH DASHBOARD DATA ================= */
// // //   useEffect(() => {
// // //     const fetchDashboardData = async () => {
// // //       try {
// // //         const res = await api.get("/api/dashboard/owner", {
// // //           headers: { Authorization: `Bearer ${token}` },
// // //         });
        
// // //         if (res.data.success) {
// // //           setDashboardData(res.data.dashboard);
// // //         }
// // //       } catch (err) {
// // //         console.warn("Dashboard API error:", err);
// // //         // Set sample data for demo
// // //         setDashboardData({
// // //           totalPGs: pgs.length,
// // //           totalBookings: 23,
// // //           totalRevenue: 125000,
// // //           activeMembers: 18,
// // //           pendingRequests: 7,
// // //           vacantRooms: 12,
// // //           monthlyGrowth: 25,
// // //           occupancyRate: 78,
// // //           monthlyRevenue: [
// // //             { month: "Jan", revenue: 95000 },
// // //             { month: "Feb", revenue: 105000 },
// // //             { month: "Mar", revenue: 115000 },
// // //             { month: "Apr", revenue: 120000 },
// // //             { month: "May", revenue: 125000 },
// // //             { month: "Jun", revenue: 130000 }
// // //           ]
// // //         });
// // //       } finally {
// // //         setLoadingDashboard(false);
// // //       }
// // //     };

// // //     fetchDashboardData();
// // //   }, [token, pgs.length]);

// // //   /* ================= FETCH RECENT REVIEWS ================= */
// // //   useEffect(() => {
// // //     const fetchRecentReviews = async () => {
// // //       try {
// // //         const res = await api.get("/reviews/owner", {
// // //           headers: { Authorization: `Bearer ${token}` },
// // //         });
        
// // //         if (res.data.data) {
// // //           setRecentReviews(res.data.data.slice(0, 3)); // Last 3 reviews
// // //         } else {
// // //           // Sample reviews for demo
// // //           setRecentReviews([
// // //             { id: 1, name: "Rahul Sharma", comment: "Great PG with clean facilities", rating: 4.5, pgName: "Green Valley PG" },
// // //             { id: 2, name: "Priya Patel", comment: "Good location and friendly staff", rating: 4, pgName: "Sunrise Hostel" },
// // //             { id: 3, name: "Amit Kumar", comment: "Value for money", rating: 3.5, pgName: "City Stay PG" }
// // //           ]);
// // //         }
// // //       } catch (err) {
// // //         console.warn("Reviews fetch failed, using sample data");
// // //         setRecentReviews([
// // //           { id: 1, name: "Rahul Sharma", comment: "Great PG with clean facilities", rating: 4.5 },
// // //           { id: 2, name: "Priya Patel", comment: "Good location and friendly staff", rating: 4 },
// // //           { id: 3, name: "Amit Kumar", comment: "Value for money", rating: 3.5 }
// // //         ]);
// // //       }
// // //     };

// // //     fetchRecentReviews();
// // //   }, [token]);

// // //   /* ================= FETCH RECENT COMPLAINTS ================= */
// // //   useEffect(() => {
// // //     const fetchRecentComplaints = async () => {
// // //       try {
// // //         // Assuming you have a complaints endpoint
// // //         const res = await api.get("/complaints/owner", {
// // //           headers: { Authorization: `Bearer ${token}` },
// // //         });
        
// // //         if (res.data.data) {
// // //           setRecentComplaints(res.data.data.slice(0, 3));
// // //         } else {
// // //           // Sample complaints for demo
// // //           setRecentComplaints([
// // //             { id: 1, name: "Vikram Singh", message: "Water heater not working", status: "Pending", pgName: "Green Valley PG" },
// // //             { id: 2, name: "Neha Gupta", message: "WiFi connectivity issues", status: "Resolved", pgName: "Sunrise Hostel" },
// // //             { id: 3, name: "Rajesh Nair", message: "Cleaning schedule not followed", status: "In Progress", pgName: "City Stay PG" }
// // //           ]);
// // //         }
// // //       } catch (err) {
// // //         console.warn("Complaints fetch failed, using sample data");
// // //         setRecentComplaints([
// // //           { id: 1, name: "Vikram Singh", message: "Water heater not working", status: "Pending" },
// // //           { id: 2, name: "Neha Gupta", message: "WiFi connectivity issues", status: "Resolved" },
// // //           { id: 3, name: "Rajesh Nair", message: "Cleaning schedule not followed", status: "In Progress" }
// // //         ]);
// // //       }
// // //     };

// // //     fetchRecentComplaints();
// // //   }, [token]);

// // //   /* ================= RENDER STARS ================= */
// // //   const renderStars = (rating = 0) => {
// // //     const stars = [];
// // //     const fullStars = Math.floor(rating);
// // //     const hasHalfStar = rating % 1 !== 0;

// // //     for (let i = 0; i < fullStars; i++) {
// // //       stars.push(<FaStar key={`full-${i}`} color="#FFD700" />);
// // //     }

// // //     if (hasHalfStar) {
// // //       stars.push(<FaStarHalfAlt key="half" color="#FFD700" />);
// // //     }

// // //     while (stars.length < 5) {
// // //       stars.push(
// // //         <FaRegStar key={`empty-${stars.length}`} color="#FFD700" />
// // //       );
// // //     }

// // //     return <div className="stars">{stars}</div>;
// // //   };

// // //   /* ================= LOADING SKELETON ================= */
// // //   if (loadingDashboard || loadingPGs) {
// // //     return (
// // //       <div className="dashboard-container">
// // //         <h3 className="welcome-text">Loading Dashboard...</h3>
// // //         <div className="loading-skeleton">
// // //           <div className="skeleton-row"></div>
// // //           <div className="skeleton-row"></div>
// // //           <div className="skeleton-row"></div>
// // //         </div>
// // //       </div>
// // //     );
// // //   }

// // //   return (
// // //     <div className="dashboard-container">
// // //       {/* Greeting */}
// // //       <h3 className="welcome-text">
// // //         Hi, <span className="highlight">{user?.name || "Owner"}</span>. Welcome to{" "}
// // //         <span className="highlight">HloPG</span> Admin!
// // //       </h3>

// // //       {/* ================= QUICK STATS ================= */}
// // //       {dashboardData && (
// // //         <section className="quick-stats">
// // //           <div className="stats-grid">
// // //             <div className="stat-card">
// // //               <div className="stat-icon" style={{ background: "#4CAF50" }}>
// // //                 🏠
// // //               </div>
// // //               <div className="stat-content">
// // //                 <h3>{dashboardData.totalPGs}</h3>
// // //                 <p>Total PGs</p>
// // //               </div>
// // //             </div>
            
// // //             <div className="stat-card">
// // //               <div className="stat-icon" style={{ background: "#2196F3" }}>
// // //                 📅
// // //               </div>
// // //               <div className="stat-content">
// // //                 <h3>{dashboardData.totalBookings}</h3>
// // //                 <p>Total Bookings</p>
// // //               </div>
// // //             </div>
            
// // //             <div className="stat-card">
// // //               <div className="stat-icon" style={{ background: "#FF9800" }}>
// // //                 ₹
// // //               </div>
// // //               <div className="stat-content">
// // //                 <h3>₹{dashboardData.totalRevenue?.toLocaleString()}</h3>
// // //                 <p>Total Revenue</p>
// // //               </div>
// // //             </div>
            
// // //             <div className="stat-card">
// // //               <div className="stat-icon" style={{ background: "#9C27B0" }}>
// // //                 👥
// // //               </div>
// // //               <div className="stat-content">
// // //                 <h3>{dashboardData.activeMembers}</h3>
// // //                 <p>Active Members</p>
// // //               </div>
// // //             </div>
// // //           </div>
// // //         </section>
// // //       )}

// // //       {/* ================= MY PGs SECTION ================= */}
// // //       <section className="my-pgs-section">
// // //         <h4 className="section-title">My PG's</h4>
        
// // //         {loadingPGs ? (
// // //           <p>Loading PGs...</p>
// // //         ) : pgs.length === 0 ? (
// // //           <div className="no-pgs">
// // //             <p>No PGs found. Upload your first PG!</p>
// // //           </div>
// // //         ) : (
// // //           <div className="pg-cards-grid">
// // //             {pgs.slice(0, 4).map((pg) => (
// // //               <div className="dashboard-pg-card" key={pg.hostel_id || pg.id}>
// // //                 <div className="pg-card-image">
// // //                   <img
// // //                     src={pg.displayImage}
// // //                     alt={pg.hostel_name}
// // //                     onError={(e) => {
// // //                       e.target.onerror = null;
// // //                       e.target.src = pgDefaultImg;
// // //                     }}
// // //                   />
// // //                 </div>
// // //                 <div className="pg-card-content">
// // //                   <h4>{pg.hostel_name}</h4>
// // //                   <p>{pg.area}, {pg.city}</p>
// // //                   <div className="pg-stats">
// // //                     <span>Rooms: {pg.total_rooms || 0}</span>
// // //                     <span>Vacant: {pg.vacant_rooms || 0}</span>
// // //                   </div>
// // //                 </div>
// // //               </div>
// // //             ))}
// // //             {pgs.length > 4 && (
// // //               <div className="view-all-card" onClick={() => window.location.href = "/owner-dashboard?tab=My PG's"}>
// // //                 <div className="view-all-content">
// // //                   <span>+{pgs.length - 4}</span>
// // //                   <p>View All PGs</p>
// // //                 </div>
// // //               </div>
// // //             )}
// // //           </div>
// // //         )}
// // //       </section>

// // //       <div className="dashboard-row">
// // //         {/* ================= REVENUE CHART ================= */}
// // //         {dashboardData?.monthlyRevenue && (
// // //           <section className="revenue-section">
// // //             <h4 className="section-title">Monthly Revenue</h4>
// // //             <div className="chart-container">
// // //               <ResponsiveContainer width="100%" height={250}>
// // //                 <AreaChart data={dashboardData.monthlyRevenue}>
// // //                   <CartesianGrid strokeDasharray="3 3" />
// // //                   <XAxis dataKey="month" />
// // //                   <YAxis />
// // //                   <Tooltip 
// // //                     formatter={(value) => [`₹${value.toLocaleString()}`, "Revenue"]}
// // //                   />
// // //                   <Area
// // //                     type="monotone"
// // //                     dataKey="revenue"
// // //                     stroke="#5B5FF8"
// // //                     fill="#5B5FF8"
// // //                     fillOpacity={0.3}
// // //                   />
// // //                 </AreaChart>
// // //               </ResponsiveContainer>
// // //             </div>
// // //             <div className="chart-footer">
// // //               <div className="chart-stat">
// // //                 <span className="stat-label">Monthly Growth</span>
// // //                 <span className="stat-value positive">+{dashboardData.monthlyGrowth}%</span>
// // //               </div>
// // //               <div className="chart-stat">
// // //                 <span className="stat-label">Occupancy Rate</span>
// // //                 <span className="stat-value">{dashboardData.occupancyRate}%</span>
// // //               </div>
// // //             </div>
// // //           </section>
// // //         )}

// // //         {/* ================= RECENT COMPLAINTS ================= */}
// // //         <section className="complaints-section">
// // //           <h4 className="section-title">Recent Complaints</h4>
// // //           {recentComplaints.length === 0 ? (
// // //             <p className="no-data">No complaints</p>
// // //           ) : (
// // //             <div className="complaints-list">
// // //               {recentComplaints.map((complaint) => (
// // //                 <div className="complaint-item" key={complaint.id}>
// // //                   <div className="complaint-avatar">
// // //                     <img src={userImg} alt={complaint.name} />
// // //                   </div>
// // //                   <div className="complaint-content">
// // //                     <div className="complaint-header">
// // //                       <h5>{complaint.name}</h5>
// // //                       <span className={`status-badge ${complaint.status?.toLowerCase()}`}>
// // //                         {complaint.status}
// // //                       </span>
// // //                     </div>
// // //                     <p className="complaint-message">{complaint.message}</p>
// // //                     {complaint.pgName && (
// // //                       <p className="complaint-pg">{complaint.pgName}</p>
// // //                     )}
// // //                   </div>
// // //                 </div>
// // //               ))}
// // //             </div>
// // //           )}
// // //           {recentComplaints.length > 0 && (
// // //             <button 
// // //               className="view-all-btn"
// // //               onClick={() => window.location.href = "#"} // Add your complaints page link
// // //             >
// // //               View All Complaints
// // //             </button>
// // //           )}
// // //         </section>
// // //       </div>

// // //       {/* ================= RECENT REVIEWS ================= */}
// // //       <section className="reviews-section">
// // //         <h4 className="section-title">Recent Reviews</h4>
// // //         {recentReviews.length === 0 ? (
// // //           <p className="no-data">No reviews yet</p>
// // //         ) : (
// // //           <div className="reviews-grid">
// // //             {recentReviews.map((review) => (
// // //               <div className="review-card" key={review.id}>
// // //                 <div className="review-header">
// // //                   <div className="review-avatar">
// // //                     <img 
// // //                       src={`https://ui-avatars.com/api/?name=${review.name}&background=random`}
// // //                       alt={review.name}
// // //                     />
// // //                   </div>
// // //                   <div className="reviewer-info">
// // //                     <h5>{review.name}</h5>
// // //                     {review.pgName && <p className="review-pg">{review.pgName}</p>}
// // //                   </div>
// // //                 </div>
// // //                 <p className="review-text">{review.comment}</p>
// // //                 <div className="review-footer">
// // //                   {renderStars(review.rating)}
// // //                   <span className="review-rating">{review.rating}/5</span>
// // //                 </div>
// // //               </div>
// // //             ))}
// // //           </div>
// // //         )}
// // //         {recentReviews.length > 0 && (
// // //           <button 
// // //             className="view-all-btn"
// // //             onClick={() => window.location.href = "/owner-dashboard?tab=Reviews"}
// // //           >
// // //             View All Reviews
// // //           </button>
// // //         )}
// // //       </section>
// // //     </div>
// // //   );
// // // };

// // // export default Dashboard;

// // // src/pages/Dashboard.jsx
// // import React, { useState, useEffect } from "react";
// // import "./Dashboard.css";
// // import api from "../api";

// // // Image Imports
// // import pgDefaultImg from "../assets/pg1.png";
// // import userImg from "../assets/user.png";
// // import { FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa";

// // const Dashboard = ({ user }) => {
// //   const token = localStorage.getItem("hlopgToken");

// //   /* ================= STATES ================= */
// //   const [pgs, setPgs] = useState([]);
// //   const [loadingPGs, setLoadingPGs] = useState(true);
// //   const [dashboardData, setDashboardData] = useState(null);
// //   const [recentReviews, setRecentReviews] = useState([]);
// //   const [recentComplaints, setRecentComplaints] = useState([]);

// //   /* ================= FETCH MY PGs ================= */
// //   useEffect(() => {
// //     const fetchOwnerPGs = async () => {
// //       try {
// //         const res = await api.get("/hostel/owner/pgs", {
// //           headers: { Authorization: `Bearer ${token}` },
// //         });
        
// //         if (res.data.success) {
// //           const pgData = res.data.data || res.data.hostels || [];
// //           const processedPGs = pgData.map(pg => {
// //             // Handle image URL
// //             let displayImage = pgDefaultImg;
// //             if (pg.images && pg.images.length > 0) {
// //               const img = pg.images[0];
// //               if (img.startsWith('http')) {
// //                 displayImage = img;
// //               } else if (img.startsWith('/')) {
// //                 displayImage = `https://hlopg.com${img}`;
// //               } else {
// //                 displayImage = `https://hlopg.com/uploads/${img}`;
// //               }
// //             } else if (pg.img) {
// //               if (pg.img.startsWith('http')) {
// //                 displayImage = pg.img;
// //               } else {
// //                 displayImage = `https://hlopg.com${pg.img}`;
// //               }
// //             }
            
// //             return {
// //               ...pg,
// //               displayImage: displayImage,
// //               hostel_name: pg.hostel_name || pg.name,
// //             };
// //           });
// //           setPgs(processedPGs);
// //           console.log("PGs loaded:", processedPGs.length);
// //         }
// //       } catch (err) {
// //         console.error("PG fetch failed", err);
// //       } finally {
// //         setLoadingPGs(false);
// //       }
// //     };

// //     if (token) {
// //       fetchOwnerPGs();
// //     }
// //   }, [token]);

// //   /* ================= FETCH DASHBOARD DATA ================= */
// //   useEffect(() => {
// //     const fetchDashboardData = async () => {
// //       try {
// //         const res = await api.get("/api/dashboard/owner", {
// //           headers: { Authorization: `Bearer ${token}` },
// //         });
        
// //         if (res.data.success) {
// //           setDashboardData(res.data.dashboard);
// //         }
// //       } catch (err) {
// //         console.warn("Dashboard API error:", err);
// //         // Set sample data for demo
// //         setDashboardData({
// //           totalBookings: 23,
// //           totalRevenue: 125000,
// //         });
// //       }
// //     };

// //     if (token) {
// //       fetchDashboardData();
// //     }
// //   }, [token]);

// //   /* ================= FETCH RECENT REVIEWS ================= */
// //   useEffect(() => {
// //     const fetchRecentReviews = async () => {
// //       try {
// //         const res = await api.get("/reviews/owner", {
// //           headers: { Authorization: `Bearer ${token}` },
// //         });
        
// //         if (res.data?.data && Array.isArray(res.data.data)) {
// //           setRecentReviews(res.data.data.slice(0, 3));
// //         }
// //       } catch (err) {
// //         console.warn("Reviews fetch failed:", err);
// //         // Sample reviews for demo
// //         setRecentReviews([
// //           { id: 1, name: "Rahul Sharma", comment: "Great PG with clean facilities", rating: 4.5 },
// //           { id: 2, name: "Priya Patel", comment: "Good location and friendly staff", rating: 4 },
// //           { id: 3, name: "Amit Kumar", comment: "Value for money", rating: 3.5 }
// //         ]);
// //       }
// //     };

// //     if (token) {
// //       fetchRecentReviews();
// //     }
// //   }, [token]);

// //   /* ================= FETCH RECENT COMPLAINTS ================= */
// //   useEffect(() => {
// //     const fetchRecentComplaints = async () => {
// //       try {
// //         // Try your complaints endpoint or use sample data
// //         const res = await api.get("/complaints/owner", {
// //           headers: { Authorization: `Bearer ${token}` },
// //         });
        
// //         if (res.data?.data && Array.isArray(res.data.data)) {
// //           setRecentComplaints(res.data.data.slice(0, 3));
// //         }
// //       } catch (err) {
// //         console.warn("Complaints fetch failed, using sample data");
// //         setRecentComplaints([
// //           { id: 1, name: "Vikram Singh", message: "Water heater not working", status: "Pending" },
// //           { id: 2, name: "Neha Gupta", message: "WiFi connectivity issues", status: "Resolved" },
// //           { id: 3, name: "Rajesh Nair", message: "Cleaning schedule not followed", status: "In Progress" }
// //         ]);
// //       }
// //     };

// //     if (token) {
// //       fetchRecentComplaints();
// //     }
// //   }, [token]);

// //   /* ================= RENDER STARS ================= */
// //   const renderStars = (rating = 0) => {
// //     const stars = [];
// //     const fullStars = Math.floor(rating);
// //     const hasHalfStar = rating % 1 !== 0;

// //     for (let i = 0; i < fullStars; i++) {
// //       stars.push(<FaStar key={`full-${i}`} color="#FFD700" />);
// //     }

// //     if (hasHalfStar) {
// //       stars.push(<FaStarHalfAlt key="half" color="#FFD700" />);
// //     }

// //     while (stars.length < 5) {
// //       stars.push(
// //         <FaRegStar key={`empty-${stars.length}`} color="#FFD700" />
// //       );
// //     }

// //     return <div className="stars">{stars}</div>;
// //   };

// //   /* ================= LOADING STATE ================= */
// //   if (loadingPGs) {
// //     return (
// //       <div className="dashboard-container">
// //         <h3 className="welcome-text">Loading Dashboard...</h3>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="dashboard-container">
// //       {/* Greeting */}
// //       <h3 className="welcome-text">
// //         Hi, <span className="highlight">{user?.name || "Owner"}</span>. Welcome to{" "}
// //         <span className="highlight">HloPG</span> Admin!
// //       </h3>

// //       {/* ================= MY PGs SECTION ================= */}
// //       <section className="my-pgs-section">
// //         <h4 className="section-title">My PG's</h4>
        
// //         {pgs.length === 0 ? (
// //           <div className="no-pgs">
// //             <p>No PGs found. Upload your first PG!</p>
// //           </div>
// //         ) : (
// //           <div className="pg-cards-grid">
// //             {pgs.map((pg) => (
// //               <div className="dashboard-pg-card" key={pg.hostel_id || pg.id}>
// //                 <div className="pg-card-image">
// //                   <img
// //                     src={pg.displayImage}
// //                     alt={pg.hostel_name}
// //                     onError={(e) => {
// //                       e.target.onerror = null;
// //                       e.target.src = pgDefaultImg;
// //                     }}
// //                   />
// //                 </div>
// //                 <div className="pg-card-name">
// //                   {pg.hostel_name}
// //                 </div>
// //               </div>
// //             ))}
// //           </div>
// //         )}
// //       </section>

// //       {/* ================= BOOKINGS & AMOUNT ================= */}
// //       {dashboardData && (
// //         <section className="bookings-section">
// //           <h4 className="section-title">Bookings & Revenue</h4>
// //           <div className="bookings-stats">
// //             <div className="booking-stat">
// //               <span className="stat-label">Total Bookings</span>
// //               <span className="stat-value">{dashboardData.totalBookings || 0}</span>
// //             </div>
// //             <div className="booking-stat">
// //               <span className="stat-label">Total Revenue</span>
// //               <span className="stat-value">₹{dashboardData.totalRevenue?.toLocaleString() || 0}</span>
// //             </div>
// //           </div>
// //         </section>
// //       )}

// //      {/* ================= COMPLAINTS ================= */}
// // <section className="complaints-section">
// //   <h4 className="section-title">Recent Complaints</h4>
// //   {recentComplaints.length === 0 ? (
// //     <p className="no-data">No complaints</p>
// //   ) : (
// //     <div className="complaints-cards-grid">
// //       {recentComplaints.map((complaint) => (
// //         <div className="complaint-card" key={complaint.id}>
// //           <div className="complaint-icon">
// //             {complaint.status === 'Resolved' ? (
// //               <span className="icon-resolved">✓</span>
// //             ) : complaint.status === 'In Progress' ? (
// //               <span className="icon-progress">⟳</span>
// //             ) : (
// //               <span className="icon-pending">!</span>
// //             )}
// //           </div>
// //           <div className="complaint-content">
// //             <h5>{complaint.name}</h5>
// //             <p className="complaint-message">{complaint.message}</p>
// //             <span className={`status-badge ${complaint.status?.toLowerCase().replace(' ', '-')}`}>
// //               {complaint.status}
// //             </span>
// //           </div>
// //         </div>
// //       ))}
// //     </div>
// //   )}
// // </section>

// //       {/* ================= REVIEWS ================= */}
// // <section className="reviews-section">
// //   <h4 className="section-title">Recent Reviews</h4>
// //   <div className="reviews-cards-grid">
// //     {/* Always show 3 dummy review cards */}
// //     <div className="review-card">
// //       <div className="review-icon">
// //         <div className="avatar-circle">S</div>
// //       </div>
// //       <div className="review-content">
// //         <h5>Sneha R.</h5>
// //         <p className="review-text">Great facilities and clean rooms. Staff is very cooperative.</p>
// //         <div className="review-rating-section">
// //           {renderStars(4.5)}
// //           <span className="rating-number">4.5/5</span>
// //         </div>
// //       </div>
// //     </div>
    
// //     <div className="review-card">
// //       <div className="review-icon">
// //         <div className="avatar-circle">M</div>
// //       </div>
// //       <div className="review-content">
// //         <h5>Mohit P.</h5>
// //         <p className="review-text">Good food quality and timely service. Happy with the stay.</p>
// //         <div className="review-rating-section">
// //           {renderStars(4)}
// //           <span className="rating-number">4/5</span>
// //         </div>
// //       </div>
// //     </div>
    
// //     <div className="review-card">
// //       <div className="review-icon">
// //         <div className="avatar-circle">K</div>
// //       </div>
// //       <div className="review-content">
// //         <h5>Kiran V.</h5>
// //         <p className="review-text">Comfortable stay at reasonable price. Would recommend to friends.</p>
// //         <div className="review-rating-section">
// //           {renderStars(4.2)}
// //           <span className="rating-number">4.2/5</span>
// //         </div>
// //       </div>
// //     </div>
// //   </div>
// // </section>
// //     </div>
// //   );
// // };

// // export default Dashboard;

// // src/pages/Dashboard.jsx
// import React, { useState, useEffect } from "react";
// import "./Dashboard.css";
// import api from "../api";

// // Image Imports
// import pgDefaultImg from "../assets/pg1.png";
// import { FaStar, FaRegStar, FaStarHalfAlt, FaUser } from "react-icons/fa";

// const Dashboard = ({ user }) => {
//   const token = localStorage.getItem("hlopgToken");

//   /* ================= STATES ================= */
//   const [pgs, setPgs] = useState([]);
//   const [loadingPGs, setLoadingPGs] = useState(true);
//   const [dashboardData, setDashboardData] = useState(null);
//   const [recentComplaints, setRecentComplaints] = useState([]);

//   /* ================= FETCH MY PGs ================= */
//   useEffect(() => {
//     const fetchOwnerPGs = async () => {
//       try {
//         const res = await api.get("/hostel/owner/pgs", {
//           headers: { Authorization: `Bearer ${token}` },
//         });
        
//         if (res.data.success) {
//           const pgData = res.data.data || res.data.hostels || [];
//           const processedPGs = pgData.map(pg => {
//             // Handle image URL
//             let displayImage = pgDefaultImg;
//             if (pg.images && pg.images.length > 0) {
//               const img = pg.images[0];
//               if (img.startsWith('http')) {
//                 displayImage = img;
//               } else if (img.startsWith('/')) {
//                 displayImage = `https://hlopg.com${img}`;
//               } else {
//                 displayImage = `https://hlopg.com/uploads/${img}`;
//               }
//             } else if (pg.img) {
//               if (pg.img.startsWith('http')) {
//                 displayImage = pg.img;
//               } else {
//                 displayImage = `https://hlopg.com${pg.img}`;
//               }
//             }
            
//             return {
//               ...pg,
//               displayImage: displayImage,
//               hostel_name: pg.hostel_name || pg.name,
//             };
//           });
//           setPgs(processedPGs);
//         }
//       } catch (err) {
//         console.error("PG fetch failed", err);
//       } finally {
//         setLoadingPGs(false);
//       }
//     };

//     if (token) {
//       fetchOwnerPGs();
//     }
//   }, [token]);

//   /* ================= FETCH DASHBOARD DATA ================= */
//   useEffect(() => {
//     const fetchDashboardData = async () => {
//       try {
//         const res = await api.get("/dashboard/owner", {
//           headers: { Authorization: `Bearer ${token}` },
//         });
        
//         if (res.data.success) {
//           setDashboardData(res.data.dashboard);
//         }
//       } catch (err) {
//         console.warn("Dashboard API error:", err);
//         // Set sample data for demo
//         setDashboardData({
//           totalBookings: 23,
//           totalRevenue: 125000,
//           bookingChart: [
//             { month: 'Jan', bookings: 12, revenue: 85000 },
//             { month: 'Feb', bookings: 18, revenue: 95000 },
//             { month: 'Mar', bookings: 15, revenue: 105000 },
//             { month: 'Apr', bookings: 22, revenue: 115000 },
//             { month: 'May', bookings: 25, revenue: 125000 },
//             { month: 'Jun', bookings: 28, revenue: 135000 }
//           ]
//         });
//       }
//     };

//     if (token) {
//       fetchDashboardData();
//     }
//   }, [token]);

//   /* ================= FETCH RECENT COMPLAINTS ================= */
//   useEffect(() => {
//     const fetchRecentComplaints = async () => {
//       try {
//         const res = await api.get("/complaints/owner", {
//           headers: { Authorization: `Bearer ${token}` },
//         });
        
//         if (res.data?.data && Array.isArray(res.data.data)) {
//           setRecentComplaints(res.data.data.slice(0, 3));
//         }
//       } catch (err) {
//         console.warn("Complaints fetch failed, using sample data");
//         setRecentComplaints([
//           { id: 1, name: "Vikram Singh", message: "Water heater not working in room 201", status: "Pending" },
//           { id: 2, name: "Neha Gupta", message: "WiFi connectivity issues in common area", status: "Resolved" },
//           { id: 3, name: "Rajesh Nair", message: "Cleaning schedule not followed this week", status: "In Progress" }
//         ]);
//       }
//     };

//     if (token) {
//       fetchRecentComplaints();
//     }
//   }, [token]);

//   /* ================= RENDER STARS ================= */
//   const renderStars = (rating = 0) => {
//     const stars = [];
//     const fullStars = Math.floor(rating);
//     const hasHalfStar = rating % 1 !== 0;

//     for (let i = 0; i < fullStars; i++) {
//       stars.push(<FaStar key={`full-${i}`} color="#FFD700" />);
//     }

//     if (hasHalfStar) {
//       stars.push(<FaStarHalfAlt key="half" color="#FFD700" />);
//     }

//     while (stars.length < 5) {
//       stars.push(
//         <FaRegStar key={`empty-${stars.length}`} color="#FFD700" />
//       );
//     }

//     return <div className="stars">{stars}</div>;
//   };

//   /* ================= LOADING STATE ================= */
//   if (loadingPGs) {
//     return (
//       <div className="dashboard-container">
//         <h3 className="welcome-text">Loading Dashboard...</h3>
//       </div>
//     );
//   }

//   return (
//     <div className="dashboard-container">
//       {/* Greeting */}
//       <h3 className="welcome-text">
//         Hi, <span className="highlight">{user?.name || "Owner"}</span>. Welcome to{" "}
//         <span className="highlight">HloPG</span> Admin!
//       </h3>

//       {/* ================= MY PGs SECTION ================= */}
//       <section className="my-pgs-section">
//         <h4 className="section-title">My PG's</h4>
        
//         {pgs.length === 0 ? (
//           <div className="no-pgs">
//             <p>No PGs found. Upload your first PG!</p>
//           </div>
//         ) : (
//           <div className="pg-cards-grid">
//             {pgs.map((pg) => (
//               <div className="dashboard-pg-card" key={pg.hostel_id || pg.id}>
//                 <div className="pg-card-image">
//                   <img
//                     src={pg.displayImage}
//                     alt={pg.hostel_name}
//                     onError={(e) => {
//                       e.target.onerror = null;
//                       e.target.src = pgDefaultImg;
//                     }}
//                   />
//                 </div>
//                 <div className="pg-card-name">
//                   {pg.hostel_name}
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </section>

//        {/* ================= BOOKINGS & AMOUNT CHART ================= */}
//       {dashboardData && dashboardData.bookingChart && (
//         <section className="bookings-section">
//           <h4 className="section-title">Bookings & Revenue Trend</h4>
//           <div className="chart-container">
//             <div className="chart-header">
//               <div className="chart-stats">
//                 <div className="chart-stat">
//                   <span className="stat-label">Total Bookings</span>
//                   <span className="stat-value">{dashboardData.totalBookings || 0}</span>
//                 </div>
//                 <div className="chart-stat">
//                   <span className="stat-label">Total Revenue</span>
//                   <span className="stat-value">₹{dashboardData.totalRevenue?.toLocaleString() || 0}</span>
//                 </div>
//               </div>
//             </div>
            
//             <div className="chart-wrapper">
//               <div className="y-axis">
//                 <span>Revenue (₹)</span>
//                 <div className="y-labels">
//                   <span>150K</span>
//                   <span>120K</span>
//                   <span>90K</span>
//                   <span>60K</span>
//                   <span>30K</span>
//                   <span>0</span>
//                 </div>
//               </div>
              
//               <div className="chart-content">
//                 <div className="x-axis">
//                   {dashboardData.bookingChart.map((item) => (
//                     <span key={item.month} className="x-label">{item.month}</span>
//                   ))}
//                 </div>
                
//                 <div className="chart-bars">
//                   {dashboardData.bookingChart.map((item, index) => (
//                     <div key={item.month} className="chart-bar-container">
//                       <div 
//                         className="chart-bar revenue" 
//                         style={{ height: `${(item.revenue / 150000) * 100}%` }}
//                         title={`Revenue: ₹${item.revenue.toLocaleString()}`}
//                       ></div>
//                       <div 
//                         className="chart-bar bookings" 
//                         style={{ height: `${(item.bookings / 30) * 100}%` }}
//                         title={`Bookings: ${item.bookings}`}
//                       ></div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
            
//             <div className="chart-legend">
//               <div className="legend-item">
//                 <div className="legend-color revenue"></div>
//                 <span>Revenue</span>
//               </div>
//               <div className="legend-item">
//                 <div className="legend-color bookings"></div>
//                 <span>Bookings</span>
//               </div>
//             </div>
//           </div>
//         </section>
//       )}


//       {/* ================= COMPLAINTS ================= */}
//       <section className="complaints-section">
//         <h4 className="section-title">Recent Complaints</h4>
//         {recentComplaints.length === 0 ? (
//           <p className="no-data">No complaints</p>
//         ) : (
//           <div className="complaints-cards-grid">
//             {recentComplaints.map((complaint) => (
//               <div className="complaint-card" key={complaint.id}>
//                 <div className="complaint-icon">
//                   <FaUser />
//                 </div>
//                 <div className="complaint-content">
//                   <div className="complaint-header">
//                     <h5>{complaint.name}</h5>
//                     <span className={`status-badge ${complaint.status?.toLowerCase().replace(' ', '-')}`}>
//                       {complaint.status}
//                     </span>
//                   </div>
//                   <p className="complaint-message">{complaint.message}</p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </section>

//       {/* ================= REVIEWS ================= */}
//       <section className="reviews-section">
//         <h4 className="section-title">Recent Reviews</h4>
//         <div className="reviews-cards-grid">
//           <div className="review-card">
//             <div className="review-header">
//               <div className="review-avatar">
//                 <FaUser />
//               </div>
//               <div className="reviewer-info">
//                 <h5>Sneha R.</h5>
//                 {renderStars(4.5)}
//               </div>
//             </div>
//             <p className="review-text">Great facilities and clean rooms. Staff is very cooperative.</p>
//           </div>
          
//           <div className="review-card">
//             <div className="review-header">
//               <div className="review-avatar">
//                 <FaUser />
//               </div>
//               <div className="reviewer-info">
//                 <h5>Mohit P.</h5>
//                 {renderStars(4)}
//               </div>
//             </div>
//             <p className="review-text">Good food quality and timely service. Happy with the stay.</p>
//           </div>
          
//           <div className="review-card">
//             <div className="review-header">
//               <div className="review-avatar">
//                 <FaUser />
//               </div>
//               <div className="reviewer-info">
//                 <h5>Kiran V.</h5>
//                 {renderStars(4.2)}
//               </div>
//             </div>
//             <p className="review-text">Comfortable stay at reasonable price. Would recommend to friends.</p>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// };

// export default Dashboard;

// src/pages/Dashboard.jsx
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
          const processedPGs = pgData.map(pg => {
            // Handle image URL
            let displayImage = pgDefaultImg;
            if (pg.images && pg.images.length > 0) {
              const img = pg.images[0];
              if (img.startsWith('http')) {
                displayImage = img;
              } else if (img.startsWith('/')) {
                displayImage = `https://hlopg.com${img}`;
              } else {
                displayImage = `https://hlopg.com/uploads/${img}`;
              }
            } else if (pg.img) {
              if (pg.img.startsWith('http')) {
                displayImage = pg.img;
              } else {
                displayImage = `https://hlopg.com${pg.img}`;
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
    }
  }, [token]);

  /* ================= FETCH DASHBOARD DATA ================= */
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await api.get("/api/dashboard/owner", {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        if (res.data.success) {
          setDashboardData(res.data.dashboard);
        }
      } catch (err) {
        console.warn("Dashboard API error:", err);
        // Set sample data for demo
        setDashboardData({
          totalBookings: 23,
          totalRevenue: 125000,
          bookingChart: [
            { month: 'Jan', bookings: 12, revenue: 85000 },
            { month: 'Feb', bookings: 18, revenue: 95000 },
            { month: 'Mar', bookings: 15, revenue: 105000 },
            { month: 'Apr', bookings: 22, revenue: 115000 },
            { month: 'May', bookings: 25, revenue: 125000 },
            { month: 'Jun', bookings: 28, revenue: 135000 }
          ]
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
          { id: 1, name: "Vikram Singh", message: "Water heater not working in room 201", status: "Pending" },
          { id: 2, name: "Neha Gupta", message: "WiFi connectivity issues in common area", status: "Resolved" },
          { id: 3, name: "Rajesh Nair", message: "Cleaning schedule not followed this week", status: "In Progress" }
        ]);
      }
    };

    if (token) {
      fetchRecentComplaints();
    }
  }, [token]);

  /* ================= RENDER STARS ================= */
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
      stars.push(
        <FaRegStar key={`empty-${stars.length}`} color="#FFD700" />
      );
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
        Hi, <span className="highlight">{user?.name || "Owner"}</span>. Welcome to{" "}
        <span className="highlight">HloPG</span> Admin!
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
                <div className="pg-card-name">
                  {pg.hostel_name}
                </div>
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
                  <span className="stat-value">{dashboardData.totalBookings || 0}</span>
                </div>
                <div className="chart-stat">
                  <span className="stat-label">Total Revenue</span>
                  <span className="stat-value">₹{dashboardData.totalRevenue?.toLocaleString() || 0}</span>
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
                    <span key={item.month} className="x-label">{item.month}</span>
                  ))}
                </div>
                
                <div className="chart-bars">
                  {dashboardData.bookingChart.map((item, index) => (
                    <div key={item.month} className="chart-bar-container">
                      <div 
                        className="chart-bar revenue" 
                        style={{ height: `${(item.revenue / 150000) * 100}%` }}
                        title={`Revenue: ₹${item.revenue.toLocaleString()}`}
                      ></div>
                      <div 
                        className="chart-bar bookings" 
                        style={{ height: `${(item.bookings / 30) * 100}%` }}
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
                    <span className={`status-badge ${complaint.status?.toLowerCase().replace(' ', '-')}`}>
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
            <p className="review-text">Great facilities and clean rooms. Staff is very cooperative.</p>
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
            <p className="review-text">Good food quality and timely service. Happy with the stay.</p>
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
            <p className="review-text">Comfortable stay at reasonable price. Would recommend to friends.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;