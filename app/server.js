const express = require('express');
const bodyParser = require('body-parser');
const {connectToDatabase} = require('./database');
const userRoute = require('./routes/userRoute');
const orderRoute= require('./routes/orderRoute');
const productRoute= require('./routes/productRoute');
const restaurantRoute= require('./routes/restaurantRoute');
const orderItemRoute= require('./routes/orderItemRoute');

const app = express();
const PORT =  3000;

app.use(bodyParser.json());
app.use(express.json());

const startServer = async () => {
  try {
    await connectToDatabase();

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });

    app.use('/api/users', userRoute);
    app.use('/api/orders', orderRoute);
    app.use('/api/products', productRoute);
    app.use('./api/restaurants', restaurantRoute);
    app.use('./api/orderitems', orderItemRoute)

    app.get('/', async (req, res) => {
      console.log('SOMEONE HITTING BASE URL');
      res.send('Ecommerce service running Successfully');
    });
  } catch (error) {
    console.error('Unable to start the server:', error);
  }
};

startServer();
