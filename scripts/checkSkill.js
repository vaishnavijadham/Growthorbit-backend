const mongoose = require("mongoose");
require("dotenv").config();

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const db = mongoose.connection.db;

  const data = await db.collection("skillverifications").find({}).toArray();

  console.log("📦 Total records:", data.length);

  console.log("🔍 Sample record:", data[0]);

  process.exit();
};

run();