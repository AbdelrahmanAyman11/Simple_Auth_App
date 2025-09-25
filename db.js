// db.js
const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",       // اسم المستخدم بتاع PostgreSQL
  host: "localhost",      // أو IP السيرفر
  database: "test_app",  // اسم الداتابيز
  password: "123",
  port: 5432,
});

module.exports = pool;
