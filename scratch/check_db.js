const mongoose = require('mongoose');

const MONGODB_URI = "mongodb+srv://vidya:aakash8471@cluster0.ftbypmu.mongodb.net/?appName=Cluster0";
const MONGODB_DB = "school_admin";

async function main() {
  console.log("Connecting to MongoDB...");
  await mongoose.connect(MONGODB_URI, { dbName: MONGODB_DB });
  console.log("Connected!");

  const collections = await mongoose.connection.db.listCollections().toArray();
  console.log("Collections:", collections.map(c => c.name));

  const count = await mongoose.connection.db.collection('disclosure_documents').countDocuments();
  console.log("Disclosure documents count:", count);

  const docs = await mongoose.connection.db.collection('disclosure_documents').find().toArray();
  console.log("Sample docs:", docs);

  await mongoose.disconnect();
}

main().catch(err => {
  console.error("Error:", err);
});
