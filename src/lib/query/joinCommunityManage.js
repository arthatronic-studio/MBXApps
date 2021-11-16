import gql from 'graphql-tag';

export const joinCommunityManage = gql`
  query($status: Int!, $id: Int!) {
    joinCommunityManage(status: $status, id: $id) {
      id
      car_type
      car_color
      car_year
      car_identity
      reason
      chapter_id
      car_photo
      status
      userId
    }
  }
`;
