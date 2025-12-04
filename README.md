#  Smart Devices Ordering System

A simple ordering system built with **Node.js + Express + PostgreSQL + Vanilla JS (Frontend)**.  
The project provides user authentication, product management, and order creation linked to users.  

## 🚀 Requirements
Before running the project, make sure you have installed:

- [Node.js](https://nodejs.org/) (v18+ recommended)  
- [PostgreSQL](https://www.postgresql.org/) (v14+ recommended)  
- Git  


---

## 📂 Features
- 👤 **Authentication & Authorization**  
  - User registration (User / Admin roles)  
  - Login with JWT  
  - Role-based access (Users can place orders, Admins can add products)  

- 📦 **Products**  
  - Add new products (Admin only)  
  - List available products (User only)  

- 🛒 **Orders**  
  - Users can place orders with multiple products  
  - Orders are linked to users  
  - Automatic **total price** calculation  
  - Each order stores product name, quantity, and unit price  

---

## 🛠 Tech Stack
- **Backend**: Node.js + Express  
- **Database**: PostgreSQL  
- **Frontend**: HTML + TailwindCSS + Fetch API  
- **Authentication**: JWT + bcrypt  

---

## ⚙️ Setup

###  Install dependencies
```bash
 1. open terminal then write -> npm install

 2. Database setup

Create a PostgreSQL database (example: test_app)
Execute the schema (tables users, products, orders, order_items)

CREATE DATABASE test_app;

Run PostgreSQL and execute the schema:

-- 1. Users table 
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
 
-- 2. Products table 
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    description TEXT,
    stock_quantity INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
 
-- 3. Enhanced Orders table 
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    user_email VARCHAR(255),
    total_price DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    -- Billing Information
    billing_name VARCHAR(255),
    billing_email VARCHAR(255),
    billing_phone VARCHAR(20),
    billing_address TEXT,
    billing_city VARCHAR(100),
    billing_postal_code VARCHAR(20),
    billing_country VARCHAR(100),
    -- Shipping Information (if different from billing)
    shipping_name VARCHAR(255),
    shipping_address TEXT,
    shipping_city VARCHAR(100),
    shipping_postal_code VARCHAR(20),
    shipping_country VARCHAR(100),
    -- Payment Information
    payment_method VARCHAR(50),
    payment_status VARCHAR(50) DEFAULT 'pending',
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
 
-- 4. Enhanced Order Items table 
CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id),
    product_name VARCHAR(255),
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    total_price DECIMAL(10, 2) GENERATED ALWAYS AS (quantity * unit_price) STORED,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
 
-- 5. Shopping Cart table (for persistent cart storage)
CREATE TABLE IF NOT EXISTS cart_items (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, product_id)
);
 
-- 6. Order Status History table (optional - for tracking order status changes)
CREATE TABLE IF NOT EXISTS order_status_history (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
 
-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_user_id ON cart_items(user_id);

------------------------------------------
3. Environment variables

Copy .env.example to .env :
Command -> cp .env.example .env
Edit .env with your database credentials
------------------------------------------
4. Notes :
db.js is configured to read credentials from .env.
Never commit your real .env file. 

###
