import { Field, ID, InputType } from "type-graphql";

@InputType()
export class UniqueRelation {
  @Field(() => ID)
  id: number;
}

@InputType()
export class ManyRelation {
  @Field(() => [ID])
  connect: number[];

  @Field(() => [ID])
  disconnect: number[];
}
