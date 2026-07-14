const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Load environment variables from .env.local or .env
function loadEnv() {
  const localEnv = path.join(__dirname, '..', '.env.local');
  const regularEnv = path.join(__dirname, '..', '.env');
  const envPath = fs.existsSync(localEnv) ? localEnv : (fs.existsSync(regularEnv) ? regularEnv : null);
  
  if (envPath) {
    console.log(`Loading env from ${envPath}`);
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split(/\r?\n/).forEach(line => {
      const parts = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (parts) {
        const key = parts[1];
        let value = parts[2] || '';
        if (value.startsWith('"') && value.endsWith('"')) {
          value = value.substring(1, value.length - 1);
        } else if (value.startsWith("'") && value.endsWith("'")) {
          value = value.substring(1, value.length - 1);
        }
        process.env[key] = value;
      }
    });
  }
}

loadEnv();

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB || "school_admin";

if (!MONGODB_URI) {
  console.error("Error: MONGODB_URI is not defined.");
  process.exit(1);
}

const DisclosureDocumentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    pdfUrl: { type: String, trim: true },
    category: { type: String, default: "documents", trim: true },
    value: { type: String, trim: true },
    details: { type: String, trim: true },
    count: { type: Number },
  },
  { timestamps: true }
);

const DisclosureDocumentModel = mongoose.models.DisclosureDocument || mongoose.model("DisclosureDocument", DisclosureDocumentSchema);

