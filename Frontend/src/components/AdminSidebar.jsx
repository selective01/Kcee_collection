import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const isActive = (path) =>
    path === "/admin"
      ? location.pathname === "/admin"
      : location.pathname.startsWith(path);

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  const navItems = [
    {
      to: "/admin",
      label: "Dashboard",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
        </svg>
      ),
    },
    {
      to: "/admin/orders",
      label: "Orders",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4H6zm1 1h10l2.5 3H4.5L7 3zM5 7h14v13H5V7zm5 2v2H8v2h2v2h2v-2h2v-2h-2V9h-2z"/>
        </svg>
      ),
    },
    {
      to: "/admin/products",
      label: "Products",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14l-5-5 1.41-1.41L12 14.17l7.59-7.59L21 8l-9 9z"/>
        </svg>
      ),
    },
    {
      to: "/admin/users",
      label: "Users",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
        </svg>
      ),
    },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&display=swap');

        .kcee-sidebar {
          width: 240px;
          min-height: 100vh;
          background: #0f172a;
          display: flex;
          flex-direction: column;
          font-family: 'DM Sans', sans-serif;
          flex-shrink: 0;
        }

        .sidebar-brand {
          background: #1d4ed8;
          padding: 18px 20px;
          font-size: 1.1rem;
          font-weight: 700;
          color: #fff;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          text-align: center;
        }

        .sidebar-user {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px 20px;
          border-bottom: 1px solid rgba(255,255,255,0.07);
        }

        .sidebar-avatar {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: #1d4ed8;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1rem;
          font-weight: 600;
          color: #fff;
          flex-shrink: 0;
        }

        .sidebar-user-info .name {
          font-size: 0.85rem;
          font-weight: 600;
          color: #f1f5f9;
        }

        .sidebar-user-info .status {
          font-size: 0.72rem;
          color: #4ade80;
          display: flex;
          align-items: center;
          gap: 4px;
          margin-top: 2px;
        }

        .sidebar-user-info .status::before {
          content: '';
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #4ade80;
          display: inline-block;
        }

        .sidebar-nav-label {
          padding: 16px 20px 6px;
          font-size: 0.68rem;
          font-weight: 600;
          color: rgba(255,255,255,0.3);
          letter-spacing: 1px;
          text-transform: uppercase;
        }

        .sidebar-nav {
          display: flex;
          flex-direction: column;
          flex: 1;
          padding-bottom: 16px;
        }

        .sidebar-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 11px 20px;
          color: rgba(255,255,255,0.55);
          text-decoration: none;
          font-size: 0.88rem;
          font-weight: 400;
          transition: background 0.15s, color 0.15s;
          border-left: 3px solid transparent;
        }

        .sidebar-link svg {
          width: 18px;
          height: 18px;
          flex-shrink: 0;
          opacity: 0.6;
          transition: opacity 0.15s;
        }

        .sidebar-link:hover {
          background: rgba(255,255,255,0.06);
          color: #fff;
        }

        .sidebar-link:hover svg {
          opacity: 1;
        }

        .sidebar-link.active {
          background: rgba(29, 78, 216, 0.2);
          color: #fff;
          border-left-color: #1d4ed8;
          font-weight: 500;
        }

        .sidebar-link.active svg {
          opacity: 1;
        }

        .sidebar-logout {
          margin: 8px 16px 0;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 14px;
          background: rgba(220, 38, 38, 0.15);
          color: #fca5a5;
          border: 1px solid rgba(220, 38, 38, 0.25);
          border-radius: 7px;
          font-size: 0.85rem;
          font-family: 'DM Sans', sans-serif;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s, color 0.2s;
          width: calc(100% - 32px);
        }

        .sidebar-logout:hover {
          background: rgba(220, 38, 38, 0.3);
          color: #fff;
        }

        .sidebar-logout svg {
          width: 16px;
          height: 16px;
          flex-shrink: 0;
        }
      `}</style>

      <div className="kcee-sidebar">
        {/* Brand */}
        <div className="sidebar-brand">KCEE Admin</div>

        {/* User info */}
        <div className="sidebar-user">
          <div className="sidebar-avatar">
            {user?.name?.charAt(0)?.toUpperCase() || "A"}
          </div>
          <div className="sidebar-user-info">
            <div className="name">{user?.name || "Admin"}</div>
            <div className="status">Online</div>
          </div>
        </div>

        {/* Nav */}
        <nav className="sidebar-nav">
          <div className="sidebar-nav-label">Main Navigation</div>

          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`sidebar-link ${isActive(item.to) ? "active" : ""}`}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}

          {/* Spacer */}
          <div style={{ flex: 1 }} />

          {/* Logout */}
          <button className="sidebar-logout" onClick={handleLogout}>
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
            </svg>
            Logout
          </button>
        </nav>
      </div>
    </>
  );
}
