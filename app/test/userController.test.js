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

describe('User API endpoints', () => {
  afterEach(() => {
    jest.clearAllMocks(); 
  });

  it('GET /api/users should return all users', async () => {    
    const mockUsers = [
      { id: 1, username: 'user1', email: 'user1@example.com', password: 'password1' },
      { id: 2, username: 'user2', email: 'user2@example.com', password: 'password2' },
    ];
    getConnection().query.mockResolvedValueOnce(mockUsers);

    const response = await request(app).get('/api/users');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockUsers);
  });

  it('GET /api/users/:id should return the user by ID', async () => {    
    const userId = 1;
    const mockUser = { id: userId, username: 'user1', email: 'user1@example.com', password: 'password1' };
    getConnection().query.mockResolvedValueOnce([mockUser]);

    const response = await request(app).get(`/api/users/${userId}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockUser);
  });

  it('POST /api/users/create should create a new user', async () => {
    const newUser = { username: 'newuser', email: 'newuser@example.com', password: 'newpassword' };    
    const mockResult = { id: 3, ...newUser };
    getConnection().query.mockResolvedValueOnce([mockResult]);

    const response = await request(app).post('/api/users/create').send(newUser);

    expect(response.status).toBe(201);
    expect(response.body).toEqual([mockResult]);
  });

  it('PUT /api/users/:id should update an existing user', async () => {
    const updatedUser = { username: 'updateduser', email: 'updateduser@example.com', password: 'updatedpassword' };    
    const mockResult = { id: 1, ...updatedUser };
    getConnection().query.mockResolvedValueOnce([mockResult]);

    const response = await request(app).put('/api/users/1').send(updatedUser);

    expect(response.status).toBe(200);
    expect(response.body).toEqual([mockResult]);
  });

  it('DELETE /api/users/:id should delete an existing user', async () => {
    const userId = 1;    
    const mockResult = { message: 'User deleted successfully' };
    getConnection().query.mockResolvedValueOnce([mockResult]);

    const response = await request(app).delete(`/api/users/${userId}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockResult);
  });
});
