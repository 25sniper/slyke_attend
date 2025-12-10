
import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Trash2, PlusCircle, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import { getSubject, getEntriesBySubject, deleteSubject, deleteEntry } from '../db/db';
import type { Subject, AttendanceEntry } from '../db/types';
import { calculateStats, type CalculatedStats } from '../utils/calculations';

export default function SubjectDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [subject, setSubject] = useState<Subject | null>(null);
    const [entries, setEntries] = useState<AttendanceEntry[]>([]);
    const [stats, setStats] = useState<CalculatedStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) loadData(id);
    }, [id]);

    const loadData = async (subId: string) => {
        try {
            const sub = await getSubject(subId);
            if (!sub) {
                alert('Subject not found');
                navigate('/');
                return;
            }
            setSubject(sub);

            const ents = await getEntriesBySubject(subId);
            // Sort entries by timestamp desc
            ents.sort((a, b) => b.timestamp - a.timestamp);
            setEntries(ents);

            setStats(calculateStats(sub, ents));
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!id || !confirm('Are you sure you want to delete this subject? This cannot be undone.')) return;
        try {
            await deleteSubject(id);
            navigate('/');
        } catch (e) {
            console.error(e);
            alert('Failed to delete');
        }
    };

    const handleDeleteEntry = async (entryId: string) => {
        if (!confirm('Delete this entry?')) return;
        try {
            await deleteEntry(entryId);
            if (id) loadData(id);
        } catch (e) {
            console.error(e);
            alert('Failed to delete entry');
        }
    };

    if (loading) return <div className="container">Loading...</div>;
    if (!subject || !stats) return null;

    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-md)' }}>
                <Link to="/" className="btn-icon" style={{ padding: '4px' }}><ArrowLeft size={24} /></Link>
                <div style={{ flex: 1 }}>
                    <h2 style={{ flex: 1 }}>{subject.name}</h2>
                </div>

                <button onClick={handleDelete} className="btn-icon" style={{ color: 'var(--color-danger)' }}>
                    <Trash2 size={20} />
                </button>
            </div>

            {/* Stats Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-lg)' }}>
                <div className="card" style={{ textAlign: 'center', backgroundColor: stats.percentage < 75 ? '#FEE2E2' : '#EFF6FF' }}>
                    <div style={{ fontSize: '2em', fontWeight: 'bold', color: stats.percentage < 75 ? '#DC2626' : '#2563EB' }}>
                        {stats.percentage}%
                    </div>
                    <div style={{ fontSize: '0.9em', color: stats.percentage < 75 ? '#B91C1C' : '#1D4ED8' }}>Attendance</div>
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--spacing-md)', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                <span>Present: {stats.totalPresent}h</span>
                <span>Absent: {stats.totalAbsent}h</span>
                <span>Total: {subject.totalHours}h</span>
            </div>

            {/* Action Button */}
            <Link to={`/subject/${id}/mark`} className="btn btn-primary" style={{ width: '100%', marginBottom: 'var(--spacing-xl)', gap: 'var(--spacing-sm)' }}>
                <PlusCircle size={20} /> Mark Attendance Hours
            </Link>

            {/* History */}
            <h3 style={{ marginBottom: 'var(--spacing-md)' }}>History</h3>

            {entries.length === 0 ? (
                <p style={{ color: 'var(--color-text-muted)', textAlign: 'center' }}>No entries recorded yet.</p>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
                    {entries.map(entry => (
                        <div key={entry.id} className="card" style={{ padding: 'var(--spacing-md)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                <span style={{ fontWeight: '500' }}>
                                    {format(entry.timestamp, 'MMM d, yyyy h:mm a')}
                                </span>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <span style={{
                                        fontWeight: 'bold',
                                        color: entry.presentHours > 0 ? 'var(--color-success)' : 'var(--color-danger)'
                                    }}>
                                        {entry.presentHours > 0 ? `+${entry.presentHours}h Present` : `-${entry.absentHours}h Absent`}
                                    </span>
                                    <button
                                        onClick={() => handleDeleteEntry(entry.id)}
                                        className="btn-icon"
                                        style={{ color: 'var(--color-text-muted)', padding: '4px' }}
                                        title="Delete entry"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>

                            {(entry.topics || entry.reason) && (
                                <div style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginTop: '8px' }}>
                                    {entry.topics && <p>Move: {entry.topics}</p>}
                                    {entry.reason && <p>Reason: {entry.reason}</p>}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
