import React, { useState } from "react";
import Header from "./components/Header";
import Semester from "./components/Semester";
import Modal from "./components/Modal";
import { useSemesters } from "./hooks/useSemesters";
import "./styles/App.css";

const DEPARTMENTS = [
  "الهندسة الكهربائية والإلكترونية",
  "الهندسة المدنية",
  "الهندسة النووية",
  "هندسة الحاسوب",
  "الهندسة الميكانيكية",
];

const App: React.FC = () => {
  const {
    department,
    setDepartment,
    semesters,
    stats,
    coursesData,
    addSemester,
    addCourseToSemester,
    updateGrade,
    bulkAddCourses,
    lastSemesterRef,
    saveProgress,
    clearProgress,
  } = useSemesters();

  // Modal state to confirm clear progress action
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleClearProgress = () => {
    setIsModalOpen(true);
  };

  const confirmClearProgress = () => {
    clearProgress();
    setIsModalOpen(false);
  };

  const cancelClearProgress = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <div className="container">
          <div className="top-controls">
            <label htmlFor="department-select">القسم:</label>
            <select
              id="department-select"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
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

            <div className="progress-controls">
              <button className="save-progress-btn" onClick={saveProgress}>
                💾 حفظ التقدم
              </button>
              <button
                className="clear-progress-btn"
                onClick={handleClearProgress}
              >
                🗑️ حذف التقدم
              </button>
            </div>
          </div>

          <div className="semesters-grid">
            {semesters.map((semester, index) => (
              <div
                key={semester.id}
                ref={index === semesters.length - 1 ? lastSemesterRef : null}
              >
                <Semester
                  id={semester.id}
                  courses={semester.courses}
                  stats={stats.find((s) => s.semesterId === semester.id)}
                  allCourses={coursesData}
                  onAddCourse={addCourseToSemester}
                  onUpdateGrade={updateGrade}
                  onBulkAddCourses={bulkAddCourses}
                />
              </div>
            ))}
          </div>
        </div>
      </main>
      <Modal
        isOpen={isModalOpen}
        title="تأكيد حذف التقدم"
        content={
          <p>
            هل أنت متأكد من حذف تقدمك؟
          </p>
        }
        onClose={cancelClearProgress}
        onConfirm={confirmClearProgress}
      />
    </div>
  );
};

export default App;
