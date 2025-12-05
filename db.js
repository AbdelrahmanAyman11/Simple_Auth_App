// db.js
const { Pool } = require("pg");
require("dotenv").config()
const pool = new Pool({
  connectionString: process.env.DB_URL,
  ssl: {
    rejectUnauthorized : false
  }

});
pool.on("error", (error)=> {
  console.log(error)
})
pool.on("connect", (connect)=> {
  console.log("Connected Succssesfully")
})
module.exports = pool;
