import {
  Resolver,
  Mutation,
  Arg,
  Query,
  Authorized,
  Ctx,
  ID,
} from "type-graphql";
import { IContext } from "../auth";
import {
  Comment,
  CreateCommentInput,
  UpdateCommentInput,
} from "../entities/Comment";
import datasource from "../utils";

@Resolver()
export class CommentsResolver {
  @Authorized()
  @Mutation(() => Comment)
  async createComment(
    @Ctx() context: IContext,
    @Arg("data", () => CreateCommentInput) data: CreateCommentInput
  ): Promise<Comment> {
    data.createdAt = new Date();
    data.createdBy = context.user?.id as any;
    return await datasource.getRepository(Comment).save(data);
  }

  @Authorized()
  @Mutation(() => Comment)
  async updateComment(
    @Ctx() context: IContext,
    @Arg("id", () => ID) id: number,
    @Arg("data", () => UpdateCommentInput) data: UpdateCommentInput
  ): Promise<Comment> {
    // get original entity to update (useless for creation)
    const comment = await datasource
      .getRepository(Comment)
      .findOne({ where: { id }, relations: ["createdBy"] });

    // only author can edit their own comment
    if (comment?.createdBy.id !== context.user?.id) {
      throw new Error("forbidden");
    }

    // replace likes prop with the array from the db
    return await datasource
      .getRepository(Comment)
      .save({ ...comment, ...data });
  }

  @Authorized()
  @Mutation(() => Comment)
  async likeComment(
    @Ctx() context: IContext,
    @Arg("id", () => ID) id: number
  ): Promise<Comment | null> {
    // get original entity to update
    const comment = await datasource
      .getRepository(Comment)
      .findOne({ where: { id }, relations: ["likes"] });

    // check that we got a comment + that user is defined
    if (comment !== null && context.user !== undefined) {
      // check if the user is present
      if (!comment.likes.find((user) => user.id === context.user?.id)) {
        comment.likes = [...comment.likes, context.user];
        await datasource.getRepository(Comment).save(comment);
      }
    }

    return comment;
  }

  @Authorized()
  @Mutation(() => Comment)
  async dislikeComment(
    @Ctx() context: IContext,
    @Arg("id", () => ID) id: number
  ): Promise<Comment | null> {
    // get original entity to update
    const comment = await datasource
      .getRepository(Comment)
      .findOne({ where: { id }, relations: ["likes"] });

    // check that we got a comment + that user is defined
    if (comment !== null && context.user !== undefined) {
      comment.likes = comment.likes.filter(
        (user) => user.id !== context.user?.id
      );
      await datasource.getRepository(Comment).save(comment);
    }
    return comment;
  }

  @Authorized()
  @Query(() => [Comment])
  async comments(): Promise<Comment[]> {
    return await datasource
      .getRepository(Comment)
      .find({ relations: ["createdBy", "post"] });
  }
}
