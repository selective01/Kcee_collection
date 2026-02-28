import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

const BASE_URL = import.meta.env.VITE_API_URL;

export default function AdminUsers() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [entries, setEntries] = useState(10);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (user) fetchUsers();
  }, [user]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      // ✅ Read token directly from localStorage — reliable on refresh
      const token = localStorage.getItem("token");

      const res = await axios.get(`${BASE_URL}/api/admin/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUsers(res.data);
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      await axios.delete(`${BASE_URL}/api/admin/users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to delete user");
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <h1>Manage Users</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {loading && <p>Loading...</p>}

      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 15 }}>
        <div>
          Show{" "}
          <select value={entries} onChange={(e) => setEntries(Number(e.target.value))}>
            {[10, 25, 50, 100].map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>{" "}
          entries
        </div>
        <div>
          Search:{" "}
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users..."
          />
        </div>
      </div>

      <table border="1" cellPadding="5" cellSpacing="0" style={{ width: "100%" }}>
        <thead>
          <tr>
            <th>S/N</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.slice(0, entries).length === 0 ? (
            <tr>
              <td colSpan={6}>No users found</td>
            </tr>
          ) : (
            filteredUsers.slice(0, entries).map((u, index) => (
              <tr key={u._id}>
                <td>{index + 1}</td>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                <td>
                  <button
                    onClick={() => handleDelete(u._id)}
                    style={{ backgroundColor: "red", color: "#fff", marginRight: 5 }}
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => navigate(`/admin/shipping/${u._id}`)}
                    style={{ backgroundColor: "#1d4ed8", color: "#fff" }}
                  >
                    Shipping
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </>
  );
}