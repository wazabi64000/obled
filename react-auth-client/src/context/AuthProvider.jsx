// src/context/AuthProvider.jsx
import { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import {jwtDecode} from "jwt-decode"; // utile pour décoder le token et avoir user info

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // infos de l’utilisateur connecté
  const [token, setToken] = useState(null); // JWT
  const [loading, setLoading] = useState(true); // indique si on est en train d’initialiser

  useEffect(() => {
    // --- 1) Vérifie si on a reçu un token dans l’URL (après Google OAuth)
    const params = new URLSearchParams(window.location.search);
    const tokenFromUrl = params.get("token");

    if (tokenFromUrl) {
      try {
        // On peut décoder directement le JWT (payload contient id, name, role, etc.)
        const decoded = jwtDecode(tokenFromUrl);

        const userData = {
          id: decoded.id,
          name: decoded.name,
          role: decoded.role,
          avatar: decoded.avatar ?? null,
        };

        // Stocker user + token
        setUser(userData);
        setToken(tokenFromUrl);
        localStorage.setItem("auth_user", JSON.stringify(userData));
        localStorage.setItem("auth_token", tokenFromUrl);

        // Nettoyer l’URL pour enlever ?token=...
        window.history.replaceState({}, document.title, window.location.pathname);
      } catch (err) {
        console.error("Token invalide reçu via URL :", err);
      }
    } else {
      // --- 2) Sinon, recharge depuis localStorage (connexion classique déjà faite)
      const storedUser = localStorage.getItem("auth_user");
      const storedToken = localStorage.getItem("auth_token");

      if (storedUser && storedToken) {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      }
    }

    setLoading(false);
  }, []);

  // --- Méthode login (utilisée par formulaire email + mot de passe)
  const login = (userData, jwtToken) => {
    setUser(userData);
    setToken(jwtToken);
    localStorage.setItem("auth_user", JSON.stringify(userData));
    localStorage.setItem("auth_token", jwtToken);
  };

  // --- Méthode logout
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("auth_user");
    localStorage.removeItem("auth_token");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
