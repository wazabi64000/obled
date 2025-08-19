import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = async () => {
    try {
      const res = await fetch("/api/auth/user-profile", { credentials: "include" });
      if (!res.ok) throw new Error("Non authentifié");
      const data = await res.json();
      setUser({ name: data.message.replace("Bienvenue ", ""), avatar: data.avatar });
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  const login = async (email, password) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Erreur login");
    setUser(data.user);
  };

  const register = async (formData) => {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Erreur register");
    return data;
  };

  const requestPasswordReset = async (email) => {
    const res = await fetch("/api/auth/password-reset-request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  };

  const resetPassword = async (token, password, confirmPassword) => {
    const res = await fetch(`/api/auth/reset-password/${token}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password, confirmPassword }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  };

  const logout = async () => {
    // Optionnel: appeler une route backend pour supprimer le cookie
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, requestPasswordReset, resetPassword }}
    >
      {children}
    </AuthContext.Provider>
  );
};
