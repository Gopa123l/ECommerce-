const {getConnection}= require('../database')

exports.getAllOrders = async (req, res) => {
  try {
    const page = req.query.page || 1; 
    const pageSize = req.query.pageSize || 10; 
    const offset = (page - 1) * pageSize; 
    const connection = await getConnection();
    const orders = await connection.query('SELECT * FROM "order" LIMIT $1 OFFSET $2', [pageSize, offset]);
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getOrderByOrderId = async (req, res) => {
  try {
    const orderId = req.params.id;
    const connection= await getConnection();
    const order = await connection.query('SELECT * FROM "order" WHERE "id" = $1', [orderId]);    
    if (order.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getOrderByUserId = async (req, res) => {
  try {
    const userId = req.params.id;
    const connection= await getConnection();
    const order = await connection.query('SELECT * FROM "order" WHERE "userId" = $1', [userId]);    
    if (order.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.createOrder = async (req, res) => {
  try {
    const { userId, total_amount, order_status } = req.body;
    const connection= await getConnection();
    const result = await connection.query(
      'INSERT INTO "order" ("userId", "total_amount", "order_status") VALUES ($1, $2, $3) RETURNING *',
      [userId, total_amount, order_status]
    );
    res.status(201).json(result);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.updateOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const { userId, total_amount, order_status } = req.body;
    const connection= await getConnection();
    const result = await connection.query(
      'UPDATE "order" SET "userId" = $1, "total_amount" = $2, "order_status" = $3 WHERE id = $4 RETURNING *',
      [userId, total_amount, order_status, orderId]
    );
    if (result[0].length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(result);
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const connection= await getConnection();
    const result = await connection.query('DELETE FROM "order" WHERE id = $1 RETURNING *', [orderId]);
    console.log(result[0].length)
    if (result[0].length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
