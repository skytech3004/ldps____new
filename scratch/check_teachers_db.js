const { connectToDatabase } = require("../src/lib/mongodb");
const { TeacherModel } = require("../src/models/Teacher");
const fs = require("fs");
const path = require("path");

async function checkDb() {
  await connectToDatabase();
  const count = await TeacherModel.countDocuments();
  console.log("MongoDB Teacher count:", count);
  const sample = await TeacherModel.find().limit(5).lean();
  console.log("Sample:", sample);
}

checkDb().then(() => process.exit(0)).catch(err => { console.error(err); process.exit(1); });
