import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { getSubject, addEntry } from '../db/db';
import type { Subject, AttendanceEntry } from '../db/types';

export default function MarkHours() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [subject, setSubject] = useState<Subject | null>(null);
    const [loading, setLoading] = useState(true);

    // Form State
    const [presentHours, setPresentHours] = useState('');
    const [absentHours, setAbsentHours] = useState('');
    const [reason, setReason] = useState('');
    const [topics, setTopics] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (id) loadSubject(id);
    }, [id]);

    const loadSubject = async (subId: string) => {
        try {
            const data = await getSubject(subId);
            if (data) setSubject(data);
            else alert('Subject not found');
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!subject || !id) return;

        const p = parseFloat(presentHours) || 0;
        const a = parseFloat(absentHours) || 0;

        if (p === 0 && a === 0) {
            alert('Please enter present or absent hours.');
            return;
        }

        setIsSubmitting(true);
        try {
            const entry: AttendanceEntry = {
                id: uuidv4(),
                subjectId: id,
                timestamp: Date.now(),
                presentHours: p,
                absentHours: a,
                reason: reason.trim() || undefined,
                topics: topics.trim() || undefined
            };

            await addEntry(entry);
            navigate(-1); // Go back (likely to detail page or home)
        } catch (e) {
            console.error(e);
            alert('Failed to save entry');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return <div className="container">Loading...</div>;
    if (!subject) return <div className="container">Subject not found</div>;

    return (
        <div>
            <h2 style={{ marginBottom: 'var(--spacing-sm)' }}>Mark Hours</h2>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--spacing-md)' }}>for {subject.name}</p>

            <form onSubmit={handleSubmit} className="card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: 'var(--spacing-xs)' }}>Present (Hrs)</label>
                        <input
                            type="number"
                            className="input"
                            value={presentHours}
                            onChange={(e) => setPresentHours(e.target.value)}
                            placeholder="0"
                            min="0"
                            step="0.5"
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: 'var(--spacing-xs)' }}>Absent (Hrs)</label>
                        <input
                            type="number"
                            className="input"
                            value={absentHours}
                            onChange={(e) => setAbsentHours(e.target.value)}
                            placeholder="0"
                            min="0"
                            step="0.5"
                        />
                    </div>
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: 'var(--spacing-xs)' }}>
                        Topics Covered <span style={{ fontSize: '0.8em', color: 'var(--color-text-muted)' }}>(Optional)</span>
                    </label>
                    <textarea
                        className="input"
                        rows={2}
                        value={topics}
                        onChange={(e) => setTopics(e.target.value)}
                        placeholder="What did you learn?"
                    />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: 'var(--spacing-xs)' }}>
                        Reason for Absence <span style={{ fontSize: '0.8em', color: 'var(--color-text-muted)' }}>(Optional)</span>
                    </label>
                    <textarea
                        className="input"
                        rows={2}
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="Why were you absent?"
                    />
                </div>

                <div style={{ display: 'flex', gap: 'var(--spacing-sm)', marginTop: 'var(--spacing-sm)' }}>
                    <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={isSubmitting}>
                        Save Entry
                    </button>
                    <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)} disabled={isSubmitting}>
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}
