import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { clearData } from '../db/db';
import ConfirmationModal from '../components/ConfirmationModal';

export default function Settings() {
    const [resetModal, setResetModal] = useState(false);

    const handleClearData = async () => {
        try {
            await clearData();
            alert('All data cleared successfully');
            window.location.reload();
        } catch (error) {
            console.error(error);
            alert('Failed to clear data');
        }
    };

    return (
        <div>
            <h2 style={{ marginBottom: 'var(--spacing-lg)' }}>Settings</h2>

            {/* Application Info */}
            <div className="card" style={{ marginBottom: 'var(--spacing-lg)' }}>
                <h3>About</h3>
                <p>Slyke Attend v1.2</p>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                    A simple offline-first attendance tracker.
                </p>
            </div>

            {/* Danger Zone */}
            <div className="card" style={{ border: '1px solid #FECACA' }}>
                <h3 style={{ color: '#DC2626', marginBottom: 'var(--spacing-md)' }}>Danger Zone</h3>
                <p style={{ marginBottom: 'var(--spacing-md)', fontSize: '0.9rem' }}>
                    These actions are destructive and cannot be undone.
                </p>

                <button
                    onClick={() => setResetModal(true)}
                    className="btn"
                    style={{
                        backgroundColor: '#DC2626',
                        color: 'white',
                        width: '100%',
                        justifyContent: 'center'
                    }}
                >
                    <Trash2 size={18} /> Reset All Data
                </button>
            </div>

            {/* Footer with Punchline */}
            <div className="card settings-footer">
                <p>LINUS build panna Bug aagadhu</p>
                <p>Bug aana mattum sollu</p>
            </div>

            <ConfirmationModal
                isOpen={resetModal}
                onClose={() => setResetModal(false)}
                onConfirm={handleClearData}
                title="Reset All Data"
                message="Are you sure you want to delete ALL subjects and attendance entries? This action is irreversible and will wipe your entire database."
                confirmText="Reset Everything"
                isDanger={true}
            />
        </div>
    );
}
