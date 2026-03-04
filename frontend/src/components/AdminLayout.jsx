import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import AdminNotifications from "./AdminNotifications";

export default function AdminLayout() {
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f1f5f9" }}>
      <AdminSidebar />
      <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column" }}>
        {/* Topbar */}
        <div style={{
          background: "#fff", padding: "12px 24px",
          borderBottom: "1px solid #e5e7eb",
          display: "flex", alignItems: "center", justifyContent: "flex-end",
          position: "sticky", top: 0, zIndex: 100,
        }}>
          <AdminNotifications />
        </div>
        <Outlet />
      </div>
    </div>
  );
}