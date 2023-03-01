import { beforeAll, describe, expect, it } from "@jest/globals";
import { graphql, GraphQLSchema, print } from "graphql";
import { buildSchema } from "type-graphql";
import { CommentsResolver } from "../src/resolvers/Comments";
import { UsersResolver } from "../src/resolvers/Users";
import { authChecker } from "../src/auth";
import datasource from "../src/utils";
import { createUser } from "./graphql/createUser";
import { User } from "../src/entities/User";
import { signin } from "./graphql/signin";
import { me } from "./graphql/me";

let schema: GraphQLSchema;

beforeAll(async () => {
  // connect to DB
  await datasource.initialize();

  // purge DB
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  if (!process.env.SQLITE) {
    try {
      const entities = datasource.entityMetadatas;
      const tableNames = entities
        .map((entity) => `"${entity.tableName}"`)
        .join(", ");
      await datasource.query(`TRUNCATE ${tableNames} CASCADE;`);
      console.log("[TEST DATABASE]: Clean");
    } catch (error) {
      throw new Error(
        `ERROR: Cleaning test database: ${JSON.stringify(error)}`
      );
    }
  }

  // compute GraphQL schema
  schema = await buildSchema({
    resolvers: [UsersResolver, CommentsResolver],
    authChecker,
  });
});

describe("users", () => {
  describe("user signup", () => {
    it("creates a new user", async () => {
      // check here

      const result = await graphql({
        schema,
        source: print(createUser),
        variableValues: {
          data: {
            email: "toto@test.com",
            password: "supersecret",
          },
        },
      });

      expect(result.data?.createUser).toBeTruthy();
    });
    it("creates user in db", async () => {
      const user = await datasource
        .getRepository(User)
        .findOneBy({ email: "toto@test.com" });
      expect(user?.password !== "supersecret").toBe(true);
      expect(user).toBeDefined();
    });
    it("cannot create 2 users with the same email", async () => {
      const result = await graphql({
        schema,
        source: print(createUser),
        variableValues: {
          data: {
            email: "toto@test.com",
            password: "supersecret",
          },
        },
      });

      expect(result.data?.createUser).toBeFalsy();
      expect(result.errors).toHaveLength(1);
    });
  });

  describe("user signin", () => {
    let userToken: string;
    it("returns a token on a valid mutation", async () => {
      const result = await graphql({
        schema,
        source: print(signin),
        variableValues: {
          email: "toto@test.com",
          password: "supersecret",
        },
      });

      expect(result.data?.signin).toBeTruthy();
      expect(typeof result.data?.signin).toBe("string");
      userToken = result.data?.signin;
    });

    it("returns current logged user", async () => {
      const result = await graphql({
        schema,
        source: print(me),
        contextValue: {
          token: userToken,
        },
      });

      expect(result.data?.me).toBeTruthy();
      expect(result.data?.me.email).toBe("toto@test.com");
    });
  });
});
