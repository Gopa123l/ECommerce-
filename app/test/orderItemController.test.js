const request = require('supertest');
const app = require('../server.js'); 
const { getConnection } = require('../database');

const jest = require('jest');
const { describe, afterEach, it, expect } = jest;

jest.mock('../database', () => ({
  getConnection: jest.fn(() => ({
    query: jest.fn(),
  })),
}));

describe('Order Item API endpoints', () => {
  afterEach(() => {
    jest.clearAllMocks(); 
  });

  it('GET /api/orderItems should return all order items', async () => {    
    const mockOrderItems = [
      { id: 1, orderId: 1, productId: 1, quantity: 2, price_per_unit: 10, total_price: 20 },
    ];
    getConnection().query.mockResolvedValueOnce(mockOrderItems);

    const response = await request(app).get('/api/orderItems');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockOrderItems);
  });

  it('GET /api/orderItems/orderItem/:id should return the order item by ID', async () => {       
    const mockOrderItem = { id: 1, orderId: 1, productId: 1, quantity: 2, price_per_unit: 10, total_price: 20 };
    getConnection().query.mockResolvedValueOnce([mockOrderItem]);

    const response = await request(app).get('/api/orderItems/orderItem/1');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockOrderItem);
  });

  it('GET /api/orderItems/orderId/:id should return the order items by order ID', async () => {    
    const orderId = 1;
    const mockOrderItems = [
      { id: 1, orderId: orderId, productId: 1, quantity: 2, price_per_unit: 10, total_price: 20 },
      { id: 2, orderId: orderId, productId: 2, quantity: 1, price_per_unit: 15, total_price: 15 },
    ];
    getConnection().query.mockResolvedValueOnce(mockOrderItems);

    const response = await request(app).get(`/api/orderItems/orderId/${orderId}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockOrderItems);
  });

  it('GET /api/orderItems/productId/:id should return the order items by product ID', async () => {   
    const productId = 1;
    const mockOrderItems = [
      { id: 1, orderId: 1, productId: productId, quantity: 2, price_per_unit: 10, total_price: 20 },
      { id: 2, orderId: 2, productId: productId, quantity: 1, price_per_unit: 15, total_price: 15 },
    ];
    getConnection().query.mockResolvedValueOnce(mockOrderItems);

    const response = await request(app).get(`/api/orderItems/productId/${productId}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockOrderItems);
  });

  it('POST /api/orderItems/create should create a new order item', async () => {
    const newOrderItem = { orderId: 1, productId: 1, quantity: 2, price_per_unit: 10, total_price: 20 };    
    const mockResult = { id: 1, ...newOrderItem };
    getConnection().query.mockResolvedValueOnce([mockResult]);

    const response = await request(app).post('/api/orderItems/create').send(newOrderItem);

    expect(response.status).toBe(201);
    expect(response.body).toEqual([mockResult]);
  });

  it('PUT /api/orderItems/update/:id should update an existing order item', async () => {
    const updatedOrderItem = { orderId: 1, productId: 2, quantity: 3, price_per_unit: 12, total_price: 36 };    
    const mockResult = { id: 1, ...updatedOrderItem };
    getConnection().query.mockResolvedValueOnce([mockResult]);

    const response = await request(app).put('/api/orderItems/update/1').send(updatedOrderItem);

    expect(response.status).toBe(200);
    expect(response.body).toEqual([mockResult]);
  });

  it('DELETE /api/orderItems/delete/:id should delete an existing order item', async () => {
    const orderId = 1;    
    const mockResult = { message: 'Order item deleted successfully' };
    getConnection().query.mockResolvedValueOnce([mockResult]);

    const response = await request(app).delete(`/api/orderItems/delete/${orderId}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockResult);
  });

});
