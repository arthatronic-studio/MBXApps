import gql from 'graphql-tag';

export const joinCommunityMember = gql`
  query($status: Int!) {
    joinCommunityMember(status: $status) {
      id
      car_type
      car_color
      car_year
      car_identity
      reason
      note
      chapter_id
      car_photo_main
      car_photo_front
      car_photo_side
      car_photo_back
      selfie_photo
      sim_photo
      stnk_photo
      transaction_proof
      status
      user_id
      chapter{
        id
        name
        community_id
        code
      }
      userDetail{
        userId
        firstName
        lastName
        email
        phoneCountryCode
        phoneNumber
        address
        city
        postalCode
        country
        organizationId
        organizationName
        userCode
        idCardNumber
        idNumber
        isDirector
        image
        photoProfile
        birthDate
      }
      photo_profile
    }
  }
`;
