import request from 'supertest';
import app from '../src/app.js';
import mongoose from 'mongoose';
import User from '../src/models/User.js';
import dotenv from 'dotenv';

dotenv.config();

describe('First User Admin Registration', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_TEST_URI);
  });

  afterEach(async () => {
    await User.deleteMany();
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('Auto Role Assignment', () => {
    it('should make the first user an admin', async () => {
      const firstUser = {
        email: 'first@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(firstUser);

      expect(response.statusCode).toBe(201);
      expect(response.body.user.role).toBe('admin');
      expect(response.body.user.email).toBe('first@example.com');
    });

    it('should make subsequent users customers', async () => {
      // Register first user (will be admin)
      await request(app)
        .post('/api/auth/register')
        .send({
          email: 'admin@example.com',
          password: 'password123'
        });

      // Register second user (should be customer)
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'customer@example.com',
          password: 'password123'
        });

      expect(response.statusCode).toBe(201);
      expect(response.body.user.role).toBe('customer');
      expect(response.body.user.email).toBe('customer@example.com');
    });

    it('should make third and subsequent users customers', async () => {
      // Register first user (admin)
      await request(app)
        .post('/api/auth/register')
        .send({
          email: 'admin@example.com',
          password: 'password123'
        });

      // Register second user (customer)
      await request(app)
        .post('/api/auth/register')
        .send({
          email: 'customer1@example.com',
          password: 'password123'
        });

      // Register third user (should also be customer)
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'customer2@example.com',
          password: 'password123'
        });

      expect(response.statusCode).toBe(201);
      expect(response.body.user.role).toBe('customer');
    });
  });

  describe('Login with Auto-Assigned Roles', () => {
    beforeEach(async () => {
      // Set up one admin (first) and one customer (second)
      await request(app)
        .post('/api/auth/register')
        .send({
          email: 'admin@test.com',
          password: 'password123'
        });

      await request(app)
        .post('/api/auth/register')
        .send({
          email: 'customer@test.com',
          password: 'password123'
        });
    });

    it('should login admin with admin role', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'admin@test.com',
          password: 'password123'
        });

      expect(response.statusCode).toBe(200);
      expect(response.body.user.role).toBe('admin');
      expect(response.body.user.email).toBe('admin@test.com');
    });

    it('should login customer with customer role', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'customer@test.com',
          password: 'password123'
        });

      expect(response.statusCode).toBe(200);
      expect(response.body.user.role).toBe('customer');
      expect(response.body.user.email).toBe('customer@test.com');
    });
  });

  describe('Profile Access with Auto-Assigned Roles', () => {
    let adminToken, customerToken;

    beforeEach(async () => {
      // Register admin (first user)
      const adminResponse = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'admin@test.com',
          password: 'password123'
        });
      adminToken = adminResponse.body.token;

      // Register customer (second user)
      const customerResponse = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'customer@test.com',
          password: 'password123'
        });
      customerToken = customerResponse.body.token;
    });

    it('should return admin profile with admin role', async () => {
      const response = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.user.role).toBe('admin');
      expect(response.body.user.email).toBe('admin@test.com');
    });

    it('should return customer profile with customer role', async () => {
      const response = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', `Bearer ${customerToken}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.user.role).toBe('customer');
      expect(response.body.user.email).toBe('customer@test.com');
    });
  });
});