/**
 * useSemesters.ts
 * Custom hook for managing semesters, course data, and local storage progress.
 */

import { useState, useEffect, useRef } from "react";
import generalCourses from "../data/general.json";
import eeeCourses from "../data/eee.json";
import { computeAllSemesterStats } from "../utils/Calculations";

export interface Course {
  code: string;
  name: string;
  credit: number;
  grade: number | "";
}

export interface SemesterType {
  id: number;
  courses: Course[];
}

interface UserProgress {
  department: string;
  semesters: SemesterType[];
}

export const useSemesters = () => {
  const [department, setDepartment] = useState<string>("");
  const [semesters, setSemesters] = useState<SemesterType[]>([]);
  const [coursesData, setCoursesData] = useState<Course[]>([]);
  const lastSemesterRef = useRef<HTMLDivElement | null>(null);

  const emptyGrade: number | "" = "";

  // Load saved progress on mount
  useEffect(() => {
    const savedData = localStorage.getItem("userProgress");
    if (savedData) {
      try {
        const progress: UserProgress = JSON.parse(savedData);
        if (progress.department) setDepartment(progress.department);
        if (progress.semesters) setSemesters(progress.semesters);
      } catch (error) {
        console.error("Failed to parse progress from localStorage", error);
      }
    }
  }, []);

  // Update courses data based on department selection
  useEffect(() => {
    const updatedCourses =
      department === "الهندسة الكهربائية والإلكترونية"
        ? [
            ...generalCourses.map((course) => ({ ...course, grade: emptyGrade })),
            ...eeeCourses.map((course) => ({ ...course, grade: emptyGrade })),
          ]
        : generalCourses.map((course) => ({ ...course, grade: emptyGrade }));

    setCoursesData(updatedCourses);
  }, [department]);

  // Save progress to local storage
  const saveProgress = () => {
    const progress: UserProgress = { department, semesters };
    localStorage.setItem("userProgress", JSON.stringify(progress));
  };

  // Clear progress from local storage and reset state
  const clearProgress = () => {
    localStorage.removeItem("userProgress");
    setDepartment("");
    setSemesters([]);
  };

  const addSemester = () => {
    setSemesters((prev) => [...prev, { id: prev.length + 1, courses: [] }]);
    setTimeout(() => {
      lastSemesterRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const addCourseToSemester = (semesterId: number, courseCode: string) => {
    const courseToAdd = coursesData.find((course) => course.code === courseCode);
    if (!courseToAdd) return;
    setSemesters((prevSemesters) =>
      prevSemesters.map((semester) =>
        semester.id === semesterId
          ? {
              ...semester,
              courses: [...semester.courses, { ...courseToAdd, grade: emptyGrade }],
            }
          : semester
      )
    );
  };

  const updateGrade = (semesterId: number, courseCode: string, grade: number | "") => {
    setSemesters((prevSemesters) =>
      prevSemesters.map((semester) =>
        semester.id === semesterId
          ? {
              ...semester,
              courses: semester.courses.map((course) =>
                course.code === courseCode ? { ...course, grade } : course
              ),
            }
          : semester
      )
    );
  };

  const bulkAddCourses = (semesterId: number, newCourses: Course[]) => {
    setSemesters((prevSemesters) =>
      prevSemesters.map((semester) =>
        semester.id === semesterId
          ? { ...semester, courses: [...semester.courses, ...newCourses] }
          : semester
      )
    );
  };

  const stats = computeAllSemesterStats(semesters);

  return {
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
  };
};
