import { useEffect, useState } from "react";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [revenue, setRevenue] = useState(0);
  const [pendingOrders, setPendingOrders] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found.");

        const headers = { Authorization: `Bearer ${token}` };

        const [ordersRes, usersRes] = await Promise.all([
          axios.get(`${BASE_URL}/api/orders`, { headers }),
          axios.get(`${BASE_URL}/api/auth`, { headers }),
        ]);

        const ordersData = ordersRes.data || [];
        const usersData = usersRes.data || [];

        setOrders(ordersData);
        setUsers(usersData);
        setRevenue(ordersData.reduce((acc, o) => acc + (o.totalPrice || 0), 0));
        setPendingOrders(ordersData.filter((o) => o.status === "Pending").length);
      } catch (err) {
        setError(err.response?.data?.message || err.message || "Failed to load.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const cards = [
    {
      label: "Total Orders",
      value: orders.length,
      bg: "#1d4ed8",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0"/>
        </svg>
      ),
    },
    {
      label: "Total Revenue",
      value: `₦${revenue.toLocaleString()}`,
      bg: "#16a34a",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
        </svg>
      ),
    },
    {
      label: "Total Users",
      value: users.length,
      bg: "#dc2626",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
        </svg>
      ),
    },
    {
      label: "Pending Orders",
      value: pendingOrders,
      bg: "#d97706",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
        </svg>
      ),
    },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&display=swap');

        .dash-wrapper {
          font-family: 'DM Sans', sans-serif;
          padding: 0;
        }

        .dash-topbar {
          background: #fff;
          padding: 16px 28px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid #e5e7eb;
          margin-bottom: 28px;
        }

        .dash-topbar h1 {
          font-size: 1.4rem;
          font-weight: 600;
          color: #0f172a;
          letter-spacing: -0.3px;
        }

        .dash-breadcrumb {
          font-size: 0.82rem;
          color: #6b7280;
        }

        .dash-breadcrumb span {
          color: #1d4ed8;
          font-weight: 500;
        }

        .dash-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 20px;
          padding: 0 28px 28px;
        }

        .dash-card {
          border-radius: 10px;
          padding: 24px 20px 0;
          color: #fff;
          position: relative;
          overflow: hidden;
          box-shadow: 0 4px 15px rgba(0,0,0,0.15);
          animation: fadeUp 0.4s ease forwards;
          opacity: 0;
        }

        .dash-card:nth-child(1) { animation-delay: 0.05s; }
        .dash-card:nth-child(2) { animation-delay: 0.1s; }
        .dash-card:nth-child(3) { animation-delay: 0.15s; }
        .dash-card:nth-child(4) { animation-delay: 0.2s; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .dash-card-body {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 20px;
        }

        .dash-card-value {
          font-size: 2rem;
          font-weight: 700;
          line-height: 1;
          margin-bottom: 8px;
          letter-spacing: -1px;
        }

        .dash-card-label {
          font-size: 0.85rem;
          font-weight: 400;
          opacity: 0.9;
          letter-spacing: 0.2px;
        }

        .dash-card-icon {
          width: 52px;
          height: 52px;
          opacity: 0.25;
          flex-shrink: 0;
        }

        .dash-card-icon svg {
          width: 100%;
          height: 100%;
        }

        .dash-card-footer {
          background: rgba(0,0,0,0.15);
          margin: 0 -20px;
          padding: 10px 20px;
          font-size: 0.78rem;
          font-weight: 500;
          letter-spacing: 0.3px;
          cursor: pointer;
          transition: background 0.2s;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .dash-card-footer:hover {
          background: rgba(0,0,0,0.25);
        }

        .dash-card-footer svg {
          width: 13px;
          height: 13px;
        }

        .dash-loading {
          padding: 40px 28px;
          color: #6b7280;
          font-size: 0.9rem;
        }

        .dash-error {
          padding: 20px 28px;
          color: #dc2626;
          font-size: 0.9rem;
        }

        .dash-recent {
          margin: 0 28px 28px;
          background: #fff;
          border-radius: 10px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.06);
          overflow: hidden;
        }

        .dash-recent-header {
          padding: 16px 20px;
          border-bottom: 1px solid #f3f4f6;
          font-size: 0.95rem;
          font-weight: 600;
          color: #0f172a;
        }

        .dash-recent-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.85rem;
        }

        .dash-recent-table th {
          background: #f9fafb;
          padding: 10px 16px;
          text-align: left;
          font-weight: 500;
          color: #6b7280;
          font-size: 0.78rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          border-bottom: 1px solid #f3f4f6;
        }

        .dash-recent-table td {
          padding: 12px 16px;
          border-bottom: 1px solid #f9fafb;
          color: #374151;
        }

        .dash-recent-table tr:last-child td {
          border-bottom: none;
        }

        .dash-badge {
          display: inline-block;
          padding: 3px 10px;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 500;
        }

        .badge-pending { background: #fef3c7; color: #92400e; }
        .badge-paid { background: #d1fae5; color: #065f46; }
        .badge-shipped { background: #dbeafe; color: #1e40af; }
        .badge-delivered { background: #ede9fe; color: #5b21b6; }
      `}</style>

      <div className="dash-wrapper">
        {/* Top bar */}
        <div className="dash-topbar">
          <h1>Dashboard</h1>
          <div className="dash-breadcrumb">
            🏠 Home &rsaquo; <span>Dashboard</span>
          </div>
        </div>

        {loading && <div className="dash-loading">Loading dashboard...</div>}
        {error && <div className="dash-error">Error: {error}</div>}

        {!loading && !error && (
          <>
            {/* Stat Cards */}
            <div className="dash-cards">
              {cards.map((card, i) => (
                <div key={i} className="dash-card" style={{ background: card.bg }}>
                  <div className="dash-card-body">
                    <div>
                      <div className="dash-card-value">{card.value}</div>
                      <div className="dash-card-label">{card.label}</div>
                    </div>
                    <div className="dash-card-icon">{card.icon}</div>
                  </div>
                  <div className="dash-card-footer">
                    More info
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </div>
                </div>
              ))}
            </div>

            {/* Recent Orders Table */}
            <div className="dash-recent">
              <div className="dash-recent-header">Recent Orders</div>
              {orders.length === 0 ? (
                <div style={{ padding: "20px 16px", color: "#6b7280", fontSize: "0.85rem" }}>
                  No orders yet.
                </div>
              ) : (
                <table className="dash-recent-table">
                  <thead>
                    <tr>
                      <th>Customer</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.slice(0, 5).map((order) => (
                      <tr key={order._id}>
                        <td>{order.customer?.fullName || "N/A"}</td>
                        <td>₦{(order.totalPrice || 0).toLocaleString()}</td>
                        <td>
                          <span className={`dash-badge badge-${(order.status || "pending").toLowerCase()}`}>
                            {order.status || "Pending"}
                          </span>
                        </td>
                        <td>
                          {order.createdAt
                            ? new Date(order.createdAt).toLocaleDateString("en-GB", {
                                day: "2-digit", month: "short", year: "numeric",
                              })
                            : "N/A"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}
