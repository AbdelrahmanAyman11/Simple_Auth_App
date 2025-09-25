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
    console.error(err);
    res.status(500).json({ error: "Server error" });
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

app.use((req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "index.html"));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
