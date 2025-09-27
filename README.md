#  Smart Devices Ordering System

A simple ordering system built with **Node.js + Express + PostgreSQL + Vanilla JS (Frontend)**.  
The project provides user authentication, product management, and order creation linked to users.  

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

### **2 Database setup**

Create a PostgreSQL database (example: test_app)

Import the schema (tables users, products, orders, order_items)

CREATE DATABASE test_app;

###
