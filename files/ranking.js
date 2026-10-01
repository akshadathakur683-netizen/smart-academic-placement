// ranking.js - RANKING ALGORITHM
// Score out of 100 = 40 (CGPA) + 30 (test score) + 30 (skill match)

function calculateScore(student, matched, required) {
  const cgpaPart  = (student.cgpa / 10) * 40;
  const testPart  = (student.testScore / 100) * 30;
  const skillPart = required === 0 ? 0 : (matched / required) * 30;
  return { cgpaPart: cgpaPart, testPart: testPart, skillPart: skillPart,
           total: cgpaPart + testPart + skillPart };
}

// Insertion sort, highest total first. Time: O(n^2) worst case.
// Idea: keep the left part sorted, and slide each new item into its place.
function insertionSort(list) {
  for (let i = 1; i < list.length; i++) {
    const current = list[i];
    let j = i - 1;
    while (j >= 0 && list[j].score.total < current.score.total) {
      list[j + 1] = list[j];   // shift the smaller score to the right
      j--;
    }
    list[j + 1] = current;
  }
}

// candidates = [{ student, matched }]  ->  same list with scores, best first
function rankCandidates(candidates, required) {
  const ranked = [];
  for (const c of candidates) {
    ranked.push({ student: c.student, matched: c.matched,
                  score: calculateScore(c.student, c.matched, required) });
  }
  insertionSort(ranked);
  return ranked;
}
