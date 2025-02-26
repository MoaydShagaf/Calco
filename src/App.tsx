import React, { useState } from "react";
import "./styles/App.css"; // Updated styling
import Semester from "./components/Semester";
import coursesData from "./data/courses.json";
import Header from "./components/Header";
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
  "الهندسة الكهربائية والإلكترونية",
  "الهندسة المدنية",
  "الهندسة النووية",
  "هندسة الحاسوب",
  "الهندسة الميكانيكية",
];

const App: React.FC = () => {
  const [semesters, setSemesters] = useState<SemesterType[]>([]);
  const [department, setDepartment] = useState<string>("");

  // Recompute stats whenever semesters change
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
    const courseToAdd = coursesData.find((course) => course.code === courseCode);
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

  const updateGrade = (semesterId: number, courseCode: string, grade: number) => {
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
    <div className="app">
      {/* Top header (logo + link) */}
      <Header />

      {/* Main content */}
      <main className="main-content">
        <div className="container">
          {/* Department + Add Semester Row */}
          <div className="top-controls">
            <label htmlFor="department-select">القسم:</label>
            <select
              id="department-select"
              value={department}
              onChange={handleDepartmentChange}
            >
              <option value="" disabled>
                اختر القسم
              </option>
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>

            {department && (
              <span className="current-dept">
                القسم الحالي: <strong>{department}</strong>
              </span>
            )}

            <button className="add-semester-btn" onClick={addSemester}>
              ➕ إضافة فصل
            </button>
          </div>

          {/* Grid of Semester Cards */}
          <div className="semesters-grid">
            {semesters.map((semester) => {
              const s = stats.find((st) => st.semesterId === semester.id);
              return (
                <Semester
                  key={semester.id}
                  id={semester.id}
                  courses={semester.courses}
                  onAddCourse={addCourseToSemester}
                  onUpdateGrade={updateGrade}
                  onBulkAddCourses={bulkAddCourses}
                  stats={s}
                />
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
