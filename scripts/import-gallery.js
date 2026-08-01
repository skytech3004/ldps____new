const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

// Base URL for fetching files
const BASE_URL = 'https://www.vidyawadi.org';
const MONGODB_URI = "mongodb+srv://vidya:aakash8471@cluster0.ftbypmu.mongodb.net/?appName=Cluster0";
const MONGODB_DB = "school_admin";

// Ensure local directory structure exists
function ensureDirectoryExistence(filePath) {
  const dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  ensureDirectoryExistence(dirname);
  fs.mkdirSync(dirname);
}

// Download helper
async function downloadFile(urlPath) {
  // Ensure the urlPath has a leading slash
  const cleanUrlPath = urlPath.startsWith('/') ? urlPath : '/' + urlPath;
  const remoteUrl = `${BASE_URL}${cleanUrlPath}`;
  
  // Resolve local destination path (under public folder)
  const localDest = path.join(__dirname, '../public', cleanUrlPath);
  
  if (fs.existsSync(localDest)) {
    console.log(`[File exists] Skipping download: ${cleanUrlPath}`);
    return cleanUrlPath;
  }

  ensureDirectoryExistence(localDest);

  console.log(`[Downloading] ${remoteUrl} -> ${localDest}`);
  try {
    const res = await fetch(remoteUrl);
    if (!res.ok) {
      throw new Error(`Failed to fetch image: Status ${res.status}`);
    }
    const buffer = Buffer.from(await res.arrayBuffer());
    await fs.promises.writeFile(localDest, buffer);
    console.log(`[Downloaded] Successful: ${cleanUrlPath}`);
    return cleanUrlPath;
  } catch (err) {
    console.error(`[Error] Failed to download ${cleanUrlPath}:`, err.message);
    return null;
  }
}

async function main() {
  try {
    console.log("Fetching gallery JSON...");
    const res = await fetch(`${BASE_URL}/api/gallery`);
    if (!res.ok) {
      throw new Error(`Failed to fetch gallery: Status ${res.status}`);
    }
    const gallery = await res.json();
    const galleryArr = Array.isArray(gallery) ? gallery : (gallery.data || []);
    console.log(`Found ${galleryArr.length} albums in remote API.`);

    // Connect to database
    console.log(`Connecting to MongoDB (${MONGODB_DB})...`);
    await mongoose.connect(MONGODB_URI, { dbName: MONGODB_DB });
    console.log("Connected to MongoDB.");

    // Define MediaItem schema/model
    const MediaItemSchema = new mongoose.Schema(
      {
        title: { type: String, required: true },
        src: { type: String, required: true },
        alt: { type: String, default: "" },
        type: { type: String, required: true },
        category: { type: String, default: "Others", trim: true },
      },
      { collection: 'mediaitems', timestamps: true }
    );
    const MediaItem = mongoose.models.MediaItem || mongoose.model("MediaItem", MediaItemSchema);

    // Filter albums of interest:
    // 1. Category is "Hostel" or albumTitle is "Hostel life"
    // 2. Category is "Infrastructure" or albumTitle is "Infrastucture" (with typo)
    const targetAlbums = galleryArr.filter(album => {
      const cat = String(album.category || '').toLowerCase();
      const title = String(album.albumTitle || '').toLowerCase();
      return cat === 'hostel' || title === 'hostel life' || cat === 'infrastructure' || title === 'infrastucture';
    });

    console.log(`Found ${targetAlbums.length} target albums to process.`);

    for (const album of targetAlbums) {
      const albumTitle = album.albumTitle;
      const originalCat = album.category;
      
      // Determine mapped database category
      let dbCategory = "Others";
      if (originalCat.toLowerCase() === 'hostel' || albumTitle.toLowerCase() === 'hostel life') {
        dbCategory = "Hostel";
      } else if (originalCat.toLowerCase() === 'infrastructure' || albumTitle.toLowerCase() === 'infrastucture') {
        dbCategory = "Infrastructure";
      }

      console.log(`\nProcessing album: "${albumTitle}" (Remote Category: "${originalCat}") -> Target DB Category: "${dbCategory}"`);
      const images = album.images || [];
      console.log(`Album contains ${images.length} images.`);

      let successCount = 0;
      let dbCount = 0;

      for (let i = 0; i < images.length; i++) {
        const imagePath = images[i];
        
        // 1. Download image
        const downloadedPath = await downloadFile(imagePath);
        if (!downloadedPath) {
          continue;
        }

        // 2. Insert into DB (if not already exists)
        const exists = await MediaItem.findOne({ src: downloadedPath });
        if (exists) {
          console.log(`[DB exists] Document with src "${downloadedPath}" already in database.`);
          continue;
        }

        // Create document
        const photoIndex = i + 1;
        const photoTitle = `${dbCategory} - Photo ${photoIndex}`;
        
        await MediaItem.create({
          title: photoTitle,
          src: downloadedPath,
          alt: photoTitle,
          type: "photo",
          category: dbCategory
        });

        console.log(`[DB Inserted] Added "${photoTitle}" -> ${downloadedPath}`);
        dbCount++;
      }

      console.log(`Finished album "${albumTitle}": Downloaded images: ${images.length}, Inserted into DB: ${dbCount}`);
    }

    console.log("\nAll tasks completed successfully!");
    await mongoose.disconnect();
    console.log("Disconnected from database.");
  } catch (err) {
    console.error("Fatal error during import process:", err);
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
  }
}

main();
