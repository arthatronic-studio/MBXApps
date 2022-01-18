import gql from 'graphql-tag';

export const queryBannerList = gql`
  query(
    $categoryId: Int
    $page: Int
    $itemPerPage: Int 
  ){
    bannerList(
      categoryId: $categoryId
      page: $page
      itemPerPage: $itemPerPage
    ){
      id
      categoryId
      title
      image
      link
    }
  }
`;
