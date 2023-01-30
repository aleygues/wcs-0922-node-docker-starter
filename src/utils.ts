import { User } from "./entities/User";
import { DataSource } from "typeorm";
import { Comment } from "./entities/Comment";
import { Post } from "./entities/Post";
import { Image } from "./entities/Image";

const datasource = new DataSource({
  type: "postgres",
  host: "db",
  port: 5432,
  username: "postgres",
  password: "supersecret",
  database: "postgres",
  synchronize: true,
  entities: [User, Comment, Post, Image],
  logging: ["query", "error"],
});

export default datasource;
