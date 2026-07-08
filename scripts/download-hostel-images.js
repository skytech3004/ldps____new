const fs = require('fs');
const path = require('path');
const https = require('https');

const IMAGES_TO_DOWNLOAD = [
  { url: "https://www.vidyawadi.org/hostel.jpg", dest: "hostel.jpg" },
  { url: "https://www.vidyawadi.org/f837631c-4bc9-4494-b8f1-fff9b07554d8.jpg", dest: "about_hostel.jpg" },
  { url: "https://www.vidyawadi.org/uploads/mess/security.jpg", dest: "security.jpg" },
  { url: "https://www.vidyawadi.org/images/jain_meals.png", dest: "jain_meals.png" },
  { url: "https://www.vidyawadi.org/uploads/mess/RO.jpg", dest: "RO.jpg" },
  { url: "https://www.vidyawadi.org/uploads/mess/HOT.jpg", dest: "HOT.jpg" },
  { url: "https://www.vidyawadi.org/uploads/mess/aa.jpg", dest: "aa.jpg" },
  { url: "https://www.vidyawadi.org/uploads/mess/yoga.jpeg", dest: "yoga.jpeg" },
  { url: "https://www.vidyawadi.org/uploads/mess/sport.jpg", dest: "sport.jpg" },
  { url: "https://www.vidyawadi.org/uploads/mess/Health.jpg", dest: "Health.jpg" },
  { url: "https://www.vidyawadi.org/uploads/mess/ac.jpg", dest: "ac.jpg" },
  { url: "https://www.vidyawadi.org/uploads/mess/laundry.jpg", dest: "laundry.jpg" },
  { url: "https://www.vidyawadi.org/uploads/mess/tuck.jpg", dest: "tuck.jpg" },
  { url: "https://www.vidyawadi.org/Cafeteria.png", dest: "Cafeteria.png" },
  { url: "https://www.vidyawadi.org/Hostels.png", dest: "Hostels.png" },
  { url: "https://www.vidyawadi.org/Hostels_1.png", dest: "Hostels_1.png" },
  { url: "https://www.vidyawadi.org/Hostels_2.png", dest: "Hostels_2.png" },
  { url: "https://www.vidyawadi.org/Hostels_3.png", dest: "Hostels_3.png" },
  { url: "https://www.vidyawadi.org/Hostels_4.png", dest: "Hostels_4.png" }
];

const destDir = path.join(__dirname, "..", "public", "uploads", "hostel");

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`Failed to fetch ${url}, status code: ${res.statusCode}`));
        return;
      }
      const fileStream = fs.createWriteStream(destPath);
      res.pipe(fileStream);
      fileStream.on('finish', () => {
        fileStream.close();
        resolve();
      });
      fileStream.on('error', (err) => {
        fs.unlink(destPath, () => {});
        reject(err);
      });
    }).on('error', reject);
  });
}

async function run() {
  console.log("Starting download of hostel page assets...");
  for (const img of IMAGES_TO_DOWNLOAD) {
    const filePath = path.join(destDir, img.dest);
    console.log(`Downloading ${img.url} -> ${filePath}`);
    try {
      await downloadFile(img.url, filePath);
      console.log(`Success!`);
    } catch (err) {
      console.error(`Failed to download ${img.url}:`, err.message);
    }
  }
  console.log("All downloads complete.");
}

run();
