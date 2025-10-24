// controllers/paymentController.js
const Razorpay = require("razorpay");
const Order = require("../models/Order");
const Product = require("../models/product");
// Initialize Razorpay (sandbox keys)
const razorpay = new Razorpay({
  key_id: "rzp_test_RQEOTeLlGJwqQB",
  key_secret: "ig0lZo0T9dNN262E7w5eT4kA"
});

// ✅ Step 1: Create Razorpay Order
exports.createPaymentOrder = async (req, res) => {
  try {
    const { userId, cartItems } = req.body;

    if (!cartItems || cartItems.length === 0)
      return res.status(400).json({ message: "Cart is empty" });

    // Calculate total
    let total = 0;
    for (let item of cartItems) {
      const product = await Product.findById(item.productId);
      if (!product) return res.status(404).json({ message: "Product not found" });
      if (item.qty > product.stock)
        return res.status(400).json({ message: `Not enough stock for ${product.name}` });
  item.name = product.name;   // overwrite just in case
  item.price = product.price;
      total += product.price * item.qty;
    }

    // Create order in Razorpay
    const razorpayOrder = await razorpay.orders.create({
      amount: total * 100, // convert to paise
      currency: "INR",
      receipt: "receipt_" + Math.floor(Math.random() * 10000)
    });

    // Save order to DB
    const newOrder = new Order({
      userId,
      items: cartItems.map(i => ({
        productId: i.productId,
        name: i.name,
        qty: i.qty,
        price: i.price
      })),
      totalAmount: total,
      razorpayOrderId: razorpayOrder.id,
      status: "CREATED"
    });

    await newOrder.save();

    res.json({
      message: "Razorpay order created successfully",
      razorpayOrder,
      order: newOrder
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// ✅ Verify payment success (frontend calls this after checkout)
exports.verifyPayment = async (req, res) => {
  try {
    const { razorpayPaymentId, razorpayOrderId } = req.body;

    const order = await Order.findOne({razorpayOrderId });
    if (!order) return res.status(404).json({ error: "Order not found" });

    order.status = "PAID";
    order.razorpayPaymentId = razorpayPaymentId;
   await order.save();

    // Decrease stock after successful payment
    for (let item of order.items) {
      const product = await Product.findById(item.productId);
      if (product) {
        product.stock -= item.qty;
        await product.save();
      }
    }
    res.json({
      message: "Payment verified successfully",
      order
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// exports.getUserOrders = async (req, res) => {
//   try {
//     const { userId } = req.params;
//     const orders = await Order.find({ userId });
//     res.json(orders);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

exports.getUserOrders = async (req, res) => {
  const { userId } = req.params;
  const orders = await Order.find({ userId });
  res.json(orders);
};
