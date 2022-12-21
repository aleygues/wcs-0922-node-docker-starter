# Node TS Starter!

This boilerplate contains:

- Node with TypeScript
- TypeGraphQL to generate the GraphQL API
- TypeORM to generate the database schema
- A first entity and its resolver to create some users

Everything is dockerized, just install Docker on you host machine then run:

```
docker compose up --build
```

To work locally, you should install the NPM dependencies by running:

```
npm i
```

Please note that everytime you install a new NPM package, you should rerun you docker compose command.

To run test, you have 2 choices:

- run in with docker (will work with all OS and a CI): `yarn test:docker`, check the yarn script and the `docker-compose.test.yml` for more information,
- run tests locally, connected to a Docker DB. First launch a PostGres DB with `docker run -e POSTGRES_PASSWORD=supersecret -p 5432:5432 postgres`, and let the db running, in another terminal, finally run the tests locally by using `yarn test ./tests --watch`

The `./tests` folder contains some examples of integration tests. These tests will be run against a live DB that will be truncated (clear) before all tests.
