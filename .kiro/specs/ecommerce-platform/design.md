# Design Document

## Overview

The ecommerce platform is a lightweight web application built with Node.js, Express, and MongoDB. It provides a simple shopping experience where customers can browse products, make instant purchases, and receive email invoices. Admins can manage products and view financial reports. The architecture follows the MVC pattern with clear separation of concerns.

The system prioritizes simplicity and speed of development while maintaining essential ecommerce functionality. Authentication is session-based, purchases are one-click without a cart, and the UI is responsive using modern CSS.

## Architecture

### High-Level Architecture

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │ HTTP/HTTPS
       ▼
┌─────────────────────────────────────┐
│      Express.js Server              │
│  ┌───────────────────────────────┐  │
│  │   Routes & Middleware         │  │
│  │  - Auth, Session, Static      │  │
│  └───────────┬───────────────────┘  │
│              ▼                       │
│  ┌───────────────────────────────┐  │
│  │      Controllers              │  │
│  │  - Auth, Products, Orders     │  │
│  └───────────┬───────────────────┘  │
│              ▼                       │
│  ┌───────────────────────────────┐  │
│  │    Services & Models          │  │
│  │  - Business Logic, DB Access  │  │
│  └───────────┬───────────────────┘  │
└──────────────┼───────────────────────┘
               │
               ▼
    ┌──────────────────┐      ┌──────────────┐
    │    MongoDB       │      │ Email Service│
    │  - Users         │      │  (Nodemailer)│
    │  - Products      │      └──────────────┘
    │  - Orders        │
    └──────────────────┘
