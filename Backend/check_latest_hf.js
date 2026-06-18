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
      console.log(`customerNo: ${c.customerNo}`);
      console.log(`Address Legal: ${c.addressLegal}`);
      console.log(`Address Site: ${c.addressSite}`);
      console.log(`Ref No (LAI): ${c.refNo}`);
      console.log(`Directions (North):`, JSON.stringify(c.directions?.North));
      console.log(`Directions (South):`, JSON.stringify(c.directions?.South));
      console.log(`Directions (East):`, JSON.stringify(c.directions?.East));
      console.log(`Directions (West):`, JSON.stringify(c.directions?.West));
      console.log(`Land Area: ${c.landArea}`);
      console.log(`Plot Area: ${c.plotArea}`);
    });

    process.exit(0);
  } catch (err) {
    console.error("Error connecting or querying:", err);
    process.exit(1);
  }
}

run();
