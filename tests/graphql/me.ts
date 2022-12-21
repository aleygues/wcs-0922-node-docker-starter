import { gql } from "apollo-server";

export const me = gql`
  query me {
    me {
      id
      email
    }
  }
`;
