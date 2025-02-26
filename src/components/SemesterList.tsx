// src/components/SemesterList.tsx

import React from "react";
import Semester from "./Semester";
import { SemesterStats } from "../utils/Calculations";
import "../styles/SemesterList.css";

interface Course {
  code: string;
  name: string;
  credit: number;
  grade: number | "";
}

interface SemesterType {
  id: number;
  courses: Course[];
}

interface SemesterListProps {
  semesters: SemesterType[];
  stats: SemesterStats[];
  onAddCourse: (semesterId: number, courseCode: string) => void;
  onUpdateGrade: (semesterId: number, courseCode: string, grade: number) => void;
  onBulkAddCourses: (semesterId: number, newCourses: Course[]) => void;
}

const SemesterList: React.FC<SemesterListProps> = ({
  semesters,
  stats,
  onAddCourse,
  onUpdateGrade,
  onBulkAddCourses,
}) => {
  return (
    <div className="semesters-grid">
      {semesters.map((semester) => {
        const s = stats.find((st) => st.semesterId === semester.id);

        return (
          <Semester
            key={semester.id}
            id={semester.id}
            courses={semester.courses}
            stats={s}
            onAddCourse={onAddCourse}
            onUpdateGrade={onUpdateGrade}
            onBulkAddCourses={onBulkAddCourses}
          />
        );
      })}
    </div>
  );
};

export default SemesterList;
