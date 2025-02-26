import React from "react";
import "../styles/Course.css"; // <-- Import course-specific CSS

interface CourseProps {
  code: string;
  name: string;
  credit: number;
  grade: number | "";
  onUpdateGrade: (code: string, grade: number | "") => void; // Allow empty string
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
        type="text" // Change to text to control input behavior
        inputMode="numeric" // Ensures number keyboard on mobile
        pattern="^\d{0,3}$" // Only allows numbers up to 3 digits
        maxLength={3} // Restrict input length to 3 digits
        value={grade}
        onChange={(e) => {
          let newValue = e.target.value.replace(/^0+(?=\d)/, ""); // Remove leading zeros
          if (newValue === "") {
            onUpdateGrade(code, ""); // Allow empty input
          } else if (/^\d+$/.test(newValue) && Number(newValue) <= 100) {
            onUpdateGrade(code, Number(newValue)); // Convert valid input to number
          }
        }}
        className="grade-input"
        placeholder="الدرجة"
      />
    </div>
  );
};

export default Course;
