// src/components/Semester.tsx
import React, { useState } from "react";
import "../styles/Semester.css";
import coursesData from "../data/courses.json";
import Course from "./Course";
import Papa from "papaparse";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";
import { SemesterStats } from "../utils/Calculations"; // so we can type the stats prop

interface CourseType {
  code: string;
  name: string;
  credit: number;
  grade: number | "";
}

interface SemesterProps {
  id: number;
  courses: CourseType[];
  onAddCourse: (semesterId: number, courseCode: string) => void;
  onUpdateGrade: (
    semesterId: number,
    courseCode: string,
    grade: number
  ) => void;
  onBulkAddCourses: (
    semesterId: number,
    newCourses: CourseType[]
  ) => void;
  stats?: SemesterStats; // <-- optional or required
}

const Semester: React.FC<SemesterProps> = ({
  id,
  courses = [],
  onAddCourse,
  onUpdateGrade,
  onBulkAddCourses,
  stats,
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [csvFile, setCsvFile] = useState<File | null>(null);

  const handleCSVUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setCsvFile(file);
    }
  };

  const submitCSV = () => {
    if (!csvFile) return;

    Papa.parse(csvFile, {
      complete: (result) => {
        const csvData = result.data as string[][]; // [Course Code, Grade]
        const newCourses: CourseType[] = [];

        csvData.forEach(([code, grade]) => {
          const course = coursesData.find(
            (c) => c.code === code.trim().toUpperCase()
          );
          if (course && !isNaN(Number(grade))) {
            newCourses.push({ ...course, grade: Number(grade) });
          }
        });

        if (newCourses.length > 0) {
          onBulkAddCourses(id, newCourses);
        }
      },
      header: false,
      skipEmptyLines: true,
    });

    setCsvFile(null);
  };

  return (
    <div className="semester-card">
      <div
        className="semester-header"
        onClick={() => setIsOpen(!isOpen)}
        title="Click to expand/collapse"
      >
        <div>
          <h3 className="semester-title">Semester {id}</h3>
        </div>
        <div className="semester-toggle">
          {isOpen ? <FaChevronDown /> : <FaChevronRight />}
        </div>
      </div>

      {isOpen && (
        <div className="semester-body">
          {/* A small summary area for the four metrics */}
          {stats && (
            <div className="semester-summary">
              <div className="summary-item">
                <span>Cumulative Points:</span>
                <strong>{stats.cumulativePoints.toFixed(2)}</strong>
              </div>
              <div className="summary-item">
                <span>Cumulative Credits:</span>
                <strong>{stats.cumulativeCredits.toFixed(2)}</strong>
              </div>
              <div className="summary-item">
                <span>General %:</span>
                <strong>{stats.generalPercentage.toFixed(2)}</strong>
              </div>
              <div className="summary-item">
                <span>Semester %:</span>
                <strong>{stats.semesterPercentage.toFixed(2)}</strong>
              </div>
            </div>
          )}

          <div className="add-course-row">
            <select
              onChange={(e) => onAddCourse(id, e.target.value)}
              defaultValue=""
              className="course-selector"
            >
              <option value="" disabled>
                Select a Course
              </option>
              {coursesData.map((course) => (
                <option key={course.code} value={course.code}>
                  {course.name} ({course.code})
                </option>
              ))}
            </select>
          </div>

          <div className="course-list">
            {courses.map((course) => (
              <Course
                key={course.code}
                code={course.code}
                name={course.name}
                credit={course.credit}
                grade={course.grade}
                onUpdateGrade={(code, grade) =>
                  onUpdateGrade(id, code, grade)
                }
              />
            ))}
          </div>

          <div className="csv-upload">
            <input
              type="file"
              accept=".csv"
              onChange={handleCSVUpload}
              className="csv-input"
            />
            <button
              className="submit-csv-btn"
              onClick={submitCSV}
              disabled={!csvFile}
            >
              📥 Import CSV
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Semester;
