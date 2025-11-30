# Implementation Plan

- [x] 1. Set up project structure and Docker configuration


  - Create directory structure (src, views, public folders)
  - Initialize package.json with dependencies
  - Create Dockerfile for Node.js application
  - Create docker-compose.yml with app and MongoDB services
  - Create .env.example file with configuration template
  - Create .dockerignore file
  - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.7_

- [x] 2. Implement database models and configuration


- [ ] 2.1 Create database connection configuration
  - Write MongoDB connection logic with error handling
  - Configure Mongoose connection options

  - _Requirements: 10.2, 10.5_

- [x] 2.2 Implement User model

  - Create User schema with name, email, password, role fields
  - Add email uniqueness constraint and validation
  - Add password hashing with bcrypt
  - _Requirements: 2.1, 2.2, 3.1_

- [x] 2.3 Implement Product model


  - Create Product schema with name, description, price, cost, imageUrl
  - Add validation for non-negative prices and costs
  - Add timestamps for createdAt and updatedAt
  - _Requirements: 7.1, 7.5_

- [x] 2.4 Implement Order model


  - Create Order schema with user, product, and denormalized data
  - Add profit calculation field
  - Add email status tracking fields
  - Add indexes for userId and purchaseDate
  - _Requirements: 4.1, 5.5, 6.1, 8.2_

- [ ]* 2.5 Write property test for product validation
  - **Property 15: Product validation**
  - **Validates: Requirements 7.5**

- [ ]* 2.6 Write unit tests for models
  - Test User model password hashing
  - Test Product model validation
  - Test Order model profit calculation
  - _Requirements: 2.1, 7.5, 8.2_

- [ ] 3. Implement authentication system
- [x] 3.1 Create authentication middleware


  - Write requireAuth middleware to protect routes
  - Write requireAdmin middleware for admin-only routes
  - Configure express-session with connect-mongo
  - _Requirements: 2.3, 3.1, 3.3_

- [x] 3.2 Implement registration controller


  - Create POST /register route handler
  - Validate registration input
  - Check for duplicate emails
  - Hash password and create user
  - _Requirements: 2.1, 2.2_

- [x] 3.3 Implement login controller

  - Create POST /login route handler
  - Validate credentials against database
  - Create session on successful login
  - _Requirements: 2.3, 2.4_

- [x] 3.4 Implement logout functionality

  - Create POST /logout route handler
  - Destroy user session
  - _Requirements: 2.3_

- [ ]* 3.5 Write property test for valid registration
  - **Property 2: Valid registration creates account**
  - **Validates: Requirements 2.1**

- [ ]* 3.6 Write property test for duplicate email rejection
  - **Property 3: Duplicate email rejection**
  - **Validates: Requirements 2.2**

- [ ]* 3.7 Write property test for valid credentials
  - **Property 4: Valid credentials authenticate**
  - **Validates: Requirements 2.3**

- [ ]* 3.8 Write property test for invalid credentials
  - **Property 5: Invalid credentials rejected**
  - **Validates: Requirements 2.4**

- [ ]* 3.9 Write property test for admin authorization
  - **Property 6: Admin role authorization**
  - **Validates: Requirements 3.1, 3.3**

- [ ] 4. Implement product management
- [x] 4.1 Create product routes and controllers


  - Implement GET /products for listing all products
  - Implement GET /products/:id for product details
  - Implement POST /products for creating products (admin only)
  - Implement PUT /products/:id for updating products (admin only)
  - Implement DELETE /products/:id for deleting products (admin only)
  - _Requirements: 1.1, 7.1, 7.2, 7.3, 7.4_

- [ ]* 4.2 Write property test for product display completeness
  - **Property 1: Product display completeness**
  - **Validates: Requirements 1.1**

- [ ]* 4.3 Write property test for product CRUD operations
  - **Property 14: Product CRUD operations**
  - **Validates: Requirements 7.1, 7.2, 7.3, 7.4**

- [ ] 5. Implement order processing
- [x] 5.1 Create order controller


  - Implement POST /orders route for creating orders
  - Verify user authentication
  - Fetch product details and create order with denormalized data
  - Calculate profit field
  - _Requirements: 4.1, 4.2, 4.3, 8.2_

- [ ]* 5.2 Write property test for order creation completeness
  - **Property 7: Order creation completeness**
  - **Validates: Requirements 4.1, 4.3**

- [ ]* 5.3 Write property test for unauthenticated purchase prevention
  - **Property 8: Unauthenticated purchase prevention**
  - **Validates: Requirements 4.2**

- [x] 5.4 Create admin orders dashboard endpoint

  - Implement GET /admin/orders route
  - Fetch all orders sorted by most recent
  - Populate user and product details
  - _Requirements: 6.1, 6.2, 6.3_

- [ ]* 5.5 Write property test for admin order visibility
  - **Property 12: Admin order visibility**
  - **Validates: Requirements 6.1, 6.2**

