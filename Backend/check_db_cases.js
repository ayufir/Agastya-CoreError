require("dotenv").config();
const mongoose = require("mongoose");
const HomeFirst = require("./model/Banks/homeFirstModel");

async function check() {
  try {
    const uri = process.env.MONGO_URI;
    console.log("Connecting to MongoDB:", uri);
    await mongoose.connect(uri);
    console.log("Connected.");

    // Find the latest case in HomeFirst
    const c = await HomeFirst.findOne({ customerName: "ashukuhu" });
    if (c) {
      console.log("\nCase Details for 'ashukuhu':");
      console.log(`ID: ${c._id}`);
      console.log(`Status: ${c.status}`);
      console.log(`Approval Status: ${c.approvalStatus}`);
      console.log(`Created By: ${c.createdBy}`);
      console.log(`Assigned To: ${c.assignedTo}`);
      console.log(`Timeline:`, JSON.stringify(c.timeline || [], null, 2));
    } else {
      console.log("Case not found.");
    }

    process.exit(0);
  } catch (err) {
    console.error("Error connecting or querying:", err);
    process.exit(1);
  }
}

check();
