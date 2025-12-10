import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getSubject, updateSubject } from '../db/db';
import type { Subject } from '../db/types';
import { ArrowLeft, Save } from 'lucide-react';

export default function EditSubject() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [subject, setSubject] = useState<Subject | null>(null);
    const [name, setName] = useState('');
    const [weeklyHours, setWeeklyHours] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) loadSubject(id);
    }, [id]);

    const loadSubject = async (subjectId: string) => {
        try {
            const sub = await getSubject(subjectId);
            if (sub) {
                setSubject(sub);
                setName(sub.name);
                setWeeklyHours(sub.weeklyHours?.toString() || '');
            } else {
                alert('Subject not found');
                navigate('/');
            }
        } catch (error) {
            console.error(error);
            alert('Error loading subject');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!name || !weeklyHours || !id || !subject) {
            alert('Please fill in all fields');
            return;
        }

        const wHours = parseFloat(weeklyHours);

        if (isNaN(wHours) || wHours <= 0) {
            alert('Please enter a valid number of weekly hours');
            return;
        }

        // Derive total hours (assuming 15 week semester standard)
        const derivedTotalHours = wHours * 15;

        try {
            const updatedSubject: Subject = {
                ...subject,
                name,
                totalHours: derivedTotalHours,
                weeklyHours: wHours
            };
            await updateSubject(updatedSubject);
            navigate(`/subject/${id}`);
        } catch (error) {
            console.error(error);
            alert('Failed to update subject');
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-lg)' }}>
                <Link to={`/subject/${id}`} className="btn-icon" style={{ padding: '8px', borderRadius: '50%', backgroundColor: '#F3F4F6' }}>
                    <ArrowLeft size={24} color="#374151" />
                </Link>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#111827', margin: 0 }}>Edit Subject</h2>
            </div>

            <div className="card" style={{
                padding: 'var(--spacing-xl)',
                border: '1px solid #E5E7EB',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                borderRadius: '16px',
                background: 'white'
            }}>
                <div className="form-group" style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: '600', color: '#374151', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Subject Name
                    </label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Mathematics"
                        style={{
                            width: '100%',
                            padding: '12px 16px',
                            fontSize: '1rem',
                            borderRadius: '8px',
                            border: '1px solid #D1D5DB',
                            outline: 'none',
                            transition: 'border-color 0.2s, box-shadow 0.2s',
                            backgroundColor: '#F9FAFB'
                        }}
                        onFocus={(e) => {
                            e.target.style.borderColor = 'var(--color-primary)';
                            e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                            e.target.style.backgroundColor = 'white';
                        }}
                        onBlur={(e) => {
                            e.target.style.borderColor = '#D1D5DB';
                            e.target.style.boxShadow = 'none';
                            e.target.style.backgroundColor = '#F9FAFB';
                        }}
                    />
                </div>

                <div className="form-group" style={{ marginBottom: '24px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: '600', color: '#374151', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Weekly Hours
                    </label>
                    <input
                        type="number"
                        value={weeklyHours}
                        onChange={(e) => setWeeklyHours(e.target.value)}
                        placeholder="e.g. 4"
                        style={{
                            width: '100%',
                            padding: '12px 16px',
                            fontSize: '1rem',
                            borderRadius: '8px',
                            border: '1px solid #D1D5DB',
                            outline: 'none',
                            transition: 'border-color 0.2s, box-shadow 0.2s',
                            backgroundColor: '#F9FAFB'
                        }}
                        onFocus={(e) => {
                            e.target.style.borderColor = 'var(--color-primary)';
                            e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                            e.target.style.backgroundColor = 'white';
                        }}
                        onBlur={(e) => {
                            e.target.style.borderColor = '#D1D5DB';
                            e.target.style.boxShadow = 'none';
                            e.target.style.backgroundColor = '#F9FAFB';
                        }}
                    />
                </div>

                <button
                    onClick={handleSave}
                    className="btn btn-primary"
                    style={{
                        width: '100%',
                        padding: '14px',
                        fontSize: '1rem',
                        fontWeight: '600',
                        borderRadius: '8px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                >
                    <Save size={20} /> Save Changes
                </button>
            </div>
        </div>
    );
}
