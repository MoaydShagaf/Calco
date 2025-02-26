// src/components/DepartmentSelector.tsx

import React from "react";
import "../styles/DepartmentSelector.css";

interface DepartmentSelectorProps {
  department: string;
  departmentList: string[];
  onDepartmentChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const DepartmentSelector: React.FC<DepartmentSelectorProps> = ({
  department,
  departmentList,
  onDepartmentChange,
}) => {
  return (
    <div className="department-row">
      <label htmlFor="department-select" className="dept-label">
        Department:
      </label>
      <select
        id="department-select"
        value={department}
        onChange={onDepartmentChange}
        className="dept-select"
      >
        <option value="" disabled>
          Select Department
        </option>
        {departmentList.map((dept) => (
          <option key={dept} value={dept}>
            {dept}
          </option>
        ))}
      </select>

      {department && (
        <span className="chosen-dept">
          Current Dept: <strong>{department}</strong>
        </span>
      )}
    </div>
  );
};

export default DepartmentSelector;
