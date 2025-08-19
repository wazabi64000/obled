import { useState } from "react";
import { useForm } from "react-hook-form";
import { api } from "../../services/api.js";

import { useNavigate } from "react-router-dom"; // <-- import


export default function PasswordReset() {
  const { register, handleSubmit, reset } = useForm();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); // <-- hook de navigation

const onSubmit = async (data) => {
  setMessage("");
  setError("");
  try {
    const res = await api.requestPasswordReset(data.email); // envoyer juste l’email
    setMessage(res.data.message);
    reset();

    // Désactiver le bouton pendant 2 sec (optionnel)
    setTimeout(() => navigate("/login"), 2000); // redirige vers login après 2s
  } catch (err) {
    setError(err.response?.data?.message || "Erreur lors de la demande.");
  }
};


  return (
    <div
      className="card p-4 shadow-sm"
      style={{ maxWidth: "400px", margin: "auto" }}
    >
      <h3 className="card-title text-center mb-4">
        Réinitialiser le mot de passe
      </h3>

      {error && <div className="alert alert-danger">{error}</div>}
      {message && <div className="alert alert-success">{message}</div>}

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-3">
          <input
            type="email"
            placeholder="Email"
            {...register("email")}
            className="form-control"
            required
          />
        </div>

        <button type="submit" className="btn btn-primary w-100">
          Envoyer le lien de réinitialisation
        </button>
      </form>
    </div>
  );
}
