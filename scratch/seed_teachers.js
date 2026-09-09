const fs = require("fs");
const path = require("path");

const txtPath = path.join(__dirname, "..", "teacher.txt");
const rawText = fs.readFileSync(txtPath, "utf8");
const lines = rawText
  .split(/\r?\n/)
  .map((line) => line.trim())
  .filter(Boolean);

const roster = [];

for (let index = 0; index < lines.length;) {
  const name = lines[index];
  const repeatedName = lines[index + 1];
  const designation = lines[index + 2];

  if (name && repeatedName && designation && name === repeatedName) {
    roster.push({
      name,
      designation,
      image: /principal/i.test(designation) ? "/lps-vidhyawadi/principal_portrait.png" : ""
    });
    index += 3;
    continue;
  }

  if (name && designation) {
    roster.push({
      name,
      designation,
      image: /principal/i.test(designation) ? "/lps-vidhyawadi/principal_portrait.png" : ""
    });
    index += 2;
    continue;
  }

  index += 1;
}

const jsonPath = path.join(__dirname, "..", "public", "data", "teachers.json");
fs.writeFileSync(jsonPath, JSON.stringify(roster, null, 2), "utf8");
console.log(`Successfully generated teachers.json with ${roster.length} entries.`);
