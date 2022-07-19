import gql from 'graphql-tag';

export const queryLocationProvinceListing = gql`
    {
        locationProvinceListing{
            location_province_id
            location_province_name
            location_province_latitude
            location_province_longitude
        }
    }
`;

export const queryLocationCityListing = gql`
    query(
        $location_province_id: Int
    ){
        locationCityListing(
            location_province_id: $location_province_id
        ){
            location_city_id
            location_city_name
            location_city_latitude
            location_city_longitude
        }
    }
`;