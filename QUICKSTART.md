# Quick Start Guide

## Get Started in 3 Steps

### Step 1: Start the Application
```bash
docker-compose up --build
```

Wait for the message: "MongoDB Connected" and "Server running on port 3000"

### Step 2: Seed the Database
Open a new terminal and run:
```bash
docker-compose exec app npm run seed
```

This creates:
- Admin user (admin@ecommerce.com / admin123)
- 6 sample products

### Step 3: Open the Application
Open your browser and go to: **http://localhost:3000**

## What You Can Do

### As a Customer:
1. Click "Register" to create an account
2. Browse products on the home page
3. Click "Buy Now" to purchase instantly
4. View your invoices in "My Orders"

### As an Admin:
1. Click "Login" and use: admin@ecommerce.com / admin123
2. **Orders** - See all customer purchases
3. **Products** - Add, edit, or delete products
4. **Reports** - View monthly profit/loss with interactive charts

## Troubleshooting

**Port 3000 already in use?**
```bash
# Stop the containers
docker-compose down

# Change PORT in .env file to 3001 or another port
# Then restart
docker-compose up
```

**Can't connect to MongoDB?**
```bash
# Make sure Docker is running
# Restart containers
docker-compose down
docker-compose up --build
```

**Want to see the visualizations?**
1. Login as admin
2. Go to Reports page
3. You'll see interactive charts showing financial data
4. Hover over charts for detailed information

## Stop the Application
```bash
docker-compose down
```

## Need Help?
Check the full README.md for detailed documentation.
