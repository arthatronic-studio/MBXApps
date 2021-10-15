import gql from 'graphql-tag';
import Client from '../../../lib/apollo';

export const plnPrepaid = (variables) => {
  return (dispatch, getState) => {
    dispatch({ type: 'BOOKING.REQUEST_BOOKING' });

    const user = getState()['user.auth'].login.user;

    return (
      Client.mutate({
        mutation: prepaidTransaction,
        variables
      })
      .then(res => {
        if (res.data.PrepaidTransaction) {
          console.log('booking add');
          dispatch({
            type: 'BOOKING.ADD_BOOKING',
            data: res.data.PrepaidTransaction
          });

          if(user){
            console.log('booking user');
            dispatch({
              type: 'USER.UPDATE_BOOKING_LOGIN',
              data: res.data.PrepaidTransaction
            });
          }else {
            dispatch({
              type: 'BOOKING.ADD_BOOKING_HISTORY',
              data: res.data.PrepaidTransaction
            })
          }
        }
        console.log(res.data.PrepaidTransaction, 'res data');
      })
      .catch(error => {
        console.log(JSON.stringify(error),'error pln');

        let message = 'Gagal melakukan pembelian pln';
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
    $AutoDetect: Boolean
    $PulsaPrice: Float
    $Category: RequestSegmentType!
  ){
    PrepaidTransaction(
      PhoneNumber: $PhoneNumber
      PulsaCode: $PulsaCode
      AutoDetect: $AutoDetect
      PulsaPrice: $PulsaPrice
      Category: $Category
    ){
      id
      userId
      invoiceNumber
      contact{
        firstName
        lastName
        title{
          abbr
        }
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
  }`;
