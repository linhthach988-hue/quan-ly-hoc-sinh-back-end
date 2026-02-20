module.exports = {
  students: {
    init: `
    CREATE TABLE IF NOT EXISTS students (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      class_name TEXT NOT NULL,
      age INTEGER
    )
  `,
    list: `SELECT * FROM students ORDER BY class_name`,
    create: `INSERT INTO students (name, class_name, age) VALUES ($1, $2, $3) RETURNING id`,
    edit: `UPDATE students SET name=$2, class_name=$3, age=$4 WHERE id=$1`,
    detail: `SELECT * FROM students where id=$1`,
    delete: `DELETE FROM students where id=$1`,
  },
};
