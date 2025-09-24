import request from 'supertest';
import app from '../src/app.js';
import mongoose from 'mongoose';
import User from '../src/models/User.js';
import Sweet from '../src/models/Sweet.js';
import dotenv from 'dotenv';

dotenv.config();

describe('Sweet CRUD Operations', () => {
  let userToken;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_TEST_URI);
  });

  beforeEach(async () => {
    await User.deleteMany();
    await Sweet.deleteMany();

    // Create a user to get auth token
    const userResponse = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'user@test.com',
        password: 'password123'
      });
    userToken = userResponse.body.token;
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('GET /api/sweets - List all sweets', () => {
    it('should return empty array when no sweets exist', async () => {
      const response = await request(app)
        .get('/api/sweets')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.sweets).toEqual([]);
    });

    it('should return all sweets when they exist', async () => {
      // Create test sweets
      const sweet1 = await new Sweet({
        name: 'Chocolate Cake',
        category: 'cakes',
        price: 25.99,
        quantity: 5
      }).save();

      const sweet2 = await new Sweet({
        name: 'Vanilla Cupcake',
        category: 'cupcakes', 
        price: 3.99,
        quantity: 12
      }).save();

      const response = await request(app)
        .get('/api/sweets')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.sweets).toHaveLength(2);
      expect(response.body.sweets[0].name).toBe('Chocolate Cake');
      expect(response.body.sweets[1].name).toBe('Vanilla Cupcake');
    });

    it('should require authentication', async () => {
      const response = await request(app).get('/api/sweets');

      expect(response.statusCode).toBe(401);
      expect(response.body.message).toBe('Access token required');
    });
  });

  describe('GET /api/sweets/:id - Get single sweet', () => {
    let testSweet;

    beforeEach(async () => {
      testSweet = await new Sweet({
        name: 'Strawberry Tart',
        category: 'tarts',
        price: 12.50,
        quantity: 8
      }).save();
    });

    it('should return sweet by valid ID', async () => {
      const response = await request(app)
        .get(`/api/sweets/${testSweet._id}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.sweet.name).toBe('Strawberry Tart');
      expect(response.body.sweet.price).toBe(12.50);
      expect(response.body.sweet.quantity).toBe(8);
    });

    it('should return 404 for non-existent sweet', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .get(`/api/sweets/${fakeId}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.statusCode).toBe(404);
      expect(response.body.message).toBe('Sweet not found');
    });

    it('should return 400 for invalid ID format', async () => {
      const response = await request(app)
        .get('/api/sweets/invalid-id')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.statusCode).toBe(400);
      expect(response.body.message).toBe('Invalid sweet ID');
    });

    it('should require authentication', async () => {
      const response = await request(app)
        .get(`/api/sweets/${testSweet._id}`);

      expect(response.statusCode).toBe(401);
    });
  });
});