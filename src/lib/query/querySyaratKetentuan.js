import gql from 'graphql-tag';

export const querySyaratKetentuan = gql`
  query {
    getSyaratKetentuan {
      page_id
      page_nm
      page_title
      page_isguest
      page_description
      page_keywords
      page_content
    }
  }
`;
