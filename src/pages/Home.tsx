
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { getAllSubjects, getEntriesBySubject } from '../db/db';
import type { Subject } from '../db/types';
import { calculateStats, type CalculatedStats } from '../utils/calculations';
import SubjectCard from '../components/SubjectCard';

interface SubjectWithStats {
    subject: Subject;
    stats: CalculatedStats;
}

export default function Home() {
    const [items, setItems] = useState<SubjectWithStats[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const subjects = await getAllSubjects();
            const detailedItems = await Promise.all(subjects.map(async (subj) => {
                const entries = await getEntriesBySubject(subj.id);
                const stats = calculateStats(subj, entries);
                return { subject: subj, stats };
            }));

            // Sort by creation time desc (newest first)
            detailedItems.sort((a, b) => b.subject.created - a.subject.created);

            setItems(detailedItems);
        } catch (e) {
            console.error("Failed to load subjects", e);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="container" style={{ textAlign: 'center', marginTop: '50px' }}>Loading...</div>;
    }

    return (
        <div>
            <h2 style={{ marginBottom: 'var(--spacing-md)' }}>Dashboard</h2>

            {items.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 'var(--spacing-xl)', color: 'var(--color-text-muted)' }}>
                    <p>No subjects added yet.</p>
                    <p>Tap the + button to start tracking.</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                    {items.map(item => (
                        <SubjectCard key={item.subject.id} subject={item.subject} stats={item.stats} />
                    ))}
                </div>
            )}

            <Link to="/add" className="fab" aria-label="Add Subject">
                <Plus size={24} />
            </Link>
        </div>
    );
}
