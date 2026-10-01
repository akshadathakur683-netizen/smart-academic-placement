// data.js - 20 fictional students
// Each student: id, name, cgpa (out of 10), testScore (out of 100), skills

const students = [
  { id: 101, name: "Aarav Sharma",    cgpa: 8.9, testScore: 92, skills: ["python", "machine learning", "pandas", "sql"] },
  { id: 102, name: "Diya Patil",      cgpa: 9.1, testScore: 88, skills: ["java", "data structures", "sql", "git"] },
  { id: 103, name: "Rohan Deshmukh",  cgpa: 7.4, testScore: 65, skills: ["html", "css", "javascript"] },
  { id: 104, name: "Ananya Iyer",     cgpa: 9.4, testScore: 95, skills: ["python", "tensorflow", "machine learning", "data structures"] },
  { id: 105, name: "Kabir Singh",     cgpa: 6.8, testScore: 58, skills: ["c", "c++", "linux"] },
  { id: 106, name: "Meera Joshi",     cgpa: 8.2, testScore: 79, skills: ["javascript", "react", "html", "css"] },
  { id: 107, name: "Vihaan Gupta",    cgpa: 7.9, testScore: 72, skills: ["python", "django", "sql", "git"] },
  { id: 108, name: "Isha Kulkarni",   cgpa: 8.6, testScore: 84, skills: ["c++", "data structures", "java"] },
  { id: 109, name: "Arjun Nair",      cgpa: 7.1, testScore: 61, skills: ["html", "css", "javascript", "git"] },
  { id: 110, name: "Saanvi Reddy",    cgpa: 9.0, testScore: 90, skills: ["python", "machine learning", "tensorflow", "pandas"] },
  { id: 111, name: "Aditya Verma",    cgpa: 6.5, testScore: 52, skills: ["c", "linux", "git"] },
  { id: 112, name: "Riya Mehta",      cgpa: 8.0, testScore: 77, skills: ["sql", "mongodb", "javascript", "react"] },
  { id: 113, name: "Karan Malhotra",  cgpa: 7.6, testScore: 69, skills: ["java", "sql", "docker"] },
  { id: 114, name: "Sneha Pawar",     cgpa: 8.8, testScore: 86, skills: ["python", "django", "sql", "docker"] },
  { id: 115, name: "Yash Bhosale",    cgpa: 7.2, testScore: 63, skills: ["c++", "c", "data structures"] },
  { id: 116, name: "Priya Chavan",    cgpa: 9.3, testScore: 93, skills: ["java", "data structures", "c++", "git"] },
  { id: 117, name: "Neil D'Souza",    cgpa: 7.8, testScore: 74, skills: ["python", "pandas", "sql"] },
  { id: 118, name: "Tanvi Shah",      cgpa: 8.4, testScore: 81, skills: ["react", "javascript", "css", "mongodb"] },
  { id: 119, name: "Om Jadhav",       cgpa: 6.9, testScore: 55, skills: ["python", "linux", "docker"] },
  { id: 120, name: "Kavya Menon",     cgpa: 8.7, testScore: 89, skills: ["python", "machine learning", "sql", "git"] }
];

// Quick lookup: id -> student (an object works like a hash table, O(1))
const studentById = {};
for (const s of students) {
  studentById[s.id] = s;
}
