const mongoose = require('mongoose');

async function main() {
  try {
    const uri = "mongodb+srv://vidya:aakash8471@cluster0.ftbypmu.mongodb.net/?appName=Cluster0";
    const dbName = "school_admin";
    await mongoose.connect(uri, { dbName });
    const db = mongoose.connection.db;
    const items = await db.collection('preprimaryitems').find({}).toArray();
    items.forEach(item => {
      console.log(`Section: "${item.section}" | Title: "${item.title}" | Src: "${item.src}"`);
    });
    await mongoose.disconnect();
  } catch (err) {
    console.error(err);
  }
}
main();
