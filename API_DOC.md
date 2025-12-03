<div align="center">

# 🚀 Simple Auth App
## API Documentation

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen.svg)
![License](https://img.shields.io/badge/license-MIT-orange.svg)

**Complete REST API documentation for authentication, products, and checkout system**

[🔐 Authentication](#-authentication) • [👤 User](#-user-endpoints) • [👑 Admin](#-admin-endpoints) • [🛍️ Products](#️-products) • [🛒 Checkout](#-orders--checkout)

</div>

---

## 📑 Table of Contents

<table>
<tr>
<td width="50%">

### Core Features
- [🔐 Authentication](#-authentication)
  - [Register User](#register-user)
  - [Login](#login)
- [👤 User Endpoints](#-user-endpoints)
  - [Get Profile](#get-profile)
  - [Get User Home](#get-user-home)

</td>
<td width="50%">

### Advanced Features
- [👑 Admin Endpoints](#-admin-endpoints)
- [🛍️ Products](#️-products)
- [🛒 Orders & Checkout](#-orders--checkout)
- [⚠️ Error Responses](#️-error-responses)

</td>
</tr>
</table>

---

<div align="center">

## 🔐 Authentication
**Secure user registration and login with JWT tokens**

</div>

### 📝 Register User
> Create a new user account with email and password

<table>
<tr>
<td> <b>Method</b> </td>
<td> <code>POST</code> </td>
</tr>
<tr>
<td> <b>Endpoint</b> </td>
<td> <code>/register</code> </td>
</tr>
<tr>
<td> <b>Auth Required</b> </td>
<td> ❌ No </td>
</tr>
</table>

**📥 Request Body:**
```json
{
  "email": "user@example.com",
  "password": "your_password",
  "role": "user"  // Optional: "user" (default) or "admin"
}
```

**📤 Response:** `201 Created`
```json
{
  "message": "User registered",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "role": "user"
  }
}
```

<details>
<summary>💡 <b>Tips & Notes</b></summary>

- Password is automatically hashed with bcrypt
- Default role is `user` if not specified
- Email must be unique in the system
- Minimum password length: 3 characters (recommended: 8+)

</details>

---

### 🔑 Login
> Authenticate user and receive JWT token

<table>
<tr>
<td> <b>Method</b> </td>
<td> <code>POST</code> </td>
</tr>
<tr>
<td> <b>Endpoint</b> </td>
<td> <code>/login</code> </td>
</tr>
<tr>
<td> <b>Auth Required</b> </td>
<td> ❌ No </td>
</tr>
</table>

**📥 Request Body:**
```json
{
  "email": "user@example.com",
  "password": "your_password"
}
```

**📤 Response:** `200 OK`
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "role": "user"
  }
}
```

<details>
<summary>💡 <b>Tips & Notes</b></summary>

- Token expires after 1 hour
- Store the token securely (localStorage/sessionStorage)
- Include token in `Authorization` header for protected routes
- Format: `Authorization: Bearer <token>`

</details>

---

<div align="center">

## 👤 User Endpoints
**Protected endpoints for authenticated users**

</div>

### 📊 Get Profile
> Retrieve authenticated user profile information

<table>
<tr>
<td> <b>Method</b> </td>
<td> <code>GET</code> </td>
</tr>
<tr>
<td> <b>Endpoint</b> </td>
<td> <code>/profile</code> </td>
</tr>
<tr>
<td> <b>Auth Required</b> </td>
<td> ✅ Yes (User/Admin) </td>
</tr>
</table>

**📋 Headers:**
```http
Authorization: Bearer <your_jwt_token>
```

**📤 Response:** `200 OK`
```json
{
  "message": "Welcome user@example.com",
  "role": "user"
}
```

---

### 🏠 Get User Home
> Access user home page dashboard

<table>
<tr>
<td> <b>Method</b> </td>
<td> <code>GET</code> </td>
</tr>
<tr>
<td> <b>Endpoint</b> </td>
<td> <code>/user</code> </td>
</tr>
<tr>
<td> <b>Auth Required</b> </td>
<td> ✅ Yes (User only) </td>
</tr>
</table>

**📋 Headers:**
```http
Authorization: Bearer <your_jwt_token>
```

**📤 Response:** `200 OK`
```json
{
  "message": "Welcome User user@example.com"
}
```

---

<div align="center">

## 👑 Admin Endpoints
**Protected endpoints for administrators only**

⚠️ **Requires `role: admin` in JWT token**

</div>

### 🎯 Get Admin Dashboard
> Access admin control panel

<table>
<tr>
<td> <b>Method</b> </td>
<td> <code>GET</code> </td>
</tr>
<tr>
<td> <b>Endpoint</b> </td>
<td> <code>/admin</code> </td>
</tr>
<tr>
<td> <b>Auth Required</b> </td>
<td> ✅ Yes (Admin only) </td>
</tr>
</table>

**📋 Headers:**
```http
Authorization: Bearer <admin_jwt_token>
```

**📤 Response:** `200 OK`
```json
{
  "message": "Hello Admin 👑"
}
```

---

<div align="center">

## 🛍️ Products
**Manage and view product catalog**

</div>

### 📦 Get All Products
> Retrieve complete product catalog

<table>
<tr>
<td> <b>Method</b> </td>
<td> <code>GET</code> </td>
</tr>
<tr>
<td> <b>Endpoint</b> </td>
<td> <code>/products</code> </td>
</tr>
<tr>
<td> <b>Auth Required</b> </td>
<td> ✅ Yes (User/Admin) </td>
</tr>
</table>

**📋 Headers:**
```http
Authorization: Bearer <your_jwt_token>
```

**📤 Response:** `200 OK`
```json
[
  {
    "id": 1,
    "name": "Product Name",
    "price": 29.99,
    "description": "Product description",
    "stock_quantity": 100,
    "created_at": "2025-11-03T10:00:00.000Z"
  }
]
```

<details>
<summary>💡 <b>Tips & Notes</b></summary>

- Products are sorted by creation date (newest first)
- Returns empty array if no products available
- Stock quantity shows available inventory

</details>

---

### ➕ Add Product
> Create a new product (Admin only)

<table>
<tr>
<td> <b>Method</b> </td>
<td> <code>POST</code> </td>
</tr>
<tr>
<td> <b>Endpoint</b> </td>
<td> <code>/products</code> </td>
</tr>
<tr>
<td> <b>Auth Required</b> </td>
<td> ✅ Yes (Admin only) </td>
</tr>
</table>

**📋 Headers:**
```http
Authorization: Bearer <admin_jwt_token>
```

**📥 Request Body:**
```json
{
  "name": "New Product",
  "price": 49.99
}
```

**📤 Response:** `201 Created`
```json
{
  "id": 2,
  "name": "New Product",
  "price": 49.99,
  "created_at": "2025-11-03T10:00:00.000Z"
}
```

<details>
<summary>💡 <b>Tips & Notes</b></summary>

- Only admins can create products
- Price must be a positive number
- Product name is required
- Description and stock_quantity are optional

</details>

---

<div align="center">

## 🛒 Orders & Checkout
**Complete order processing and checkout system**

</div>

### ⚡ Place Quick Order (Legacy)
> Create order directly without full checkout process

<table>
<tr>
<td> <b>Method</b> </td>
<td> <code>POST</code> </td>
</tr>
<tr>
<td> <b>Endpoint</b> </td>
<td> <code>/orders</code> </td>
</tr>
<tr>
<td> <b>Auth Required</b> </td>
<td> ✅ Yes (User/Admin) </td>
</tr>
</table>

**📋 Headers:**
```http
Authorization: Bearer <your_jwt_token>
```

**📥 Request Body:**
```json
{
  "items": [
    {
      "product_id": 1,
      "product_name": "Product Name",
      "quantity": 2,
      "unit_price": 29.99
    }
  ]
}
```

**📤 Response:** `201 Created`
```json
{
  "message": "✅ Order created",
  "orderId": 1,
  "total_price": 59.98
}
```

<details>
<summary>⚠️ <b>Legacy Endpoint Notice</b></summary>

This is a simplified order endpoint for quick purchases. For full checkout with billing and shipping information, use the `/checkout` endpoint instead.

</details>

---

### 💳 Complete Checkout
> Process full checkout with billing and shipping information

<table>
<tr>
<td> <b>Method</b> </td>
<td> <code>POST</code> </td>
</tr>
<tr>
<td> <b>Endpoint</b> </td>
<td> <code>/checkout</code> </td>
</tr>
<tr>
<td> <b>Auth Required</b> </td>
<td> ✅ Yes (User/Admin) </td>
</tr>
</table>

**📋 Headers:**
```http
Authorization: Bearer <your_jwt_token>
```

**📥 Request Body:**
```json
{
  "items": [
    {
      "product_id": 1,
      "product_name": "Product Name",
      "quantity": 2,
      "unit_price": 29.99
    }
  ],
  "billing_info": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "address": "123 Main Street",
    "city": "New York",
    "postal_code": "10001",
    "country": "USA"
  },
  "shipping_info": {
    "name": "John Doe",
    "address": "123 Main Street",
    "city": "New York",
    "postal_code": "10001",
    "country": "USA"
  },
  "payment_method": "credit_card",
  "total_amount": 71.48
}
```

**Response:** `201 Created`
```json
{
  "message": "✅ Order placed successfully",
  "orderId": 1,
  "total_price": 71.48,
  "order_details": {
    "subtotal": 59.98,
    "shipping": 5.00,
    "tax": 5.998,
    "total": 71.48
  }
}
```

<details>
<summary>💡 <b>Checkout Details & Pricing</b></summary>

**💰 Pricing Calculation:**
- **Subtotal:** Sum of all items (quantity × unit_price)
- **Shipping:** $5.00 (FREE on orders over $100)
- **Tax:** 10% of subtotal
- **Total:** Subtotal + Shipping + Tax

**💳 Accepted Payment Methods:**
- `credit_card` - Credit/Debit Cards
- `paypal` - PayPal
- `cash_on_delivery` - Pay on Delivery

**📦 Shipping Notes:**
- Same address checkbox available for billing/shipping
- All fields are required for successful checkout
- Order status set to `pending` by default

</details>

---

### 📋 Get My Orders
> Retrieve all orders for authenticated user

<table>
<tr>
<td> <b>Method</b> </td>
<td> <code>GET</code> </td>
</tr>
<tr>
<td> <b>Endpoint</b> </td>
<td> <code>/my-orders</code> </td>
</tr>
<tr>
<td> <b>Auth Required</b> </td>
<td> ✅ Yes (User/Admin) </td>
</tr>
</table>

**📋 Headers:**
```http
Authorization: Bearer <your_jwt_token>
```

**📤 Response:** `200 OK`
```json
[
  {
    "id": 1,
    "user_id": 1,
    "user_email": "user@example.com",
    "total_price": 71.48,
    "status": "pending",
    "payment_method": "credit_card",
    "items_count": 2,
    "products": "Product Name, Another Product",
    "created_at": "2025-11-03T10:00:00.000Z"
  }
]
```

<details>
<summary>💡 <b>Tips & Notes</b></summary>

- Orders are sorted by creation date (newest first)
- Returns all orders for the authenticated user
- Includes item count and product list summary
- Use `/orders/:orderId` for detailed order information

</details>

---

### 🔍 Get Order Details
> Retrieve specific order with complete information

<table>
<tr>
<td> <b>Method</b> </td>
<td> <code>GET</code> </td>
</tr>
<tr>
<td> <b>Endpoint</b> </td>
<td> <code>/orders/:orderId</code> </td>
</tr>
<tr>
<td> <b>Auth Required</b> </td>
<td> ✅ Yes (User/Admin) </td>
</tr>
</table>

**📋 Headers:**
```http
Authorization: Bearer <your_jwt_token>
```

**🔢 Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `orderId` | integer | Unique order identifier |

**📤 Response:** `200 OK`
```json
{
  "id": 1,
  "user_id": 1,
  "user_email": "user@example.com",
  "total_price": 71.48,
  "status": "pending",
  "billing_name": "John Doe",
  "billing_email": "john@example.com",
  "billing_phone": "+1234567890",
  "billing_address": "123 Main Street",
  "billing_city": "New York",
  "billing_postal_code": "10001",
  "billing_country": "USA",
  "payment_method": "credit_card",
  "payment_status": "pending",
  "created_at": "2025-11-03T10:00:00.000Z",
  "items": [
    {
      "id": 1,
      "order_id": 1,
      "product_id": 1,
      "product_name": "Product Name",
      "quantity": 2,
      "unit_price": 29.99,
      "total_price": 59.98
    }
  ]
}
```

<details>
<summary>💡 <b>Tips & Notes</b></summary>

- Only users can view their own orders
- Returns 404 if order doesn't exist or doesn't belong to user
- Includes complete billing, shipping, and payment information
- Items array contains all products in the order

</details>

---

<div align="center">

## ⚠️ Error Responses
**Standard error response formats**

</div>

All API endpoints may return the following error responses:

<table>
<tr>
<th>Status Code</th>
<th>Error Type</th>
<th>Example Response</th>
</tr>
<tr>
<td><code>400</code></td>
<td>Bad Request</td>
<td>

```json
{ "error": "Invalid credentials" }
```

</td>
</tr>
<tr>
<td><code>401</code></td>
<td>Unauthorized</td>
<td>

```json
{ "error": "No token provided" }
```

</td>
</tr>
<tr>
<td><code>403</code></td>
<td>Forbidden</td>
<td>

```json
{ "error": "Access denied" }
```

</td>
</tr>
<tr>
<td><code>404</code></td>
<td>Not Found</td>
<td>

```json
{ "error": "Order not found" }
```

</td>
</tr>
<tr>
<td><code>500</code></td>
<td>Server Error</td>
<td>

```json
{ "error": "Server error" }
```

</td>
</tr>
</table>

---

<div align="center">

## 📝 Important Notes

</div>

<table>
<tr>
<td width="50%">

### 🔐 Security
- 🔑 JWT token required for all protected routes
- 👑 Admin role required for admin endpoints
- 🔒 Passwords hashed with bcrypt (10 salt rounds)
- ⏰ Tokens expire after 1 hour
- �️ CORS enabled for all origins

</td>
<td width="50%">

### 💼 Business Rules
- 💵 All prices in USD
- 📦 Free shipping over $100
- 💰 Tax rate: 10% of subtotal
- � Email must be unique
- 🔢 Minimum order: 1 item

</td>
</tr>
</table>

---

<div align="center">

## 🛠️ Technical Details

</div>

<table>
<tr>
<td width="33%">

### 🌐 Server
**Base URL**
```
http://localhost:5000
```

**Port**
```
5000 (default)
```

</td>
<td width="33%">

### 💻 Stack
- Node.js v14+
- Express.js v5
- PostgreSQL
- JWT (jsonwebtoken)
- bcrypt v6

</td>
<td width="33%">

### 📦 Dependencies
- `express`
- `pg`
- `jsonwebtoken`
- `bcrypt`
- `cors`
- `dotenv`

</td>
</tr>
</table>

---

<div align="center">

## 📚 Additional Resources

</div>

<table align="center">
<tr>
<td align="center" width="25%">

### 📖 Documentation
Source code in<br/>
`server.js`

</td>
<td align="center" width="25%">

### 🗄️ Database
PostgreSQL<br/>
Schema & Migrations

</td>
<td align="center" width="25%">

### 🎨 Frontend
HTML + Tailwind CSS<br/>
Vanilla JavaScript

</td>
<td align="center" width="25%">

### 🔧 Configuration
Environment variables<br/>
`.env` file

</td>
</tr>
</table>

---

<div align="center">

## 🎯 Quick Start Guide

</div>

```bash
# 1️⃣ Install Dependencies
npm install

# 2️⃣ Setup Environment Variables
cp .env.example .env

# 3️⃣ Start Backend Server
npm run backend

# 4️⃣ Start Frontend (separate terminal)
npm run frontend

# 5️⃣ Access Application
# Backend: http://localhost:5000
# Frontend: http://localhost:3000
```

---

<div align="center">

### 🌟 Features Highlights

![Authentication](https://img.shields.io/badge/✓-JWT_Authentication-success)
![Authorization](https://img.shields.io/badge/✓-Role_Based_Access-success)
![Products](https://img.shields.io/badge/✓-Product_Management-success)
![Checkout](https://img.shields.io/badge/✓-Complete_Checkout-success)
![Orders](https://img.shields.io/badge/✓-Order_Tracking-success)

---

**Made with ❤️ by Simple Auth App Team**

*Last Updated: November 3, 2025*

---

</div>
