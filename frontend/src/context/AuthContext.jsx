import React, { createContext, useContext, useEffect, useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await API.get("/user/profile");
        setUser(response.data.User);
        console.log(user);
      } catch (error) {
        if (error.response?.status === 403) {
          setUser(null);
        } else {
          console.error("Error fetching user profile:", error);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const register = async (username, password) => {
    try {
      const response = await API.post("/user/auth/register", { username, password });
      setUser(response.data.User);
    } catch (error) {
      throw error.response?.data?.message || "Registration failed. Please try again.";
    }
  };

  const login = async (username, password) => {
    try {
      const response = await API.post("/user/auth/login", { username, password });
      setUser(response.data.User);
    } catch (error) {
      throw error.response?.data?.message || "Invalid username or password.";
    }
  };

  const logout = async () => {
    try {
      await API.post("/user/auth/logout");
      setUser(null);
    } catch (error) {
      throw error.response?.data?.message || "Logout failed. Please try again.";
    }
  };

  const updateProfile = async ({ username, image }) => {
    try {
      console.log(image)
      const response = await API.put("/user/update-profile", {
        username,
        image
      });
      setUser(response.data.user);
    } catch (error) {
      throw error.response?.data?.message || "Failed to update profile.";
    }
  };

  const deleteProfile = async () => {
    try {
      await API.delete("/user/delete-profile");
      setUser(null);
    } catch (error) {
      throw error.response?.data?.message || "Failed to delete profile.";
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, register, login, logout, updateProfile, deleteProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);