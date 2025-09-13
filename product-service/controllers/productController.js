const Product = require('../models/product');

// @desc Get all products
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// exports.addProduct =async (req,res) => {
//   try{
//     const { name, price, category, stock, imageUrl } =req.body;
//    if (!name || !price || !category) {
//       return res.status(400).json({ message: "Name, price, and category are required" });
//     }

//     const product =new Product ({ name, price, category, stock, imageUrl });
//     const savedProduct = await product.save();
  
//     res.status(201).json(savedProduct);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

  exports.getProductById = async (req,res) =>{
    try{
      const product = await Product.findById(req.params.id);
      if(!product){
         return res.status(400).json({ message: "Name, price, and category are required" });
      }
      res.json(product);
    }
    catch(err)
    {
       res.status(500).json({ message: err.message });
    }
  };




// @desc Add new product
exports.addProduct = async (req, res) => {
  try {
    // Multer gives text fields in req.body
    const { name, price, category, stock ,unit} = req.body;

    if (!name || !price || !category) {
      return res.status(400).json({ message: "Name, price, and category are required" });
    }

    // Multer gives uploaded file info in req.file
    const imageUrl = req.file ? req.file.path : null;

    const product = new Product({
      name,
      price,
      category,
      stock,
      unit,
      imageUrl
    });

    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// @desc Update product
exports.updateProduct = async (req, res) => {
  try {
    const { name, price, category, stock, unit } = req.body;

    const updatedFields = { name, price, category, stock ,unit};
    if (req.file) {
      updatedFields.imageUrl = req.file.path;
    }

    const product = await Product.findByIdAndUpdate(req.params.id, updatedFields, {
      new: true,
      runValidators: true
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};