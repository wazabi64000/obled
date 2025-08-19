import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { AuthProvider } from "./context/AuthProvider.jsx";
import App from "./App.jsx";

import "bootswatch/dist/spacelab/bootstrap.min.css";

import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // pour les dropdowns, modals, etc


createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>
);
