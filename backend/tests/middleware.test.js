import request from 'supertest';
import app from './testApp.js';
import mongoose from 'mongoose';
import User from '../src/models/User.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

describe('JWT Authentication Middleware', () => {
  let testUser;
  let validToken;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_TEST_URI);
  });

  beforeEach(async () => {
    // Clean database
    await User.deleteMany();
    
    // Create a test user and generate token
    const userData = {
      email: 'test@example.com',
      password: 'password123'
    };
    
    const registerResponse = await request(app)
      .post('/api/auth/register')
      .send(userData);
    
    testUser = registerResponse.body.user;
    validToken = registerResponse.body.token;
  });

  afterAll(async () => {
    // Clean after tests then close connection
    await User.deleteMany();
    await mongoose.connection.close();
  });

  describe('Protected Route Access', () => {
    it('should deny access without token', async () => {
      const response = await request(app)
        .get('/api/auth/profile');
      
      expect(response.statusCode).toBe(401);
      expect(response.body.message).toBe('Access token required');
    });

    it('should deny access with invalid token', async () => {
      const response = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', 'Bearer invalid_token_here');
      
      expect(response.statusCode).toBe(401);
      expect(response.body.message).toBe('Invalid token');
    });

    it('should allow access with valid token', async () => {
      const response = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', `Bearer ${validToken}`);
      
      expect(response.statusCode).toBe(200);
      expect(response.body.user.email).toBe('test@example.com');
       expect(response.body.user.role).toBe('admin'); // First user = admin
      expect(response.body.user).not.toHaveProperty('password');
    });

    it('should populate req.user with role information', async () => {
      // This test verifies the middleware correctly populates req.user
      const response = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', `Bearer ${validToken}`);
      
      expect(response.statusCode).toBe(200);
      expect(response.body.user).toHaveProperty('id');
      expect(response.body.user).toHaveProperty('email');
      expect(response.body.user).toHaveProperty('role');
      expect(response.body.user.role).toBe('admin'); // First registered user
    });
  });
});