import { useAuth } from '../context/AuthContext';
import './navbar.css';

export default function Navbar({ onNavigate, onLoginClick }) {
  const { user, isAuthenticated, logout } = useAuth();

  const goTo = (view) => {
    onNavigate(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isAdmin = user?.role === 'ADMIN';

  return (
    <nav
      className="navbar navbar-expand-lg bg-secondary text-uppercase fixed-top"
      id="mainNav"
    >
      <div className="container">

        {/* LOGO */}
        <a
          className="navbar-brand"
          href="#page-top"
          onClick={(e) => {
            e.preventDefault();
            goTo('home');
          }}
        >
          SOCIEDAD MÉDICA ALTAMIRA
        </a>

        {/* MENÚ HAMBURGUESA */}
        <button
          className="navbar-toggler text-uppercase font-weight-bold bg-primary text-white rounded"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarResponsive"
          aria-controls="navbarResponsive"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          Menú <i className="fas fa-bars ms-1"></i>
        </button>

        {/* ITEMS DEL NAV */}
        <div className="collapse navbar-collapse" id="navbarResponsive">
          <ul className="navbar-nav ms-auto">

            {/* INICIO */}
            <li className="nav-item mx-0 mx-lg-2">
              <a
                href="#inicio"
                className="nav-link px-lg-3 rounded nav-link-main"
                onClick={(e) => {
                  e.preventDefault();
                  goTo('home');
                }}
              >
                INICIO
              </a>
            </li>

            {/* RESERVAR HORA */}
            <li className="nav-item mx-0 mx-lg-2">
              <a
                href="#reserva"
                className="nav-link px-lg-3 rounded nav-link-main"
                onClick={(e) => {
                  e.preventDefault();
                  goTo('reserva');
                }}
              >
                RESERVAR HORA
              </a>
            </li>

            {/* PERFIL (SOLO LOGUEADO) */}
            {isAuthenticated && (
              <li className="nav-item mx-0 mx-lg-2">
                <a
                  href="#perfil"
                  className="nav-link px-lg-3 rounded nav-link-main"
                  onClick={(e) => {
                    e.preventDefault();
                    goTo('perfil');
                  }}
                >
                  MI PERFIL
                </a>
              </li>
            )}

            {/* ADMIN (SOLO ROLE ADMIN) */}
            {isAdmin && (
              <li className="nav-item mx-0 mx-lg-2">
                <a
                  href="#admin"
                  className="nav-link px-lg-3 rounded nav-link-admin"
                  onClick={(e) => {
                    e.preventDefault();
                    goTo('admin');
                  }}
                >
                  ADMIN
                </a>
              </li>
            )}

            {/* LOGIN / LOGOUT */}
            <li className="nav-item ms-lg-3">
              {!isAuthenticated ? (
                <button
                  type="button"
                  className="btn btn-primary btn-sm login-btn"
                  onClick={onLoginClick}
                >
                  Iniciar sesión
                </button>
              ) : (
                <div className="d-flex flex-column flex-lg-row align-items-lg-center gap-2 text-white">
                  <span className="fw-bold small saludo-usuario">
                    HOLA, {user?.email?.toUpperCase()}
                  </span>
                  <button
                    type="button"
                    className="btn btn-outline-light btn-sm"
                    onClick={logout}
                  >
                    Cerrar sesión
                  </button>
                </div>
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
