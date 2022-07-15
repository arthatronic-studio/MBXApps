import gql from 'graphql-tag';

export const queryLikeComment = gql`
  query ($commentId: Int!) {
    contentCommentLikeManage(commentId: $commentId) {
      success
      message
    }
  }
`;
