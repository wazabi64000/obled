// src/context/AuthContext.jsx
import { createContext, useContext } from "react";

export const AuthContext = createContext(null);

// Hook personnalisé pour accéder au contexte
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth doit être utilisé dans un AuthProvider");
  return context;
};
