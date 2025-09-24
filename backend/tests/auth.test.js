// tests/auth.test.js
import request from 'supertest';
import app from "../src/app.js" 
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
});