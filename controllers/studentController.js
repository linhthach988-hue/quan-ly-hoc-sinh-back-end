const queryData = require("../data/query.json");
const alertData = require("../data/alert.json");

const st = queryData.students;
const com = alertData.com;
exports.list = async function (req, res) {
  const pool = req.pool;
  try {
    const result = await pool.query(st.list);
    res.json({ message: com.success, data: result.rows });
  } catch (err) {
    res.status(500).json({ error: com.errorQuery + ": " + err.message });
  }
};

exports.insert = async function (req, res) {
  const pool = req.pool;
  const { name, class_name, age } = req.body;

  if (!name || !class_name || !age) {
    return res.status(400).json({ error: com.missingFieldInfo });
  }

  try {
    const result = await pool.query(st.create, [name, class_name, age]);
    const newId = result.rows[0].id;
    res.status(201).json({
      message: com.createSuccess,
      data: { id: newId, name, class_name, age },
    });
  } catch (err) {
    res.status(500).json({ error: com.errorQuery + ": " + err.message });
  }
};

exports.delete = async function (req, res) {
  const pool = req.pool;
  const { id } = req.params;
  try {
    const result = await pool.query(st.delete, [id]);
    res.status(201).json({
      message: com.deleteSuccess,
    });
  } catch (err) {
    res.status(500).json({ error: com.errorQuery + ": " + err.message });
  }
};
