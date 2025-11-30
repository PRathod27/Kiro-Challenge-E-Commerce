# EcomStore - Minimal Ecommerce Platform

A lightweight ecommerce platform built with Node.js, Express, MongoDB, and Docker.

## Features

- 🛍️ Product browsing and one-click purchasing
- 👤 Customer authentication (register/login)
- 🔐 Admin authentication and dashboard
- 📄 Invoice viewing directly on website
- 📊 Monthly profit/loss financial reports with visualizations
- 📈 Interactive charts (Bar, Pie, Doughnut)
- 📱 Fully responsive design
- 🐳 Docker containerization

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: Express-session with connect-mongo
- **Template Engine**: EJS
- **Charts**: Chart.js for data visualization
- **Containerization**: Docker & Docker Compose

## Quick Start

### Prerequisites

- Docker and Docker Compose installed

### Installation

1. **Clone or navigate to the project directory**

2. **Environment is pre-configured**
   ```bash
   # The .env file is already created with default values
   # No additional configuration needed!
   ```

3. **Start the application with Docker**
   ```bash
   docker-compose up --build
   ```

4. **Seed the database** (in a new terminal)
   ```bash
   docker-compose exec app npm run seed
   ```

5. **Access the application**
   - Open browser: http://localhost:3000
   - Admin login: admin@ecommerce.com / admin123

## Usage

### Customer Flow
1. Register a new account or login
2. Browse products on the home page
3. Click "Buy Now" to purchase (no checkout process)
4. View invoices in "My Orders" section

### Admin Flow
1. Login with admin credentials
2. **Orders Dashboard**: View all customer orders
3. **Products**: Add, edit, or delete products
4. **Reports**: View monthly profit/loss statements with interactive charts

## Project Structure

```
ecommerce-platform/
├── src/
│   ├── models/          # Mongoose schemas
│   ├── controllers/     # Request handlers
│   ├── routes/          # Express routes
│   ├── middleware/      # Auth middleware
│   ├── services/        # Email & financial services
│   ├── config/          # Database config
│   └── utils/           # Seed script
├── views/               # EJS templates
├── public/              # Static assets (CSS)
├── Dockerfile
├── docker-compose.yml
└── server.js
```

## API Endpoints

### Authentication
- `GET /register` - Registration page
- `POST /register` - Create account
- `GET /login` - Login page
- `POST /login` - Authenticate user
- `GET /logout` - Logout user

### Products
- `GET /` - Home page with products
- `POST /products` - Create product (admin)
- `PUT /products/:id` - Update product (admin)
- `DELETE /products/:id` - Delete product (admin)

### Orders
- `POST /orders` - Create order (authenticated)
- `GET /my-orders` - User's orders page (authenticated)
- `GET /invoice/:id` - View invoice (authenticated)

### Admin
- `GET /admin/dashboard` - Orders dashboard
- `GET /admin/products` - Product management
- `GET /admin/reports` - Financial reports

## Visualizations

The admin reports page includes interactive charts powered by Chart.js:

- **Bar Chart**: Revenue vs Cost vs Profit comparison
- **Pie Chart**: Financial breakdown showing profit and cost distribution
- **Doughnut Chart**: Profit margin percentage visualization

All charts are responsive and interactive with hover tooltips.

## Docker Commands

```bash
# Start services
docker-compose up

# Start in background
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# Rebuild containers
docker-compose up --build

# Run seed script
docker-compose exec app npm run seed
```

## Development

To run without Docker:

1. Install Node.js and MongoDB locally
2. Update `MONGODB_URI` in `.env` to `mongodb://localhost:27017/ecommerce`
3. Install dependencies: `npm install`
4. Run seed script: `npm run seed`
5. Start server: `npm start`

## Default Credentials

**Admin Account:**
- Email: admin@ecommerce.com
- Password: admin123

## License

ISC
