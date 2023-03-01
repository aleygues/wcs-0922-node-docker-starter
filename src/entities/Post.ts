import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  JoinColumn,
} from "typeorm";
import { ObjectType, Field, ID, InputType } from "type-graphql";
import { Length } from "class-validator";
import { User } from "./User";
import { Comment } from "./Comment";
import { Image } from "./Image";
import { UniqueRelation } from "./common";

@Entity()
@ObjectType()
export class Post {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number;

  @Column()
  @Field()
  content: string;

  @OneToMany(() => Comment, (comment) => comment.post, { lazy: true })
  @Field(() => [Comment])
  comments: Promise<Comment[]>;

  @OneToOne(() => Image, (image) => image.post)
  @JoinColumn()
  @Field(() => Image)
  image: Image;

  @ManyToOne(() => User, { lazy: true })
  @Field(() => User, { nullable: true })
  createdBy: User;

  @Column()
  @Field(() => Date)
  createdAt: Date;
}

@InputType()
export class PostInput {
  @Field()
  @Length(5, 500)
  content: string;

  // { id: number, url: string, ... }
  @Field(() => UniqueRelation, { nullable: true })
  image: UniqueRelation;

  // these fields are not available for GraphQL
  createdAt: Date;
  createdBy: User;
}
