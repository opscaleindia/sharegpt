import { connect } from "@planetscale/database";
import mysql from "mysql";

export const conn = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password"
});
