import gql from 'graphql-tag';

export const queryGroupMemberList = gql`
    query($groupId: Int!, $status: Int!) {
        groupMemberList(groupId: $groupId, status: $status) {
            id
            createdDate
            status
            userId
            groupId
            fullname
            image
            type
        }
    }
`;