import "reflect-metadata";
import { ApolloServer } from "apollo-server";
import datasource from "./utils";
import { buildSchema } from "type-graphql";
import { UsersResolver } from "./resolvers/Users";
import { authChecker } from "./auth";
import { CommentsResolver } from "./resolvers/Comments";
import { PostsResolver } from "./resolvers/Posts";
import { ImagesResolver } from "./resolvers/Images";
import { User } from "./entities/User";
import { Dev } from "./resolvers/Dev";

const PORT = 5000;

async function bootstrap(): Promise<void> {
  // ... Building schema here
  const schema = await buildSchema({
    resolvers: [
      UsersResolver,
      CommentsResolver,
      PostsResolver,
      ImagesResolver,
      ...(process.env.DEV ? [Dev] : []),
    ],
    authChecker,
  });

  // Create the GraphQL server
  const server = new ApolloServer({
    schema,
    cors: true,
    context: ({ req }) => {
      // Get the user token from the headers.
      const authorization: string | undefined = req?.headers?.authorization;

      if (authorization) {
        // Bearer ...jwt
        const token = authorization.split(" ").pop();
        return { token };
      }
      // Add the user to the context
      return { token: null };
    },
  });

  try {
    await datasource.initialize();
    console.log("DB started!");

    // Start the server
    const { url } = await server.listen(PORT);
    console.log(`Server is running, GraphQL Playground available at ${url}`);
  } catch (err) {
    console.log("An error occured");
    console.error(err);
  }
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
