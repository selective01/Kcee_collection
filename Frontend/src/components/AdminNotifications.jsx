import { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;
const STORAGE_KEY = "kcee_admin_notifications";
const COUNT_KEY = "kcee_admin_last_order_count"; // ← persisted across sessions

const getStored = () => {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
  catch { return []; }
};

const saveStored = (notifications) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
};

const getStoredCount = () => {
  const val = localStorage.getItem(COUNT_KEY);
  return val !== null ? parseInt(val, 10) : null;
};

const saveStoredCount = (count) => {
  localStorage.setItem(COUNT_KEY, String(count));
};

const typeStyles = {
  order:   { bg: "#f0fdf4", color: "#16a34a", icon: "fa-bag-shopping" },
  payment: { bg: "#dbeafe", color: "#1d4ed8", icon: "fa-circle-dollar-to-slot" },
  stock:   { bg: "#fff7ed", color: "#ea580c", icon: "fa-triangle-exclamation" },
};

export default function AdminNotifications() {
  const [notifications, setNotifications] = useState(getStored);
  const [open, setOpen] = useState(false);
  const lastOrderCountRef = useRef(getStoredCount()); // ← restored from localStorage on mount
  const dropdownRef = useRef(null);

  const unread = notifications.filter((n) => !n.read).length;

  const checkOrders = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await axios.get(`${BASE_URL}/api/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const orders = res.data;
      const currentCount = orders.length;

      // First ever run — no stored count at all, set baseline and exit
      if (lastOrderCountRef.current === null) {
        lastOrderCountRef.current = currentCount;
        saveStoredCount(currentCount);
        return;
      }

      // New orders detected — includes orders made while logged out
      if (currentCount > lastOrderCountRef.current) {
        const diff = currentCount - lastOrderCountRef.current;
        const newOrders = orders.slice(0, diff);

        const newNotifs = newOrders.map((o) => ({
          id: o._id,
          type: "order",
          title: "New Order Received",
          message: `₦${(o.totalPrice || 0).toLocaleString()} from ${o.customer?.fullName || "a customer"}`,
          time: new Date().toISOString(),
          read: false,
        }));

        const paidNotifs = newOrders
          .filter((o) => o.paymentStatus?.toLowerCase() === "paid")
          .map((o) => ({
            id: `pay_${o._id}`,
            type: "payment",
            title: "Payment Received",
            message: `₦${(o.totalPrice || 0).toLocaleString()} from ${o.customer?.fullName || "a customer"}`,
            time: new Date().toISOString(),
            read: false,
          }));

        // Persist the new count so next logout/login cycle works correctly
        lastOrderCountRef.current = currentCount;
        saveStoredCount(currentCount);

        setNotifications((prev) => {
          // Deduplicate by id to avoid double entries
          const existingIds = new Set(prev.map((n) => n.id));
          const fresh = [...newNotifs, ...paidNotifs].filter((n) => !existingIds.has(n.id));
          const updated = [...fresh, ...prev].slice(0, 50);
          saveStored(updated);
          return updated;
        });
      }
    } catch {
      // silent fail
    }
  }, []);

  useEffect(() => {
    checkOrders();
    const interval = setInterval(checkOrders, 30000);
    return () => clearInterval(interval);
  }, [checkOrders]);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const markAllRead = () => {
    const updated = notifications.map((n) => ({ ...n, read: true }));
    setNotifications(updated);
    saveStored(updated);
  };

  const clearAll = () => {
    setNotifications([]);
    saveStored([]);
  };

  const markRead = (id) => {
    const updated = notifications.map((n) => n.id === id ? { ...n, read: true } : n);
    setNotifications(updated);
    saveStored(updated);
  };

  const formatTime = (iso) => {
    const d = new Date(iso);
    const now = new Date();
    const diff = Math.floor((now - d) / 1000);
    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
  };

  return (
    <div ref={dropdownRef} style={{ position: "relative" }}>
      <button
        onClick={() => { setOpen(!open); if (!open) markAllRead(); }}
        style={{
          position: "relative", background: "none", border: "none",
          cursor: "pointer", padding: "6px", borderRadius: "8px",
          color: "#6b7280", transition: "background 0.2s",
        }}
        onMouseEnter={(e) => e.currentTarget.style.background = "#f1f5f9"}
        onMouseLeave={(e) => e.currentTarget.style.background = "none"}
        title="Notifications"
      >
        <i className="fa-solid fa-bell" style={{ fontSize: 18 }}></i>
        {unread > 0 && (
          <span style={{
            position: "absolute", top: 2, right: 2,
            background: "#dc2626", color: "#fff",
            fontSize: 10, fontWeight: 700,
            width: 16, height: 16, borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "'DM Sans', sans-serif",
          }}>
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 8px)", right: 0,
          width: 340, background: "#fff", borderRadius: 12,
          boxShadow: "0 8px 32px rgba(0,0,0,0.12)", zIndex: 9999,
          border: "1px solid #f1f5f9", overflow: "hidden",
        }}>
          <div style={{
            padding: "14px 16px", borderBottom: "1px solid #f1f5f9",
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <span style={{ fontSize: "0.9rem", fontWeight: 600, color: "#0f172a", fontFamily: "'DM Sans', sans-serif" }}>
              Notifications
              {unread > 0 && (
                <span style={{ background: "#dc2626", color: "#fff", fontSize: 10, padding: "2px 6px", borderRadius: 999, marginLeft: 6 }}>
                  {unread}
                </span>
              )}
            </span>
            <div style={{ display: "flex", gap: 8 }}>
              {notifications.length > 0 && (
                <>
                  <button onClick={markAllRead} style={{ background: "none", border: "none", fontSize: "0.72rem", color: "#3A9D23", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}>
                    Mark all read
                  </button>
                  <button onClick={clearAll} style={{ background: "none", border: "none", fontSize: "0.72rem", color: "#dc2626", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}>
                    Clear all
                  </button>
                </>
              )}
            </div>
          </div>

          <div style={{ maxHeight: 360, overflowY: "auto" }}>
            {notifications.length === 0 ? (
              <div style={{ padding: "32px 16px", textAlign: "center", color: "#9ca3af", fontFamily: "'DM Sans', sans-serif", fontSize: "0.85rem" }}>
                <i className="fa-solid fa-bell-slash" style={{ fontSize: 24, marginBottom: 8, display: "block" }}></i>
                No notifications yet
              </div>
            ) : (
              notifications.map((n) => {
                const style = typeStyles[n.type] || typeStyles.order;
                return (
                  <div
                    key={n.id}
                    onClick={() => markRead(n.id)}
                    style={{
                      padding: "12px 16px", display: "flex", gap: 12, alignItems: "flex-start",
                      borderBottom: "1px solid #f8fafc", cursor: "pointer",
                      background: n.read ? "#fff" : "#f8fafc",
                      transition: "background 0.15s",
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = "#f1f5f9"}
                    onMouseLeave={(e) => e.currentTarget.style.background = n.read ? "#fff" : "#f8fafc"}
                  >
                    <div style={{
                      width: 36, height: 36, borderRadius: 8, flexShrink: 0,
                      background: style.bg, color: style.color,
                      display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14,
                    }}>
                      <i className={`fa-solid ${style.icon}`}></i>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: "0.82rem", fontWeight: 600, color: "#0f172a", fontFamily: "'DM Sans', sans-serif" }}>{n.title}</span>
                        {!n.read && <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#3A9D23", flexShrink: 0 }} />}
                      </div>
                      <p style={{ margin: "2px 0 4px", fontSize: "0.78rem", color: "#6b7280", fontFamily: "'DM Sans', sans-serif", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {n.message}
                      </p>
                      <span style={{ fontSize: "0.72rem", color: "#9ca3af", fontFamily: "'DM Sans', sans-serif" }}>{formatTime(n.time)}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
