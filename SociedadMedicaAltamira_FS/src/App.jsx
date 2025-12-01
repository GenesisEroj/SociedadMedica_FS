// src/App.jsx
import { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext.jsx'; // 👈 Se usa para obtener user y logout

import Navbar from './components/Navbar.jsx';
import Header from './components/Header.jsx';
import Portfolio from './components/Portfolio.jsx';
import About from './components/About.jsx';
import Contact from './components/Contact.jsx';
import Footer from './components/Footer.jsx';
import ScrollToTop from './components/ScrollToTop.jsx';
import LoginModal from './components/LoginModal.jsx';
import Reserva from './components/Reserva.jsx';
import Perfil from './components/Perfil.jsx';
import AdminReservas from './components/AdminReservas.jsx';
// REMOVIDO: MisReservas ya no existe.

export default function App() {
  // ✅ OBTENEMOS LOGOUT DEL CONTEXTO DE AUTENTICACIÓN
  const { user, logout } = useAuth();
  const [currentView, setCurrentView] = useState('home');
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const openLogin = () => setIsLoginOpen(true);
  const closeLogin = () => setIsLoginOpen(false);

  // Lógica para redirección automática al iniciar sesión
  useEffect(() => {
    if (user) {
      // 🔎 Usamos primero user.role (normalizado en AuthContext) y, si no existe, caemos a user.rol
      const rawRole = user.role ?? user.rol;
      const role = rawRole?.toString().trim().toUpperCase();

      if (role === 'ADMIN') {
        setCurrentView('admin');
      } else {
        // Si es CLIENT (o cualquier otro), redirigimos a 'reserva'
        setCurrentView('reserva');
      }

      // Cerramos el modal de login después de iniciar sesión
      closeLogin();
    } else {
      setCurrentView('home');
    }
  }, [user]);

  // Normaliza la vista para que coincida con el Navbar (ej: 'reserva')
  const handleNavigate = (view) => {
    setCurrentView(
      view.toLowerCase().replace(/ /g, '-').replace(/_/g, '-')
    );
  };

  const renderContent = () => {
    // Normalizamos la vista actual antes del switch
    const normalizedView = currentView
      .toLowerCase()
      .replace(/ /g, '-')
      .replace(/_/g, '-');

    switch (normalizedView) {
      case 'home':
        return (
          <>
            <Header />
            <Portfolio />
            <About />
            <Contact />
          </>
        );

      case 'reserva':
        // Pasamos openLogin para que el componente pueda pedir iniciar sesión si es necesario
        return <Reserva onRequestLogin={openLogin} />;

      case 'perfil':
        // Si el usuario no está logueado, redirigimos a home
        if (!user) return <Header />;
        // La navegación 'perfil' puede ser genérica para mostrar la vista del usuario logueado.
        return <Perfil />;

      case 'admin': {
        // ✅ Usamos user.role (normalizado) con fallback a user.rol
        const rawRole = user?.role ?? user?.rol;
        const role = rawRole?.toString().trim().toUpperCase();

        if (role === 'ADMIN') {
          return <AdminReservas />;
        }
        return <Header />; // Redirige a Home si no es Admin
      }

      default:
        return <Header />;
    }
  };

  return (
    <>
      {/* ✅ PASAMOS props al Navbar (aunque él use useAuth internamente, no molesta) */}
      <Navbar
        onNavigate={handleNavigate}
        onLoginClick={openLogin}
        user={user}
        handleLogout={logout}
      />

      <main className="app-main">{renderContent()}</main>

      <Footer />
      <ScrollToTop />

      {/* Modal de login con isOpen / onClose */}
      <LoginModal isOpen={isLoginOpen} onClose={closeLogin} />
    </>
  );
}
