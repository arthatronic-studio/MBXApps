import gql from 'graphql-tag';

export const queyGetDokumentasiEnventList = gql`
    query($page: Int
        $itemPerPage: Int
        $search: String
       ){
        eventDocumentationList(
            page: $page
            itemPerPage: $itemPerPage
            search: $search
        ) {
            id
            userId
            category
            name
            description
            date
            startTime
            endTime
            location
            images
            latestMedia
            mediaCounts{
                image
                video
              }
            eventDocumentations{
                eventId
                userId
                name
                description
                media
                mediaType

            }
        }
    }
`