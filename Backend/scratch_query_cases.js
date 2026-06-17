require("dotenv").config();
const mongoose = require("mongoose");
const HomeFirst = require("./model/Banks/homeFirstModel");

async function check() {
  try {
    const uri = process.env.MONGO_URI;
    console.log("Connecting to MongoDB:", uri);
    await mongoose.connect(uri);
    console.log("Connected.");

    const latestCase = await HomeFirst.findOne({ customerName: "ashukuhu" });
    console.log("Full case details for 'ashukuhu':");
    console.log(JSON.stringify(latestCase, null, 2));

    process.exit(0);
  } catch (err) {
    console.error("Error connecting or querying:", err);
    process.exit(1);
  }
}

check();
