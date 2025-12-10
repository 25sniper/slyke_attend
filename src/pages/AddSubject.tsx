import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { addSubject } from '../db/db';
import type { Subject } from '../db/types';

export default function AddSubject() {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [weeklyHours, setWeeklyHours] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const totalHours = weeklyHours ? parseFloat(weeklyHours) * 15 : 0;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !weeklyHours) return;

        setIsSubmitting(true);
        try {
            const newSubject: Subject = {
                id: uuidv4(),
                name,
                weeklyHours: parseFloat(weeklyHours),
                totalHours: parseFloat(weeklyHours) * 15,
                created: Date.now(),
            };

            await addSubject(newSubject);
            navigate('/');
        } catch (error) {
            console.error('Failed to add subject:', error);
            alert('Failed to save subject.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div>
            <h2 style={{ marginBottom: 'var(--spacing-md)' }}>Add New Subject</h2>

            <form onSubmit={handleSubmit} className="card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: 'var(--spacing-xs)' }}>Subject Name</label>
                    <input
                        type="text"
                        className="input"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Mathematics"
                        required
                        autoFocus
                    />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: 'var(--spacing-xs)' }}>
                        Weekly Hours
                        <span style={{ fontSize: '0.9em', color: 'var(--color-text-muted)', marginLeft: '8px' }}>
                            (Credits/Hours per week)
                        </span>
                    </label>
                    <input
                        type="number"
                        className="input"
                        value={weeklyHours}
                        onChange={(e) => setWeeklyHours(e.target.value)}
                        placeholder="e.g. 4"
                        min="0.5"
                        step="0.5"
                        required
                    />
                </div>

                <div style={{ padding: 'var(--spacing-sm)', backgroundColor: 'var(--color-bg)', borderRadius: 'var(--radius-sm)' }}>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9em' }}>
                        Calculated Semester Total (15 weeks):
                    </p>
                    <strong style={{ fontSize: '1.2em' }}>{totalHours} Hours</strong>
                </div>

                <div style={{ display: 'flex', gap: 'var(--spacing-sm)', marginTop: 'var(--spacing-sm)' }}>
                    <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={isSubmitting}>
                        {isSubmitting ? 'Saving...' : 'Save Subject'}
                    </button>
                    <button type="button" className="btn btn-secondary" onClick={() => navigate('/')} disabled={isSubmitting}>
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}
