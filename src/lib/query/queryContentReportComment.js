import gql from 'graphql-tag';

export const queryReportComment = gql`
  mutation(
    $commentId: Int
  ) {
    commentReport(
      commentId: $commentId
    ) {
      commentId
      status
    }
  }
`;