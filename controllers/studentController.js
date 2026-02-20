const queryData = require("../data/query");
const alertData = require("../data/alert.json");

const st = queryData.students;
const com = alertData.com;

exports.initializeDB = async function (req, res) {
  const pool = req.pool;
  try {
    await pool.query(queryData.init);
    console.log(com.createTableSucces.replace("{0}", "students"));
  } catch (err) {
    console.error(com.errorInitDB, err);
  }
};

exports.list = async function (req, res) {
  const pool = req.pool;
  try {
    const result = await pool.query(st.list);
    console.log(result.rows);

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

exports.edit = async function (req, res) {
  const pool = req.pool;
  const { id, name, class_name, age } = req.body;

  if (!id || !name || !class_name || !age) {
    return res.status(400).json({ error: com.missingFieldInfo });
  }

  try {
    const result = await pool.query(st.edit, [id, name, class_name, age]);
    res.status(201).json({
      message: com.createSuccess,
      data: { id: id, name, class_name, age },
    });
  } catch (err) {
    res.status(500).json({ error: com.errorQuery + ": " + err.message });
  }
};

exports.delete = async function (req, res) {
  const pool = req.pool;
  const { id } = req.params;
  console.log(id);

  try {
    await pool.query(st.delete, [id]);
    res.status(201).json({
      message: com.deleteSuccess,
    });
  } catch (err) {
    res.status(500).json({ error: com.errorQuery + ": " + err.message });
  }
};

exports.detail = async function (req, res) {
  const pool = req.pool;
  const { id } = req.params;
  console.log(id);
  try {
    const result = await pool.query(st.detail, [id]);
    console.log(result.rows);
    res.json({ message: com.success, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: com.errorQuery + ": " + err.message });
  }
};
