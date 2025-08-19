// src/services/api.js
import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://obledapi.onrender.com/api/auth",
  withCredentials: true,
 
 
  
});
 

// Interceptor pour ajouter le token si présent
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Export nommé
export const api = {
  register: (formData) => API.post("/register", formData),
  login: (data) => API.post("/login", data),
  logout: () => API.post("/logout"),
  verifyEmail: (token) => API.get(`/verify/${token}`),
  resendVerification: (email) => API.post("/resend-verification", { email }),
  requestPasswordReset: (email) =>
    API.post("/password-reset-request", { email }),
resetPassword: (token, data) => API.post(`/reset-password/${token}`, data),

  googleAuthUrl: () => `${API.defaults.baseURL}/google`,
};
