const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.get('/', productController.getAllProducts);
router.get('/productId/:id', productController.getProductById);
router.get('/restaurantId/:id', productController.getProductByRestaurantId);
router.post('/create', productController.createProduct);
router.put('/update/:id', productController.updateProduct);
router.delete('/delete/:id', productController.deleteProduct);

module.exports = router;
