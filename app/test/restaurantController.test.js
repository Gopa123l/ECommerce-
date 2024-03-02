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

describe('Restaurant API endpoints', () => {
  afterEach(() => {
    jest.clearAllMocks(); 
  });

  it('GET /api/restaurants should return all restaurants', async () => {    
    const mockRestaurants = [
      { id: 1, name: 'Restaurant 1', address: 'Address 1', contact_number: '1234567890' },
      { id: 2, name: 'Restaurant 2', address: 'Address 2', contact_number: '9876543210' },
    ];
    getConnection().query.mockResolvedValueOnce(mockRestaurants);

    const response = await request(app).get('/api/restaurants');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockRestaurants);
  });

  it('GET /api/restaurants/:id should return the restaurant by ID', async () => {    
    const restaurantId = 1;
    const mockRestaurant = { id: restaurantId, name: 'Restaurant 1', address: 'Address 1', contact_number: '1234567890' };
    getConnection().query.mockResolvedValueOnce([mockRestaurant]);

    const response = await request(app).get(`/api/restaurants/${restaurantId}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockRestaurant);
  });

  it('POST /api/restaurants/create should create a new restaurant', async () => {
    const newRestaurant = { name: 'New Restaurant', address: 'New Address', contact_number: '9876543210' };   
    const mockResult = { id: 3, ...newRestaurant };
    getConnection().query.mockResolvedValueOnce([mockResult]);

    const response = await request(app).post('/api/restaurants/create').send(newRestaurant);

    expect(response.status).toBe(201);
    expect(response.body).toEqual([mockResult]);
  });

  it('PUT /api/restaurants/update/:id should update an existing restaurant', async () => {
    const updatedRestaurant = { name: 'Updated Restaurant', address: 'Updated Address', contact_number: '1234567890' };   
    const mockResult = { id: 1, ...updatedRestaurant };
    getConnection().query.mockResolvedValueOnce([mockResult]);

    const response = await request(app).put('/api/restaurants/update/1').send(updatedRestaurant);

    expect(response.status).toBe(200);
    expect(response.body).toEqual([mockResult]);
  });

  it('DELETE /api/restaurants/delete/:id should delete an existing restaurant', async () => {
    const restaurantId = 1;    
    const mockResult = { message: 'Restaurant deleted successfully' };
    getConnection().query.mockResolvedValueOnce([mockResult]);

    const response = await request(app).delete(`/api/restaurants/delete/${restaurantId}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockResult);
  });
});
