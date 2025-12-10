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
    const [entryType, setEntryType] = useState<'present' | 'absent'>('present');
    const [hours, setHours] = useState('');
    const [notes, setNotes] = useState(''); // Unified notes field
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

        const h = parseFloat(hours) || 0;

        if (h <= 0) {
            alert('Please enter valid hours.');
            return;
        }

        setIsSubmitting(true);
        try {
            const entry: AttendanceEntry = {
                id: uuidv4(),
                subjectId: id,
                timestamp: Date.now(),
                presentHours: entryType === 'present' ? h : 0,
                absentHours: entryType === 'absent' ? h : 0,
                // Unified notes handling - mapping to reason/topics based on type for backward compatibility or simplicity
                topics: entryType === 'present' ? notes.trim() : undefined,
                reason: entryType === 'absent' ? notes.trim() : undefined
            };

            await addEntry(entry);
            navigate(-1); // Go back
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
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h2 style={{ marginBottom: 'var(--spacing-sm)' }}>Mark Hours</h2>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--spacing-md)' }}>for {subject.name}</p>

            <form onSubmit={handleSubmit} className="card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>

                {/* Type Toggles */}
                <div style={{ display: 'flex', background: '#F3F4F6', padding: '4px', borderRadius: '8px', marginBottom: '8px' }}>
                    <button
                        type="button"
                        onClick={() => setEntryType('present')}
                        style={{
                            flex: 1,
                            padding: '10px',
                            border: 'none',
                            background: entryType === 'present' ? 'white' : 'transparent',
                            color: entryType === 'present' ? '#059669' : '#6B7280',
                            fontWeight: '600',
                            borderRadius: '6px',
                            boxShadow: entryType === 'present' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px'
                        }}
                    >
                        <span style={{ fontSize: '1.2em' }}>✅</span> Present
                    </button>
                    <button
                        type="button"
                        onClick={() => setEntryType('absent')}
                        style={{
                            flex: 1,
                            padding: '10px',
                            border: 'none',
                            background: entryType === 'absent' ? 'white' : 'transparent',
                            color: entryType === 'absent' ? '#DC2626' : '#6B7280',
                            fontWeight: '600',
                            borderRadius: '6px',
                            boxShadow: entryType === 'absent' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px'
                        }}
                    >
                        <span style={{ fontSize: '1.2em' }}>❌</span> Absent
                    </button>
                </div>

                {/* Hours Input */}
                <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: '600', color: '#374151', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        number of hours
                    </label>
                    <input
                        type="number"
                        className="input"
                        value={hours}
                        onChange={(e) => setHours(e.target.value)}
                        placeholder="e.g. 1"
                        min="0.5"
                        step="0.5"
                        style={{
                            width: '100%',
                            padding: '12px 16px',
                            fontSize: '1.1rem',
                            fontWeight: '500',
                            borderRadius: '8px',
                            border: '1px solid #D1D5DB'
                        }}
                        autoFocus
                    />
                </div>

                {/* Conditional Notes */}
                <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: '600', color: '#374151', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        {entryType === 'present' ? 'Topics Covered' : 'Reason for Absence'} <span style={{ fontSize: '0.8em', color: 'var(--color-text-muted)', textTransform: 'none', fontWeight: 'normal' }}>(Optional)</span>
                    </label>
                    <textarea
                        className="input"
                        rows={3}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder={entryType === 'present' ? "What did you learn today?" : "Why were you absent?"}
                        style={{
                            width: '100%',
                            padding: '12px 16px',
                            borderRadius: '8px',
                            border: '1px solid #D1D5DB',
                            fontFamily: 'inherit'
                        }}
                    />
                </div>

                <div style={{ display: 'flex', gap: 'var(--spacing-sm)', marginTop: 'var(--spacing-sm)' }}>
                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{
                            flex: 1,
                            justifyContent: 'center',
                            backgroundColor: entryType === 'present' ? 'var(--color-primary)' : '#DC2626'
                        }}
                        disabled={isSubmitting}
                    >
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
