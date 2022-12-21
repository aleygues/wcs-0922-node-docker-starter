import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { ObjectType, Field, ID, InputType } from "type-graphql";
import { Length } from "class-validator";
import { User } from "./User";
import { computeDaysBetween } from "../helpers";

@Entity()
@ObjectType()
export class Comment {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number;

  @Column({ unique: true })
  @Field()
  comment: string;

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

  createdAt: Date;

  createdBy: User;
}
