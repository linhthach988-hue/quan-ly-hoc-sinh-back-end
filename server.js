// server.js (Back-end: Node.js/Express, sử dụng PostgreSQL)
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors'); 

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// --- Cấu hình và Kết nối PostgreSQL ---

// Sử dụng biến môi trường cho URL kết nối PostgreSQL
// **LƯU Ý QUAN TRỌNG:** Khi deploy lên Render/Railway, họ sẽ cung cấp biến môi trường này.
// Để chạy thử Local, bạn có thể thay thế bằng chuỗi kết nối local của bạn:
// Ví dụ: 'postgresql://user:password@host:port/database_name'
const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:Linh2011%40@localhost:5432/studentdb'; 
//postgresql://student_admin:PxIKPgoXM2C1mDV7UG9ay0rftogpxrqL@dpg-d49men2dbo4c73aaqosg-a.oregon-postgres.render.com/studentdb_h01k
const pool = new Pool({
    connectionString: connectionString,
    // THÊM CẤU HÌNH SSL TẠI ĐÂY:
    ssl: {
        // Tùy chọn này cho phép kết nối ngay cả khi không có certificate (thường dùng trong môi trường dev/test)
        rejectUnauthorized: false 
    }
});

// Hàm khởi tạo Database
async function initializeDatabase() {
    try {
        const client = await pool.connect();
        console.log('Kết nối database PostgreSQL thành công!');
        
        // Cú pháp tạo bảng trong PostgreSQL. 
        // SERIAL PRIMARY KEY tương đương với INTEGER PRIMARY KEY AUTOINCREMENT
        await client.query(`
            CREATE TABLE IF NOT EXISTS students (
                id SERIAL PRIMARY KEY,
                name TEXT NOT NULL,
                class_name TEXT NOT NULL,
                age INTEGER
            )
        `);
        client.release();
    } catch (err) {
        console.error("Lỗi khi kết nối hoặc khởi tạo database:", err.message);
        // Thoát ứng dụng nếu kết nối CSDL thất bại
        process.exit(1); 
    }
}

// Khởi tạo Database khi server khởi động
initializeDatabase();

// --- API Endpoints ---

// 1. Lấy tất cả học sinh (GET /api/students)
app.get('/api/students', async (req, res) => {
    try {
        // Sử dụng pool.query trực tiếp để lấy tất cả rows
        const result = await pool.query("SELECT * FROM students ORDER BY class_name"); 
        
        res.json({
            "message": "success",
            "data": result.rows // Dữ liệu trả về nằm trong .rows
        });
    } catch (err) {
        res.status(500).json({"error": "Lỗi truy vấn: " + err.message});
    }
});

// 2. Thêm học sinh mới (POST /api/students)
app.post('/api/students', async (req, res) => {
    const { name, class_name, age } = req.body;
    
    if (!name || !class_name || !age) {
        return res.status(400).json({"error": "Thiếu trường thông tin!"});
    }
    
    try {
        // Cú pháp tham số hóa trong pg là $1, $2, $3 thay vì ?
        // RETURNING id giúp lấy id vừa được tạo ra (thay cho this.lastID của sqlite3)
        const result = await pool.query(
            'INSERT INTO students (name, class_name, age) VALUES ($1, $2, $3) RETURNING id', 
            [name, class_name, age]
        );

        const newId = result.rows[0].id;
        
        res.status(201).json({ // 201 Created là HTTP status code tốt hơn cho POST
            "message": "Thêm học sinh thành công",
            "data": { id: newId, name, class_name, age }
        });
    } catch (err) {
        res.status(500).json({"error": "Lỗi thêm dữ liệu: " + err.message});
    }
});

// Khởi động Server
app.listen(PORT, () => {
    console.log(`Server đang chạy tại http://localhost:${PORT}`);
});