- [ ]* 5.6 Write property test for order sorting
  - **Property 13: Order sorting by date**
  - **Validates: Requirements 6.3**

- [ ] 6. Implement email service
- [x] 6.1 Create email service with Nodemailer


  - Configure SMTP connection with environment variables
  - Create invoice HTML template generator
  - Implement sendInvoice function
  - Add retry logic for failed emails
  - _Requirements: 5.1, 5.2, 5.3, 5.4_

- [x] 6.2 Integrate email service with order creation

  - Call email service after order creation
  - Update order emailStatus field
  - Handle email failures gracefully
  - _Requirements: 5.1, 5.5_

- [ ]* 6.3 Write property test for invoice generation
  - **Property 9: Invoice generation completeness**
  - **Validates: Requirements 5.1, 5.4**

- [ ]* 6.4 Write property test for email status recording
  - **Property 10: Email status recording**
  - **Validates: Requirements 5.5**

- [ ]* 6.5 Write property test for email retry
  - **Property 11: Email retry on failure**
  - **Validates: Requirements 5.3**

- [ ] 7. Implement financial reporting
- [x] 7.1 Create financial calculations service


  - Implement calculateMonthlyRevenue function
  - Implement calculateMonthlyCost function
  - Implement calculateProfit function
  - Implement getProfitMargin function
  - _Requirements: 8.1, 8.2, 8.3_

- [x] 7.2 Create financial reports endpoint


  - Implement GET /admin/reports route
  - Calculate all financial metrics for current month
  - Return revenue, cost, profit, and profit margin
  - _Requirements: 8.1, 8.2, 8.3, 8.5_

- [ ]* 7.3 Write property test for financial calculations
  - **Property 16: Financial calculations correctness**
  - **Validates: Requirements 8.1, 8.2, 8.3, 8.5**

- [ ] 8. Create view templates with EJS
- [x] 8.1 Create layout and partials


  - Create header partial with navigation
  - Create footer partial
  - Create layout template with responsive structure
  - _Requirements: 9.1, 9.2, 9.3, 9.4_

- [x] 8.2 Create authentication views


  - Create login.ejs with login form
  - Create register.ejs with registration form
  - Add form validation and error display
  - _Requirements: 2.1, 2.2, 2.3, 2.4_

- [x] 8.3 Create home page view


  - Create home.ejs displaying product grid
  - Add buy buttons for authenticated users
  - Show login prompt for unauthenticated users
  - Display empty state when no products exist
  - _Requirements: 1.1, 1.3, 1.5, 4.1_

- [x] 8.4 Create admin views


  - Create admin/dashboard.ejs for orders list
  - Create admin/products.ejs for product management
  - Create admin/reports.ejs for financial reports
  - Add forms for creating/editing products
  - _Requirements: 6.1, 7.1, 8.3_

- [ ] 9. Implement CSS styling
- [x] 9.1 Create responsive CSS


  - Create main stylesheet with mobile-first approach
  - Implement responsive grid for products
  - Add media queries for tablet (768px) and desktop (1024px)
  - Style forms, buttons, and navigation
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_

- [x] 9.2 Style authentication pages

  - Style login and register forms
  - Add error message styling
  - Ensure responsive layout
  - _Requirements: 9.1, 9.5_

- [x] 9.3 Style admin interface

  - Style admin dashboard tables
  - Style product management forms
  - Style financial reports display
  - Ensure responsive tables
  - _Requirements: 9.1, 9.5_

- [ ] 10. Set up routes and server
- [x] 10.1 Create Express server configuration


  - Initialize Express app
  - Configure middleware (body-parser, session, static files)
  - Set up EJS as template engine
  - Configure error handling middleware
  - _Requirements: 10.1, 10.5_

- [x] 10.2 Define all application routes


  - Create auth routes (login, register, logout)
  - Create product routes (list, detail, CRUD)
  - Create order routes (create, list)
  - Create admin routes (dashboard, products, reports)
  - Wire up controllers to routes
  - _Requirements: 10.7_

- [ ]* 10.3 Write property test for error handling
  - **Property 17: Error handling for database operations**
  - **Validates: Requirements 10.5**

- [ ] 11. Create database seed script
- [x] 11.1 Implement seed script


  - Create script to generate admin user
  - Create sample products for testing
  - Add command to package.json
  - _Requirements: 3.1, 7.1_

- [ ] 12. Final integration and testing
- [x] 12.1 Test Docker setup


  - Verify docker-compose up starts all services
  - Test database connection from app container
  - Verify environment variables are loaded
  - _Requirements: 10.3, 10.4, 10.6_

- [x] 12.2 Test complete user flows

  - Test customer registration and login
  - Test product browsing and purchase
  - Test admin login and product management
  - Test financial reports display
  - Verify email invoice generation
  - _Requirements: All_

- [x] 12.3 Checkpoint - Ensure all tests pass


  - Run all property-based tests
  - Run all unit tests
  - Fix any failing tests
  - Verify all features work end-to-end
