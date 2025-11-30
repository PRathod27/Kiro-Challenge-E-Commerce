# Requirements Document

## Introduction

This document specifies the requirements for a minimal ecommerce platform that enables customers to browse and purchase products, with automated invoice generation and administrative profit/loss reporting. The system provides authentication, order management, email notifications, and financial reporting capabilities.

## Glossary

- **Customer**: A user who browses and purchases products from the platform
- **Admin**: A user with administrative privileges who manages products and views financial reports
- **Order**: A record of a product purchase transaction including customer and product details
- **Invoice**: A document generated after purchase containing order details sent to the customer
- **Financial Report**: A monthly summary showing profit and loss statements for the admin
- **Authentication System**: The component that handles user registration, login, and session management
- **Email Service**: The component that sends invoice emails to customers
- **Product Catalog**: The collection of products available for purchase
- **Platform**: The complete ecommerce web application system

## Requirements

### Requirement 1

**User Story:** As a customer, I want to view available products on the home page, so that I can browse and select items to purchase.

#### Acceptance Criteria

1. WHEN a customer visits the home page THEN the Platform SHALL display all available products with images, names, prices, and descriptions
2. WHEN products are displayed THEN the Platform SHALL render them in a responsive grid layout that adapts to different screen sizes
3. WHEN a customer clicks on a product THEN the Platform SHALL display detailed product information
4. THE Platform SHALL load the home page within 2 seconds under normal network conditions
5. WHEN no products exist THEN the Platform SHALL display a message indicating the catalog is empty

### Requirement 2

**User Story:** As a customer, I want to register and authenticate with the platform, so that I can make purchases and receive invoices.

#### Acceptance Criteria

1. WHEN a customer provides valid registration details (name, email, password) THEN the Authentication System SHALL create a new customer account
2. WHEN a customer provides an email that already exists THEN the Authentication System SHALL reject the registration and display an error message
3. WHEN a customer provides valid login credentials THEN the Authentication System SHALL authenticate the user and create a session
4. WHEN a customer provides invalid login credentials THEN the Authentication System SHALL reject the login attempt and display an error message
5. WHEN a customer session is active THEN the Platform SHALL display the customer's name in the navigation bar

### Requirement 3

**User Story:** As an admin, I want to authenticate with administrative privileges, so that I can manage products and view financial reports.

#### Acceptance Criteria

1. WHEN an admin provides valid admin credentials THEN the Authentication System SHALL authenticate the user with admin role privileges
2. WHEN an authenticated admin accesses the admin dashboard THEN the Platform SHALL display product management and financial reporting interfaces
3. WHEN a non-admin user attempts to access admin routes THEN the Platform SHALL deny access and redirect to the home page
4. THE Authentication System SHALL maintain separate role-based permissions for customers and admins

### Requirement 4

**User Story:** As a customer, I want to purchase a product with a single click, so that I can quickly complete my transaction without a checkout process.

#### Acceptance Criteria

1. WHEN an authenticated customer clicks the buy button on a product THEN the Platform SHALL create an order record containing customer details, product details, purchase timestamp, and price
2. WHEN an unauthenticated user clicks the buy button THEN the Platform SHALL redirect to the login page
3. WHEN an order is created THEN the Platform SHALL store the order in the database immediately
4. WHEN an order is successfully created THEN the Platform SHALL display a confirmation message to the customer
5. WHEN an order creation fails THEN the Platform SHALL display an error message and maintain the current page state

### Requirement 5

**User Story:** As a customer, I want to receive an invoice via email after purchase, so that I have a record of my transaction.

#### Acceptance Criteria

1. WHEN an order is successfully created THEN the Email Service SHALL generate an invoice containing order ID, customer name, product name, price, purchase date, and total amount
2. WHEN an invoice is generated THEN the Email Service SHALL send the invoice to the customer's registered email address within 30 seconds
3. WHEN the email sending fails THEN the Platform SHALL log the error and retry sending once
4. THE Email Service SHALL format invoices in a clear, readable HTML format
5. WHEN an invoice email is sent THEN the Platform SHALL record the email delivery status in the order record

### Requirement 6

**User Story:** As an admin, I want to view all order data in real-time, so that I can monitor sales and customer activity.

#### Acceptance Criteria

1. WHEN an admin accesses the orders dashboard THEN the Platform SHALL display all orders with customer name, email, product name, price, and purchase timestamp
2. WHEN a new order is created THEN the Platform SHALL make the order visible in the admin dashboard immediately
3. WHEN displaying orders THEN the Platform SHALL sort them by most recent first
4. THE Platform SHALL display orders in a responsive table format that works on all screen sizes
5. WHEN no orders exist THEN the Platform SHALL display a message indicating no orders have been placed

### Requirement 7

**User Story:** As an admin, I want to add, edit, and delete products, so that I can manage the product catalog and make products available to customers.

#### Acceptance Criteria

1. WHEN an admin submits a new product with name, description, price, cost, and image URL THEN the Platform SHALL create the product and add it to the Product Catalog
2. WHEN a new product is added by admin THEN the Platform SHALL display the product on the customer home page immediately
3. WHEN an admin edits a product THEN the Platform SHALL update the product details in the database and reflect changes on the home page immediately
4. WHEN an admin deletes a product THEN the Platform SHALL remove the product from the Product Catalog and the customer home page
5. WHEN product data is invalid (negative price, empty name) THEN the Platform SHALL reject the operation and display validation errors
6. THE Platform SHALL persist all product changes to the database immediately

### Requirement 8

**User Story:** As an admin, I want to view monthly profit and loss statements, so that I can understand the financial performance of my business.

#### Acceptance Criteria

1. WHEN an admin accesses the financial reports page THEN the Platform SHALL calculate and display total revenue for the current month
2. WHEN calculating profit THEN the Platform SHALL compute profit as the difference between product selling price and product cost for all orders
3. WHEN displaying financial reports THEN the Platform SHALL show total revenue, total cost, total profit, and profit margin percentage for the current month
4. WHEN no orders exist for the current month THEN the Platform SHALL display zero values for all financial metrics
5. THE Platform SHALL update financial calculations in real-time as new orders are placed

### Requirement 9

**User Story:** As a user, I want the website to be visually appealing and responsive, so that I have a pleasant experience on any device.

#### Acceptance Criteria

1. THE Platform SHALL apply consistent styling using CSS across all pages
2. WHEN viewed on mobile devices (width less than 768px) THEN the Platform SHALL adapt the layout to single-column format
3. WHEN viewed on tablet devices (width between 768px and 1024px) THEN the Platform SHALL adapt the layout to two-column format where appropriate
4. WHEN viewed on desktop devices (width greater than 1024px) THEN the Platform SHALL display the full multi-column layout
5. THE Platform SHALL use a cohesive color scheme, typography, and spacing throughout the interface

### Requirement 10

**User Story:** As a developer, I want the application to use modern technologies and best practices, so that the system is maintainable and scalable.

#### Acceptance Criteria

1. THE Platform SHALL be built using Node.js and Express.js for the backend server
2. THE Platform SHALL use MongoDB as the database for storing users, products, and orders
3. THE Platform SHALL be containerized using Docker and Docker Compose for easy deployment
4. WHEN a developer runs docker-compose up THEN the Platform SHALL start both the application and database containers
5. THE Platform SHALL implement proper error handling for all database operations and API endpoints
6. THE Platform SHALL use environment variables for configuration (database connection, email credentials, port)
7. THE Platform SHALL structure the codebase with clear separation between routes, controllers, models, and views
