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

describe('Order API endpoints', () => {
  afterEach(() => {
    jest.clearAllMocks(); 
  });

  it('GET /api/orders should return all orders', async () => {    
    const mockOrders = [{ id: 1, userId: 1, total_amount: 100, order_status: 'pending' }];
    getConnection().query.mockResolvedValueOnce(mockOrders);

    const response = await request(app).get('/api/orders');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockOrders);
  });

  it('GET /api/orders/orderId/:id should return order by ID', async () => {
    const orderId = 1;
    const mockOrder = { id: orderId, userId: 1, total_amount: 100, order_status: 'pending' };
    getConnection().query.mockResolvedValueOnce([mockOrder]);

    const response = await request(app).get(`/api/orders/orderId/${orderId}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockOrder);
  });

  it('GET /api/orders/userId/:id should return orders by user ID', async () => {
    const userId = 1;
    const mockOrders = [
      { id: 1, userId, total_amount: 100, order_status: 'pending' },
      { id: 2, userId, total_amount: 150, order_status: 'completed' },
    ];
    getConnection().query.mockResolvedValueOnce(mockOrders);

    const response = await request(app).get(`/api/orders/userId/${userId}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockOrders);
  });

  it('POST /api/orders/create should create a new order', async () => {
    const newOrder = { userId: 1, total_amount: 100, order_status: 'pending' };
    const createdOrder = { id: 1, ...newOrder };
    getConnection().query.mockResolvedValueOnce([createdOrder]);

    const response = await request(app).post('/api/orders/create').send(newOrder);

    expect(response.status).toBe(201);
    expect(response.body).toEqual([createdOrder]);
  });

  it('PUT /api/orders/update/:id should update an existing order', async () => {
    const orderId = 1;
    const updatedOrder = { id: orderId, userId: 1, total_amount: 150, order_status: 'completed' };
    getConnection().query.mockResolvedValueOnce([updatedOrder]);

    const response = await request(app).put(`/api/orders/update/${orderId}`).send(updatedOrder);

    expect(response.status).toBe(200);
    expect(response.body).toEqual([updatedOrder]);
  });

  it('DELETE /api/orders/delete/:id should delete an order by ID', async () => {
    const orderId = 1;
    const deletedOrderMessage = { message: 'Order deleted successfully' };
    getConnection().query.mockResolvedValueOnce([{ id: orderId }]);

    const response = await request(app).delete(`/api/orders/delete/${orderId}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(deletedOrderMessage);
  });
});
