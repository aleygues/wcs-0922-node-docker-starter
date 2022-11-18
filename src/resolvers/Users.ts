import { Resolver, Mutation, Arg, Query, Ctx, Authorized } from "type-graphql";
import { User, UserInput } from "../entities/User";
import datasource from "../utils";
import { hash, verify } from "argon2";
import { sign, decode, verify as jwtVerify } from "jsonwebtoken";
import { IContext } from "../auth";

@Resolver()
export class UsersResolver {
  @Mutation(() => User)
  async createUser(
    @Arg("data", () => UserInput) data: UserInput
  ): Promise<User> {
    data.password = await hash(data.password);
    return await datasource.getRepository(User).save(data);
  }

  @Mutation(() => String, { nullable: true })
  async signin(
    @Arg("email") email: string,
    @Arg("password") password: string
  ): Promise<string | null> {
    try {
      const user = await datasource
        .getRepository(User)
        .findOne({ where: { email } });

      if (!user) {
        return null;
      }

      if (await verify(user.password, password)) {
        const token = sign({ userId: user.id }, "supersecret!", {
          expiresIn: 3600,
        });
        return token;
      } else {
        return null;
      }
    } catch {
      return null;
    }
  }

  @Authorized()
  @Query(() => User, { nullable: true })
  async me(@Ctx() context: IContext): Promise<User | null> {
    return context.user;
  }

  // only connected user may read that
  @Authorized()
  @Query(() => [User])
  async users(): Promise<User[]> {
    return await datasource.getRepository(User).find({});
  }
}
