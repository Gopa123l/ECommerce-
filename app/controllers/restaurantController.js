const { getConnection } = require('../database.js');

exports.getAllRestaurants = async (req, res) => {
  try {
    const page = req.query.page || 1; 
    const pageSize = req.query.pageSize || 10; 
    const offset = (page - 1) * pageSize; 
    const connection = await getConnection();
    const restaurants = await connection.query('SELECT * FROM "restaurant" LIMIT $1 OFFSET $2', [pageSize, offset]);
    res.json(restaurants);
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getRestaurantById = async (req, res) => {
  try {
    const restaurantId = req.params.id;
    const connection = getConnection();
    const restaurant = await connection.query('SELECT * FROM "restaurant" WHERE id = $1', [restaurantId]);
    if (restaurant.length === 0) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }
    res.json(restaurant);
  } catch (error) {
    console.error('Error fetching restaurant:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.createRestaurant = async (req, res) => {
  try {
    const { name, address, contact_number } = req.body;
    const connection = getConnection();
    const result = await connection.query(
      'INSERT INTO "restaurant" ("name", "address", "contact_number") VALUES ($1, $2, $3) RETURNING *',
      [name, address, contact_number]
    );
    res.status(201).json(result);
  } catch (error) {
    console.error('Error creating restaurant:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.updateRestaurant = async (req, res) => {
  try {
    const restaurantId = req.params.id;
    const { name, address, contact_number } = req.body;
    const connection = getConnection();
    const result = await connection.query(
      'UPDATE "restaurant" SET "name" = $1, "address" = $2, "contact_number" = $3 WHERE id = $4 RETURNING *',
      [name, address, contact_number, restaurantId]
    );
    if (result[0].length === 0) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }
    res.json(result);
  } catch (error) {
    console.error('Error updating restaurant:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.deleteRestaurant = async (req, res) => {
  try {
    const restaurantId = req.params.id;
    const connection = getConnection();
    const result = await connection.query('DELETE FROM "restaurant" WHERE id = $1 RETURNING *', [restaurantId]);
    if (result[0].length === 0) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }
    res.json({ message: 'Restaurant deleted successfully' });
  } catch (error) {
    console.error('Error deleting restaurant:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
