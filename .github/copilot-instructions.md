# Sweet Shop Backend - AI Coding Guide

## Architecture Overview

This is a **backend-only** Node.js Express API for a sweet shop system, using MongoDB for data persistence. The project follows a clean MVC architecture with JWT-based authentication.

**Key Structure:**
- `src/app.js` - Express app configuration and route mounting
- `src/server.js` - Entry point that connects to DB and starts server
- `src/config/db.js` - MongoDB connection using Mongoose
- `src/models/` - Mongoose schemas (currently only User model)
- `src/controllers/` - Business logic handlers
- `src/routes/` - Express route definitions
- `tests/` - Jest test files with supertest for API testing

## Critical Development Patterns

### ES Modules Configuration
- Project uses `"type": "module"` in package.json - all imports/exports must use ES6 syntax
- Import paths must include `.js` extensions: `import User from "../models/User.js"`
- Test runner requires special flag: `node --experimental-vm-modules node_modules/jest/bin/jest.js`

### Database Connection Strategy
- **Development**: Uses local MongoDB at `mongodb://localhost:27017/sweetshop`
- **Testing**: Separate test database `mongodb://localhost:27017/sweetshop_test`
- Connection is established in `src/server.js` before starting the server
- Tests connect directly and clean up after each test (`afterEach: User.deleteMany()`)

### Authentication Implementation
- Uses bcryptjs for password hashing with salt rounds of 10
- JWT tokens expire in 1 hour (`expiresIn: '1h'`)
- Registration endpoint returns both token and sanitized user object (without password)
- Current implementation only has registration - login endpoint not yet implemented

### Error Handling Convention
- HTTP 409 for conflicts (email already exists)
- HTTP 201 for successful creation
- HTTP 500 for server errors with error message in response
- Console logging for debugging: `console.log('REGISTRATION ERROR', error)`

## Development Workflow

### Running the Application
```bash
npm run dev     # Development with nodemon
npm start      # Production
npm test       # Run Jest tests
```

### Testing Strategy
- Uses Jest + Supertest for API integration tests
- Each test file connects to test database in `beforeAll`
- Database is cleaned between tests in `afterEach`
- Connection closed in `afterAll`
- Test example: `tests/auth.test.js` shows proper test structure

### Environment Variables
Required in `.env`:
```
MONGO_URI=mongodb://localhost:27017/sweetshop
MONGO_TEST_URI=mongodb://localhost:27017/sweetshop_test
JWT_SECRET=your-secret-key
```

## Extending the System

### Adding New Routes
1. Create controller function in `src/controllers/`
2. Export route handler: `export const handlerName = async (req, res) => {}`
3. Import and use in route file: `import { handlerName } from "../controllers/"`
4. Mount route in `src/app.js`: `app.use('/api/prefix', routeHandler)`

### Adding New Models
Follow the pattern in `src/models/User.js` - use Mongoose schemas with proper validation and export the model.

### Current Limitations
- No login endpoint implemented yet
- No password validation/requirements
- No user roles or permissions
- No input validation middleware
- No rate limiting or security headers