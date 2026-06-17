require("dotenv").config();
const mongoose = require("mongoose");
require("./model/auth/authModel");
const ICICI_BANK = require("./model/Banks/IciciBankModel");

async function check() {
  try {
    const uri = process.env.MONGO_URI;
    await mongoose.connect(uri);
    console.log("Connected.");

    const cases = await ICICI_BANK.find().sort({ createdAt: -1 }).limit(5);
    cases.forEach((c) => {
      console.log(`Case ID: ${c._id}`);
      console.log(`  customerName: ${c.customerName}`);
      console.log(`  applicantName: ${c.applicantName}`);
      console.log(`  personContact: ${c.personContact}`);
      console.log(`  createdAt: ${c.createdAt}`);
      console.log(`  updatedAt: ${c.updatedAt}`);
    });

    process.exit(0);
  } catch (err) {
    console.error("Error:", err);
    process.exit(1);
  }
}

check();
