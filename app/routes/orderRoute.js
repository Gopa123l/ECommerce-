const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

router.get('/', orderController.getAllOrders);
router.get('/orderId/:id', orderController.getOrderByOrderId);
router.get('/userId/:id', orderController.getOrderByUserId);
router.post('/create', orderController.createOrder);
router.put('/update/:id', orderController.updateOrder);
router.delete('/delete/:id', orderController.deleteOrder);

module.exports = router;
