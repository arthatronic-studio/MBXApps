import gql from 'graphql-tag';
import Client from '../../../lib/apollo';

export const paketDataPrepaid = (data) => {
  return (dispatch, getState) => {
    dispatch({ type: 'BOOKING.REQUEST_BOOKING'});

    const user = getState()['user.auth'].login.user;

    const variables = {
      PhoneNumber: data.number,
      PulsaCode: data.code,
      AutoDetect: false,
      PulsaPrice: data.price,
      Category: 'PAKET_DATA',
    };

    console.log(variables, 'variables');

    return (
      Client.mutate({
        mutation: prepaidTransaction,
        variables
      }).then(res => {
        console.log(res,'res pulsa');

        if (res.data.PrepaidTransaction){
          dispatch({
            type: 'BOOKING.ADD_BOOKING',
            data: res.data.PrepaidTransaction
          });
          if (user) {
            dispatch({
              type: 'USER.UPDATE_BOOKING_LOGIN',
              data: res.data.PrepaidTransaction
            });
          } else {
            dispatch({
              type: 'BOOKING.ADD_BOOKING_HISTORY',
              data: res.data.PrepaidTransaction
            })
          }
        }
      }).catch(error => {
        console.log(JSON.stringify(error),'error paket data');

        let message = 'Gagal melakukan pembelian paket data';
        if (error && error.graphQLErrors &&  error.graphQLErrors.length > 0) {
          message = error.graphQLErrors[0].message;
        }

        dispatch({
          type: 'BOOKING.ADD_BOOKING_ERROR',
          data: message,
        });
      })
    )
  }
}

const prepaidTransaction = gql`
  mutation(
    $PhoneNumber: String!
    $PulsaCode: String
    $PulsaPrice: Float
    $AutoDetect: Boolean
    $Category: RequestSegmentType!
  ){
    PrepaidTransaction(
      PhoneNumber: $PhoneNumber
      PulsaCode: $PulsaCode
      PulsaPrice: $PulsaPrice
      AutoDetect: $AutoDetect
      Category: $Category
    ){
      id
      userId
      invoiceNumber
      contact{
        title{
          abbr
        }
        firstName
        lastName
        email
        countryCode
        phone
        address
        postalCode
      }
      bookingStatus{
        id
        name
      }
      payments {
        type {
          id
          name
        }
        amount
        discount
        finalAmount
        transferAccountNumber
      }
      expiresAt
      amount
      discount
      finalAmount
      adminFee
      vat
  		prepaidTransaction{
        id
        orderId
        refId
        status
        code
        destinationNumber
        price
        message
        balance
        tr_id
        rc
        category
        order_status
        request_data
        response_data
        lastUpdated
      }
    }
  }
`;
