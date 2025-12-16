
export interface Subject {
  id: string;
  name: string;
  weeklyHours: number;
  totalHours: number; // derived: weeklyHours * 15
  created: number;
  order?: number; // for custom sorting
}

export interface AttendanceEntry {
  id: string;
  subjectId: string;
  timestamp: number;
  presentHours: number;
  absentHours: number;
  reason?: string;
  topics?: string;
}

export interface SubjectStats {
  totalPresent: number;
  totalAbsent: number;
  percentage: number;
}
