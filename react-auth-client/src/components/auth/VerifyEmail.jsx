// src/pages/VerifyEmail.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../../services/api.js"; // Assure-toi que api.verifyEmail existe

export default function VerifyEmail() {
  const { token } = useParams();
  const [status, setStatus] = useState("loading"); // loading | success | error
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await api.verifyEmail(token);
        setStatus("success");
        setMessage(res.data.message || "Merci d’avoir vérifié votre compte !");
        setTimeout(() => navigate("/login"), 3000); // redirection vers login après 3s
      } catch (err) {
        setStatus("error");
        setMessage(err.response?.data?.message || "Lien de vérification invalide ou expiré.");
      }
    };

    if (token) verify();
    else {
      setStatus("error");
      setMessage("Lien invalide.");
    }
  }, [token, navigate]);

  return (
    <div className="card p-4 shadow-sm" style={{ maxWidth: "500px", margin: "auto", textAlign: "center" }}>
      {status === "loading" && <p>Vérification en cours...</p>}
      {status === "success" && <div className="alert alert-success">{message} Vous allez être redirigé vers la page de connexion.</div>}
      {status === "error" && <div className="alert alert-danger">{message}</div>}
    </div>
  );
}
