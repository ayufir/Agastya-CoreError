const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/banker';
console.log('Connecting to:', mongoURI);

mongoose.connect(mongoURI)
  .then(async () => {
    console.log('Connected to DB');
    const User = require("./model/auth/authModel");
    const modelMap = require("./controllers/modelMap");
    const bankRegistry = modelMap.bankRegistry;

    for (let i = 0; i < bankRegistry.length; i++) {
      const entry = bankRegistry[i];
      try {
        console.log(`Testing model: ${entry.key}`);
        const cases = await entry.model.find({}).populate("assignedTo").limit(1);
        console.log(`Model ${entry.key} query successful, found ${cases.length} cases.`);
      } catch (err) {
        console.error(`ERROR querying ${entry.key}:`, err.message);
      }
    }
    
    mongoose.disconnect();
    process.exit(0);
  })
  .catch(err => {
    console.error('DB Connection Failed:', err);
    process.exit(1);
  });
