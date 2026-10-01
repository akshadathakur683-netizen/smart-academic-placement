// app.js - connects the web page to the data structures

// ---------- 1. Build the 3 data structures ONCE when the page loads ----------
const trie = new Trie();
const invertedIndex = new InvertedIndex();
const kdTree = new KDTree();

for (const s of students) {
  invertedIndex.addStudent(s);      // skill -> student IDs
  kdTree.insert(s);                 // (cgpa, testScore) point
  for (const skill of s.skills) {
    trie.insert(skill);             // skill letters
  }
}

let selectedSkills = [];            // skills the recruiter has picked

// ---------- 2. Small helpers ----------
function el(id) { return document.getElementById(id); }

// Read a number from an input box, use the fallback if it is empty
function num(id, fallback) {
  const v = parseFloat(el(id).value);
  return isNaN(v) ? fallback : v;
}

// Build an HTML table from headers and rows
function makeTable(headers, rows) {
  if (rows.length === 0) return "<p class='empty'>No students found.</p>";
  let html = "<div class='tablewrap'><table><tr>";
  for (const h of headers) html += "<th>" + h + "</th>";
  html += "</tr>";
  for (const row of rows) {
    html += "<tr>";
    for (const cell of row) html += "<td>" + cell + "</td>";
    html += "</tr>";
  }
  return html + "</table></div>";
}

// ---------- 3. Navigation ----------
function showPage(name) {
  for (const p of document.querySelectorAll(".page")) p.classList.remove("active");
  for (const b of document.querySelectorAll("nav button")) b.classList.remove("active");
  el(name).classList.add("active");
  document.querySelector("nav button[data-page='" + name + "']").classList.add("active");
  if (name === "results") renderResults();   // recalculate with the latest choices
  if (name === "ranking") renderRanking();
}

// ---------- 4. The three lists ----------
// List A: students matching the selected skills (Inverted Index) -> Map(id -> matched count)
function getSkillMatches() {
  const matches = invertedIndex.searchSkills(selectedSkills);
  if (el("mustAll").checked) {
    for (const [id, count] of matches) {
      if (count < selectedSkills.length) matches.delete(id);
    }
  }
  return matches;
}

// List B: students inside the CGPA / test score range (K-D Tree) -> array of IDs
function getRangeMatches() {
  return kdTree.rangeSearch(num("minCgpa", 0), num("maxCgpa", 10),
                            num("minScore", 0), num("maxScore", 100));
}

// A and B combined: candidates who pass both checks
function getCandidates() {
  const listA = getSkillMatches();
  const listB = new Set(getRangeMatches());
  const candidates = [];
  for (const s of students) {
    if (!listB.has(s.id)) continue;                                // outside range
    if (selectedSkills.length > 0 && !listA.has(s.id)) continue;   // missing skills
    candidates.push({ student: s, matched: listA.get(s.id) || 0 });
  }
  return candidates;
}

// ---------- 5. Dashboard ----------
function renderDashboard() {
  let totalCgpa = 0, totalScore = 0;
  for (const s of students) {
    totalCgpa += s.cgpa;
    totalScore += s.testScore;
  }
  const skillCounts = invertedIndex.getSkillCounts();
  const n = students.length;

  el("stats").innerHTML =
    "<div><b>" + n + "</b>Students</div>" +
    "<div><b>" + (totalCgpa / n).toFixed(2) + "</b>Average CGPA</div>" +
    "<div><b>" + (totalScore / n).toFixed(1) + "</b>Average test score</div>" +
    "<div><b>" + skillCounts.length + "</b>Different skills</div>";

  let bars = "";
  const top = skillCounts.slice(0, 6);
  for (const item of top) {
    const width = (item.count / top[0].count) * 100;
    bars += "<div class='barrow'><span>" + item.skill + "</span>" +
            "<div class='track'><div class='bar' style='width:" + width + "%'></div></div>" +
            "<b>" + item.count + "</b></div>";
  }
  el("topSkills").innerHTML = bars;
}

