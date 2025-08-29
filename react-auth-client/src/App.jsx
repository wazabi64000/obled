import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import Footer from "./components/layout/Footer";
import Navbar from "./components/layout/Navbar"; // on va créer Navbar
import VerifyEmail from "./components/auth/VerifyEmail";
import PasswordReset from "./pages/auth/PasswordReset";
import PasswordResetForm from "./components/auth/PasswordResetForm.jsx";

import "./App.css";
import CookieConsentBanner from "./components/layout/CookieConsent.jsx";

function App() {
  return (
    <Router>
      <Navbar />
      <CookieConsentBanner />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify/:token" element={<VerifyEmail />} />
        <Route path="/password-reset-request" element={<PasswordReset />} />
        <Route path="/password-reset/:token" element={<PasswordResetForm />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
