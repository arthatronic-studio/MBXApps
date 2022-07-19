import gql from 'graphql-tag';

export const queryProductReport = gql`
mutation (
  $referenceId: Int!
  $referenceType: ReportAbuseType!
  $referenceName: String!
  $refStatus: String!
	$reportMessage: String
) {
  reportAbuseManage(
    referenceId: $referenceId
    referenceType: $referenceType
    referenceName: $referenceName
    refStatus: $refStatus
    reportMessage: $reportMessage
  ) {
      id
			refId
      refType
      message
      reportedBy
      status
      createdAt
      detail {
        id
        reportId
        userId
        fullname
        reportMessage
        reportedAt
      }
    }
  }
`;
