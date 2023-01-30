import { Resolver, Mutation, Arg, Query, Authorized, Ctx } from "type-graphql";
import { IContext } from "../auth";
import { Post, PostInput } from "../entities/Post";
import datasource from "../utils";

@Resolver()
export class PostsResolver {
  @Authorized()
  @Mutation(() => Post)
  async createPost(
    @Ctx() context: IContext,
    @Arg("data", () => PostInput) data: PostInput
  ): Promise<Post> {
    data.createdAt = new Date();
    data.createdBy = context.user?.id as any;

    return await datasource.getRepository(Post).save(data);
  }

  @Authorized()
  @Query(() => [Post])
  async posts(): Promise<Post[]> {
    return await datasource
      .getRepository(Post)
      .find({ relations: ["createdBy", "comments"] });
  }
}
