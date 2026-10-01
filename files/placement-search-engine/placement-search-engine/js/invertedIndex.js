// invertedIndex.js - INVERTED INDEX
// Like the index at the back of a book: word -> pages.
// Here: skill -> list of student IDs who have that skill.
//   { python: [101, 104, 107], sql: [101, 102, ...], ... }

class InvertedIndex {
  constructor() {
    this.index = {};
  }

  // Put the student's ID under each of their skills
  addStudent(student) {
    for (const skill of student.skills) {
      const key = skill.toLowerCase();
      if (!this.index[key]) {
        this.index[key] = [];
      }
      this.index[key].push(student.id);
    }
  }

  // All student IDs for ONE skill. Time: O(1) lookup
  getStudents(skill) {
    return this.index[skill.toLowerCase()] || [];
  }

  // Multi-skill search (OR + count).
  // Returns a Map: studentId -> how many of the required skills they have.
  // A Map is a hash table (key -> value).
  // For "must have ALL skills": keep only students whose count equals requiredSkills.length
  searchSkills(requiredSkills) {
    const matchCount = new Map();
    for (const skill of requiredSkills) {
      for (const id of this.getStudents(skill)) {
        matchCount.set(id, (matchCount.get(id) || 0) + 1);
      }
    }
    return matchCount;
  }

  // Every skill with how many students have it, most common first (for the dashboard)
  getSkillCounts() {
    const counts = [];
    for (const skill in this.index) {
      counts.push({ skill: skill, count: this.index[skill].length });
    }
    counts.sort((a, b) => b.count - a.count);
    return counts;
  }
}
