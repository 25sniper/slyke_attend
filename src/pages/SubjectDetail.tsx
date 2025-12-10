
import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Trash2, PlusCircle, ArrowLeft, Edit } from 'lucide-react';
import { format } from 'date-fns';
import { getSubject, getEntriesBySubject, deleteSubject, deleteEntry } from '../db/db';
import type { Subject, AttendanceEntry } from '../db/types';
import { calculateStats, type CalculatedStats } from '../utils/calculations';
import ConfirmationModal from '../components/ConfirmationModal';

export default function SubjectDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [subject, setSubject] = useState<Subject | null>(null);
    const [entries, setEntries] = useState<AttendanceEntry[]>([]);
    const [stats, setStats] = useState<CalculatedStats | null>(null);
    const [loading, setLoading] = useState(true);

    // Modal State
    const [deleteSubjectModal, setDeleteSubjectModal] = useState(false);
    const [deleteEntryModal, setDeleteEntryModal] = useState(false);
    const [entryToDelete, setEntryToDelete] = useState<string | null>(null);

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

    const confirmDeleteSubject = async () => {
        if (!id) return;
        try {
            await deleteSubject(id);
            navigate('/');
        } catch (e) {
            console.error(e);
            alert('Failed to delete');
        }
    };

    const confirmDeleteEntry = async () => {
        if (!entryToDelete) return;
        try {
            await deleteEntry(entryToDelete);
            if (id) loadData(id);
            setDeleteEntryModal(false);
            setEntryToDelete(null);
        } catch (e) {
            console.error(e);
            alert('Failed to delete entry');
        }
    };

    const handleDeleteEntryClick = (entryId: string) => {
        setEntryToDelete(entryId);
        setDeleteEntryModal(true);
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

                <Link to={`/subject/${id}/edit`} className="btn-icon" style={{ color: 'var(--color-text-muted)' }}>
                    <Edit size={20} />
                </Link>
            </div>

            {/* Stats Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-lg)' }}>
                <div className="card" style={{ textAlign: 'center', backgroundColor: '#ECFDF5' }}>
                    <div style={{ fontSize: '2em', fontWeight: 'bold', color: '#059669' }}>
                        {stats.currentPercentage}%
                    </div>
                    <div style={{ fontSize: '0.9em', color: '#047857' }}>Current %</div>
                </div>
                <div className="card" style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '2em', fontWeight: 'bold', color: 'var(--color-primary)' }}>
                        {stats.percentage}%
                    </div>
                    <div style={{ fontSize: '0.9em', color: 'var(--color-text-muted)' }}>Remaining %</div>
                </div>
                <div className="card" style={{ textAlign: 'center', gridColumn: 'span 2' }}>
                    <div style={{ fontSize: '2em', fontWeight: 'bold' }}>
                        {stats.canMissHours}h
                    </div>
                    <div style={{ fontSize: '0.9em', color: 'var(--color-text-muted)' }}>
                        Safe to Miss (to keep &ge; 75%)
                    </div>
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
                                        onClick={() => handleDeleteEntryClick(entry.id)}
                                        className="btn-icon"
                                        style={{
                                            color: '#DC2626',
                                            padding: '8px',
                                            backgroundColor: '#FEF2F2',
                                            borderRadius: '6px',
                                            marginLeft: '8px'
                                        }}
                                        title="Delete entry"
                                        aria-label="Delete entry"
                                    >
                                        <Trash2 size={18} />
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

            {/* Danger Zone */}
            <div style={{ marginTop: '40px', paddingTop: '20px', borderTop: '1px solid #E5E7EB' }}>
                <button onClick={() => setDeleteSubjectModal(true)} className="btn" style={{
                    backgroundColor: '#FEF2F2',
                    color: '#DC2626',
                    width: '100%',
                    justifyContent: 'center',
                    gap: '8px',
                    fontWeight: '600',
                    padding: '12px',
                    borderRadius: '8px'
                }}>
                    <Trash2 size={20} /> Delete Subject
                </button>
                <p style={{ textAlign: 'center', fontSize: '0.8rem', color: '#6B7280', marginTop: '8px' }}>
                    This action cannot be undone.
                </p>
            </div>

            {/* Modals */}
            <ConfirmationModal
                isOpen={deleteSubjectModal}
                onClose={() => setDeleteSubjectModal(false)}
                onConfirm={confirmDeleteSubject}
                title="Delete Subject"
                message={`Are you sure you want to delete "${subject.name}"? This will delete all attendance entries associated with it. This action cannot be undone.`}
                confirmText="Delete Subject"
                isDanger={true}
            />

            <ConfirmationModal
                isOpen={deleteEntryModal}
                onClose={() => {
                    setDeleteEntryModal(false);
                    setEntryToDelete(null);
                }}
                onConfirm={confirmDeleteEntry}
                title="Delete Entry"
                message="Are you sure you want to delete this attendance entry?"
                confirmText="Delete Entry"
                isDanger={true}
            />
        </div>
    );
}
