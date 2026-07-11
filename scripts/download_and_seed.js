const https = require('https');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

// Manually load environment variables from .env
const envPath = path.join(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
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

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB || "school_admin";

if (!MONGODB_URI) {
  console.error("Error: MONGODB_URI is not defined in the environment.");
  process.exit(1);
}

// Schemas & Models
const FilterSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  type: { type: String, enum: ["gallery", "blog", "hostel"], required: true },
}, { timestamps: true });

FilterSchema.index({ name: 1, type: 1 }, { unique: true });

const FilterModel = mongoose.model('Filter', FilterSchema);

const MediaItemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  src: { type: String, required: true },
  alt: { type: String, default: "" },
  type: { type: String, enum: ["photo", "video", "highlight", "hostel-photo", "nss-photo", "ncc-photo"], required: true },
  category: { type: String, default: "Others", trim: true },
}, { timestamps: true });

const MediaItemModel = mongoose.model('MediaItem', MediaItemSchema);

const SportsSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true, default: "main" },
  complexImages: { type: [String], default: [] }
}, { strict: false });

const SportsModel = mongoose.model('Sports', SportsSchema);

// Data
const sportsUrls = [
  "https://www.vidyawadi.org/uploads/gallery/sports/1772677427823-_29012022131409406.jpg",
  "https://www.vidyawadi.org/uploads/gallery/sports/1772677462810-6d8b41a6-cf4a-4f8f-9530-ea59b75c9377.jpg",
  "https://www.vidyawadi.org/uploads/gallery/sports/1772677493367-Picture34.jpg",
  "https://www.vidyawadi.org/uploads/gallery/sports/1772677493477-Picture33.jpg",
  "https://www.vidyawadi.org/uploads/gallery/sports/1772677493692-Picture30.jpg",
  "https://www.vidyawadi.org/uploads/gallery/sports/1772677493981-Picture29.jpg",
  "https://www.vidyawadi.org/uploads/gallery/sports/1772677492410-Picture28.jpg",
  "https://www.vidyawadi.org/uploads/gallery/sports/1772677519346-WhatsApp-Image-2026-02-25-at-18.27.53.jpeg"
];

const nccUrls = [
  "https://www.vidyawadi.org/uploads/gallery/1772676969037-9ef208ed-5ca3-4c87-88f9-fcf2fd7d8b60.jpg",
  "https://www.vidyawadi.org/uploads/gallery/1772676969207-c6a0bd22-14dd-407d-b513-807cd2bf7d0b.jpg",
  "https://www.vidyawadi.org/uploads/gallery/ncc-&-nss/1772677090981-WhatsApp-Image-2026-01-13-at-15.55.53.jpeg",
  "https://www.vidyawadi.org/uploads/gallery/ncc-&-nss/1772677120460-Picture32.jpg",
  "https://www.vidyawadi.org/uploads/gallery/ncc-&-nss/1772677597487-a9fa45d8-e14b-4e5f-b4c0-64cc9c49e22f.jpg"
];

const nssUrls = [
  "https://www.vidyawadi.org/uploads/gallery/1772676968979-74d4f380-d171-424f-b6bb-442329f9df58.jpg",
  "https://www.vidyawadi.org/uploads/gallery/1772676969088-d14cd52c-4329-48db-a8ca-35e40014d84f.jpg",
  "https://www.vidyawadi.org/uploads/gallery/1772676969137-e781f21c-6fa8-40fe-b753-459ce5c72570.jpg",
  "https://www.vidyawadi.org/uploads/gallery/1772676968997-ed1636f9-25e8-4bf3-ac4a-fb8461b1f8fe.jpg",
  "https://www.vidyawadi.org/uploads/gallery/ncc-&-nss/1772677597347-6f59020c-dd38-4b4c-ba4e-473de9b146e4.jpg",
  "https://www.vidyawadi.org/uploads/gallery/ncc-&-nss/1772677597333-7e7ad0cf-7675-40dc-b2d9-a7a4dc3053a4.jpg",
  "https://www.vidyawadi.org/uploads/gallery/ncc-&-nss/1772677597343-74d4f380-d171-424f-b6bb-442329f9df58.jpg"
];

