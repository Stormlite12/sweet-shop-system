import request from 'supertest';
import app from '../src/app.js';
import mongoose from 'mongoose';
import User from '../src/models/User.js';
import Sweet from '../src/models/Sweet.js';
import dotenv from 'dotenv';

dotenv.config();

describe('Sweet Inventory Management', () => {
  let adminToken, customerToken;
  let testSweet;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_TEST_URI);
  });

  beforeEach(async () => {
    await User.deleteMany();
    await Sweet.deleteMany();

    // Create admin user (first user)
    const adminResponse = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'admin@test.com',
        password: 'password123'
      });
    adminToken = adminResponse.body.token;

    // Create customer user (second user)
    const customerResponse = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'customer@test.com',
        password: 'password123'
      });
    customerToken = customerResponse.body.token;

    // Create test sweet with initial stock
    testSweet = await new Sweet({
      name: 'Test Sweet',
      category: 'test',
      price: 5.99,
      quantity: 10
    }).save();
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('POST /api/sweets/:id/purchase - Purchase sweet', () => {
    it('should allow customer to purchase sweet and decrease quantity', async () => {
      const purchaseData = { quantity: 3 };

      const response = await request(app)
        .post(`/api/sweets/${testSweet._id}/purchase`)
        .set('Authorization', `Bearer ${customerToken}`)
        .send(purchaseData);

      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe('Purchase successful');
      expect(response.body.sweet.quantity).toBe(7); // 10 - 3 = 7
      expect(response.body.purchaseDetails.quantity).toBe(3);
      expect(response.body.purchaseDetails.totalPrice).toBe(17.97); // 3 × 5.99
    });

    it('should allow admin to purchase sweet', async () => {
      const purchaseData = { quantity: 2 };

      const response = await request(app)
        .post(`/api/sweets/${testSweet._id}/purchase`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(purchaseData);

      expect(response.statusCode).toBe(200);
      expect(response.body.sweet.quantity).toBe(8); // 10 - 2 = 8
    });

    it('should reject purchase when insufficient stock', async () => {
      const purchaseData = { quantity: 15 }; // More than available (10)

      const response = await request(app)
        .post(`/api/sweets/${testSweet._id}/purchase`)
        .set('Authorization', `Bearer ${customerToken}`)
        .send(purchaseData);

      expect(response.statusCode).toBe(400);
      expect(response.body.message).toBe('Insufficient stock');
      expect(response.body.available).toBe(10);
      expect(response.body.requested).toBe(15);
    });

    it('should reject purchase of zero or negative quantity', async () => {
      const purchaseData = { quantity: 0 };

      const response = await request(app)
        .post(`/api/sweets/${testSweet._id}/purchase`)
        .set('Authorization', `Bearer ${customerToken}`)
        .send(purchaseData);

      expect(response.statusCode).toBe(400);
      expect(response.body.message).toBe('Purchase quantity must be positive');
    });

    it('should reject purchase without quantity', async () => {
      const response = await request(app)
        .post(`/api/sweets/${testSweet._id}/purchase`)
        .set('Authorization', `Bearer ${customerToken}`)
        .send({});

      expect(response.statusCode).toBe(400);
      expect(response.body.message).toBe('Purchase quantity is required');
    });

    it('should require authentication', async () => {
      const response = await request(app)
        .post(`/api/sweets/${testSweet._id}/purchase`)
        .send({ quantity: 1 });

      expect(response.statusCode).toBe(401);
      expect(response.body.message).toBe('Access token required');
    });

    it('should return 404 for non-existent sweet', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .post(`/api/sweets/${fakeId}/purchase`)
        .set('Authorization', `Bearer ${customerToken}`)
        .send({ quantity: 1 });

      expect(response.statusCode).toBe(404);
      expect(response.body.message).toBe('Sweet not found');
    });
  });

  describe('POST /api/sweets/:id/restock - Restock sweet (Admin only)', () => {
    it('should allow admin to restock sweet', async () => {
      const restockData = { quantity: 5 };

      const response = await request(app)
        .post(`/api/sweets/${testSweet._id}/restock`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(restockData);

      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe('Restock successful');
      expect(response.body.sweet.quantity).toBe(15); // 10 + 5 = 15
      expect(response.body.restockDetails.quantity).toBe(5);
      expect(response.body.restockDetails.previousQuantity).toBe(10);
      expect(response.body.restockDetails.newQuantity).toBe(15);
    });

    it('should reject customer restocking sweet', async () => {
      const restockData = { quantity: 5 };

      const response = await request(app)
        .post(`/api/sweets/${testSweet._id}/restock`)
        .set('Authorization', `Bearer ${customerToken}`)
        .send(restockData);

      expect(response.statusCode).toBe(403);
      expect(response.body.message).toBe('Admin access required');
    });

    it('should reject restock of zero or negative quantity', async () => {
      const restockData = { quantity: -3 };

      const response = await request(app)
        .post(`/api/sweets/${testSweet._id}/restock`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(restockData);

      expect(response.statusCode).toBe(400);
      expect(response.body.message).toBe('Restock quantity must be positive');
    });

    it('should require authentication', async () => {
      const response = await request(app)
        .post(`/api/sweets/${testSweet._id}/restock`)
        .send({ quantity: 5 });

      expect(response.statusCode).toBe(401);
    });

    it('should return 404 for non-existent sweet', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .post(`/api/sweets/${fakeId}/restock`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ quantity: 5 });

      expect(response.statusCode).toBe(404);
      expect(response.body.message).toBe('Sweet not found');
    });
  });
});