```

### Technology Stack

- **Backend**: Node.js with Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: express-session with connect-mongo
- **Email**: Nodemailer (SMTP)
- **Template Engine**: EJS for server-side rendering
- **Styling**: Custom CSS with responsive design
- **Environment**: dotenv for configuration
- **Containerization**: Docker and Docker Compose for easy deployment

### Directory Structure

```
ecommerce-platform/
├── src/
│   ├── models/          # Mongoose schemas
│   ├── controllers/     # Request handlers
│   ├── routes/          # Express routes
│   ├── middleware/      # Auth & validation
│   ├── services/        # Email, calculations
│   ├── config/          # Database, email config
│   └── utils/           # Helper functions
├── views/               # EJS templates
│   ├── partials/        # Reusable components
│   ├── home.ejs
│   ├── login.ejs
│   ├── register.ejs
│   └── admin/
│       ├── dashboard.ejs
│       ├── products.ejs
│       └── reports.ejs
├── public/              # Static assets
│   ├── css/
│   └── images/
├── .env                 # Environment variables
├── .env.example         # Example environment variables
├── Dockerfile           # Docker configuration
├── docker-compose.yml   # Docker Compose configuration
├── .dockerignore        # Docker ignore file
├── package.json
└── server.js            # Entry point
```

## Components and Interfaces

### 1. Authentication System

**Responsibilities:**
- User registration and login
- Session management
- Role-based access control (customer vs admin)

**Key Functions:**
- `register(name, email, password, role)` - Creates new user account
- `login(email, password)` - Authenticates user and creates session
- `logout()` - Destroys user session
- `requireAuth(req, res, next)` - Middleware to protect routes
- `requireAdmin(req, res, next)` - Middleware to protect admin routes

### 2. Product Management

**Responsibilities:**
- CRUD operations for products
- Product catalog display
- Product validation

**Key Functions:**
- `getAllProducts()` - Retrieves all products for display
- `getProductById(id)` - Retrieves single product details
- `createProduct(data)` - Adds new product (admin only)
- `updateProduct(id, data)` - Updates product details (admin only)
- `deleteProduct(id)` - Removes product (admin only)

### 3. Order Processing

**Responsibilities:**
- Order creation
- Order data storage
- Order retrieval for admin

**Key Functions:**
- `createOrder(userId, productId)` - Creates order record
- `getAllOrders()` - Retrieves all orders (admin only)
- `getOrdersByUser(userId)` - Retrieves user's order history

### 4. Email Service

**Responsibilities:**
- Invoice generation
- Email delivery
- Retry logic for failed sends

**Key Functions:**
- `generateInvoice(order)` - Creates HTML invoice from order data
- `sendInvoice(email, invoice)` - Sends invoice via SMTP
- `retryFailedEmail(orderId)` - Attempts to resend failed invoice

### 5. Financial Reporting

**Responsibilities:**
- Calculate monthly revenue, costs, and profit
- Generate profit/loss statements
- Real-time financial metrics

**Key Functions:**
- `calculateMonthlyRevenue(month, year)` - Sums all order totals
- `calculateMonthlyCost(month, year)` - Sums product costs
- `calculateProfit(month, year)` - Revenue minus costs
- `getProfitMargin(month, year)` - Profit as percentage of revenue

### 6. View Layer

**Responsibilities:**
- Render HTML pages
- Display data to users
- Handle responsive layouts

**Templates:**
- `home.ejs` - Product catalog for customers
- `login.ejs` / `register.ejs` - Authentication forms
- `admin/dashboard.ejs` - Order list for admin
- `admin/products.ejs` - Product management interface
- `admin/reports.ejs` - Financial reports display

## Data Models

### User Model

```javascript
{
  _id: ObjectId,
  name: String (required),
  email: String (required, unique, lowercase),
  password: String (required, hashed),
  role: String (enum: ['customer', 'admin'], default: 'customer'),
  createdAt: Date (default: Date.now)
}
```

**Indexes:**
- `email` (unique)

### Product Model

```javascript
{
  _id: ObjectId,
  name: String (required),
  description: String (required),
  price: Number (required, min: 0),
  cost: Number (required, min: 0),
  imageUrl: String (required),
  createdAt: Date (default: Date.now),
  updatedAt: Date (default: Date.now)
}
```

**Validation:**
- Price and cost must be non-negative
- Name must not be empty

### Order Model

```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: 'User', required),
  productId: ObjectId (ref: 'Product', required),
  customerName: String (required),
  customerEmail: String (required),
  productName: String (required),
  price: Number (required),
  cost: Number (required),
  profit: Number (calculated: price - cost),
  invoiceSent: Boolean (default: false),
  emailStatus: String (enum: ['pending', 'sent', 'failed']),
  purchaseDate: Date (default: Date.now)
}
```

**Indexes:**
- `userId`
- `purchaseDate` (for monthly reports)

**Note:** Order stores denormalized product and user data to maintain historical accuracy even if products/users are modified or deleted.

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*


### Property 1: Product display completeness
*For any* set of products in the database, when the home page is rendered, all products should be included in the response with their name, description, price, and image URL.
**Validates: Requirements 1.1**

### Property 2: Valid registration creates account
*For any* valid user registration data (non-empty name, unique email, password), the authentication system should successfully create a new user account with the correct role.
**Validates: Requirements 2.1**

### Property 3: Duplicate email rejection
*For any* email address that already exists in the database, attempting to register with that email should fail with an error.
**Validates: Requirements 2.2**

### Property 4: Valid credentials authenticate
*For any* user with valid credentials in the database, providing correct email and password should result in successful authentication.
**Validates: Requirements 2.3**

### Property 5: Invalid credentials rejected
*For any* login attempt with credentials that don't match a user in the database, the authentication system should reject the login.
**Validates: Requirements 2.4**

### Property 6: Admin role authorization
*For any* user with admin role, accessing admin routes should be permitted, and for any user without admin role, accessing admin routes should be denied.
**Validates: Requirements 3.1, 3.3**

### Property 7: Order creation completeness
*For any* authenticated customer and valid product, creating an order should result in a database record containing customer name, customer email, product name, price, cost, and purchase timestamp.
**Validates: Requirements 4.1, 4.3**

### Property 8: Unauthenticated purchase prevention
*For any* purchase attempt without authentication, the system should reject the request and require login.
**Validates: Requirements 4.2**

### Property 9: Invoice generation completeness
*For any* order, the generated invoice should be valid HTML and contain order ID, customer name, product name, price, purchase date, and total amount.
**Validates: Requirements 5.1, 5.4**

### Property 10: Email status recording
*For any* order where an invoice email is sent, the order record should be updated with the email delivery status.
**Validates: Requirements 5.5**

### Property 11: Email retry on failure
*For any* order where email sending fails, the system should attempt to retry sending once.
**Validates: Requirements 5.3**

### Property 12: Admin order visibility
*For any* order in the database, it should appear in the admin dashboard with customer name, email, product name, price, and purchase timestamp.
**Validates: Requirements 6.1, 6.2**

### Property 13: Order sorting by date
*For any* set of orders, when retrieved for the admin dashboard, they should be sorted with the most recent order first.
**Validates: Requirements 6.3**

### Property 14: Product CRUD operations
*For any* valid product data, admins should be able to create, update, and delete products, with changes immediately reflected in the product catalog queries.
**Validates: Requirements 7.1, 7.2, 7.3, 7.4**

### Property 15: Product validation
*For any* invalid product data (negative price, negative cost, or empty name), the system should reject the operation with validation errors.
**Validates: Requirements 7.5**

### Property 16: Financial calculations correctness
*For any* set of orders in a given month, the financial report should correctly calculate total revenue (sum of prices), total cost (sum of costs), total profit (revenue - cost), and profit margin (profit / revenue * 100).
**Validates: Requirements 8.1, 8.2, 8.3, 8.5**

### Property 17: Error handling for database operations
*For any* database operation that fails, the system should catch the error and return an appropriate error response without crashing.
**Validates: Requirements 10.3**

## Error Handling

### Error Categories

1. **Validation Errors**
   - Invalid user input (empty fields, negative numbers)
   - Duplicate email registration
   - Invalid credentials
   - Response: 400 Bad Request with descriptive error message

2. **Authentication Errors**
   - Unauthenticated access to protected routes
   - Unauthorized access to admin routes
   - Response: 401 Unauthorized or 403 Forbidden with redirect

3. **Database Errors**
   - Connection failures
   - Query errors
   - Document not found
   - Response: 500 Internal Server Error with generic message (log detailed error)

4. **Email Errors**
   - SMTP connection failure
   - Invalid email address
   - Response: Log error, update order status, attempt retry

5. **Not Found Errors**
   - Product not found
   - User not found
   - Order not found
   - Response: 404 Not Found with appropriate message

### Error Handling Strategy

- All route handlers wrapped in try-catch blocks
- Centralized error handling middleware
- Detailed error logging for debugging
- User-friendly error messages (no stack traces to users)
- Graceful degradation (e.g., continue even if email fails)
- Database connection retry logic
- Email retry mechanism (one retry on failure)

### Example Error Response Format

```javascript
{
  success: false,
  error: "User-friendly error message",
  code: "ERROR_CODE"
}
```

## Testing Strategy

The ecommerce platform will use a dual testing approach combining unit tests and property-based tests to ensure comprehensive coverage.

### Unit Testing

Unit tests will verify specific examples, edge cases, and integration points:

- **Authentication**: Test login/register with specific valid/invalid inputs
- **Edge Cases**: Empty product catalog, no orders in month, empty email list
- **Integration**: Database connection, email service integration
- **Error Conditions**: Database failures, invalid inputs, missing data

**Framework**: Jest or Mocha with Chai
**Coverage Target**: Critical paths and edge cases

### Property-Based Testing

Property-based tests will verify universal properties across all inputs using **fast-check** (JavaScript property testing library):

- Each property test will run a minimum of 100 iterations
- Tests will use generators to create random valid inputs
- Each test will be tagged with the format: `**Feature: ecommerce-platform, Property {number}: {property_text}**`
- Each correctness property from this design document will be implemented as a single property-based test

**Key Property Tests**:
- Product display includes all database products (Property 1)
- Valid registrations always create accounts (Property 2)
- Duplicate emails always rejected (Property 3)
- Order creation always includes required fields (Property 7)
- Financial calculations always correct (Property 16)
- Product validation always rejects invalid data (Property 15)

**Generators Needed**:
- Random valid user data (name, email, password)
- Random valid product data (name, description, price > 0, cost > 0)
- Random orders with associated user and product data
- Random invalid inputs (negative numbers, empty strings, etc.)

### Test Environment

- Separate test database (MongoDB in-memory or test instance)
- Mock email service for testing (no actual emails sent)
- Environment variables for test configuration
- Database cleanup between tests
- Seed data for consistent test scenarios

### Testing Workflow

1. Run unit tests first to catch specific bugs
2. Run property tests to verify general correctness
3. Both test suites must pass before deployment
4. Property tests help catch edge cases unit tests might miss
5. Unit tests provide concrete examples of expected behavior

## Security Considerations

1. **Password Security**
   - Passwords hashed using bcrypt (salt rounds: 10)
   - Never store plain text passwords
   - Never return password hashes in API responses

2. **Session Security**
   - Secure session cookies (httpOnly, secure in production)
   - Session expiration (24 hours)
   - Session stored in MongoDB for persistence

3. **Input Validation**
   - Sanitize all user inputs
   - Validate email format
   - Validate numeric inputs (prices, costs)
   - Prevent NoSQL injection

4. **Authorization**
   - Role-based access control
   - Middleware to protect admin routes
   - Verify user ownership for user-specific operations

5. **Environment Variables**
   - Sensitive data in .env file
   - .env file in .gitignore
   - Different configs for dev/prod

## Performance Considerations

1. **Database Indexing**
   - Index on user email for fast lookups
   - Index on order purchaseDate for monthly reports
   - Index on userId for order queries

2. **Query Optimization**
   - Use lean() for read-only queries
   - Limit fields returned in queries
   - Pagination for large result sets (future enhancement)

3. **Caching Strategy**
   - Session caching via connect-mongo
   - Consider Redis for future scaling
   - Static asset caching with proper headers

4. **Email Async Processing**
   - Email sending doesn't block order creation
   - Use async/await for non-blocking operations
   - Consider queue system for production (future enhancement)

## Docker Configuration

### Docker Setup

The application will be containerized using Docker for easy deployment and consistent environments across development and production.

**Docker Compose Services**:
1. **app** - Node.js application container
2. **mongodb** - MongoDB database container

**Dockerfile**:
- Base image: node:18-alpine (lightweight)
- Working directory: /app
- Install dependencies
- Copy application code
- Expose port 3000
- Start command: npm start

**docker-compose.yml**:
- Define app and mongodb services
- Network configuration for service communication
- Volume mounting for MongoDB data persistence
- Environment variable configuration
- Port mapping (3000:3000 for app, 27017:27017 for MongoDB)

**Benefits**:
- One-command startup: `docker-compose up`
- Isolated environment
- Easy to replicate across machines
- No need to install Node.js or MongoDB locally
- Consistent development and production environments

## Deployment Considerations

1. **Environment Setup**
   - Docker and Docker Compose installed
   - Environment variables configured in .env file
   - SMTP credentials for email

2. **Configuration**
   ```
   PORT=3000
   MONGODB_URI=mongodb://mongodb:27017/ecommerce
   SESSION_SECRET=random-secret-key
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   NODE_ENV=development
   ```

3. **Docker Commands**
   - Start: `docker-compose up -d`
   - Stop: `docker-compose down`
   - View logs: `docker-compose logs -f`
   - Rebuild: `docker-compose up --build`

4. **Initial Setup**
   - Copy .env.example to .env and configure
   - Run `docker-compose up`
   - Create admin user via seed script or API
   - Test email configuration
   - Verify all routes work

5. **Monitoring**
   - Log all errors
   - Monitor email delivery rates
   - Track order creation success/failure
   - Database connection health checks
   - Container health monitoring

## Future Enhancements

While out of scope for the initial implementation, these enhancements could be added:

- Shopping cart for multiple items
- Product categories and search
- Order history for customers
- Payment gateway integration
- Product inventory management
- Customer reviews and ratings
- Advanced financial reports (yearly, custom date ranges)
- Email templates with branding
- Password reset functionality
- User profile management
