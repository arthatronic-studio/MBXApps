import gql from 'graphql-tag';

export const queryGetEnumList = gql`
  query ($enumType: String!, $enumContent: String) {
    enumList(enumType: $enumType, enumContent: $enumContent) {
      id
      enumType
      enumContent
      enumLabel
    }
  }
`;
