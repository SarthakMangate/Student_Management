import { pool } from "../config/db";

export const getAllStudents = async () => {
  const result = await pool.query(
    "SELECT * FROM students ORDER BY id DESC"
  );
  return result.rows;
};

export const createStudent = async (student: any) => {
  // ✅ validation
  if (!student.name || !student.age || !student.course) {
    throw new Error("Name, age and course are required");
  }

  const query = `
    INSERT INTO students
    (name, age, gender, email, phone, address, course, enrollment_date, image)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
    RETURNING *
  `;

  const values = [
    student.name,
    student.age,
    student.gender,
    student.email,
    student.phone,
    student.address,
    student.course,
    student.enrollmentDate,
    student.image
  ];

  const result = await pool.query(query, values);
  return result.rows[0];
};

export const deleteStudent = async (id: number) => {
  const result = await pool.query(
    "DELETE FROM students WHERE id=$1 RETURNING *",
    [id]
  );

  if (result.rowCount === 0) {
    throw new Error("Student not found");
  }

  return result.rows[0];
};

export const updateStudent = async (id: number, student: any) => {
  // ✅ validation
  if (!student.name || !student.age || !student.course) {
    throw new Error("Name, age and course are required");
  }

  const query = `
    UPDATE students
    SET name=$1, age=$2, gender=$3, email=$4, phone=$5, address=$6, course=$7, enrollment_date=$8, image=$9
    WHERE id=$10
    RETURNING *
  `;

  const values = [
    student.name,
    student.age,
    student.gender,
    student.email,
    student.phone,
    student.address,
    student.course,
    student.enrollmentDate,
    student.image,
    id
  ];

  const result = await pool.query(query, values);

  if (result.rowCount === 0) {
    throw new Error("Student not found");
  }

  return result.rows[0];
};

