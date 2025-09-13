const express = require('express');
const router = express.Router();
const { getProducts, addProduct  ,
  getProductById, 
  updateProduct, 
  deleteProduct  } = require('../controllers/productController');
const { upload } = require('../config/cloudinary');

router.get('/', getProducts);
// router.post('/',addProduct);
router.post('/', upload.single('image'), addProduct);


// GET product by ID
router.get('/:id', getProductById);

// PUT update product
router.put('/:id', updateProduct);

// DELETE product
router.delete('/:id', deleteProduct);



module.exports = router;
