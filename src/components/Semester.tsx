import React, { useState } from "react";
import "../styles/Semester.css";
import coursesData from "../data/courses.json";
import Course from "./Course";
import ComboBox from "./ComboBox";
import Papa from "papaparse";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";
import { SemesterStats } from "../utils/Calculations";

interface CourseType {
  code: string;
  name: string;
  credit: number;
  grade: number | "";
}

interface SemesterProps {
  id: number;
  courses: CourseType[];
  stats?: SemesterStats;
  onAddCourse: (semesterId: number, courseCode: string) => void;
  onUpdateGrade: (semesterId: number, courseCode: string, grade: number | "") => void;
  onBulkAddCourses: (semesterId: number, newCourses: CourseType[]) => void;
}

const Semester: React.FC<SemesterProps> = ({
  id,
  courses,
  stats,
  onAddCourse,
  onUpdateGrade,
  onBulkAddCourses,
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [chosenCourse, setChosenCourse] = useState<string>("");

  const handleCSVUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setCsvFile(file);
    }
  };

  const submitCSV = () => {
    if (!csvFile) return;

    Papa.parse(csvFile, {
      complete: (result) => {
        const csvData = result.data as string[][];
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

  const courseOptions = coursesData.map((c) => c.code);

  const handleComboBoxChange = (selectedCode: string) => {
    if (!selectedCode) return;
    setChosenCourse("");
    onAddCourse(id, selectedCode);
  };


  return (
    <div className="semester-card">
      <div
        className="semester-header"
        onClick={() => setIsOpen(!isOpen)}
        title="اضغط للتوسيع/الطي"
      >
        <h3 className="semester-title">📚 الفصل {id}</h3>
        <div className="semester-toggle">
          {isOpen ? <FaChevronDown /> : <FaChevronRight />}
        </div>
      </div>

      {isOpen && (
        <div className="semester-body">
          {stats && (
            <div className="semester-summary">
              <div className="summary-item">
                <span>🏆 النقاط التراكمية:</span>
                <strong>{stats.cumulativePoints.toFixed(2)}</strong>
              </div>
              <div className="summary-item">
                <span>📐 الوحدات التراكمية:</span>
                <strong>{stats.cumulativeCredits.toFixed(2)}</strong>
              </div>
              <div className="summary-item">
                <span>📊 المعدل العام:</span>
                <strong>{stats.generalPercentage.toFixed(2)}</strong>
              </div>
              <div className="summary-item">
                <span>🤩 المعدل الفصلي:</span>
                <strong>{stats.semesterPercentage.toFixed(2)}</strong>
              </div>
            </div>
          )}

          <div className="add-course-row">
            <ComboBox
              options={courseOptions}
              value={chosenCourse}
              onChange={handleComboBoxChange}
            />
          </div>

          <div className="course-list">
            {courses.map((course) => (
              <Course
                key={course.code}
                code={course.code}
                name={course.name}
                credit={course.credit}
                grade={course.grade}
                onUpdateGrade={(code, grade) => onUpdateGrade(id, code, grade)}
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
              📥 استيراد CSV
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Semester;
