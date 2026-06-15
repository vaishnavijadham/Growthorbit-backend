const mongoose = require("mongoose");
require("dotenv").config();

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const db = mongoose.connection.db;

    const result = await db.collection("skillverifications").updateMany(
      {},
      [
        {
          $set: {
            skill: {
              $toLower: {
                $replaceAll: {
                  input: "$skill",
                  find: " ",
                  replacement: ""
                }
              }
            }
          }
        }
      ]
    );

    console.log("✅ Updated records:", result.modifiedCount);
  } catch (err) {
    console.error("❌ Error:", err.message);
  } finally {
    await mongoose.disconnect();
  }
};

run();