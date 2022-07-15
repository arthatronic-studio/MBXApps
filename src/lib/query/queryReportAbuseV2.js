import gql from 'graphql-tag';

export const queryReportAbuseV2 = gql`
mutation(
  $referenceId: Int!
  $referenceType: ReportAbuseType!
  $referenceName: String!
  $refStatus: String!
  $reportType: String
  $reportMessage: String
){
  reportAbuseManageV2(
    referenceId: $referenceId
    referenceType: $referenceType
    referenceName: $referenceName
    refStatus: $refStatus
    reportType: $reportType
    reportMessage: $reportMessage
  ){
    success
    message
  }
}
`;
