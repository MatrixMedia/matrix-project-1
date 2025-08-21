export const GET_USER = id => `
query {
  user(id: ${id}) {
    id
    username
    email
    address {
      geo {
        lat
        lng
      }
    }
  }
}
`;
