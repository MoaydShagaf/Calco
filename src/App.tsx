// src/App.tsx

import React, { useState } from "react";
import "./styles/App.css";
import Semester from "./components/Semester";
import coursesData from "./data/courses.json";
import { FaRocket } from "react-icons/fa";

// Import stats logic
import { computeAllSemesterStats } from "./utils/Calculations";

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

const DEPARTMENTS = [
  "Electrical and Electronics",
  "Civil",
  "Nuclear",
  "Computer",
  "Mechanical",
];

const App: React.FC = () => {
  const [semesters, setSemesters] = useState<SemesterType[]>([]);

  // Track the currently selected department
  const [department, setDepartment] = useState<string>("");

  // Recompute stats every time 'semesters' changes
  const stats = computeAllSemesterStats(semesters);

  const handleDepartmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDepartment(e.target.value);
  };

  const addSemester = () => {
    setSemesters((prev) => [
      ...prev,
      { id: prev.length + 1, courses: [] },
    ]);
  };

  const addCourseToSemester = (semesterId: number, courseCode: string) => {
    if (!courseCode) return;

    const courseToAdd = coursesData.find(
      (course) => course.code === courseCode
    );
    if (!courseToAdd) return;

    setSemesters((prev) =>
      prev.map((semester) =>
        semester.id === semesterId
          ? {
              ...semester,
              courses: [...semester.courses, { ...courseToAdd, grade: "" }],
            }
          : semester
      )
    );
  };

  const updateGrade = (
    semesterId: number,
    courseCode: string,
    grade: number
  ) => {
    setSemesters((prev) =>
      prev.map((semester) =>
        semester.id === semesterId
          ? {
              ...semester,
              courses: semester.courses.map((course) =>
                course.code === courseCode
                  ? { ...course, grade }
                  : course
              ),
            }
          : semester
      )
    );
  };

  const bulkAddCourses = (semesterId: number, newCourses: Course[]) => {
    setSemesters((prev) =>
      prev.map((semester) =>
        semester.id === semesterId
          ? {
              ...semester,
              courses: [...semester.courses, ...newCourses],
            }
          : semester
      )
    );
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1 className="app-title">
          <FaRocket className="app-icon" />
          My Jaw-Dropping University Planner
        </h1>
        <a href="#" className="course-creator-link">
          Go to Course Creator
        </a>
      </header>

      <main className="app-main">
        <div className="department-row">
          <label htmlFor="department-select">Department:</label>
          <select
            id="department-select"
            value={department}
            onChange={handleDepartmentChange}
          >
            <option value="" disabled>
              Select Department
            </option>
            {DEPARTMENTS.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>

          {/* Optionally display the chosen department */}
          {department && (
            <span className="chosen-dept">
              Current Dept: <strong>{department}</strong>
            </span>
          )}
        </div>

        <button className="add-semester-btn" onClick={addSemester}>
          ➕ Add Semester
        </button>

        <div className="semesters-grid">
          {semesters.map((semester) => {
            // retrieve the stats for this semester
            const s = stats.find((st) => st.semesterId === semester.id);

            return (
              <Semester
                key={semester.id}
                id={semester.id}
                courses={semester.courses || []}
                onAddCourse={addCourseToSemester}
                onUpdateGrade={updateGrade}
                onBulkAddCourses={bulkAddCourses}
                stats={s} // pass the computed stats down
              />
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default App;
