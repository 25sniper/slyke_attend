
import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { getAllSubjects, getEntriesBySubject, updateSubjectOrder } from '../db/db';
import type { Subject } from '../db/types';
import { calculateStats, type CalculatedStats } from '../utils/calculations';
import SubjectCard from '../components/SubjectCard';

// DnD Imports DISABLED
// import {
//     DndContext,
//     closestCenter,
//     KeyboardSensor,
//     PointerSensor,
//     useSensor,
//     useSensors,
//     type DragEndEvent
// } from '@dnd-kit/core';
// import {
//     arrayMove,
//     SortableContext,
//     sortableKeyboardCoordinates,
//     verticalListSortingStrategy,
// } from '@dnd-kit/sortable';
// import { SortableItem } from '../components/SortableItem';

interface SubjectWithStats {
    subject: Subject;
    stats: CalculatedStats;
}

export default function Home() {
    const [items, setItems] = useState<SubjectWithStats[]>([]);
    const [loading, setLoading] = useState(true);
    const [isFabVisible, setIsFabVisible] = useState(true);
    const bottomRef = useRef<HTMLDivElement>(null);

    // const sensors = useSensors(
    //     useSensor(PointerSensor),
    //     useSensor(KeyboardSensor, {
    //         coordinateGetter: sortableKeyboardCoordinates,
    //     })
    // );

    useEffect(() => {
        loadData(); // Re-enabled for Test 2 (Dnd Disabled)
        // setLoading(false); 
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                // If bottom element is visible, HIDE the FAB
                setIsFabVisible(!entry.isIntersecting);
            },
            { threshold: 0.1 }
        );

        if (bottomRef.current) {
            observer.observe(bottomRef.current);
        }

        return () => {
            if (bottomRef.current) observer.unobserve(bottomRef.current);
        };
    }, [items]); // Re-observe when items change

    const loadData = async () => {
        try {
            const subjects = await getAllSubjects();
            const detailedItems = await Promise.all(subjects.map(async (subj) => {
                const entries = await getEntriesBySubject(subj.id);
                const stats = calculateStats(subj, entries);
                return { subject: subj, stats };
            }));

            // Sort by order if available, otherwise by creation
            detailedItems.sort((a, b) => {
                if (a.subject.order !== undefined && b.subject.order !== undefined) {
                    return a.subject.order - b.subject.order;
                }
                return b.subject.created - a.subject.created;
            });

            setItems(detailedItems);
        } catch (e) {
            console.error("Failed to load subjects", e);
        } finally {
            setLoading(false);
        }
    };

    // const handleDragEnd = async (event: DragEndEvent) => { ... }

    if (loading) {
        return <div className="container" style={{ textAlign: 'center', marginTop: '50px' }}>Loading...</div>;
    }

    return (
        <div style={{ paddingBottom: '80px' }}> {/* Extra padding for scroll space */}
            <h2 style={{ marginBottom: 'var(--spacing-md)' }}>Dashboard</h2>

            {items.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 'var(--spacing-xl)', color: 'var(--color-text-muted)' }}>
                    <p>No subjects added yet.</p>
                    <p>Tap the + button to start tracking.</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                    {items.map(item => (
                        <SubjectCard
                            key={item.subject.id}
                            subject={item.subject}
                            stats={item.stats}
                        // dragHandle={null} 
                        />
                    ))}
                </div>
            )}

            {/* Bottom Element for Intersection Observer */}
            <div ref={bottomRef} style={{ marginTop: 'var(--spacing-xl)', textAlign: 'center' }}>
                <Link to="/add" className="btn btn-primary" style={{
                    width: '100%',
                    padding: 'var(--spacing-md)',
                    fontSize: '1.2rem',
                    borderRadius: 'var(--radius-lg)'
                }}>
                    <Plus size={24} style={{ marginRight: '8px' }} />
                    Add Subject
                </Link>
            </div>

            {/* Floating Action Button - Fades out */}
            <Link
                to="/add"
                className="fab"
                aria-label="Add Subject"
                style={{
                    opacity: isFabVisible ? 1 : 0,
                    pointerEvents: isFabVisible ? 'auto' : 'none',
                    transform: isFabVisible ? 'scale(1)' : 'scale(0.8)',
                    transition: 'opacity 0.3s, transform 0.3s'
                }}
            >
                <Plus size={24} />
            </Link>
        </div>
    );
}
