const express = require('express');
const router = express.Router();
const orderItemController = require('../controllers/orderItemController');

router.get('/', orderItemController.getAllOrderItems);
router.get('/orderItem/:id', orderItemController.getOrderItemById);
router.get('/orderId/:id', orderItemController.getOrderItemByOrderId);
router.get('/productId/:id', orderItemController.getOrderItemByProductId);
router.post('/create', orderItemController.createOrderItem);
router.put('/update/:id', orderItemController.updateOrderItem);
router.delete('/delete/:id', orderItemController.deleteOrderItem);

module.exports = router;
