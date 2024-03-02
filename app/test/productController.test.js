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

describe('Product API endpoints', () => {
  afterEach(() => {
    jest.clearAllMocks(); 
  });

  it('GET /api/products should return all products', async () => {    
    const mockProducts = [
      { id: 1, name: 'Product 1', price: 10, description: 'Description 1', restaurant_id: 1 },
      { id: 2, name: 'Product 2', price: 20, description: 'Description 2', restaurant_id: 2 },
    ];
    getConnection().query.mockResolvedValueOnce(mockProducts);

    const response = await request(app).get('/api/products');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockProducts);
  });

  it('GET /api/products/productId/:id should return the product by ID', async () => {    
    const mockProduct = { id: 1, name: 'Product 1', price: 10, description: 'Description 1', restaurant_id: 1 };
    getConnection().query.mockResolvedValueOnce([mockProduct]);

    const response = await request(app).get('/api/products/productId/1');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockProduct);
  });

  it('GET /api/products/restaurantId/:id should return the products by restaurant ID', async () => {    
    const restaurantId = 1;
    const mockProducts = [
      { id: 1, name: 'Product 1', price: 10, description: 'Description 1', restaurant_id: restaurantId },
      { id: 2, name: 'Product 2', price: 20, description: 'Description 2', restaurant_id: restaurantId },
    ];
    getConnection().query.mockResolvedValueOnce(mockProducts);

    const response = await request(app).get(`/api/products/restaurantId/${restaurantId}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockProducts);
  });

  it('POST /api/products/create should create a new product', async () => {
    const newProduct = { name: 'New Product', price: 30, description: 'New Description', restaurant_id: 1 };    
    const mockResult = { id: 3, ...newProduct };
    getConnection().query.mockResolvedValueOnce([mockResult]);

    const response = await request(app).post('/api/products/create').send(newProduct);

    expect(response.status).toBe(201);
    expect(response.body).toEqual([mockResult]);
  });

  it('PUT /api/products/update/:id should update an existing product', async () => {
    const updatedProduct = { name: 'Updated Product', price: 40, description: 'Updated Description', restaurant_id: 1 };   
    const mockResult = { id: 1, ...updatedProduct };
    getConnection().query.mockResolvedValueOnce([mockResult]);

    const response = await request(app).put('/api/products/update/1').send(updatedProduct);

    expect(response.status).toBe(200);
    expect(response.body).toEqual([mockResult]);
  });

  it('DELETE /api/products/delete/:id should delete an existing product', async () => {
    const productId = 1;    
    const mockResult = { message: 'Product deleted successfully' };
    getConnection().query.mockResolvedValueOnce([mockResult]);

    const response = await request(app).delete(`/api/products/delete/${productId}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockResult);
  });
});
