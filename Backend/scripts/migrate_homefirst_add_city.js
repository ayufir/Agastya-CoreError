const connectDb = require("../db/db");
const mongoose = require("mongoose");
const HomeFirst = require("../model/Banks/homeFirstModel");

async function run() {
  try {
    await connectDb();

    const missing = await HomeFirst.find({
      $or: [
        { city: { $exists: false } },
        { city: null },
        { city: "" },
      ],
    }).lean();

    console.log(`Found ${missing.length} HomeFirst documents missing city`);

    for (const doc of missing) {
      const newCity = doc.nearestCityTown || "";
      await HomeFirst.updateOne({ _id: doc._id }, { $set: { city: newCity } });
      console.log(`Updated ${doc._id} -> city='${newCity}'`);
    }

    console.log("Migration complete");
    process.exit(0);
  } catch (err) {
    console.error("Migration failed:", err);
    process.exit(1);
  }
}

run();
