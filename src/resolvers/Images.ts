import { Resolver, Mutation, Arg, Query, Authorized, Ctx } from "type-graphql";
import { IContext } from "../auth";
import { Image, ImageInput } from "../entities/Image";
import datasource from "../utils";

@Resolver()
export class ImagesResolver {
  @Authorized()
  @Mutation(() => Image)
  async Image(
    @Ctx() context: IContext,
    @Arg("data", () => ImageInput) data: ImageInput
  ): Promise<Image> {
    data.createdAt = new Date();
    data.createdBy = context.user?.id as any;
    return await datasource.getRepository(Image).save(data);
  }

  @Authorized()
  @Query(() => [Image])
  async images(): Promise<Image[]> {
    return await datasource
      .getRepository(Image)
      .find({ relations: ["createdBy"] });
  }
}
