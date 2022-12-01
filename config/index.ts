import { DataSource, DataSourceOptions } from "typeorm";
import { Note } from "../entites/Note";
const MSSQL_HOST = process.env.MSSQL_HOST;
const MSSQL_PORT = Number(process.env.MSSQL_PORT);
const MSSQL_USER = process.env.MSSQL_USER;
const MSSQL_PASSWORD = process.env.MSSQL_PASSWORD;
const MSSQL_DBNAME = process.env.MSSQL_DBNAME;

const options: DataSourceOptions = {
  type: "mssql",
  host: MSSQL_HOST,
  port: MSSQL_PORT,
  username: MSSQL_USER,
  password: MSSQL_PASSWORD,
  database: MSSQL_DBNAME,
  synchronize: true,
  logging: true,
  entities: [Note],
  options: {
    encrypt: false,
  },
};
const myDataSource = new DataSource(options);

export default myDataSource;

