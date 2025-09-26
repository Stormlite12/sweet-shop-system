import request from 'supertest';
import app from './testApp.js';
import mongoose from 'mongoose';
import User from '../src/models/User.js';
import Sweet from '../src/models/Sweet.js';
import dotenv from 'dotenv';

dotenv.config();

describe('Sweet CRUD Operations', () => {
  let adminToken, customerToken;

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
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('GET /api/sweets - List all sweets', () => {
    it('should return empty array when no sweets exist', async () => {
      const response = await request(app)
        .get('/api/sweets');

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual([]);
    });

    it('should return all sweets when they exist', async () => {
      // Create test sweets
      await new Sweet({
        name: 'Chocolate Cake',
        category: 'milk-based',
        price: 25.99,
        stock: 5
      }).save();

      await new Sweet({
        name: 'Vanilla Cupcake',
        category: 'snacks', 
        price: 3.99,
        stock: 12
      }).save();

      const response = await request(app)
        .get('/api/sweets');

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveLength(2);
    });


    it('should allow public browsing of sweets', async () => {
      const response = await request(app).get('/api/sweets');
      expect(response.statusCode).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('POST /api/sweets - Add new sweet (Admin only)', () => {
    it('should allow admin to create a new sweet', async () => {
      const sweetData = {
        name: 'Strawberry Tart',
        category: 'snacks',
        price: 12.50,
        stock: 8
      };

      const response = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(sweetData);

      expect(response.statusCode).toBe(201);
      expect(response.body.name).toBe('Strawberry Tart');
      expect(response.body.category).toBe('snacks');
      expect(response.body.price).toBe(12.50);
      expect(response.body.stock).toBe(8);
    });

    it('should reject customer creating sweet', async () => {
      const sweetData = {
        name: 'Customer Sweet',
        category: 'snacks',
        price: 4.99,
        stock: 5
      };

      const response = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${customerToken}`)
        .send(sweetData);

      expect(response.statusCode).toBe(403);
    });

    it('should require authentication', async () => {
      const response = await request(app)
        .post('/api/sweets')
        .send({
          name: 'Test Sweet',
          category: 'snacks',
          price: 1.99,
          stock: 1
        });

      expect(response.statusCode).toBe(401);
    });

    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Incomplete Sweet'
          // Missing category, price, stock
        });

      expect(response.statusCode).toBe(400);
    });
  });

  describe('GET /api/sweets/search - Search sweets', () => {
    beforeEach(async () => {
      // Create test data for search
      await new Sweet({
        name: 'Chocolate Cake',
        category: 'milk-based',
        price: 25.99,
        stock: 5
      }).save();

      await new Sweet({
        name: 'Vanilla Cupcake',
        category: 'snacks',
        price: 3.99,
        stock: 12
      }).save();

      await new Sweet({
        name: 'Chocolate Muffin',
        category: 'sugar-based',
        price: 4.50,
        stock: 8
      }).save();
    });

    it('should search sweets by name', async () => {
      const response = await request(app)
        .get('/api/sweets/search?name=chocolate');

      expect(response.statusCode).toBe(200);
      expect(response.body.sweets).toHaveLength(2);
      expect(response.body.sweets[0].name).toContain('Chocolate');
      expect(response.body.sweets[1].name).toContain('Chocolate');
    });

    it('should search sweets by category', async () => {
      const response = await request(app)
        .get('/api/sweets/search?category=snacks');

      expect(response.statusCode).toBe(200);
      expect(response.body.sweets).toHaveLength(1);
      expect(response.body.sweets[0].category).toBe('snacks');
    });

    it('should search sweets by price range', async () => {
      const response = await request(app)
        .get('/api/sweets/search?minPrice=3&maxPrice=5');

      expect(response.statusCode).toBe(200);
      expect(response.body.sweets).toHaveLength(2); // Vanilla Cupcake (3.99) and Chocolate Muffin (4.50)
    });

    it('should combine search criteria', async () => {
      const response = await request(app)
        .get('/api/sweets/search?name=chocolate&maxPrice=20');

      expect(response.statusCode).toBe(200);
      expect(response.body.sweets).toHaveLength(1); // Only Chocolate Muffin (4.50)
    });

    // Public route now; no auth required

    it('should allow public search of sweets', async () => {
      const response = await request(app).get('/api/sweets/search?name=chocolate');
      expect(response.statusCode).toBe(200);
      expect(Array.isArray(response.body.sweets)).toBe(true);
    });
  });

  describe('PUT /api/sweets/:id - Update sweet (Admin only)', () => {
    let testSweet;

    beforeEach(async () => {
      testSweet = await new Sweet({
        name: 'Original Sweet',
        category: 'snacks',
        price: 10.99,
        stock: 10
      }).save();
    });

    it('should allow admin to update sweet', async () => {
      const updateData = {
        name: 'Updated Sweet',
        price: 15.99,
        stock: 15
      };

      const response = await request(app)
        .put(`/api/sweets/${testSweet._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateData);

      expect(response.statusCode).toBe(200);
      expect(response.body.sweet.name).toBe('Updated Sweet');
      expect(response.body.sweet.price).toBe(15.99);
      expect(response.body.sweet.stock).toBe(15);
    });

    it('should reject customer updating sweet', async () => {
      const response = await request(app)
        .put(`/api/sweets/${testSweet._id}`)
        .set('Authorization', `Bearer ${customerToken}`)
        .send({ name: 'Customer Update' });

      expect(response.statusCode).toBe(403);
      expect(response.body.message).toBe('Admin access required');
    });

    it('should return 404 for non-existent sweet', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .put(`/api/sweets/${fakeId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: 'Updated' });

      expect(response.statusCode).toBe(404);
      expect(response.body.message).toBe('Sweet not found');
    });
  });

  describe('DELETE /api/sweets/:id - Delete sweet (Admin only)', () => {
    let testSweet;

    beforeEach(async () => {
      testSweet = await new Sweet({
        name: 'To Delete',
        category: 'snacks',
        price: 5.99,
        stock: 1
      }).save();
    });

    it('should allow admin to delete sweet', async () => {
      const response = await request(app)
        .delete(`/api/sweets/${testSweet._id}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe('Sweet deleted successfully');

      // Verify sweet is actually deleted
      const deletedSweet = await Sweet.findById(testSweet._id);
      expect(deletedSweet).toBeNull();
    });

    it('should reject customer deleting sweet', async () => {
      const response = await request(app)
        .delete(`/api/sweets/${testSweet._id}`)
        .set('Authorization', `Bearer ${customerToken}`);

      expect(response.statusCode).toBe(403);
      expect(response.body.message).toBe('Admin access required');
    });

    it('should return 404 for non-existent sweet', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .delete(`/api/sweets/${fakeId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.statusCode).toBe(404);
      expect(response.body.message).toBe('Sweet not found');
    });
  });
});