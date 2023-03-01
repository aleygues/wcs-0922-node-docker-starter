import axios from "axios";
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
    // data.image = { id: number };
    const newPost = await datasource.getRepository(Post).save(data);

    // send push notifications
    // const users = await datasource.getRepository(User).find();
    // const pushTokens = users.map(user => user.pushToken);
    const pushTokens = ["ExponentPushToken[bM3QWzPbQBCWooN0_xFUNZ]"];

    const message = {
      to: pushTokens,
      sound: "default",
      title: "New post!",
      body: newPost.content,
      data: { postId: newPost.id },
    };

    await axios("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
      data: JSON.stringify(message),
    });

    return newPost;
  }

  @Authorized()
  @Query(() => [Post])
  async posts(): Promise<Post[]> {
    return await datasource.getRepository(Post).find();
  }

  @Authorized()
  @Query(() => [Post])
  async postsWithComments(): Promise<Post[]> {
    return await datasource
      .getRepository(Post)
      .find({ relations: ["comments", "comments.createdBy"] });
  }
}
