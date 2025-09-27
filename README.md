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

### 1 Install dependencies
```bash
npm install

 2. Database setup

Create a PostgreSQL database (example: test_app)
Execute the schema (tables users, products, orders, order_items)

CREATE DATABASE test_app;

Run PostgreSQL and execute the schema:

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT DEFAULT 'user'
);

CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  price NUMERIC NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  user_email TEXT NOT NULL,
  total_price NUMERIC NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INT REFERENCES orders(id) ON DELETE CASCADE,
  product_id INT REFERENCES products(id) ON DELETE CASCADE,
  product_name TEXT NOT NULL,
  quantity INT NOT NULL,
  unit_price NUMERIC NOT NULL
);

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
