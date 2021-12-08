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
      chapter_id
      car_photo_main
      car_photo_front
      car_photo_side
      car_photo_back
      transaction_proof
      status
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
        qr_code
        photoProfile
        nomor_id
        alamat
        tanggalLahir
      }
    }
  }
`;
