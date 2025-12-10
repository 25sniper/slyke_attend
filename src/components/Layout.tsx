
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Settings } from 'lucide-react';

export default function Layout() {
    const location = useLocation();
    const isHome = location.pathname === '/';

    return (
        <div className="container">
            {/* Simple Header */}
            <header className="app-header">
                <Link to="/" style={{ display: 'flex', flexDirection: 'column' }}>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Slyke Attend</h1>
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Offline Edition</span>
                </Link>

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
