const jwt = require("jsonwebtoken");
const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: "No token" });

    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("DECODED:", decoded);
        req.user = decoded;
        next();
    } catch (err) {
        console.error("JWT ERROR:", err.message);
        res.status(403).json({ error: "Invalid or expired token" });
    }

};
module.exports = authenticate;// ================== Middleware ==================
