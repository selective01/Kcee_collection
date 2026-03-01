import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // show spinner until auth verified

  // ✅ Initialize user on app load
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/me`);
        setUser(res.data); // backend should return user object
      } catch (err) {
        console.error("Failed to fetch profile:", err);
        logout(); // clear invalid token
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // ✅ Login
  const login = async (email, password) => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, { email, password });
      if (!res.data.token) throw new Error("No token returned");

      const { token, user } = res.data;

      localStorage.setItem("token", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setUser(user);

      return user;
    } catch (err) {
      throw err.response?.data?.msg || err.message || "Login failed";
    }
  };

  // ✅ Register
  const register = async (name, email, password, phone = "") => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/register`, { 
        name, email, password, phone 
      });
      if (!res.data.token) throw new Error("No token returned");

      const { token, user } = res.data;

      localStorage.setItem("token", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setUser(user);

      return user;
    } catch (err) {
      throw err.response?.data?.msg || err.message || "Registration failed";
    }
  };

  // ✅ Logout
  const logout = () => {
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
    setUser(null);
  };

  // ✅ Optional forgot password
  const forgotPassword = async (email) => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/forgot-password`, { email });
      return res.data.message;
    } catch (err) {
      throw err.response?.data?.msg || err.message || "Failed to send reset email";
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, forgotPassword }}>
      {children}
    </AuthContext.Provider>
  );
};

// ✅ Custom hook to use in components
export const useAuth = () => useContext(AuthContext);