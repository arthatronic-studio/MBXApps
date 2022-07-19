import gql from 'graphql-tag';

export const queryUserAddressList = gql`
query(
    $userId: Int
      $page: Int
      $itemPerPage: Int
  
  ){
    userAddressList(
      userId: $userId
      page: $page
          itemPerPage: $itemPerPage
    ){
      id
      userId
      labelAddress
      penerimaName
      address
      noTelp
      postalCode
      latitude
      longitude
      country{
        id
        name
        code
      }
      province{
        id
        name
        lat
        lng
      }
      city{
        id
        name
        lat
        lng
      }
      suburb{
        id
        name
        lat
        lng
      }
      area{
        id
        name
        lat
        lng
      }
    }
  }
`;