import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../../context/AuthContext.jsx";
import { api } from "../../services/api.js";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom"; // <-- import

export default function LoginForm() {
  const { login } = useAuth();
  const { register, handleSubmit, reset } = useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate(); // <-- hook de navigation

  const onSubmit = async (data) => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await api.login(data);

      if (res.data.token) {
        login(res.data.user, res.data.token);
        // Redirection après login
        navigate("/");
      }

      setSuccess(res.data.message || "Connexion réussie !");
      reset();
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de la connexion");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = api.googleAuthUrl();
  };

  return (
    <div
      className="card p-4 shadow-sm"
      style={{ maxWidth: "400px", margin: "auto" }}
    >
      <h3 className="card-title text-center mb-4">Connexion</h3>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

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

        <div className="mb-3">
          <input
            type="password"
            placeholder="Mot de passe"
            {...register("password")}
            className="form-control"
            required
          />
        </div>

        <div className="mb-2 text-end">
          <Link to="/password-reset-request" className="small text-decoration-none">
            Mot de passe oublié ?
          </Link>
        </div>

        <button
          type="submit"
          className="btn btn-primary w-100 mb-2"
          disabled={loading}
        >
          {loading ? "Connexion..." : "Se connecter"}
        </button>

        <button
          type="button"
          className="btn btn-light border w-100 d-flex align-items-center justify-content-center mb-2"
          onClick={handleGoogleLogin}
        >
          <FcGoogle size={24} className="me-2" /> Se connecter avec Google
        </button>

        <div className="text-center mt-3">
          <span>Pas encore de compte ? </span>
          <a href="/register" className="text-decoration-none">
            S’inscrire
          </a>
        </div>
      </form>
    </div>
  );
}
