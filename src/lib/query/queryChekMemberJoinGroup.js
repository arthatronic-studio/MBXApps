import gql from 'graphql-tag';

export const queryChekMemberJoinGroup = gql`
query{
    checkMemberJoinGroup{
      success,
      message
      
    }
    
    }
`;
