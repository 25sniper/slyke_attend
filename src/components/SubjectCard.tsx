
import { Link } from 'react-router-dom';
import type { Subject } from '../db/types';
import type { CalculatedStats } from '../utils/calculations';
import { PlusCircle } from 'lucide-react';

interface SubjectCardProps {
    subject: Subject;
    stats: CalculatedStats;
}

export default function SubjectCard({ subject, stats, dragHandle }: SubjectCardProps & { dragHandle?: React.ReactNode }) {
    // Info for styling
    const isDanger = stats.percentage < 75;

    return (
        <div className="card" style={{ display: 'flex', alignItems: 'stretch', padding: 0, overflow: 'hidden' }}>
            {/* Drag Handle Area - Merged Start */}
            {dragHandle && (
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0 8px', // Visual padding
                    backgroundColor: 'rgba(0,0,0,0.02)', // Subtle separation
                    borderRight: '1px solid var(--color-border)',
                    cursor: 'grab',
                    touchAction: 'none'
                }}>
                    {dragHandle}
                </div>
            )}

            {/* Main Content Area - Clickable Link */}
            <Link
                to={`/subject/${subject.id}`}
                style={{
                    flex: 1,
                    display: 'block',
                    textDecoration: 'none',
                    color: 'inherit',
                    padding: 'var(--spacing-lg)' // Move padding here from .card class
                }}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--spacing-sm)' }}>
                    <div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '4px' }}>{subject.name}</h3>
                        <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                            {stats.totalPresent}h Present • {stats.totalAbsent}h Absent
                        </p>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                        <div style={{
                            backgroundColor: '#DCFCE7',
                            color: '#166534',
                            padding: '2px 6px',
                            borderRadius: 'var(--radius-sm)',
                            fontWeight: 'bold',
                            fontSize: '0.8rem',
                            whiteSpace: 'nowrap'
                        }}>
                            Cur: {stats.currentPercentage}%
                        </div>
                        <div style={{
                            backgroundColor: isDanger ? '#FEE2E2' : '#EFF6FF',
                            color: isDanger ? '#DC2626' : '#2563EB',
                            padding: '2px 6px',
                            borderRadius: 'var(--radius-sm)',
                            fontWeight: 'bold',
                            fontSize: '0.8rem',
                            whiteSpace: 'nowrap'
                        }}>
                            Rem: {stats.percentage}%
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'var(--spacing-md)' }}>
                    <span style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                        Total: {subject.totalHours}h
                    </span>

                    <Link
                        to={`/subject/${subject.id}/mark`}
                        className="btn btn-secondary"
                        onClick={(e) => e.stopPropagation()}
                        style={{ padding: '6px 12px', fontSize: '0.9rem', gap: '6px' }}
                    >
                        <PlusCircle size={16} /> Mark
                    </Link>
                </div>
            </Link>
        </div>
    );
}
