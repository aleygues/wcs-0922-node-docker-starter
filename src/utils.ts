import { User } from "./entities/User";
import { DataSource } from "typeorm";
import { Comment } from "./entities/Comment";

const datasource = new DataSource({
  type: "postgres",
  host: "db",
  port: 5432,
  username: "postgres",
  password: "supersecret",
  database: "postgres",
  synchronize: true,
  entities: [User, Comment],
  logging: ["query", "error"],
});

export default datasource;
