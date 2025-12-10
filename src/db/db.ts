
import { openDB } from 'idb';
import type { DBSchema, IDBPDatabase } from 'idb';
import type { Subject, AttendanceEntry } from './types';

interface SlykeDB extends DBSchema {
    subjects: {
        key: string;
        value: Subject;
    };
    entries: {
        key: string;
        value: AttendanceEntry;
        indexes: { 'by-subject': string };
    };
}

const DB_NAME = 'slyke-attend-db';
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase<SlykeDB>>;

export const initDB = () => {
    if (!dbPromise) {
        dbPromise = openDB<SlykeDB>(DB_NAME, DB_VERSION, {
            upgrade(db) {
                if (!db.objectStoreNames.contains('subjects')) {
                    db.createObjectStore('subjects', { keyPath: 'id' });
                }
                if (!db.objectStoreNames.contains('entries')) {
                    const entryStore = db.createObjectStore('entries', { keyPath: 'id' });
                    entryStore.createIndex('by-subject', 'subjectId');
                }
            },
        });
    }
    return dbPromise;
};

// Subjects
export const addSubject = async (subject: Subject) => {
    const db = await initDB();
    return db.put('subjects', subject);
};



export const getAllSubjects = async () => {
    const db = await initDB();
    return db.getAll('subjects');
};

export const getSubject = async (id: string) => {
    const db = await initDB();
    return db.get('subjects', id);
};

export const deleteSubject = async (id: string) => {
    const db = await initDB();
    const tx = db.transaction(['subjects', 'entries'], 'readwrite');
    await tx.objectStore('subjects').delete(id);
    const index = tx.objectStore('entries').index('by-subject');
    let cursor = await index.openCursor(IDBKeyRange.only(id));
    while (cursor) {
        await cursor.delete();
        cursor = await cursor.continue();
    }
    await tx.done;
};


// Entries
export const addEntry = async (entry: AttendanceEntry) => {
    const db = await initDB();
    return db.put('entries', entry);
};

export const getEntriesBySubject = async (subjectId: string) => {
    const db = await initDB();
    return db.getAllFromIndex('entries', 'by-subject', subjectId);
};

export const getAllEntries = async () => {
    const db = await initDB();
    return db.getAll('entries');
}


export const deleteEntry = async (id: string) => {
    const db = await initDB();
    return db.delete('entries', id);
}

export const clearData = async () => {
    const db = await initDB();
    const tx = db.transaction(['subjects', 'entries'], 'readwrite');
    await tx.objectStore('subjects').clear();
    await tx.objectStore('entries').clear();
    await tx.done;
};

export const importData = async (data: { subjects: Subject[], entries: AttendanceEntry[] }) => {
    const db = await initDB();
    const tx = db.transaction(['subjects', 'entries'], 'readwrite');

    // Clear existing
    await tx.objectStore('subjects').clear();
    await tx.objectStore('entries').clear();

    // Import new
    for (const s of data.subjects) {
        await tx.objectStore('subjects').put(s);
    }
    for (const e of data.entries) {
        await tx.objectStore('entries').put(e);
    }

    await tx.done;
};
