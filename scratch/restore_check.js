const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");

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

async function main() {
  const uri = process.env.MONGODB_URI;
  console.log("Connecting to URI:", uri ? uri.substring(0, 30) + "..." : "NONE");
  await mongoose.connect(uri, { dbName: process.env.MONGODB_DB || "school_admin" });
  
  const db = mongoose.connection.db;
  const collections = await db.listCollections().toArray();
  console.log("Collections in DB:", collections.map(c => c.name));

  for (const col of collections) {
    const docs = await db.collection(col.name).find().toArray();
    console.log(`Collection [${col.name}] has ${docs.length} documents.`);
    if (/teacher|staff|committee/i.test(col.name)) {
      console.log(`Docs in [${col.name}]:`, JSON.stringify(docs, null, 2));
    }
  }
}

main().then(() => process.exit(0)).catch(err => { console.error(err); process.exit(1); });
