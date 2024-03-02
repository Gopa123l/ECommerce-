const { createConnection } = require('typeorm');
const UserSchema = require('./entities/User.js');
const OrderSchema = require('./entities/Order.js');
const ProductSchema = require('./entities/Product.js');
const RestaurantSchema = require('./entities/Restaurant.js');
const OrderItemSchema = require('./entities/OrderItem.js');

let connection;

const connectToDatabase = async () => {
  try {
    if (!connection) {
      connection = await createConnection({
        type: "postgres",
        host: "localhost",
        port: "5432",
        username: "postgres",
        password: "TRSABCGG",
        database: "test",
        entities: [UserSchema, OrderSchema, ProductSchema, RestaurantSchema, OrderItemSchema],
        synchronize: true,
        logging: true
      });
      console.log('Connected to the database');
    }
    return connection;
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    throw error;
  }
};

const getConnection = () => {
  if (!connection) {
    throw new Error('Database connection has not been established yet');
  }
  return connection;
};

module.exports =  {connectToDatabase, getConnection};
