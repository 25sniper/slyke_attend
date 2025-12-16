
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Settings, ChevronLeft } from 'lucide-react';

export default function Layout() {
    const location = useLocation();
    const navigate = useNavigate();
    const isHome = location.pathname === '/';

    return (
        <div className="container">
            {/* Simple Header */}
            <header className="app-header">
                {!isHome ? (
                    <button onClick={() => navigate(-1)} className="btn-icon" aria-label="Go Back">
                        <ChevronLeft size={28} color="var(--color-text)" />
                    </button>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Slyke Attend</h1>
                        <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Offline Edition</span>
                    </div>
                )}

                {isHome && (
                    <Link to="/settings" className="btn-icon">
                        <Settings size={24} color="var(--color-text)" />
                    </Link>
                )}
            </header>

            {/* Main Content Area */}
            <main style={{ flex: 1 }}>
                <Outlet />
            </main>

            {/* Optional: Footer or status bar could go here */}
        </div>
    );
}
