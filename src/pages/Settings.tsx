
import { useState } from 'react';
import { Trash2, CheckCircle, AlertTriangle } from 'lucide-react';
import { clearData } from '../db/db';

export default function Settings() {
    const [message, setMessage] = useState<string | null>(null);

    const handleReset = async () => {
        if (confirm('ARE YOU SURE? This will delete ALL data permanently.')) {
            await clearData();
            showMessage('All data cleared.');
        }
    };

    const showMessage = (msg: string) => {
        setMessage(msg);
        setTimeout(() => setMessage(null), 3000);
    };

    return (
        <div>
            <h2 style={{ marginBottom: 'var(--spacing-md)' }}>Settings</h2>

            {message && (
                <div style={{
                    marginBottom: 'var(--spacing-md)',
                    padding: 'var(--spacing-md)',
                    backgroundColor: '#ECFDF5',
                    color: '#047857',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                }}>
                    <CheckCircle size={20} /> {message}
                </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>

                {/* Danger Zone */}
                <section className="card" style={{ borderColor: 'var(--color-danger)' }}>
                    <h3 style={{ marginBottom: 'var(--spacing-md)', fontSize: '1.1em', color: 'var(--color-danger)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <AlertTriangle size={20} /> Danger Zone
                    </h3>

                    <button onClick={handleReset} className="btn" style={{
                        backgroundColor: '#FEF2F2',
                        color: '#DC2626',
                        justifyContent: 'flex-start',
                        gap: '12px',
                        width: '100%'
                    }}>
                        <Trash2 size={20} /> Reset All Data
                    </button>
                </section>

                {/* About */}
                <div style={{ marginTop: 'var(--spacing-xl)', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.9em' }}>
                    <p>Slyke-Attend Offline Edition</p>
                    <p>v1.0.0</p>
                </div>

            </div>
        </div>
    );
}
