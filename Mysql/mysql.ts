import * as mysql from "mysql2/promise";

export async function getConection() {
  try {
    const connection = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "123",
      database: "pruebas",
    });
    return connection;
  } catch (error) {
    return null;
  }
}
