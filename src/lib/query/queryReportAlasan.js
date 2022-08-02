import gql from 'graphql-tag';

export const queryReportAlasan = gql`
query{
  reportAbuseAlasan{
    data
  }
}
`;