// Helper to download image
function downloadImage(url, dest) {
  return new Promise((resolve, reject) => {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    const file = fs.createWriteStream(dest);
    
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed with status ${response.statusCode} for ${url}`));
        return;
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close(() => resolve());
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

async function main() {
  console.log("Connecting to MongoDB...");
  await mongoose.connect(MONGODB_URI, { dbName: MONGODB_DB });
  console.log("Connected successfully!");

  const targetDir = path.join(__dirname, '..', 'public', 'uploads', 'gallery');

  // 1. Ensure "Sports" category filter exists in general photo gallery categories
  console.log("Checking gallery filters...");
  const sportsFilter = await FilterModel.findOne({ name: "Sports", type: "gallery" });
  if (!sportsFilter) {
    await FilterModel.create({ name: "Sports", type: "gallery" });
    console.log("Added 'Sports' filter category to the general media gallery.");
  }

  const sportsLocalPaths = [];

  // 2. Download and insert Sports Photos
  console.log("\nProcessing Sports images...");
  for (let i = 0; i < sportsUrls.length; i++) {
    const filename = `sports-img-${i + 1}.jpg`;
    const dest = path.join(targetDir, filename);
    const srcPath = `/uploads/gallery/${filename}`;
    
    console.log(`Downloading ${sportsUrls[i]} -> ${dest}...`);
    try {
      await downloadImage(sportsUrls[i], dest);
      sportsLocalPaths.push(srcPath);

      // Save in MediaItem
      const title = `Sports Day Selection - Activity ${i + 1}`;
      const existing = await MediaItemModel.findOne({ src: srcPath });
      if (!existing) {
        await MediaItemModel.create({
          title,
          src: srcPath,
          alt: title,
          type: "photo",
          category: "Sports"
        });
        console.log(`Saved MediaItem database record for ${filename}`);
      } else {
        console.log(`MediaItem record for ${filename} already exists`);
      }
    } catch (e) {
      console.error(`Failed to process sports image ${i + 1}:`, e.message);
    }
  }

  // Update Sports Complex Carousel with new images
  console.log("Updating Sports Complex Carousel...");
  const sportsComplex = await SportsModel.findOne({ key: "main" });
  if (sportsComplex) {
    // Merge existing and new local paths, avoiding duplicates
    const combined = Array.from(new Set([...sportsComplex.complexImages, ...sportsLocalPaths]));
    sportsComplex.complexImages = combined;
    await sportsComplex.save();
    console.log("Updated complexImages for Sports Showcase!");
  }

  // 3. Download and insert NCC Photos
  console.log("\nProcessing NCC images...");
  for (let i = 0; i < nccUrls.length; i++) {
    const filename = `ncc-img-${i + 1}.jpg`;
    const dest = path.join(targetDir, filename);
    const srcPath = `/uploads/gallery/${filename}`;

    console.log(`Downloading ${nccUrls[i]} -> ${dest}...`);
    try {
      await downloadImage(nccUrls[i], dest);

      // Save in MediaItem
      const title = `NCC Youth Cadets - Drill Activity ${i + 1}`;
      const existing = await MediaItemModel.findOne({ src: srcPath });
      if (!existing) {
        await MediaItemModel.create({
          title,
          src: srcPath,
          alt: title,
          type: "ncc-photo",
          category: "Others"
        });
        console.log(`Saved NCC database record for ${filename}`);
      } else {
        console.log(`NCC record for ${filename} already exists`);
      }
    } catch (e) {
      console.error(`Failed to process NCC image ${i + 1}:`, e.message);
    }
  }

  // 4. Download and insert NSS Photos
  console.log("\nProcessing NSS images...");
  for (let i = 0; i < nssUrls.length; i++) {
    const filename = `nss-img-${i + 1}.jpg`;
    const dest = path.join(targetDir, filename);
    const srcPath = `/uploads/gallery/${filename}`;

    console.log(`Downloading ${nssUrls[i]} -> ${dest}...`);
    try {
      await downloadImage(nssUrls[i], dest);

      // Save in MediaItem
      const title = `NSS Social Services - Volunteer Camp ${i + 1}`;
      const existing = await MediaItemModel.findOne({ src: srcPath });
      if (!existing) {
        await MediaItemModel.create({
          title,
          src: srcPath,
          alt: title,
          type: "nss-photo",
          category: "Others"
        });
        console.log(`Saved NSS database record for ${filename}`);
      } else {
        console.log(`NSS record for ${filename} already exists`);
      }
    } catch (e) {
      console.error(`Failed to process NSS image ${i + 1}:`, e.message);
    }
  }

  console.log("\nAll downloads and database seeding operations completed successfully!");
  mongoose.disconnect();
}

main().catch(err => {
  console.error("Fatal Seeding Error:", err);
  process.exit(1);
});
