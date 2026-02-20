const { Pool } = require("pg");

const def = "postgresql://linh2:123123@localhost:5432/studentdb";
const connectionString = process.env.DATABASE_URL || def;

const pool = new Pool({
  connectionString,
  ssl: connectionString.includes("localhost")
    ? false
    : { rejectUnauthorized: false },
});

pool
  .connect()
  .then(() => console.log("✅ Kết nối PostgreSQL thành công!"))
  .catch((err) => console.error("❌ Lỗi kết nối DB:", err.message));

module.exports = pool;
