// kdtree.js - K-D TREE (k = 2)
// A binary search tree that alternates the dimension it compares:
//   level 0 -> CGPA, level 1 -> testScore, level 2 -> CGPA, ...
// Used for: range filtering (e.g. CGPA 8 to 9.5 AND test score 70 to 100)

class KDNode {
  constructor(student) {
    this.student = student;
    this.left = null;    // values smaller than this node (on this level's dimension)
    this.right = null;   // values bigger than or equal to this node
  }
}

class KDTree {
  constructor() {
    this.root = null;
  }

  // axis 0 = CGPA, axis 1 = testScore
  getValue(student, axis) {
    return axis === 0 ? student.cgpa : student.testScore;
  }

  // Insert works like a normal BST insert, but the axis changes with depth
  insert(student) {
    this.root = this.insertNode(this.root, student, 0);
  }

  insertNode(node, student, depth) {
    if (node === null) return new KDNode(student);

    const axis = depth % 2;   // 0, 1, 0, 1, ...
    if (this.getValue(student, axis) < this.getValue(node.student, axis)) {
      node.left = this.insertNode(node.left, student, depth + 1);
    } else {
      node.right = this.insertNode(node.right, student, depth + 1);
    }
    return node;
  }

  // Returns the IDs of all students inside the rectangle:
  // minCgpa <= cgpa <= maxCgpa  AND  minScore <= testScore <= maxScore
  rangeSearch(minCgpa, maxCgpa, minScore, maxScore) {
    const results = [];
    const low = [minCgpa, minScore];
    const high = [maxCgpa, maxScore];
    this.searchNode(this.root, low, high, 0, results);
    return results;
  }

  searchNode(node, low, high, depth, results) {
    if (node === null) return;

    // 1. Is this student inside the range on BOTH dimensions?
    const s = node.student;
    if (s.cgpa >= low[0] && s.cgpa <= high[0] &&
        s.testScore >= low[1] && s.testScore <= high[1]) {
      results.push(s.id);
    }

    // 2. Visit a side only if it can still contain matches.
    //    Skipping whole branches is why this beats checking every student.
    const axis = depth % 2;
    const value = this.getValue(s, axis);
    if (low[axis] < value) {
      this.searchNode(node.left, low, high, depth + 1, results);
    }
    if (high[axis] >= value) {
      this.searchNode(node.right, low, high, depth + 1, results);
    }
  }
}