// ---------- 6. Student Records ----------
function renderRecords() {
  const rows = [];
  for (const s of students) {
    rows.push([s.id, s.name, s.cgpa, s.testScore, s.skills.join(", ")]);
  }
  el("recordsTable").innerHTML = makeTable(["ID", "Name", "CGPA", "Test score", "Skills"], rows);
}

// ---------- 7. Skill Search ----------
function onSkillTyping() {
  const text = el("skillInput").value.trim();
  if (text === "") { el("suggestions").innerHTML = ""; return; }

  const found = trie.autocomplete(text);          // Trie does the prefix search
  let html = "";
  for (const skill of found) {
    html += "<button class='chip' onclick=\"addSkill('" + skill + "')\">" + skill + "</button>";
  }
  el("suggestions").innerHTML = html || "<p class='empty'>No skill starts with that.</p>";
}

function addSkill(skill) {
  if (!selectedSkills.includes(skill)) selectedSkills.push(skill);
  el("skillInput").value = "";
  el("suggestions").innerHTML = "";
  renderSkillSearch();
}

function removeSkill(skill) {
  selectedSkills = selectedSkills.filter(s => s !== skill);
  renderSkillSearch();
}

function renderSkillSearch() {
  let chips = "";
  for (const skill of selectedSkills) {
    chips += "<span class='chip selected'>" + skill +
             "<button onclick=\"removeSkill('" + skill + "')\">&times;</button></span>";
  }
  el("chosenSkills").innerHTML = chips || "<span class='empty'>None yet. Type a skill above and pick a suggestion.</span>";

  const listA = getSkillMatches();
  const rows = [];
  for (const s of students) {
    if (listA.has(s.id)) {
      rows.push([s.id, s.name, listA.get(s.id) + " / " + selectedSkills.length, s.skills.join(", ")]);
    }
  }
  el("skillMatches").innerHTML = selectedSkills.length === 0 ? "" :
    makeTable(["ID", "Name", "Skills matched", "All skills"], rows);
}

// ---------- 8. Candidate Filter ----------
function applyFilter() {
  const inRange = new Set(getRangeMatches());
  const rows = [];
  for (const s of students) {
    if (inRange.has(s.id)) rows.push([s.id, s.name, s.cgpa, s.testScore]);
  }
  el("filterResults").innerHTML =
    "<p><b>" + rows.length + "</b> of " + students.length + " students are inside the range.</p>" +
    makeTable(["ID", "Name", "CGPA", "Test score"], rows);
}

// ---------- 9. Candidate Results ----------
function renderResults() {
  const list = getCandidates();
  const skillText = selectedSkills.length ? selectedSkills.join(", ") : "none selected";
  el("resultsSummary").innerHTML =
    "Skills: <b>" + skillText + "</b>. CGPA <b>" + num("minCgpa", 0) + " to " + num("maxCgpa", 10) +
    "</b>. Test score <b>" + num("minScore", 0) + " to " + num("maxScore", 100) +
    "</b>. Found <b>" + list.length + "</b> candidates.";

  const rows = [];
  for (const c of list) {
    const match = selectedSkills.length ? c.matched + " / " + selectedSkills.length : "-";
    rows.push([c.student.id, c.student.name, c.student.cgpa, c.student.testScore, match]);
  }
  el("resultsTable").innerHTML = makeTable(["ID", "Name", "CGPA", "Test score", "Skills matched"], rows);
}

// ---------- 10. Candidate Ranking ----------
function renderRanking() {
  const ranked = rankCandidates(getCandidates(), selectedSkills.length);   // ranking.js
  const rows = [];
  for (let i = 0; i < ranked.length; i++) {
    const c = ranked[i];
    rows.push([i + 1, c.student.name, c.score.cgpaPart.toFixed(1), c.score.testPart.toFixed(1),
               c.score.skillPart.toFixed(1), "<b>" + c.score.total.toFixed(1) + "</b>"]);
  }
  el("rankingTable").innerHTML =
    makeTable(["Rank", "Name", "CGPA (max 40)", "Test (max 30)", "Skills (max 30)", "Total (max 100)"], rows);
}

// ---------- 11. Start ----------
renderDashboard();
renderRecords();
renderSkillSearch();
applyFilter();
