import gql from 'graphql-tag';

export const queryMenuList = gql`
query(
    $page: Int
    $itemPerPage: Int
    $type: String
    $category: String
    $orderDir: MenuOrderDirection
  ){
    menuList(
        page: $page
        itemPerPage: $itemPerPage
        type: $type
        category: $category
        orderDir: $orderDir
    ){
        id
        code
        name
        nav
        param
        image
        type
        category
        badge
        show
        enable
    }
  }
`;