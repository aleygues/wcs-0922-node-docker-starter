import { Resolver, Mutation, Arg, Query, Authorized, Ctx } from "type-graphql";
import { IContext } from "../auth";
import { Comment, CommentInput } from "../entities/Comment";
import { Post } from "../entities/Post";
import datasource from "../utils";

@Resolver()
export class CommentsResolver {
  @Authorized()
  @Mutation(() => Comment)
  async createComment(
    @Ctx() context: IContext,
    @Arg("data", () => CommentInput) data: CommentInput
  ): Promise<Comment> {
    data.createdAt = new Date();
    data.createdBy = context.user?.id as any;
    return await datasource.getRepository(Comment).save(data);
  }

  @Authorized()
  @Query(() => [Comment])
  async comments(): Promise<Comment[]> {
    return await datasource
      .getRepository(Comment)
      .find({ relations: ["createdBy", "post"] });
  }
}
