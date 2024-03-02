const { getConnection } = require('../database.js');

exports.getAllProducts = async (req, res) => {
  try {
    const page = req.query.page || 1; 
    const pageSize = req.query.pageSize || 10; 
    const offset = (page - 1) * pageSize; 
    const connection = await getConnection();
    const products = await connection.query('SELECT * FROM "product" LIMIT $1 OFFSET $2', [pageSize, offset]);
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const productId = req.params.id;
    const connection = getConnection();
    const product = await connection.query('SELECT * FROM "product" WHERE id = $1', [productId]);
    if (product.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getProductByRestaurantId = async (req, res) => {
    try {
      const restaurantId = req.params.id;
      const connection = getConnection();
      const product = await connection.query('SELECT * FROM "product" WHERE "restaurant_id = $1', [restaurantId]);
      if (product.length === 0) {
        return res.status(404).json({ error: 'Product not found' });
      }
      res.json(product);
    } catch (error) {
      console.error('Error fetching product:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

exports.createProduct = async (req, res) => {
  try {
    const { name, price, description, restaurant_id } = req.body;
    const connection = getConnection();
    const result = await connection.query(
      'INSERT INTO "product" ("name", "price", "description", "restaurant_id") VALUES ($1, $2, $3, $4) RETURNING *',
      [name, price, description, restaurant_id]
    );
    res.status(201).json(result);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const { name, price, description, restaurant_id } = req.body;
    const connection = getConnection();
    const result = await connection.query(
      'UPDATE "product" SET "name" = $1, "price" = $2, "description" = $3, "restaurant_id" = $4 WHERE id = $5 RETURNING *',
      [name, price, description, restaurant_id, productId]
    );
    if (result[0].length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const connection = getConnection();
    const result = await connection.query('DELETE FROM "product" WHERE id = $1 RETURNING *', [productId]);
    if (result[0].length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
