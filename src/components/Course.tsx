import React from "react";
import "../styles/Course.css"; // <-- Import course-specific CSS

interface CourseProps {
  code: string;
  name: string;
  credit: number;
  grade: number | "";
  onUpdateGrade: (code: string, grade: number) => void;
}

const Course: React.FC<CourseProps> = ({
  code,
  name,
  credit,
  grade,
  onUpdateGrade,
}) => {
  return (
    <div className="course-row">
      <div className="course-info">
        <span className="course-name">
          {name} <span className="course-code">({code})</span>
        </span>
        <span className="course-credit">{credit} credits</span>
      </div>
      <input
        type="number"
        min="0"
        max="100"
        value={grade}
        onChange={(e) => onUpdateGrade(code, Number(e.target.value))}
        className="grade-input"
        placeholder="الدرجة"
      />
    </div>
  );
};

export default Course;
