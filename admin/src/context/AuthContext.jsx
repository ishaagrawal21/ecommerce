import React, { createContext, useContext, useState, useEffect } from "react";
import { getCurrentAdmin, adminSignIn } from "../utills/apiHelper";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("admin_token");
      if (token) {
        try {
          const res = await getCurrentAdmin();
          const userData = res?.user || res?.result;
          if (userData && userData.role === "admin") {
            setUser(userData);
          } else {
            localStorage.removeItem("admin_token");
            localStorage.removeItem("admin_user");
            setUser(null);
          }
        } catch (err) {
          console.warn("Auth verify failed:", err);
          localStorage.removeItem("admin_token");
          localStorage.removeItem("admin_user");
          setUser(null);
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const login = async (credentials) => {
    try {
      const res = await adminSignIn(credentials);
      const token = res.token || res.result?.token;
      const userData = res.user || res.result?.user;

      if (!token || !userData || userData.role !== "admin") {
        return { success: false, message: "Access denied. Admin rights required." };
      }

      localStorage.setItem("admin_token", token);
      localStorage.setItem("admin_user", JSON.stringify(userData));
      setUser(userData);
      return { success: true };
    } catch (err) {
      console.error("Login failed:", err);
      return { success: false, message: err?.response?.data?.message || "Invalid credentials" };
    }
  };

  const logout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
