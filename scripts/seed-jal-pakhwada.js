const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");

// Parse env file manually to ensure robustness
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

// Define Blog Schema inline
const BlogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    excerpt: { type: String, required: true, trim: true },
    content: { type: String, required: true, trim: true },
    image: { type: String, required: true, trim: true },
    author: { type: String, default: "Admin", trim: true },
    tags: { type: [String], default: [] },
    publishedAt: { type: Date, default: Date.now },
    status: { type: String, enum: ["Draft", "Published"], default: "Published" },
  },
  { timestamps: true }
);

const Blog = mongoose.models.Blog || mongoose.model("Blog", BlogSchema);

const jalPakhwadaBlog = {
  title: "JAL PAKHWADA 2026",
  slug: "jal-pakhwada-2026",
  excerpt: "Join us in celebrating water conservation and awareness. Explore the vibrant activities and initiatives undertaken by our students during this meaningful event.",
  content: `<div class="space-y-6 text-[#002147]/80">
    <p class="text-lg leading-relaxed font-medium">
      At Leeladevi Parasmal Sancheti English Medium Sr. Sec. School, Vidyawadi, we observed <strong>Jal Pakhwada 2026</strong>—a dedicated fortnight-long campaign designed to promote water conservation and environmental awareness among our students.
    </p>
    <p class="leading-relaxed">
      Water is the elixir of life, yet it is one of the most threatened natural resources today. Guided by our institutional commitment to fostering responsible global citizenship, the school organized a wide range of interactive events, student presentations, creative poster displays, and awareness drives.
    </p>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
      <div class="p-6 bg-slate-50 rounded-2xl border border-slate-100">
        <h4 class="font-bold text-[#3D348B] mb-2">Student Presentations &amp; Models</h4>
        <p class="text-sm text-gray-600">Students demonstrated working models of rainwater harvesting systems, drip irrigation techniques, and greywater recycling solutions suitable for campus implementation.</p>
      </div>
      <div class="p-6 bg-slate-50 rounded-2xl border border-slate-100">
        <h4 class="font-bold text-[#3D348B] mb-2">Community Rallies &amp; Campaigns</h4>
        <p class="text-sm text-gray-600">Cadets from our NCC unit and guides participated in rallies in Khimel and Rani station districts, distributing pamphlets and spreading the message of saving water.</p>
      </div>
    </div>
    <p class="leading-relaxed">
      In addition to the rallies and models, classroom activities included slogan writing, painting, and debating the global water crisis. The campaign concluded on a high note with a water conservation pledge taken by the Principal, Jyoti Nath, faculty members, and over 1,000 students, reiterating our daily commitment to ecological mindfulness.
    </p>
  </div>`,
  image: "/WhatsApp Image 2026-04-30 at 10.34.08.jpeg",
  author: "Principal Desk",
  tags: ["Events", "Conservation", "Activities"],
  publishedAt: new Date("2026-04-30T10:00:00Z"),
  status: "Published"
};

async function seed() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(uri, { dbName });
    console.log("Connected successfully!");

    console.log("Checking if blog post already exists...");
    const existing = await Blog.findOne({ slug: jalPakhwadaBlog.slug });
    if (existing) {
      console.log("Jal Pakhwada blog post already exists. Updating content...");
      await Blog.updateOne({ slug: jalPakhwadaBlog.slug }, jalPakhwadaBlog);
      console.log("Updated blog post successfully.");
    } else {
      console.log("Creating new Jal Pakhwada blog post...");
      await Blog.create(jalPakhwadaBlog);
      console.log("Created blog post successfully.");
    }

  } catch (error) {
    console.error("Seeding failed:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
  }
}

seed();
