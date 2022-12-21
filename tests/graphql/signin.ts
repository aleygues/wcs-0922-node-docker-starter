import { gql } from "apollo-server";

export const signin = gql`
  mutation signin($email: String!, $password: String!) {
    signin(email: $email, password: $password)
  }
`;
