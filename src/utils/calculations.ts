
import type { Subject, AttendanceEntry } from '../db/types';

export interface CalculatedStats {
    totalPresent: number;
    totalAbsent: number;
    percentage: number;
    currentPercentage: number;
    canMissHours: number;
    safeToMiss: boolean;
}

export function calculateStats(subject: Subject, entries: AttendanceEntry[]): CalculatedStats {
    let totalPresent = 0;
    let totalAbsent = 0;

    entries.forEach(entry => {
        totalPresent += entry.presentHours || 0;
        totalAbsent += entry.absentHours || 0;
    });

    // 1. Remaining Attendance Percentage (Bank of Hours Model)
    // Starts at 100% and goes down as you miss hours against the semester total.
    const percentage = subject.totalHours > 0
        ? ((subject.totalHours - totalAbsent) / subject.totalHours) * 100
        : 100;

    // 2. Current Attendance Percentage (Real-time performance)
    // (Total Present / Total classes occurred)
    const totalOccurred = totalPresent + totalAbsent;
    const currentPercentage = totalOccurred > 0
        ? (totalPresent / totalOccurred) * 100
        : 100; // Default to 100 if no classes have happened yet.

    // Safe to miss buffer (assuming 75% requirement)
    const requiredPercent = 75;
    const maxAbsentHours = subject.totalHours * (1 - (requiredPercent / 100));
    const canMissHours = Math.max(0, maxAbsentHours - totalAbsent);

    return {
        totalPresent,
        totalAbsent,
        percentage: parseFloat(percentage.toFixed(1)),
        currentPercentage: parseFloat(currentPercentage.toFixed(1)),
        canMissHours: parseFloat(canMissHours.toFixed(1)),
        safeToMiss: percentage >= requiredPercent
    };
}
