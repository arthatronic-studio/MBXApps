import gql from 'graphql-tag';

export const queyGetDokumentasiEnventDetail = gql`
    query(
       
        $id: Int
      ) {
        eventDocumentationDetail(
            id: $id
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