const seedData = [
  // 1. General Info
  { category: "general", title: "Name of the School", value: "Leeladevi Parasmal Sancheti English Medium School Vidyawadi" },
  { category: "general", title: "Affiliation No. (CBSE)", value: "1730491" },
  { category: "general", title: "School Code", value: "10835" },
  { category: "general", title: "Complete Address", value: "Vidyawadi, Khimel, St. Rani, Tehsil - Bali, Dist. Pali (Rajasthan), Pincode – 306115" },
  { category: "general", title: "Principal Name & Qualification", value: "Mrs. Jyoti Nath (M.A., B.Ed, M.Phil)" },
  { category: "general", title: "School Email ID", value: "lpsvidhyawadi@gmail.com" },
  { category: "general", title: "Contact Details", value: "6377203204 (Principal)" },

  // 2. Documents & Compliance
  { category: "documents", title: "COPIES OF AFFILIATION/UPGRADATION LETTER AND RECENT EXTENSION OF AFFILIATION", pdfUrl: "/uploads/disclosures/Extension_of_Affiliation.pdf" },
  { category: "documents", title: "COPIES OF SOCIETIES/TRUST/COMPANY REGISTRATION/RENEWAL CERTIFICATE", pdfUrl: "/uploads/disclosures/Trust_Certificate.pdf" },
  { category: "documents", title: "COPY OF NO OBJECTION CERTIFICATE (NOC) ISSUED BY THE STATE GOVT.", pdfUrl: "/uploads/disclosures/NOC.pdf" },
  { category: "documents", title: "COPIES OF RECOGNITION CERTIFICATE UNDER RTE ACT, 2009 & ITS RENEWAL", pdfUrl: "/uploads/disclosures/Recognition_Certificate.pdf" },
  { category: "documents", title: "COPY OF VALID BUILDING SAFETY CERTIFICATE AS PER NBC", pdfUrl: "/uploads/disclosures/Building_Safety_Certificate_AnnexureD.pdf" },
  { category: "documents", title: "COPY OF VALID FIRE SAFETY CERTIFICATE ISSUED BY COMPETENT AUTHORITY", pdfUrl: "/uploads/disclosures/FIRE_SAFETY_CERTIFICATE.pdf" },
  { category: "documents", title: "COPY OF THE SELF CERTIFICATION SUBMITTED BY SCHOOL FOR AFFILIATION", pdfUrl: "/uploads/disclosures/SELF_CERTIFICATION.pdf" },
  { category: "documents", title: "COPIES OF VALID WATER, HEALTH AND SANITATION CERTIFICATES", pdfUrl: "/uploads/disclosures/WATER_HEALTH_AND_SANITATION_CERTIFICATES.pdf" },
  { category: "documents", title: "COPY OF MANDATORY PUBLIC DISCLOSURE (APPENDIX-IX)", pdfUrl: "/uploads/disclosures/Mandatory_Public_Disclosure.pdf" },
  { category: "documents", title: "COPIES OF AFFILIATION/UPGRADATION LETTER AND EXTENSION", pdfUrl: "/uploads/disclosures/Copy_of_Affiliation.pdf" },

  // 3. Results & Academics
  { category: "academics", title: "FEE STRUCTURE OF THE SCHOOL", pdfUrl: "/uploads/disclosures/FEE_STRUCTURE.pdf" },
  { category: "academics", title: "ANNUAL ACADEMIC CALENDER", pdfUrl: "/uploads/disclosures/ANNUAL_ACADEMIC_CALENDER.pdf" },
  { category: "academics", title: "LIST OF SCHOOL MANAGEMENT COMMITTEE (SMC)", pdfUrl: "/uploads/disclosures/SCHOOL_MANAGEMENT_COMMITTEE.pdf" },
  { category: "academics", title: "LIST OF PARENTS TEACHERS ASSOCIATION (PTA) MEMBERS", pdfUrl: "/uploads/disclosures/PARENTS_TEACHERS_ASSOCIATION_MEMBERS.pdf" },
  { category: "academics", title: "LAST THREE-YEAR RESULT OF THE BOARD EXAMINATION", pdfUrl: "/uploads/disclosures/LAST_THREE_YEAR_RESULT_BOARD_EXAMINATION.pdf" },

  // 4. Staff Roles
  { category: "staff_role", title: "Principal", count: 1, details: "Ms. Jyoti Nath" },
  { category: "staff_role", title: "Vice Principal", count: 1, details: "Ms. Deepshikha Khangarot" },
  { category: "staff_role", title: "Headmistress/Headmaster", count: 1, details: "Ms. Honey Agrawat" },
  { category: "staff_role", title: "Special Educator", count: 1, details: "Mr. Andrew Daimari" },
  { category: "staff_role", title: "Counsellor & Wellness Teacher", count: 1, details: "Ms. Neelam Parihar" },

  // 5. Staff Teachers
  { category: "staff_teacher", title: "Staff List OASIS PGT", value: "Post Graduate Teacher (PGT)", count: 17, pdfUrl: "/uploads/disclosures/Staff_List_OASIS_PGT.pdf" },
  { category: "staff_teacher", title: "Staff List OASIS TGT", value: "Trained Graduate Teacher (TGT)", count: 15, pdfUrl: "/uploads/disclosures/Staff_List_OASIS_TGT.pdf" },
  { category: "staff_teacher", title: "Staff List OASIS PRT", value: "Primary & Physical Education Teacher (PRT & PET)", count: 15, pdfUrl: "/uploads/disclosures/Staff_List_OASIS_PRT.pdf" },

  // 6. Staff Stats
  { category: "staff_stat", title: "Total Teachers Count", count: 47 },

  // 7. Infrastructure Details
  { category: "infrastructure", title: "Total Campus Area of the School", value: "15,000 SqMt" },
  { category: "infrastructure", title: "No. and Size of Class Rooms", value: "38 Rooms (Approx 1,824 SqMt Total)" },
  { category: "infrastructure", title: "No. and Size of Laboratories (incl. Computer)", value: "6 Labs (Approx 571 SqMt Total)" },
  { category: "infrastructure", title: "No. and Size of Library", value: "1 Library (Approx 223 SqMt)" },
  { category: "infrastructure", title: "Internet Facility (Yes/No)", value: "Yes" },
  { category: "infrastructure", title: "No. of Girls Toilets", value: "62 Toilets" },
  { category: "infrastructure", title: "No. of Boys Toilets", value: "2 Toilets" },
  { category: "infrastructure", title: "No. of CWSN Toilets (Special Needs)", value: "2 Toilets" },

  // 8. Infrastructure Video Link
  { category: "infrastructure_video", title: "YouTube Inspection Video", value: "https://www.youtube.com/watch?v=f6aSTkhspW0" }
];

async function seed() {
  console.log("Connecting to MongoDB...");
  await mongoose.connect(MONGODB_URI, { dbName: MONGODB_DB });
  console.log("Connected!");

  console.log("Clearing existing disclosures...");
  await DisclosureDocumentModel.deleteMany({});
  console.log("Cleared.");

  console.log(`Seeding ${seedData.length} records...`);
  await DisclosureDocumentModel.insertMany(seedData);
  console.log("Successfully seeded!");

  await mongoose.disconnect();
  console.log("Disconnected from MongoDB.");
}

seed().catch(err => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
