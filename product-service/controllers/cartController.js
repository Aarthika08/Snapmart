exports.addToCart = async (req, res) => {
  try {
    const { productId, qty } = req.body;
    const product = await Product.findById(productId);

    if (!product) return res.status(404).json({ message: "Product not found" });

    // check stock
    if (qty > product.stock) {
      return res.status(400).json({ message: "Not enough stock available" });
    }

    // deduct stock
    product.stock -= qty;
    await product.save();

    res.json({ message: "Added to cart", productId, qty, unit: product.unit });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
