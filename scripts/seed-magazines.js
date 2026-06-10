const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");

// Parse env file manually to ensure robustness in different environments
const envPath = path.join(__dirname, "../.env.local");
let uri = process.env.MONGODB_URI;
let dbName = process.env.MONGODB_DB || "school_admin";

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf8");
  const matchUri = envContent.match(/MONGODB_URI=(.*)/);
  if (matchUri && matchUri[1]) {
    uri = matchUri[1].trim();
  }
  const matchDb = envContent.match(/MONGODB_DB=(.*)/);
  if (matchDb && matchDb[1]) {
    dbName = matchDb[1].trim();
  }
}

if (!uri) {
  console.error("MONGODB_URI not found in environment or .env.local");
  process.exit(1);
}

// Define schema inline to avoid ESM/CommonJS compilation mismatch
const MagazineSchema = new mongoose.Schema({
  name: String,
  pdfUrl: String,
  year: Number,
  month: String,
});

const Magazine = mongoose.models.Magazine || mongoose.model("Magazine", MagazineSchema);

const sampleData = [
  // Year 2026
  { name: "Akashganga", pdfUrl: "/uploads/documents/sample-magazine.pdf", year: 2026, month: "January" },
  
  // Year 2025
  { name: "Akashganga", pdfUrl: "/uploads/documents/sample-magazine.pdf", year: 2025, month: "November" },
  { name: "Akashganga", pdfUrl: "/uploads/documents/sample-magazine.pdf", year: 2025, month: "October" },
  { name: "Akashganga", pdfUrl: "/uploads/documents/sample-magazine.pdf", year: 2025, month: "September" },
  { name: "Akashganga", pdfUrl: "/uploads/documents/sample-magazine.pdf", year: 2025, month: "August" },
  { name: "Akashganga", pdfUrl: "/uploads/documents/sample-magazine.pdf", year: 2025, month: "July" },
  { name: "Akashganga", pdfUrl: "/uploads/documents/sample-magazine.pdf", year: 2025, month: "May" },
  { name: "Akashganga", pdfUrl: "/uploads/documents/sample-magazine.pdf", year: 2025, month: "April" },
  { name: "Akashganga", pdfUrl: "/uploads/documents/sample-magazine.pdf", year: 2025, month: "March" },
  { name: "Akashganga", pdfUrl: "/uploads/documents/sample-magazine.pdf", year: 2025, month: "February" },
  { name: "Akashganga", pdfUrl: "/uploads/documents/sample-magazine.pdf", year: 2025, month: "January" },

  // Year 2024
  { name: "Akashganga", pdfUrl: "/uploads/documents/sample-magazine.pdf", year: 2024, month: "December" },
  { name: "Akashganga", pdfUrl: "/uploads/documents/sample-magazine.pdf", year: 2024, month: "November" },
  { name: "Akashganga", pdfUrl: "/uploads/documents/sample-magazine.pdf", year: 2024, month: "October" },
  { name: "Akashganga", pdfUrl: "/uploads/documents/sample-magazine.pdf", year: 2024, month: "September" },
  { name: "Akashganga", pdfUrl: "/uploads/documents/sample-magazine.pdf", year: 2024, month: "August" },
  { name: "Akashganga", pdfUrl: "/uploads/documents/sample-magazine.pdf", year: 2024, month: "July" },
  { name: "Akashganga", pdfUrl: "/uploads/documents/sample-magazine.pdf", year: 2024, month: "May" },
  { name: "Akashganga", pdfUrl: "/uploads/documents/sample-magazine.pdf", year: 2024, month: "April" },
  { name: "Akashganga", pdfUrl: "/uploads/documents/sample-magazine.pdf", year: 2024, month: "March" },
  { name: "Akashganga", pdfUrl: "/uploads/documents/sample-magazine.pdf", year: 2024, month: "February" },

  // Year 2023
  { name: "Akashganga", pdfUrl: "/uploads/documents/sample-magazine.pdf", year: 2023, month: "December" },
  { name: "Akashganga", pdfUrl: "/uploads/documents/sample-magazine.pdf", year: 2023, month: "November" },
  { name: "Akashganga", pdfUrl: "/uploads/documents/sample-magazine.pdf", year: 2023, month: "October" },
  { name: "Akashganga", pdfUrl: "/uploads/documents/sample-magazine.pdf", year: 2023, month: "September" },
  { name: "Akashganga", pdfUrl: "/uploads/documents/sample-magazine.pdf", year: 2023, month: "August" },
  { name: "Akashganga", pdfUrl: "/uploads/documents/sample-magazine.pdf", year: 2023, month: "July" },
  { name: "Akashganga", pdfUrl: "/uploads/documents/sample-magazine.pdf", year: 2023, month: "May" },
  { name: "Akashganga", pdfUrl: "/uploads/documents/sample-magazine.pdf", year: 2023, month: "April" },
  { name: "Akashganga", pdfUrl: "/uploads/documents/sample-magazine.pdf", year: 2023, month: "March" },
  { name: "Akashganga", pdfUrl: "/uploads/documents/sample-magazine.pdf", year: 2023, month: "February" },

  // Year 2022
  { name: "Akashganga", pdfUrl: "/uploads/documents/sample-magazine.pdf", year: 2022, month: "December" },
  { name: "Akashganga", pdfUrl: "/uploads/documents/sample-magazine.pdf", year: 2022, month: "November" },
  { name: "Akashganga", pdfUrl: "/uploads/documents/sample-magazine.pdf", year: 2022, month: "October" },
  { name: "Akashganga", pdfUrl: "/uploads/documents/sample-magazine.pdf", year: 2022, month: "September" },
  { name: "Akashganga", pdfUrl: "/uploads/documents/sample-magazine.pdf", year: 2022, month: "August" },
  { name: "Akashganga", pdfUrl: "/uploads/documents/sample-magazine.pdf", year: 2022, month: "July" },
  { name: "Akashganga", pdfUrl: "/uploads/documents/sample-magazine.pdf", year: 2022, month: "May" },
  { name: "Akashganga", pdfUrl: "/uploads/documents/sample-magazine.pdf", year: 2022, month: "April" },
  { name: "Akashganga", pdfUrl: "/uploads/documents/sample-magazine.pdf", year: 2022, month: "March" },
  { name: "Akashganga", pdfUrl: "/uploads/documents/sample-magazine.pdf", year: 2022, month: "February" }
];

async function seed() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(uri, { dbName });
    console.log("Connected successfully!");

    console.log("Cleaning up existing magazines...");
    await Magazine.deleteMany({});

    console.log("Seeding new magazines...");
    await Magazine.insertMany(sampleData);
    console.log(`Successfully seeded ${sampleData.length} magazine entries!`);

    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
    process.exit(0);
  } catch (err) {
    console.error("Seeding failed:", err);
    process.exit(1);
  }
}

seed();
