import gql from 'graphql-tag';

export const queryProductReport = gql`
mutation (
  $referenceId: Int!
  $referenceType: ReportAbuseType!
  $manageType: ReportAbuseManageType!
  $message: String
  $status: ReportAbuseStatus
) {
  reportAbuseManage(
    referenceId: $referenceId
    referenceType: $referenceType
    manageType: $manageType
    message: $message
    status: $status
  ) {
      id
	    status
    }
  }
`;
