
import { Link } from 'react-router-dom';
import type { Subject } from '../db/types';
import type { CalculatedStats } from '../utils/calculations';
import { PlusCircle } from 'lucide-react';

interface SubjectCardProps {
    subject: Subject;
    stats: CalculatedStats;
}

export default function SubjectCard({ subject, stats }: SubjectCardProps) {
    // Color coding based on percentage
    // < 75% = Danger, 75-85% = Warning check? For now just use primary/danger.
    const isDanger = stats.percentage < 75;

    return (
        <Link to={`/subject/${subject.id}`} className="card" style={{ display: 'block', textDecoration: 'none', color: 'inherit', transition: 'transform 0.2s' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--spacing-sm)' }}>
                <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '4px' }}>{subject.name}</h3>
                    <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                        {stats.totalPresent}h Present • {stats.totalAbsent}h Absent
                    </p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                    <div style={{
                        backgroundColor: isDanger ? '#FEE2E2' : '#EFF6FF',
                        color: isDanger ? '#DC2626' : '#2563EB',
                        padding: '2px 6px',
                        borderRadius: 'var(--radius-sm)',
                        fontWeight: 'bold',
                        fontSize: '0.8rem',
                        whiteSpace: 'nowrap'
                    }}>
                        {stats.percentage}%
                    </div>
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'var(--spacing-md)' }}>
                <span style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                    Total: {subject.totalHours}h
                </span>

                {/* Quick Action: Mark Hours */}
                <Link
                    to={`/subject/${subject.id}/mark`}
                    className="btn btn-secondary"
                    onClick={(e) => e.stopPropagation()} // Prevent card click
                    style={{ padding: '6px 12px', fontSize: '0.9rem', gap: '6px' }}
                >
                    <PlusCircle size={16} /> Mark
                </Link>
            </div>
        </Link>
    );
}
