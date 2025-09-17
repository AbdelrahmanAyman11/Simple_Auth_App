// ===== server.js =====
const express = require("express");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const path = require("path");
const authorize = require("./helpers/authorize");
const authenticate = require("./helpers/authenticate");
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// خلي الباك يوزّع الملفات بتاعة الفرونت
app.use(express.static(path.join(__dirname, "frontend")));



const users = []; 

const generateToken = (user) => {
    return jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );

};


app.post("/register", async (req, res) => {
    try {
        const { email, password, role } = req.body;

        const hashed = await bcrypt.hash(password, 10);
        const newUser = {
            id: Date.now(),
            email,
            password: hashed,
            role: role || "user",
        };

        users.push(newUser);
        res.status(201).json({ message: "User registered" });
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
});

app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required" });
        }

        const user = users.find((u) => u.email === email);
        if (!user) return res.status(401).json({ error: "Invalid credentials" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

        const token = generateToken(user);

        // ✅ رجع معاه الايميل والـ role
        res.json({ token, role: user.role, email: user.email });
    } catch (err) {
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
// أي روت مش مفهوم → رجّع index.html
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "index.html"));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
