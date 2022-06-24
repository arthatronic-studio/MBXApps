import gql from 'graphql-tag';

export const queryMemberRank = gql`
  query {
    getUserRangkingHome {
      pemula {
        userId
        fullname
        photoProfile
        rank
      }
      veteran {
        userId
        fullname
        photoProfile
        rank
      }
    }
  }
`;
