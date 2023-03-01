import { Entity, Column, PrimaryGeneratedColumn, ManyToMany } from "typeorm";
import {
  ObjectType,
  Field,
  ID,
  InputType,
  UseMiddleware,
  MiddlewareFn,
} from "type-graphql";
import { IsEmail, Length } from "class-validator";
import { Comment } from "./Comment";
import { IContext } from "../auth";

// root is the parent entity
// context contains the connected user
export const IsUser: MiddlewareFn<IContext> = async (
  { root, context },
  next
) => {
  if (root.id === context.user?.id) {
    return await next();
  }
};

@Entity()
@ObjectType()
export class User {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number;

  @Column({ unique: true })
  @Field()
  email: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  @UseMiddleware(IsUser)
  address: string;

  @Column()
  @Field()
  password: string;

  @ManyToMany(() => Comment, (comment) => comment.likes)
  @Field(() => [Comment])
  likes: Comment[];
}

@InputType()
export class UserInput {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  @Length(8, 60)
  password: string;
}
