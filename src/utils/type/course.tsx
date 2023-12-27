export interface Course {
    id: number;
    name: string;
    creditCount: number;
    code: string;
    maxStudentCount: number;
    classroom: string;
    lecturerId?: number;
    departmentId?: number;
    scheduleId?: number;
    status?: boolean;
}