// ===== server.js =====
const express = require("express");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const path = require("path");
const pool = require("./db");
const authorize = require("./helpers/authorize");
const authenticate = require("./helpers/authenticate");
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// خلي الباك يوزّع الملفات بتاعة الفرونت
app.use(express.static(path.join(__dirname, "frontend")));

// ✅ Test database connection
app.get("/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({ success: true, message: "Database connected!", time: result.rows[0] });
  } catch (err) {
    console.error("❌ Database test error:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ✅ Register with Postgres
app.post("/register", async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // 1. Hash password
    const hashed = await bcrypt.hash(password, 10);

    // 2. Insert into Postgres
    const result = await pool.query(
      "INSERT INTO users (email, password, role) VALUES ($1, $2, $3) RETURNING id, email, role",
      [email, hashed, role || "user"]
    );

    res.status(201).json({
      message: "User registered",
      user: result.rows[0],
    });
  } catch (err) {
    console.error("❌ Register error:", err.message);
    console.error("Full error:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const user = result.rows[0];


    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error("❌ Login error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});


app.get("/profile", authenticate, authorize("user", "admin"), (req, res) => {
  res.json({ message: `Welcome ${req.user.email}`, role: req.user.role });
});

app.get("/admin", authenticate, authorize("admin"), (req, res) => {
  res.json({ message: "Hello Admin 👑" });
});

app.get("/user", authenticate, authorize("user"), (req, res) => {
  res.json({ message: `Welcome User ${req.user.email}` });
});


// ✅ Get all products (للـ user بس)
app.get("/products", authenticate, authorize("user"), async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM products ORDER BY created_at DESC");
    res.json(result.rows);
  } catch (err) {
    console.error("❌ Products error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Add new product (لو عايز الادمن يضيف)
app.post("/products", authenticate, authorize("admin"), async (req, res) => {
  try {
    const { name, price } = req.body;
    const result = await pool.query(
      "INSERT INTO products (name, price) VALUES ($1, $2) RETURNING *",
      [name, price]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("❌ Add product error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});
// app.post("/orders", authenticate, async (req, res) => {
//   const client = await pool.connect();
//   try {
//     const { items } = req.body; 
//     // items = [{ product_id: 1, quantity: 2, price: 50 }, {...}]
//     const userId = req.user.id;
//     const user_email = req.user.email;
//     const total_price = items.reduce((sum, item) => sum + (item.unit_price * item.quantity), 0);

//     await client.query("BEGIN");

//     // 1. إنشاء order
//     const orderRes = await client.query(
//       "INSERT INTO orders (user_id, user_email, total_price) VALUES ($1, $2 ,$3) RETURNING id",
//       [userId, user_email, total_price]
//     );
//     const orderId = orderRes.rows[0].id;

//     // 2. إدخال المنتجات في order_items
//     for (const item of items) {
//       await client.query(
//         "INSERT INTO order_items (order_id, product_id, quantity, unit_price, product_name) VALUES ($1, $2, $3, $4, $5)",
//         [orderId, item.product_id, item.quantity, item.unit_price , item.product_name]
//       );
//     }

//     await client.query("COMMIT");
//     res.status(201).json({ message: "✅ Order created", orderId, total_price });

//   } catch (err) {
//     await client.query("ROLLBACK");
//     console.error("❌ Order error:", err.message);
//     res.status(500).json({ error: "Server error" });
//   } finally {
//     client.release();
//   }
// });

// ✅ Enhanced Checkout Route with full billing/shipping info
app.post("/checkout", authenticate, async (req, res) => {
  const client = await pool.connect();
  try {
    const { items, billing_info, shipping_info, payment_method, total_amount } = req.body;
    const userId = req.user.id;
    const user_email = req.user.email;

    // TODO: Add input validation here - students should fix this
    // No check if items exists or is array
    // No validation of billing_info fields
    // No sanitization of user inputs

    const calculated_total = items.reduce((sum, item) => sum + (item.unit_price * item.quantity), 0);
    const shipping_cost = calculated_total > 100 ? 0 : 5; // Magic number - should be configurable
    const tax = calculated_total * 0.1; // Hardcoded tax rate - should be in database
    const final_total = calculated_total + shipping_cost + tax;

    await client.query("BEGIN");

    // 1. Create order with full details
    const orderRes = await client.query(`
      INSERT INTO orders (
        user_id, user_email, total_price, status,
        billing_name, billing_email, billing_phone, billing_address, 
        billing_city, billing_postal_code, billing_country,
        shipping_name, shipping_address, shipping_city, 
        shipping_postal_code, shipping_country,
        payment_method, payment_status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18) 
      RETURNING id
    `, [
      userId, user_email, final_total, 'pending',
      billing_info.name, billing_info.email, billing_info.phone, 
      billing_info.address, billing_info.city, billing_info.postal_code, billing_info.country,
      shipping_info.name || billing_info.name, 
      shipping_info.address || billing_info.address,
      shipping_info.city || billing_info.city,
      shipping_info.postal_code || billing_info.postal_code,
      shipping_info.country || billing_info.country,
      payment_method, 'pending'
    ]);

    const orderId = orderRes.rows[0].id;

    // 2. Insert order items - No inventory check (students should add this)
    for (const item of items) {
      await client.query(
        "INSERT INTO order_items (order_id, product_id, quantity, unit_price, product_name) VALUES ($1, $2, $3, $4, $5)",
        [orderId, item.product_id, item.quantity, item.unit_price, item.product_name]
      );
    }

    // 3. Insert order status history
    await client.query(
      "INSERT INTO order_status_history (order_id, status, notes) VALUES ($1, $2, $3)",
      [orderId, 'pending', 'Order placed successfully']
    );

    await client.query("COMMIT");

    res.status(201).json({ 
      message: "✅ Order placed successfully", 
      orderId, 
      total_price: final_total,
      order_details: {
        subtotal: calculated_total,
        shipping: shipping_cost,
        tax: tax,
        total: final_total
      }
    });

  } catch (err) {
    await client.query("ROLLBACK");
    console.error("❌ Checkout error:", err.message);
    res.status(500).json({ error: "Server error during checkout" }); // Poor error message for user
  } finally {
    client.release();
  }
});

// ✅ Get user's orders
app.get("/my-orders", authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    const ordersResult = await pool.query(`
      SELECT o.*, 
        COUNT(oi.id) as items_count,
        STRING_AGG(oi.product_name, ', ') as products
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      WHERE o.user_id = $1
      GROUP BY o.id
      ORDER BY o.created_at DESC
    `, [userId]);

    res.json(ordersResult.rows);
  } catch (err) {
    console.error("❌ Get orders error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Get specific order details
app.get("/orders/:orderId", authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    const orderId = req.params.orderId;

    // Get order details
    const orderResult = await pool.query(
      "SELECT * FROM orders WHERE id = $1 AND user_id = $2",
      [orderId, userId]
    );

    if (orderResult.rows.length === 0) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Get order items
    const itemsResult = await pool.query(
      "SELECT * FROM order_items WHERE order_id = $1",
      [orderId]
    );

    const order = orderResult.rows[0];
    order.items = itemsResult.rows;

    res.json(order);
  } catch (err) {
    console.error("❌ Get order details error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

app.use((req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "index.html"));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
