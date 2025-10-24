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
// const cartRoutes = require('./routes/cartRoutes');
const paymentRoutes = require("./routes/paymentRoutes");

const bodyParser = require("body-parser");


const app = express();
app.use(express.json());
// Middlewares
app.use(cors());
app.use(bodyParser.json());

// ❌ DO NOT use express.json() before multer for form-data routes
// (but it's fine to keep for JSON-only routes)
// app.use(express.json());

// Routes
app.use('/products', productRoutes);
// app.use('/cart',cartRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('✅ MongoDB Connected');
})
.catch(err => console.error('❌ MongoDB Connection Failed:', err));




// / Product Schema
const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  category: String,
  stock: Number,
  unit: String,
  imageUrl:String
});
// const Product = mongoose.model('Product', productSchema);
const Product = mongoose.models.Product || mongoose.model('Product', productSchema);


// Cart Schema
const cartSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  qty: Number
});
// const Cart = mongoose.model('Cart', cartSchema);
const Cart = mongoose.models.Cart || mongoose.model('Cart', cartSchema);


// -----------------------
// Basic CRUD for Cart
// -----------------------

// GET all cart items
app.get('/cart', async (req, res) => {
  const cartItems = await Cart.find().populate('productId');
  const result = cartItems.map(ci => ({
    productId: ci.productId._id,
    name: ci.productId.name,
    price: ci.productId.price,
    remainingStock: ci.productId.stock,
    unit: ci.productId.unit,
    qty: ci.qty,
    imageUrl:ci.productId.imageUrl
  }));
  res.json(result);
});

// POST add to cart (if exists, increment qty)
app.post('/cart', async (req, res) => {
  const { productId, qty } = req.body;

  const product = await Product.findById(productId);
  if (!product) return res.status(404).json({ message: 'Product not found' });

  let cartItem = await Cart.findOne({ productId });
  if (cartItem) {
    cartItem.qty += qty;
  } else {
    cartItem = new Cart({ productId, qty });
  }
  await cartItem.save();

  res.json({ message: `✅ Item added to cart`, productId, qty: cartItem.qty, remainingStock: product.stock, unit: product.unit });
});

// PUT update quantity
app.put('/cart/:productId', async (req, res) => {
  const { productId } = req.params;
  const { qty } = req.body;

  const product = await Product.findById(productId);
  if (!product) return res.status(404).json({ message: 'Product not found' });

  const cartItem = await Cart.findOne({ productId });
  if (!cartItem) return res.status(404).json({ message: 'Cart item not found' });

  cartItem.qty = qty;
  await cartItem.save();

  res.json({ message: '✅ Quantity updated', productId, qty: cartItem.qty, remainingStock: product.stock, unit: product.unit });
});

// DELETE cart item
app.delete('/cart/:productId', async (req, res) => {
  const { productId } = req.params;

  await Cart.deleteOne({ productId });
  res.json({ message: '✅ Item removed from cart' });
});




// Import payment routes

// const paymentRoutes = require("./routes/payment.routes");
app.use("/api/payment", paymentRoutes);
// -----------------------
console.log("payment order asucessful ");
app.listen(5000, () => console.log('Server payment running on http://localhost:5000'));
