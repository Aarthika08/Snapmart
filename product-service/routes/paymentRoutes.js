// routes/paymentRoutes.js
const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");

router.post("/create-order", paymentController.createPaymentOrder );
router.post("/verify-payment", paymentController.verifyPayment);
// router.get("/orders", paymentController.getOrders);
router.get("/orders/:userId", paymentController.getUserOrders);

module.exports = router;
