// src/utils/Calculations.ts

export interface Course {
code: string;
name: string;
credit: number;
grade: number | ""; // empty string means no grade entered yet
}

export interface SemesterType {
id: number;
courses: Course[];
}

// The shape of the stats we'll compute for each semester.
export interface SemesterStats {
semesterId: number;

// Cumulative (includes all semesters up to this one)
cumulativePoints: number;     // sum of (grade * credit) for all courses up to now, with repeats overwritten
cumulativeCredits: number;    // sum of credits for all unique courses up to now
generalPercentage: number;    // = cumulativePoints / cumulativeCredits, or 0 if no credits

// This semester only
semesterPoints: number;       // sum of (grade * credit) in this semester only
semesterCredits: number;      // sum of credits in this semester only
semesterPercentage: number;   // = semesterPoints / semesterCredits, or 0 if no credits
}

/**
 * Computes stats for each semester:
 *   1) Cumulative Points (overwriting repeated courses),
 *   2) Cumulative Credits (count each course once),
 *   3) General Percentage = cumulativePoints / cumulativeCredits (up to that semester),
 *   4) Semester Points/Credits/Percentage for that term alone.
 *
 * @param semesters - array of SemesterType objects, presumably in ascending order by .id
 * @returns an array of SemesterStats (same length/order as input)
 */
export function computeAllSemesterStats(semesters: SemesterType[]): SemesterStats[] {
// 1) For cumulative points, track the "latest contribution" of each repeated course
const latestContributions: Record<string, number> = {}; // maps code -> (grade*credit)
let cumulativePointsSoFar = 0;

// 2) For cumulative credits, track all unique courses encountered so far
const completedCourses = new Set<string>();
let cumulativeCreditsSoFar = 0;

// We'll build up an array of results (one entry per semester)
const results: SemesterStats[] = [];

for (const semester of semesters) {
    let semesterPoints = 0;
    let semesterCredits = 0;

    // For each course in this semester
    for (const course of semester.courses) {
    const { code, credit, grade } = course;
    // Skip if there's no valid grade yet (or treat "" as 0 if you prefer)
    if (grade === "") {
        // You could treat "" as zero grade if desired, but typically we skip
        continue;
    }

    const numericGrade = Number(grade);
    const newPoints = numericGrade * credit;

    // ===== 1) Update cumulative points (with repeated‐course logic)
    if (latestContributions[code] !== undefined) {
        // Subtract old contribution first
        cumulativePointsSoFar -= latestContributions[code];
    }
    // Add new
    latestContributions[code] = newPoints;
    cumulativePointsSoFar += newPoints;

    // ===== 2) Update cumulative credits (only if this is the first time we see this course)
    if (!completedCourses.has(code)) {
        completedCourses.add(code);
        cumulativeCreditsSoFar += credit;
    }

    // ===== 3) Count this semester's raw points/credits (NO repeated‐course logic)
    semesterPoints += newPoints;
    semesterCredits += credit;
    }

    // Compute percentages (avoid division by zero)
    const generalPercentage =
    cumulativeCreditsSoFar === 0 ? 0 : cumulativePointsSoFar / cumulativeCreditsSoFar;
    const semesterPercentage =
    semesterCredits === 0 ? 0 : semesterPoints / semesterCredits;

    results.push({
    semesterId: semester.id,
    cumulativePoints: cumulativePointsSoFar,
    cumulativeCredits: cumulativeCreditsSoFar,
    generalPercentage,
    semesterPoints,
    semesterCredits,
    semesterPercentage,
    });
}

return results;
}
