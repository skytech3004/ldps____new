import path from "path";
import fs from "fs";
import dns from "dns";

// Fix Node DNS SRV lookup on Windows
try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (e) {
  // ignore
}

// Load .env.local
const envLocalPath = path.join(__dirname, "..", ".env.local");
if (fs.existsSync(envLocalPath)) {
  const content = fs.readFileSync(envLocalPath, "utf8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#")) {
      const idx = trimmed.indexOf("=");
      if (idx > 0) {
        const k = trimmed.substring(0, idx).trim();
        const v = trimmed.substring(idx + 1).trim();
        process.env[k] = v;
      }
    }
  }
}

import { connectToDatabase } from "../src/lib/mongodb";
import { TeacherModel } from "../src/models/Teacher";

const staffList = [
  { name: "MS. JYOTI NATH", designation: "Principal", image: "/lps-vidhyawadi/principal_portrait.png", sortOrder: 1 },
  { name: "MS. DEEPSHIKHA KHANGAROT", designation: "Vice Principal & PGT (Biology)", sortOrder: 2 },
  { name: "DR. NIDHI UPADHYAY", designation: "PGT ( Painting) & CCA Incharge", sortOrder: 3 },
  { name: "MRS. BHAGWANTI", designation: "PGT (Maths) & NCC CTO", sortOrder: 4 },
  { name: "MR. GHANSHYAM SINGH", designation: "PGT (English) & Assembly Incharge", sortOrder: 5 },
  { name: "MS. MAMTA RAJPUROHIT", designation: "PGT ( Economic & B.St. )", sortOrder: 6 },
  { name: "MR. MAHENDRA KUMAR", designation: "PGT (Physics) & Exam Incharge", sortOrder: 7 },
  { name: "MRS. PRIYA SHARMA", designation: "PGT (Hindi) & Club Coordinator", sortOrder: 8 },
  { name: "MR. RONAK SINGH", designation: "PGT (Accountancy)", sortOrder: 9 },
  { name: "MS. ROSHNI BANO", designation: "PGT (Music)", sortOrder: 10 },
  { name: "MR. PRADEEP SINGH SEVARSA", designation: "PGT (Comp. Sci.)", sortOrder: 11 },
  { name: "MR. ANDREW DAIMARI", designation: "PGT(English)", sortOrder: 12 },
  { name: "MR. PUSHPENDRA SINGH", designation: "PGT (Geography)", sortOrder: 13 },
  { name: "MR. RAHUL JOSHI", designation: "PGT (Polt. Scie.)", sortOrder: 14 },
  { name: "MS. NEHA SRIVASTAVA", designation: "PGT (English)", sortOrder: 15 },
  { name: "MS. NAMITA KOLI", designation: "PGT (History)", sortOrder: 16 },
  { name: "MS. PRIYA RAO", designation: "PGT (Chemistry)", sortOrder: 17 },
  { name: "MRS. DEEPA TOLANI", designation: "TGT (S.St.) & Skill Incharge", sortOrder: 18 },
  { name: "MRS. RAJKUMARI CHOUDHARY", designation: "TGT (Science)", sortOrder: 19 },
  { name: "MS. ARUNA MALI", designation: "TGT (Sanskrit)", sortOrder: 20 },
  { name: "MR. KANTILAL PRAJAPAT", designation: "TGT (Maths)", sortOrder: 21 },
  { name: "MS. DIVYA SONI", designation: "TGT (Maths)", sortOrder: 22 },
  { name: "MS. PRIYANKA SAXENA", designation: "TGT (Sanskrit)", sortOrder: 23 },
  { name: "MS. KALAL NILAM", designation: "TGT (Comp. Sci.)", sortOrder: 24 },
  { name: "MS. YUMNUM MANGLEM SINGH", designation: "TGT(Science)", sortOrder: 25 },
  { name: "MS. SUNDER DEWASI", designation: "TGT (Hindi), Guide-Incharge", sortOrder: 26 },
  { name: "MS. LAXMI CHOUDHARY", designation: "TGT (IT)", sortOrder: 27 },
  { name: "MS. KAREENA SHAIKH", designation: "TGT(S.ST. & English)", sortOrder: 28 },
  { name: "MS. CHHAYA RAJPUROHIT", designation: "TGT(English) & PGT (B.ST)", sortOrder: 29 },
  { name: "MS. GRACY SONI", designation: "TGT (Maths)", sortOrder: 30 },
  { name: "MS. JYOTI CHOUDHARY", designation: "TGT Hindi", sortOrder: 31 },
  { name: "MS. SEJAL OJHA", designation: "TGT (Maths & science)", sortOrder: 32 },
  { name: "MS. YUMNUM REENA DEVI", designation: "PRT", sortOrder: 33 },
  { name: "MS. MONIKA NAMA", designation: "PRT (Science)", sortOrder: 34 },
  { name: "MS. HEMLATA SUTHAR", designation: "PRT", sortOrder: 35 },
  { name: "MS. PISTA KUMARI", designation: "PRT", sortOrder: 36 },
  { name: "MS. MONIKA KUMARI", designation: "PRT", sortOrder: 37 },
  { name: "MS. BHAWANA SOLANKI", designation: "PRT+Lab Asst.", sortOrder: 38 },
  { name: "MS. RAJESHWARI BOSE", designation: "PRT", sortOrder: 39 },
  { name: "MS. KOMAL KANWAR", designation: "PRT", sortOrder: 40 },
  { name: "MS. PRIYANKA", designation: "PRT", sortOrder: 41 },
  { name: "MS. MEENA CHOUHAN", designation: "PRT", sortOrder: 42 },
  { name: "MS. HARSHA KUNWAR", designation: "PTI", sortOrder: 43 },
  { name: "MR. MD. ASFAK", designation: "Office Supdt.", sortOrder: 44 },
  { name: "MR. NIRANJAN GEHLOT", designation: "Accountant", sortOrder: 45 },
  { name: "MS. SADHANA BOSE", designation: "Lab Assistant", sortOrder: 46 },
  { name: "MS. TANISHA", designation: "Librarian", sortOrder: 47 },
  { name: "MR. SURESH PURI", designation: "Peon", sortOrder: 48 },
  { name: "MR. RAMESH CHOUDHARY", designation: "Peon", sortOrder: 49 },
  { name: "MRS. RUKMINI", designation: "Peon", sortOrder: 50 },
  { name: "MR. HEERAL LAL PRAJAPAT", designation: "Peon", sortOrder: 51 },
  { name: "MRS. CHAMPA", designation: "Peon", sortOrder: 52 },
  { name: "MS. ANJU KANWAR", designation: "Peon", sortOrder: 53 },
  { name: "MRS. BASANTI DEVI", designation: "Sweeper", sortOrder: 54 },
  { name: "MRS. KRISHNA", designation: "Sweeper", sortOrder: 55 },
  { name: "MR. RAMESH PRAJAPAT", designation: "Peon", sortOrder: 56 },
  { name: "MS. MAMTA GOSWAMI", designation: "Peon", sortOrder: 57 },
];

async function seed() {
  console.log("Connecting to MongoDB with public DNS...");
  await connectToDatabase();
  console.log("Clearing existing Teacher documents...");
  await TeacherModel.deleteMany({});
  console.log(`Inserting ${staffList.length} staff entries from admin screenshots...`);
  const inserted = await TeacherModel.insertMany(staffList);
  console.log(`SUCCESS! Populated ${inserted.length} staff members into MongoDB!`);
}

seed().then(() => process.exit(0)).catch((err) => {
  console.error(err);
  process.exit(1);
});
