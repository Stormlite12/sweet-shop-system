import request from 'supertest';
import app from '../src/app.js';
import mongoose from 'mongoose';
import User from '../src/models/User.js';
import Sweet from '../src/models/Sweet.js';

describe('Sweet Model Validation', () => {
  let adminToken;

  beforeEach(async () => {
    await User.deleteMany();
    await Sweet.deleteMany();
    
    const adminResponse = await request(app)
      .post('/api/auth/register')
      .send({ email: 'admin@test.com', password: 'password123' });
    adminToken = adminResponse.body.token;
  });

  it('should create sweet with required fields: name, category, price, quantity', async () => {
    const sweetData = {
      name: 'Chocolate Cake',
      category: 'cakes', 
      price: 25.99,
      quantity: 10
    };

    const response = await request(app)
      .post('/api/sweets')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(sweetData);

    expect(response.statusCode).toBe(201);
    expect(response.body.sweet).toHaveProperty('id');
    expect(response.body.sweet.name).toBe('Chocolate Cake');
  });

  it('should reject sweet without required fields', async () => {
    const response = await request(app)
      .post('/api/sweets')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Incomplete' });

    expect(response.statusCode).toBe(400);
  });
});