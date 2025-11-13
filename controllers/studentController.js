exports.list = async function (req, res) {
  const pool = req.pool;
  try {
    const result = await pool.query(
      `SELECT * FROM students ORDER BY class_name`
    );

    res.json({
      message: "success",
      data: result.rows, // Dữ liệu trả về nằm trong .rows
    });
  } catch (err) {
    res.status(500).json({ error: "Lỗi truy vấn: " + err.message });
  }
};
exports.insert = async function (req, res) {
  const pool = req.pool;
  const { name, class_name, age } = req.body;

  if (!name || !class_name || !age) {
    return res.status(400).json({ error: "Thiếu trường thông tin!" });
  }

  try {
    // Cú pháp tham số hóa trong pg là $1, $2, $3 thay vì ?
    // RETURNING id giúp lấy id vừa được tạo ra (thay cho this.lastID của sqlite3)
    const result = await pool.query(
      "INSERT INTO students (name, class_name, age) VALUES ($1, $2, $3) RETURNING id",
      [name, class_name, age]
    );

    const newId = result.rows[0].id;

    res.status(201).json({
      // 201 Created là HTTP status code tốt hơn cho POST
      message: "Thêm học sinh thành công",
      data: { id: newId, name, class_name, age },
    });
  } catch (err) {
    res.status(500).json({ error: "Lỗi thêm dữ liệu: " + err.message });
  }
};
