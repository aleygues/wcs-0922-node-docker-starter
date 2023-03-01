import { User } from "./entities/User";
import { DataSource } from "typeorm";
import { Comment } from "./entities/Comment";
import { Post } from "./entities/Post";
import { Image } from "./entities/Image";

// eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
const datasource = !process.env.SQLITE
  ? new DataSource({
      type: "postgres",
      host: process.env.DB_HOST,
      port: 5432,
      username: "postgres",
      password: "supersecret",
      database: "postgres",
      synchronize: true,
      entities: [User, Comment, Post, Image],
      logging: ["query", "error"],
    })
  : new DataSource({
      type: "sqlite",
      database: ":memory",
      synchronize: true,
      entities: [User, Comment, Post, Image],
      logging: ["query", "error"],
    });

export default datasource;
