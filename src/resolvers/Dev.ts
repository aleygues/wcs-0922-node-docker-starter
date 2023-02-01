import { Mutation, Resolver } from "type-graphql";
import { User } from "../entities/User";
import datasource from "../utils";

@Resolver()
export class Dev {
  @Mutation(() => Boolean)
  async reset(): Promise<boolean> {
    // purge DB
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
    // could populate
    const admin = await datasource
      .getRepository(User)
      .findOne({ where: { email: "admin@aleygues.fr" } });
    if (admin === null) {
      await datasource
        .getRepository(User)
        .save({ email: "admin@aleygues.fr", password: "supersecret" });
    }
    //...
    return true;
  }
}
