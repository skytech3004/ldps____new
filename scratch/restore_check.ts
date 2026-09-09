import "dotenv/config";
import path from "path";
import fs from "fs";

// Load .env.local manually
const envLocalPath = path.join(__dirname, "..", ".env.local");
if (fs.existsSync(envLocalPath)) {
  const envConfig = require("dotenv").parse(fs.readFileSync(envLocalPath));
  for (const k in envConfig) {
    process.env[k] = envConfig[k];
  }
}

import { connectToDatabase } from "../src/lib/mongodb";
import mongoose from "mongoose";

async function main() {
  await connectToDatabase();
  const db = mongoose.connection.db;
  if (!db) {
    console.error("No db connection");
    return;
  }
  const collections = await db.listCollections().toArray();
  console.log("Collections in DB:", collections.map(c => c.name));

  for (const col of collections) {
    const docs = await db.collection(col.name).find().toArray();
    console.log(`Collection [${col.name}] has ${docs.length} documents.`);
    if (/teacher|staff|committee/i.test(col.name)) {
      console.log(`Docs in ${col.name}:`, JSON.stringify(docs, null, 2));
    }
  }
}

main().then(() => process.exit(0)).catch(err => { console.error(err); process.exit(1); });
