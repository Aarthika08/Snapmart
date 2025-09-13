require('dotenv').config();
// console.log("Cloudinary ENV Check:", {
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET ? "✅ exists" : "❌ missing"
// });

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const app = express();

// Middlewares
app.use(cors());

// ❌ DO NOT use express.json() before multer for form-data routes
// (but it's fine to keep for JSON-only routes)
app.use(express.json());

// Routes
app.use('/products', productRoutes);
app.use('/cart',cartRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('✅ MongoDB Connected');
  app.listen(5000, () => console.log('🚀 Server running on port 5000'));
})
.catch(err => console.error('❌ MongoDB Connection Failed:', err));
