import gql from 'graphql-tag';
import { onError } from 'apollo-link-error'
import Client from '../../../lib/apollo';

export const topUp = (amount) => {
  return (dispatch, getState) => {
      dispatch({ type: 'BOOKING.REQUEST_BOOKING' });

      const user = getState()['user.auth'].login.user;
      const variables = { amount: parseInt(amount, 10), paymentType: 1 };

      return (
        Client
          .query({
            query: mutationQuery,
            variables
          })
          .then(res => {
            console.log(res, 'res topup');
            
            if (res.data.vestaTopup) {
              dispatch({ type: 'BOOKING.ADD_BOOKING', data: res.data.vestaTopup });
              if (user) dispatch({ type: 'USER.UPDATE_BOOKING_LOGIN', data: res.data.vestaTopup });
              else dispatch({ type: 'BOOKING.ADD_BOOKING_HISTORY', data: res.data.vestaTopup });
            }
          })
          .catch(error => {
            console.log(JSON.stringify(error),'error topup');

            let message = 'Gagal melakukan topup';
            if (error && error.graphQLErrors &&  error.graphQLErrors.length > 0) {
              message = error.graphQLErrors[0].message;
            }

            dispatch({
              type: 'BOOKING.ADD_BOOKING_ERROR',
              data: message,
            });
          })
      );
  };
};

const mutationQuery = gql`
query(
    $amount: Float,
    $paymentType: Int
){
    vestaTopup (
        amount: $amount,
        paymentType: $paymentType
    ) {
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
      vat
      vestabalance {
        transaction_id amount status
      }
    }
}
`;
