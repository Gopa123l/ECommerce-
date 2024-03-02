const { getConnection } = require('../database.js');

exports.getAllOrderItems = async (req, res) => {
  try {
    const page = req.query.page || 1; 
    const pageSize = req.query.pageSize || 10; 
    const offset = (page - 1) * pageSize; 
    const connection = await getConnection();
    const orderItems = await connection.query('SELECT * FROM "order_item" LIMIT $1 OFFSET $2', [pageSize, offset]);
    res.json(orderItems);
  } catch (error) {
    console.error('Error fetching order items:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getOrderItemById = async (req, res) => {
  try {
    const orderItemId = req.params.id;
    const connection = getConnection();
    const orderItem = await connection.query('SELECT * FROM "order_item" WHERE id = $1', [orderItemId]);
    if (orderItem.length === 0) {
      return res.status(404).json({ error: 'Order item not found' });
    }
    res.json(orderItem);
  } catch (error) {
    console.error('Error fetching order item:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getOrderItemByOrderId = async (req, res) => {
    try {
      const orderId = req.params.id;
      const connection = getConnection();
      const orderItem = await connection.query('SELECT * FROM "order_item" WHERE "orderId" = $1', [orderId]);
      if (orderItem.length === 0) {
        return res.status(404).json({ error: 'Order item not found' });
      }
      res.json(orderItem);
    } catch (error) {
      console.error('Error fetching order item:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  exports.getOrderItemByProductId = async (req, res) => {
    try {
      const productId = req.params.id;
      const connection = getConnection();
      const orderItem = await connection.query('SELECT * FROM "order_item" WHERE "productId" = $1', [productId]);
      if (orderItem.length === 0) {
        return res.status(404).json({ error: 'Order item not found' });
      }
      res.json(orderItem);
    } catch (error) {
      console.error('Error fetching order item:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

exports.createOrderItem = async (req, res) => {
  try {
    const { orderId, productId, quantity, price_per_unit, total_price } = req.body;
    const connection = getConnection();
    const result = await connection.query(
      'INSERT INTO "order_item" ("orderId", "productId", "quantity", "price_per_unit", "total_price") VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [orderId, productId, quantity, price_per_unit, total_price]
    );
    res.status(201).json(result);
  } catch (error) {
    console.error('Error creating order item:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.updateOrderItem = async (req, res) => {
  try {
    const orderItemId = req.params.id;
    const { orderId, productId, quantity, price_per_unit, total_price } = req.body;
    const connection = getConnection();
    const result = await connection.query(
      'UPDATE "OrderItem" SET "orderId" = $1, "productId" = $2, "quantity" = $3, "price_per_unit" = $4, "total_price" = $5 WHERE id = $6 RETURNING *',
      [orderId, productId, quantity, price_per_unit, total_price, orderItemId]
    );
    if (result[0].length === 0) {
      return res.status(404).json({ error: 'Order item not found' });
    }
    res.json(result);
  } catch (error) {
    console.error('Error updating order item:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.deleteOrderItem = async (req, res) => {
  try {
    const orderItemId = req.params.id;
    const connection = getConnection();
    const result = await connection.query('DELETE FROM "order_item" WHERE id = $1 RETURNING *', [orderItemId]);
    if (result[0].length === 0) {
      return res.status(404).json({ error: 'Order item not found' });
    }
    res.json({ message: 'Order item deleted successfully' });
  } catch (error) {
    console.error('Error deleting order item:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
