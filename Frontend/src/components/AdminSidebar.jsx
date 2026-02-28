import { Link, useLocation } from "react-router-dom";

export default function AdminSidebar() {
  const location = useLocation(); // Get current path

  // Helper to check if a link is active
  const isActive = (path) => location.pathname === path;

  return (
    <div className="admin-sidebar">
      <h2>KCEE Admin</h2>

      <nav>
        <Link
          to="/admin"
          className={isActive("/admin") ? "active-link" : ""}
        >
          Dashboard
        </Link>
        <Link
          to="/admin/orders"
          className={isActive("/admin/orders") ? "active-link" : ""}
        >
          Orders
        </Link>
        <Link
          to="/admin/products"
          className={isActive("/admin/products") ? "active-link" : ""}
        >
          Products
        </Link>
        <Link
          to="/admin/users"
          className={isActive("/admin/users") ? "active-link" : ""}
        >
          Users
        </Link>
      </nav>
    </div>
  );
}