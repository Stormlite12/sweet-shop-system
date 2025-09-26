// tests/auth.test.js
import request from 'supertest';
import app from './testApp.js'
import mongoose from 'mongoose';
import User from '../src/models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_TEST_URI=process.env.MONGO_TEST_URI;
//using jest 
describe('Auth Endpoints', () => {

  // Before all tests, connect to the database
  beforeAll(async () => {
    await mongoose.connect(MONGO_TEST_URI);
  });

  // After each test, clear the users collection
  afterEach(async () => {
    await User.deleteMany();
  });

  // After all tests are finished, close the connection
  afterAll(async () => {
    await mongoose.connection.close();
  });


  it('should register a new user successfully', async () => {
    // Send a POST request to the registration endpoint with user data
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'testuser@example.com',
        password: 'password123'
      });

    

    // Assert (check) that the response is what we expect
    expect(response.statusCode).toBe(201); // 201 means 'Created'
    expect(response.body).toHaveProperty('token'); // The response should have a JWT token
    expect(response.body.user.email).toBe('testuser@example.com'); // The user's email should match
    expect(response.body.user).not.toHaveProperty('password'); // The user's password should NOT be returned
  });

   it('should return a 409 error if the email already exists', async () => {
    const userData = {
      email: 'testuser@example.com',
      password: 'password123',
    };

    // 1. Create the user for the first time
    await request(app).post('/api/auth/register').send(userData);

    // 2. Try to create the same user again
    const response = await request(app).post('/api/auth/register').send(userData);

    // 3. Assert that it fails with a 409 Conflict error
    expect(response.statusCode).toBe(409);
    expect(response.body.message).toBe('Email Already Exists');
  });

  describe('Login Tests', () => {
    it('should login a user with valid credentials', async () => {
      const userData = {
        email: 'testuser@example.com',
        password: 'password123',
      };

      // First, register the user
      await request(app).post('/api/auth/register').send(userData);

      // Then try to login
      const response = await request(app)
        .post('/api/auth/login')
        .send(userData);

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body.user.email).toBe('testuser@example.com');
      expect(response.body.user).not.toHaveProperty('password');
    });

    it('should return 401 for invalid email', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123',
        });

      expect(response.statusCode).toBe(401);
      expect(response.body.message).toBe('Invalid credentials');
    });

    it('should return 401 for invalid password', async () => {
      const userData = {
        email: 'testuser@example.com',
        password: 'password123',
      };

      // First, register the user
      await request(app).post('/api/auth/register').send(userData);

      // Then try to login with wrong password
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'testuser@example.com',
          password: 'wrongpassword',
        });

      expect(response.statusCode).toBe(401);
      expect(response.body.message).toBe('Invalid credentials');
    });
  });
});