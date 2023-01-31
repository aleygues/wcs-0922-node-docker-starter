"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const graphql_1 = require("graphql");
const type_graphql_1 = require("type-graphql");
const Comments_1 = require("../src/resolvers/Comments");
const Users_1 = require("../src/resolvers/Users");
const auth_1 = require("../src/auth");
const utils_1 = __importDefault(require("../src/utils"));
const createUser_1 = require("./graphql/createUser");
const User_1 = require("../src/entities/User");
const signin_1 = require("./graphql/signin");
const me_1 = require("./graphql/me");
let schema;
(0, globals_1.beforeAll)(async () => {
    // connect to DB
    await utils_1.default.initialize();
    // purge DB
    try {
        const entities = utils_1.default.entityMetadatas;
        const tableNames = entities
            .map((entity) => `"${entity.tableName}"`)
            .join(", ");
        await utils_1.default.query(`TRUNCATE ${tableNames} CASCADE;`);
        console.log("[TEST DATABASE]: Clean");
    }
    catch (error) {
        throw new Error(`ERROR: Cleaning test database: ${JSON.stringify(error)}`);
    }
    // compute GraphQL schema
    schema = await (0, type_graphql_1.buildSchema)({
        resolvers: [Users_1.UsersResolver, Comments_1.CommentsResolver],
        authChecker: auth_1.authChecker,
    });
});
(0, globals_1.describe)("users", () => {
    (0, globals_1.describe)("user signup", () => {
        (0, globals_1.it)("creates a new user", async () => {
            // check here
            var _a;
            const result = await (0, graphql_1.graphql)({
                schema,
                source: (0, graphql_1.print)(createUser_1.createUser),
                variableValues: {
                    data: {
                        email: "toto@test.com",
                        password: "supersecret",
                    },
                },
            });
            (0, globals_1.expect)((_a = result.data) === null || _a === void 0 ? void 0 : _a.createUser).toBeTruthy();
        });
        (0, globals_1.it)("creates user in db", async () => {
            const user = await utils_1.default
                .getRepository(User_1.User)
                .findOneBy({ email: "toto@test.com" });
            (0, globals_1.expect)((user === null || user === void 0 ? void 0 : user.password) !== "supersecret").toBe(true);
            (0, globals_1.expect)(user).toBeDefined();
        });
        (0, globals_1.it)("cannot create 2 users with the same email", async () => {
            var _a;
            const result = await (0, graphql_1.graphql)({
                schema,
                source: (0, graphql_1.print)(createUser_1.createUser),
                variableValues: {
                    data: {
                        email: "toto@test.com",
                        password: "supersecret",
                    },
                },
            });
            (0, globals_1.expect)((_a = result.data) === null || _a === void 0 ? void 0 : _a.createUser).toBeFalsy();
            (0, globals_1.expect)(result.errors).toHaveLength(1);
        });
    });
    (0, globals_1.describe)("user signin", () => {
        let userToken;
        (0, globals_1.it)("returns a token on a valid mutation", async () => {
            var _a, _b, _c;
            const result = await (0, graphql_1.graphql)({
                schema,
                source: (0, graphql_1.print)(signin_1.signin),
                variableValues: {
                    email: "toto@test.com",
                    password: "supersecret",
                },
            });
            (0, globals_1.expect)((_a = result.data) === null || _a === void 0 ? void 0 : _a.signin).toBeTruthy();
            (0, globals_1.expect)(typeof ((_b = result.data) === null || _b === void 0 ? void 0 : _b.signin)).toBe("string");
            userToken = (_c = result.data) === null || _c === void 0 ? void 0 : _c.signin;
        });
        (0, globals_1.it)("returns current logged user", async () => {
            var _a, _b;
            const result = await (0, graphql_1.graphql)({
                schema,
                source: (0, graphql_1.print)(me_1.me),
                contextValue: {
                    token: userToken,
                },
            });
            (0, globals_1.expect)((_a = result.data) === null || _a === void 0 ? void 0 : _a.me).toBeTruthy();
            (0, globals_1.expect)((_b = result.data) === null || _b === void 0 ? void 0 : _b.me.email).toBe("toto@test.com");
        });
    });
});
