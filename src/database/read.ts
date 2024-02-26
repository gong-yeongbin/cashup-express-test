import * as mysql from "mysql2/promise";
import "dotenv/config";

const pool = mysql.createPool({
  host: process.env.BUZZVIL_READ_HOST,
  user: process.env.BUZZVIL_USER,
  password: process.env.BUZZVIL_PASSWORD,
  database: process.env.BUZZVIL_DATABASE,
  port: parseInt(process.env.BUZZVIL_READ_PORT),
  connectionLimit: 400,
});

pool.on("acquire", function (connection) {
  console.log(
    "Connection %d acquired %d %d",
    connection.threadId,
    connection.config.pool._freeConnections.length,
    connection.config.pool._allConnections.length,
  );
});

pool.on("enqueue", function () {
  console.log("Waiting for available connection slot");
});

pool.on("release", function (connection) {
  console.log(
    "Connection %d released %d %d",
    connection.threadId,
    connection.config.pool._freeConnections.length,
    connection.config.pool._allConnections.length,
  );
});

export async function _query(query, value): Promise<any> {
  const connection = await pool.getConnection();
  const [data] = await connection.query(query, value);
  connection.release();

  return data;
}
