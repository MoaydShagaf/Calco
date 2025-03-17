export const DEPARTMENTS = {
    EEE: "الهندسة الكهربائية والإلكترونية",
    CIVIL: "الهندسة المدنية",
    NUCLEAR: "الهندسة النووية",
    COMPUTER: "هندسة الحاسوب",
    MECHANICAL: "الهندسة الميكانيكية",
    BIOMEDICAL: "الهندسة الطبية الحيوية"
  };
  
export type DepartmentKey = keyof typeof DEPARTMENTS;  