// scripts/fix_orphaned_cases.js
require("dotenv").config();
const mongoose = require("mongoose");
const HomeFirst = require("../model/Banks/homeFirstModel");

async function run() {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) {
      throw new Error("MONGO_URI environment variable is not defined");
    }
    console.log("Connecting to MongoDB...");
    await mongoose.connect(uri);
    console.log("Connected successfully.");

    // Query for HomeFirst cases with status: "Work in Progress" and assignedTo: null / undefined
    const orphanedCases = await HomeFirst.find({
      status: "Work in Progress",
      $or: [
        { assignedTo: null },
        { assignedTo: { $exists: false } }
      ]
    });

    console.log(`Found ${orphanedCases.length} orphaned HomeFirst cases.`);

    if (orphanedCases.length > 0) {
      const ids = orphanedCases.map(c => c._id);
      console.log("Orphaned case IDs:", ids);

      // Update their status to "Pending"
      const result = await HomeFirst.updateMany(
        { _id: { $in: ids } },
        { $set: { status: "Pending" } }
      );

      console.log(`Successfully updated ${result.modifiedCount} cases to status: "Pending".`);
    } else {
      console.log("No orphaned cases found. Nothing to update.");
    }

    process.exit(0);
  } catch (err) {
    console.error("Migration failed:", err);
    process.exit(1);
  }
}

run();
