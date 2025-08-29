// src/components/layout/Navbar.jsx
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [expanded, setExpanded] = useState(false);

  const toggleNavbar = () => setExpanded(!expanded);

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow sticky-top">
      <div className="container">
        <a className="navbar-brand fw-bold" href="/">
          MonApp
        </a>

        <button
          className="navbar-toggler"
          type="button"
          onClick={toggleNavbar}
          aria-controls="navbarSupportedContent"
          aria-expanded={expanded}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div
          className={`collapse navbar-collapse ${expanded ? "show" : ""}`}
          id="navbarSupportedContent"
        >
          {/* Left menu */}
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <a className="nav-link" href="/">
                Accueil
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/about">
                À propos
              </a>
            </li>
          </ul>

          {/* Right menu */}
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            {user ? (
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle d-flex align-items-center"
                  href="#"
                  id="userDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
           <img
            src={user.avatar || user.picture || "/default-profile.png"}
            alt={user.name || "Profil"}
            className="rounded-circle me-2"
            width="32"
            height="32"
          />

                  {user.username}
                </a>
                <ul
                  className="dropdown-menu dropdown-menu-end"
                  aria-labelledby="userDropdown"
                >
                  <li>
                    <a className="dropdown-item" href="/profile">
                      Profil
                    </a>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <button className=" btn btn-danger  ms-2" onClick={logout}>
                      Déconnexion
                    </button>
                  </li>
                </ul>
              </li>
            ) : (
              <>
                <li className="nav-item">
                  <a className="nav-link" href="/login">
                    Connexion
                  </a>
                </li>
                <li className="nav-item">
                  <a className="btn btn-primary ms-2" href="/register">
                    S’inscrire
                  </a>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
