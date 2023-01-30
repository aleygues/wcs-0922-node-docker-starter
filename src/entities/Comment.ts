import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { ObjectType, Field, ID, InputType } from "type-graphql";
import { Length } from "class-validator";
import { User } from "./User";
import { computeDaysBetween } from "../helpers";
import { Post } from "./Post";
import { UniqueRelation } from "./common";

@Entity()
@ObjectType()
export class Comment {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number;

  @Column()
  @Field()
  comment: string;

  @ManyToOne(() => Post, (post) => post.comments)
  @Field(() => Post)
  post: Post;

  @ManyToOne(() => User)
  @Field(() => User, { nullable: true })
  createdBy: User;

  @Column()
  @Field(() => Date)
  createdAt: Date;

  @Field()
  get distanceInDays(): number {
    return computeDaysBetween(this.createdAt, new Date());
  }
}

@InputType()
export class CommentInput {
  @Field()
  @Length(5, 500)
  comment: string;

  @Field(() => UniqueRelation)
  post: UniqueRelation;

  // these fields are not available for GraphQL
  createdAt: Date;
  createdBy: User;
}
