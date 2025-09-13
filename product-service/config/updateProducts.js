const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Product = require("../models/product"); // adjust path if needed

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("✅ DB Connected");

    // Example: update based on category
    await Product.updateMany(
      { category: "Veggies" },
      { $set: { unit: "gram" } }
    );

    await Product.updateMany(
      { category: "Electronics" },
      { $set: { unit: "piece" } }
    );

    await Product.updateMany(
      { category: "Fashion" },
      { $set: { unit: "piece" } }
    );
    await Product.updateMany(
      { category: "Edibles" },
      { $set: { unit: "piece" } }
    );

    await Product.updateMany(
      { category: "edibles" },
      { $set: { unit: "piece" } }
    );
     await Product.updateMany(
      { category: "grains" },
      { $set: { unit: "gram" } }
    );
     await Product.updateMany(
      { category: "oil" },
      { $set: { unit: "gram" } }
    );

    await Product.updateMany(
      { category: "Beauty" },
      { $set: { unit: "piece" } }
    );

    console.log("🎉 Products updated successfully!");
    process.exit();
  })
  .catch(err => {
    console.error("❌ Error:", err);
    process.exit(1);
  });
