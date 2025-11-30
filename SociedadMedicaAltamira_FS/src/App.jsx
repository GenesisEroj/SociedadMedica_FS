import { useState, useEffect } from 'react'
import Navbar from './components/Navbar.jsx'
import Header from './components/Header.jsx'
import Portfolio from './components/Portfolio.jsx'
import About from './components/About.jsx'
import Contact from './components/Contact.jsx'
import Footer from './components/Footer.jsx'
import ScrollToTop from './components/ScrollToTop.jsx'
import LoginModal from './components/LoginModal.jsx'
import Reserva from './components/Reserva.jsx'
import Perfil from './components/Perfil.jsx'
import AdminReservas from './components/AdminReservas.jsx'

export default function App() {
    const [currentView, setCurrentView] = useState('home')
    const [isLoginOpen, setIsLoginOpen] = useState(false)

    const openLogin = () => setIsLoginOpen(true)
    const closeLogin = () => setIsLoginOpen(false)

    // Cada vez que cambias de vista, sube arriba
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }, [currentView])

    const renderContent = () => {
        if (currentView === 'reserva') {
            return <Reserva onRequestLogin={openLogin} />
        }

        if (currentView === 'perfil') {
            return <Perfil onRequestLogin={openLogin} />
        }

        if (currentView === 'admin') {
            return <AdminReservas onRequestLogin={openLogin} />
        }

        // HOME
        return (
            <>
                <Header />
                <Portfolio />
                <About />
                <Contact />
            </>
        )
    }

    return (
        <>
            <Navbar onNavigate={setCurrentView} onLoginClick={openLogin} />

            <main className="app-main">{renderContent()}</main>

            <Footer />
            <ScrollToTop />
            <LoginModal isOpen={isLoginOpen} onClose={closeLogin} />
        </>
    )
}
