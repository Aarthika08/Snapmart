const express = require('express');
const router = express.Router();
const { addToCart } = require('../controllers/cartController');

// router.post('/', addToCart);

// module.exports = router;


// routes/cartRoutes.js
import Cart from "../models/cart";


// ➕ Add to cart
router.post("/", async (req, res) => {
  try {
    const { userId = "guest", productId, qty } = req.body;

    let item = await Cart.findOne({ userId, productId });

    if (item) {
      item.qty += qty;
      await item.save();
    } else {
      item = await Cart.create({ userId, productId, qty });
    }

    res.json({
      message: "✅ Item added to cart",
      productId,
      qty: item.qty
    });
  } catch (err) {
    res.status(500).json({ message: "Error adding to cart" });
  }
});

// 📦 Get cart items
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const cartItems = await Cart.find({ userId }).populate("productId"); // get product details
    res.json(cartItems);
  } catch (err) {
    res.status(500).json({ message: "Error fetching cart items" });
  }
});

// ✏️ Update quantity
router.put("/:userId/:productId", async (req, res) => {
  try {
    const { userId, productId } = req.params;
    const { qty } = req.body;

    const item = await Cart.findOneAndUpdate(
      { userId, productId },
      { qty },
      { new: true }
    );

    if (!item) return res.status(404).json({ message: "Item not found" });

    res.json({ message: "✅ Cart updated", productId, qty: item.qty });
  } catch (err) {
    res.status(500).json({ message: "Error updating cart item" });
  }
});

// ❌ Remove item
router.delete("/:userId/:productId", async (req, res) => {
  try {
    const { userId, productId } = req.params;
    await Cart.findOneAndDelete({ userId, productId });
    res.json({ message: "🗑️ Item removed", productId });
  } catch (err) {
    res.status(500).json({ message: "Error deleting item" });
  }
});

export default router;
