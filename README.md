# 🍭 Sweet Shop - Full Stack E-Commerce Application
# https://sweet-shop-system.vercel.app

A modern, full-featured e-commerce application for a traditional Indian sweet shop, built with the MERN stack and featuring authentication, cart management, and admin functionality.

Layout
<img width="2447" height="1345" alt="Hero" src="https://github.com/user-attachments/assets/839a2685-1ade-4a29-b37c-579352a32c64" />
<img width="1452" height="1190" alt="Login-Register" src="https://github.com/user-attachments/assets/e9be94b2-68ec-4c29-a06e-794320ef1f94" />
<img width="2262" height="1346" alt="Sweets Grid" src="https://github.com/user-attachments/assets/8f962bc9-a446-4fd6-a63c-4369a90e6e62" />


Admin Panel
<img width="1682" height="1234" alt="Admin Panel-1" src="https://github.com/user-attachments/assets/54486bf8-b67b-48e9-8dcf-076027332fa1" />
<img width="2024" height="1213" alt="Admin Panel-2" src="https://github.com/user-attachments/assets/c4fe61e6-dd5b-4ddb-b6be-c818c89bd4a9" />
<img width="1596" height="1259" alt="Admin Panel-3" src="https://github.com/user-attachments/assets/b66fc691-4539-45ed-9ffb-292d4a528524" />



## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [AI Integration](#ai-integration)
- [Installation & Setup](#installation--setup)
- [API Documentation](#api-documentation)
- [Component Architecture](#component-architecture)
- [Authentication System](#authentication-system)
- [Database Schema](#database-schema)
- [User Journey](#user-journey)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [Troubleshooting](#troubleshooting)

## ✨ Features

### 🛒 **Customer Features**
- **Public Browsing**: View all available sweets without authentication required
- **Smart Search & Filter**: Find sweets by name and category with real-time filtering
- **Guest Cart Management**: Add items to cart before logging in
- **Secure Checkout Flow**: Login prompted only at purchase completion
- **Real-time Stock Updates**: Live inventory tracking across all components
- **Responsive Design**: Mobile-first approach, optimized for all devices
- **Cart Persistence**: Shopping cart saved in localStorage

### 👑 **Admin Features**
- **Complete Sweet Management**: Full CRUD operations with form validation
- **Dual Image Upload Options**: Support for both file upload and URL input
- **Advanced Stock Management**: Track inventory with color-coded alerts (low/medium/high stock)
- **Sales Analytics Dashboard**: Real-time statistics and inventory insights
- **Automatic Admin Assignment**: First registered user becomes admin
- **Tabbed Admin Interface**: Organized panels for Add/View/Manage operations

### 🔐 **Authentication & Security**
- **JWT Token System**: Secure, stateless authentication with 7-day expiration
- **Role-based Authorization**: Granular permissions (Admin vs Customer)
- **Protected API Routes**: Public viewing, authenticated purchasing, admin-only management
- **Password Security**: bcrypt hashing with salt rounds
- **CORS Configuration**: Production-ready cross-origin setup for Vercel + Railway

### 🎨 **UI/UX Features**
- **Interactive Hero Slider**: Before/after comparison slider showcasing craftsmanship
- **Toast Notifications**: Real-time feedback for all user actions
- **Loading States**: Skeleton loading and spinners for better UX
- **Error Handling**: Graceful error states with retry options
- **Cart Sidebar**: Slide-out cart with quantity controls and item management

## 🚀 Tech Stack

### **Frontend**
- **Framework**: React 18 with Vite for fast development and builds
- **Styling**: Tailwind CSS + DaisyUI for rapid, consistent styling
- **State Management**: React Hooks (useState, useEffect) + Custom hooks
- **Routing**: React Router v6 for SPA navigation
- **HTTP Client**: Native Fetch API with error handling
- **Notifications**: React Hot Toast for user feedback
- **Image Comparison**: React Compare Slider for hero section
- **Icons**: Heroicons and custom SVG icons

### **Backend**
- **Runtime**: Node.js (v16+)
- **Framework**: Express.js with ES6 modules
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT + bcryptjs for secure auth
- **File Upload**: Multer for multipart form data
- **Validation**: Custom middleware + Mongoose validators
- **CORS**: Configured for production deployment
- **Environment**: dotenv for configuration management

### **Development & Deployment**
- **Version Control**: Git with conventional commits
- **Backend Hosting**: Railway (automatic deployments)
- **Frontend Hosting**: Vercel (automatic deployments)
- **Database**: MongoDB Atlas (cloud database)
- **Environment Management**: Separate dev/production configs

## 🤖 AI Integration

This project leveraged various AI tools and assistants to accelerate development and ensure best practices:

### **GitHub Copilot**
- **Usage**: Code completion and generation throughout the project
- **Implementation Areas**:
  - Component structure and JSX templates
  - API endpoint implementations
  - Database schema design
  - Helper functions and utilities
- **Benefits**: Accelerated development time by ~40%, consistent coding patterns

### **ChatGPT/Claude (AI Assistant)**
- **Usage**: Architecture decisions, debugging, and documentation
- **Implementation Areas**:
  - **Project Structure Planning**: Initial MERN stack architecture design
  - **Authentication Flow Design**: JWT implementation strategy
  - **Component Design Patterns**: React hook patterns and state management
  - **API Design**: RESTful endpoint structure and error handling
  - **Database Schema**: MongoDB document structure optimization
  - **Security Best Practices**: CORS configuration and password hashing
  - **Deployment Strategy**: Railway and Vercel configuration
- **Specific Contributions**:
  - Cart management logic and localStorage persistence
  - Role-based authentication system design
  - Error handling and user experience patterns
  - Testing strategy and endpoint validation
  - Documentation structure and technical writing

### **AI-Assisted Development Workflow**
1. **Planning Phase**: AI helped design system architecture and component hierarchy
2. **Implementation Phase**: Copilot provided code suggestions and boilerplate generation
3. **Debugging Phase**: AI assistant helped identify and resolve complex issues
4. **Testing Phase**: AI suggested edge cases and testing scenarios
5. **Documentation Phase**: AI assisted in creating comprehensive README and code comments

### **AI Tools Configuration**
- **GitHub Copilot**: Enabled for JavaScript, JSX, and configuration files
- **AI Assistant**: Used for architectural discussions and problem-solving
- **Prompt Engineering**: Structured queries for specific development challenges

### **Development Efficiency Gains**
- **Code Generation**: 60% faster component scaffolding
- **Bug Resolution**: 70% faster debugging with AI-suggested solutions
- **Documentation**: 80% faster technical documentation creation
- **Best Practices**: AI ensured consistent security and performance patterns

### **Human vs AI Contributions**
- **AI Strengths**: Code patterns, boilerplate, documentation, debugging suggestions
- **Human Decisions**: Business logic, UX design, final architecture choices, code review
- **Collaborative Areas**: Error handling, performance optimization, security implementation

## 🛠️ Installation & Setup

### **Prerequisites**
- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- Git

### **1. Clone Repository**
```bash
git clone https://github.com/your-username/sweet-shop.git
cd sweet-shop
```

### **2. Backend Setup**
```bash
cd backend
npm install

# Create environment file
cp .env.example .env

# Edit .env with your configurations:
# MONGO_URI=mongodb://localhost:27017/sweetshop
# JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters
# PORT=5000
# NODE_ENV=development
```

### **3. Frontend Setup**
```bash
cd ../frontend
npm install

# Create environment file
cp .env.example .env

# Edit .env for development:
# VITE_API_BASE_URL=http://localhost:5000
```

### **4. Database Seeding (Optional)**
```bash
cd backend
npm run seed
# This populates the database with 8 sample sweets
```

### **5. Start Development Servers**

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
# 🚀 Server running on http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
# ➜ Local: http://localhost:5173
```

### **6. Access the Application**
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000/api
- **API Health Check**: http://localhost:5000/api/test

## 📡 API Documentation

### **Authentication Endpoints**

#### `POST /api/auth/register`
Register a new user (first user becomes admin automatically)
```json
Request:
{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "token": "jwt-token-here",
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "role": "admin" // or "customer"
  }
}
```

#### `POST /api/auth/login`
Login existing user
```json
Request:
{
  "email": "user@example.com", 
  "password": "password123"
}

Response:
{
  "token": "jwt-token-here",
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "role": "admin"
  }
}
```

#### `GET /api/auth/profile`
Get current user profile (requires Bearer token)

### **Sweet Management Endpoints**

#### `GET /api/sweets` 🌍 Public
Get all sweets (no authentication required)

#### `GET /api/sweets/search` 🌍 Public  
Search sweets with query parameters:
- `name` - Search by name (case-insensitive)
- `category` - Filter by category
- `minPrice` - Minimum price filter
- `maxPrice` - Maximum price filter

#### `GET /api/sweets/:id` 🌍 Public
Get single sweet by ID

#### `POST /api/sweets` 🔒 Admin Only
Create new sweet
```json
{
  "name": "Gulab Jamun",
  "category": "milk-based",
  "price": 150,
  "stock": 50,
  "image": "https://example.com/image.jpg"
}
```

#### `PUT /api/sweets/:id` 🔒 Admin Only
Update existing sweet

#### `DELETE /api/sweets/:id` 🔒 Admin Only
Delete sweet from inventory

#### `POST /api/sweets/:id/purchase` 🔐 Authenticated
Purchase sweet
```json
{
  "quantity": 2
}
```

#### `POST /api/sweets/:id/restock` 🔒 Admin Only
Restock sweet inventory
```json
{
  "quantity": 25
}
```

**Note**: Upload functionality has been removed in favor of URL-based images for better reliability and deployment compatibility.

## 🏗️ Component Architecture

### **Core Components**

#### **App.jsx**
- Main application wrapper with routing
- Global state management for modals and sidebars
- Authentication state handling

#### **Navbar.jsx**
- Navigation header with responsive design
- Authentication status display
- Cart counter and admin panel access

#### **HeroSlider.jsx**
- Interactive before/after comparison slider
- Showcases halwai craftsmanship transformation
- Touch-friendly with navigation dots

#### **SweetCards.jsx**
- Product grid with search and filtering
- Public browsing capability
- Add to cart functionality for all users

#### **CartSidebar.jsx**
- Slide-out shopping cart interface
- Quantity management and item removal
- Purchase flow with authentication check

#### **AdminPanel.jsx**
- Comprehensive admin management interface
- Tabbed design (Add/View/Manage)
- Image upload with dual options (URL/File)
- Real-time inventory statistics

#### **AuthModal.jsx**
- Combined login/register modal
- Form validation with error handling
- JWT token management and storage

#### **AdminRoute.jsx**
- Protected route wrapper component
- Role-based access control
- Elegant unauthorized access handling

### **Custom Hooks**

#### **useCart.jsx**
- Shopping cart state management
- localStorage persistence
- Quantity calculations and updates
- Cart operations (add, remove, update, clear)

### **Services Layer**

#### **authService.jsx**
- Authentication API calls (login, register, logout)
- Token management (store, retrieve, validate)
- User session and role handling

#### **sweetService.jsx**
- Sweet CRUD operations
- Public and authenticated endpoints
- Error handling and response formatting

## 🔐 Authentication System

### **User Roles & Permissions**
- **Admin**: First registered user, full management access
- **Customer**: Standard users, browse and purchase capabilities

### **Authentication Flow**
1. User registers/logs in via AuthModal
2. JWT token stored in localStorage (7-day expiration)
3. Token included in authenticated API requests
4. Backend middleware validates token and extracts user info
5. Routes protected based on authentication and role status

### **Security Features**
- **Password Hashing**: bcrypt with salt rounds for secure storage
- **JWT Tokens**: Stateless authentication with expiration
- **Role-based Access**: Granular permissions for different user types
- **Protected Routes**: Public viewing, authenticated purchasing, admin-only management
- **CORS Configuration**: Production-ready cross-origin resource sharing
- **Input Validation**: Server-side validation and sanitization

## 🗄️ Database Schema

### **User Model**
```javascript
{
  _id: ObjectId,
  email: String (unique, required, validated),
  password: String (hashed with bcrypt, required),
  role: String (enum: ['admin', 'customer'], default: 'customer'),
  createdAt: Date (auto-generated),
  updatedAt: Date (auto-generated)
}
```

### **Sweet Model**
```javascript
{
  _id: ObjectId,
  name: String (required, trimmed),
  category: String (required),
  price: Number (required, min: 0),
  stock: Number (required, min: 0),
  image: String (URL or file path),
  description: String (optional),
  createdAt: Date (auto-generated),
  updatedAt: Date (auto-generated)
}
```

## 👥 User Journey

### **Guest User Experience**
1. **Browse Freely**: View all sweets without account creation
2. **Search & Filter**: Find specific sweets by name or category
3. **Add to Cart**: Build shopping cart without authentication
4. **Login Prompt**: Prompted to login only when ready to purchase
5. **Complete Purchase**: Seamless checkout after authentication

### **First-Time User (Becomes Admin)**
1. **Register Account**: First user automatically gets admin role
2. **Access Admin Panel**: Special navbar button appears for admin users
3. **Manage Inventory**: Add, edit, delete sweets with rich interface
4. **Upload Images**: Choose between URL input or file upload
5. **Monitor Analytics**: View real-time statistics and stock alerts

### **Regular Customer Journey**
1. **Quick Registration**: Simple email/password signup
2. **Enhanced Experience**: Personalized features and purchase history
3. **Secure Checkout**: Fast, authenticated purchasing
4. **Cart Persistence**: Shopping cart maintained across sessions

## 🧪 Testing

### **Manual Testing Checklist**
- [ ] User registration and login functionality
- [ ] Admin role assignment (first user)
- [ ] Sweet CRUD operations (admin only)
- [ ] Image upload functionality (both URL and file)
- [ ] Shopping cart operations (add, remove, update quantities)
- [ ] Purchase flow with stock validation
- [ ] Search and filtering functionality
- [ ] Mobile responsiveness across devices
- [ ] Error handling and edge cases

### **API Testing Files**
Located in `backend/tests/`:
- `auth.test.js` - Authentication endpoint testing
- `inventory.test.js` - Stock management testing
- `role.test.js` - Role-based access control testing
- `sweet-crud.test.js` - Sweet CRUD operations testing

### **Run Tests**
```bash
cd backend
npm test
```

## 🚀 Deployment

### **Backend Deployment (Railway)**

1. **Connect Repository**
   - Link GitHub repository to Railway
   - Enable automatic deployments

2. **Environment Variables**
   ```env
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/sweetshop
   JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters
   PORT=5000
   NODE_ENV=production
   ```

3. **Deployment**
   - Automatically deploys on git push to main branch
   - Railway provides the deployment URL

### **Frontend Deployment (Vercel)**

1. **Connect Repository**
   - Import GitHub repository to Vercel
   - Configure build settings

2. **Build Configuration**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

3. **Environment Variables**
   ```env
   VITE_API_BASE_URL=https://your-railway-backend-url.up.railway.app
   ```

4. **Deploy**
   - Automatic deployments on git push
   - Preview deployments for pull requests

### **Database Setup (MongoDB Atlas)**

1. **Create Cluster**
   - Set up free tier MongoDB Atlas cluster
   - Configure network access and database user

2. **Connection String**
   - Copy connection string to Railway environment variables
   - Ensure proper database name in connection string

## 🤝 Contributing

### **Development Setup**
1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes with proper testing
4. Commit with descriptive messages (`git commit -m 'feat: add amazing feature'`)
5. Push to your branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request with detailed description

### **AI-Assisted Development Guidelines**
- **Use AI for**: Code scaffolding, documentation, testing ideas, debugging assistance
- **Human Review Required for**: Business logic, security implementations, final code approval
- **Best Practices**: Always review AI-generated code, test thoroughly, maintain code quality standards

### **Code Standards**
- Follow existing code style and component structure
- Add comprehensive comments for complex logic
- Test all new features thoroughly
- Update documentation for new features
- Use semantic commit messages (feat, fix, docs, style, refactor, test, chore)

### **Pull Request Process**
- Ensure all tests pass
- Update README.md if needed
- Add screenshots for UI changes
- Request review from maintainers

## 🔧 Troubleshooting

### **Common Issues**

#### **CORS Errors**
```bash
# If you encounter CORS errors during development:
1. Ensure both frontend and backend are running
2. Check network tab for blocked requests
3. Verify correct ports are being used
4. Temporarily disable browser extensions that might interfere
```

#### **JWT Errors**
```bash
# Common JWT issues:
- "invalid token" - Token has expired or is malformed
- "jwt must be provided" - No token sent in request
- "jwt malformed" - Token is not a valid JWT

# Solutions:
1. Ensure you are logged in and token is stored in localStorage
2. Check network requests to see if token is being sent
3. If testing with Postman/Insomnia, manually add the token to headers
```

#### **Database Connection Errors**
```bash
# If the backend cannot connect to the database:
1. Ensure MongoDB is running (for local setups)
2. Check connection string in backend .env file
3. Verify network access and database user permissions (for Atlas)
4. Look for detailed error messages in the backend console
```

#### **File Upload Issues**
```bash
# Common problems with image uploads:
- Images not appearing in the admin panel
- Uploads failing with "file type not allowed" errors

# Troubleshooting steps:
1. Check file type and size restrictions in the backend code
2. Ensure correct implementation of multer middleware
3. Verify that the frontend is sending the correct multipart/form-data requests
```

#### **NPM Issues**
```bash
# If you encounter issues with npm commands:
1. Ensure you have the latest version of Node.js and npm
2. Delete node_modules and package-lock.json, then run npm install
3. Check for permission issues, especially on Linux/Mac
4. If using Windows, ensure you are running the command prompt as administrator
```




🙏 Acknowledgments
- **GitHub Copilot** for intelligent code completion and development acceleration
- **AI Assistant (ChatGPT/Claude)** for architectural guidance and problem-solving support
- **React Team** for the excellent framework and ecosystem
- **Tailwind CSS & DaisyUI** for beautiful, rapid styling
- **MongoDB** for flexible document database
- **Railway & Vercel** for seamless deployment platforms
- **Open Source Community** for incredible tools and libraries

## 📞 Support & Contact

- **Email**: sid2002official@gmail.com
- **GitHub Issues**: Create an issue for bug reports or feature requests
- **Discussions**: Use GitHub Discussions for questions and community chat

---

**Built with ❤️ for traditional sweet shops embracing modern technology** 🍭✨

*Developed with AI assistance for accelerated development and best practices*

*Last updated: December 2024*
