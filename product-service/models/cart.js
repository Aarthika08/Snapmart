// import express from "express";
// // import Cart from "../models/Cart.js"; // assuming you have a Cart model

// const router = express.Router();

// // ➕ Add to cart
// router.post("/", async (req, res) => {
//   try {
//     const { productId, qty } = req.body;
//     // your logic for adding item
//     res.json({
//       message: "✅ Item added to cart",
//       productId,
//       qty,
//       remainingStock: 199,
//       unit: "gram"
//     });
//   } catch (err) {
//     res.status(500).json({ message: "Error adding to cart" });
//   }
// });

// // 📦 Get all cart items
// router.get("/", async (req, res) => {
//   try {
//     const cartItems = await Cart.find();
//     res.json(cartItems);
//   } catch (err) {
//     res.status(500).json({ message: "Error fetching cart items" });
//   }
// });

// // ✏️ Update cart item quantity
// router.put("/:productId", async (req, res) => {
//   try {
//     const { productId } = req.params;
//     const { qty } = req.body;

//     // Example update logic
//     const item = await Cart.findOneAndUpdate(
//       { productId },
//       { qty },
//       { new: true }
//     );

//     if (!item) return res.status(404).json({ message: "Item not found in cart" });

//     res.json({
//       message: "✅ Cart updated",
//       productId,
//       qty: item.qty
//     });
//   } catch (err) {
//     res.status(500).json({ message: "Error updating cart item" });
//   }
// });

// // ❌ Remove item from cart
// router.delete("/:productId", async (req, res) => {
//   try {
//     const { productId } = req.params;

//     const deleted = await Cart.findOneAndDelete({ productId });
//     if (!deleted) return res.status(404).json({ message: "Item not found" });

//     res.json({ message: "🗑️ Item removed from cart", productId });
//   } catch (err) {
//     res.status(500).json({ message: "Error removing cart item" });
//   }
// });

// export default router;


// models/Cart.js
import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // normally comes from login/session
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  qty: { type: Number, required: true, default: 1 },
  imageUrl:{ type: String, required: true }
});

export default mongoose.model("Cart", cartSchema);
