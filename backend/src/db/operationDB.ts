import mysql from "mysql2/promise";
import type { Request, Response, NextFunction } from "express";
import type { ResultSetHeader } from "mysql2";


const pool = mysql.createPool({
  host: '127.0.0.1',
  user: 'staff',
  password: '0000',
  database: 'merchandise',
  port: 3306
});


export async function operationDB(req: Request, res: Response, next: NextFunction) {
  const { userId, foodName, price } = req.body;

  try {
    const [result] = await pool.execute<ResultSetHeader>(
      'INSERT INTO user_foods (user_sub, food_name, price) VALUES (?, ?, ?)',
      [userId, foodName, price]
    );

    res.json({ ok: true, message: "Values are successfully registered" });
  } catch (err) {
    console.error(err);
    res.status(500).send('DB error');
  }
}
