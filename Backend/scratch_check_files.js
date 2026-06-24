require("dotenv").config();
const mongoose = require("mongoose");
const HomeFirst = require("./model/Banks/homeFirstModel");

async function run() {
  try {
    const uri = process.env.MONGO_URI;
    console.log("Connecting to MongoDB:", uri);
    await mongoose.connect(uri);
    console.log("Connected.");

    const cases = await HomeFirst.find({}).sort({ createdAt: -1 }).limit(3);
    console.log(`\nFound ${cases.length} latest HomeFirst cases:`);
    cases.forEach((c) => {
      console.log("-----------------------------------------");
      console.log(`ID: ${c._id}`);
      console.log(`Customer Name: ${c.customerName}`);
      console.log(`atsDocuments:`, JSON.stringify(c.atsDocuments));
      console.log(`AttachDocuments:`, JSON.stringify(c.AttachDocuments));
      console.log(`imageUrls:`, JSON.stringify(c.imageUrls));
    });

    process.exit(0);
  } catch (err) {
    console.error("Error connecting or querying:", err);
    process.exit(1);
  }
}

run();
