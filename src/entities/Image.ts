import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { ObjectType, Field, ID, InputType } from "type-graphql";
import { IsUrl } from "class-validator";
import { User } from "./User";
import { Post } from "./Post";

@Entity()
@ObjectType()
export class Image {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number;

  @Column()
  @Field()
  url: string;

  @OneToMany(() => Post, (post) => post.image)
  @Field(() => Post)
  post: Post;

  @ManyToOne(() => User)
  @Field(() => User, { nullable: true })
  createdBy: User;

  @Column()
  @Field(() => Date)
  createdAt: Date;
}

@InputType()
export class ImageInput {
  @Field()
  @IsUrl()
  url: string;

  // these fields are not available for GraphQL
  createdAt: Date;
  createdBy: User;
}
