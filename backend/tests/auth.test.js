// tests/auth.test.js
import request from 'supertest';
import app from "../src/app" 

//using jest 
describe('Auth Endpoints', () => {
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