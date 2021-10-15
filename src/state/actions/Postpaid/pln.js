import gql from 'graphql-tag';
import Client from '../../../lib/apollo';

export const plnPostpaid = (variables) => {
  return (dispatch, getState) => {
    dispatch({ type: 'BOOKING.REQUEST_BOOKING' });

    const user = getState()['user.auth'].login.user;

    console.log(variables, 'var');

    return (
      Client.mutate({
        mutation: Pay_PLN_PascaBayar,
        variables
      })
      .then(res => {
        if (res.data.Pay_PLN_PascaBayar) {
          console.log('booking add');
          dispatch({
            type: 'BOOKING.ADD_BOOKING',
            data: res.data.Pay_PLN_PascaBayar
          });

          if(user){
            console.log('booking user');
            dispatch({
              type: 'USER.UPDATE_BOOKING_LOGIN',
              data: res.data.Pay_PLN_PascaBayar
            });
          }else {
            dispatch({
              type: 'BOOKING.ADD_BOOKING_HISTORY',
              data: res.data.Pay_PLN_PascaBayar
            })
          }
        }
        console.log(res, 'res Pay_PLN_PascaBayar');
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

const Pay_PLN_PascaBayar = gql`
  mutation(
    $NomorPelanggan: String!
  ){
    Pay_PLN_PascaBayar(
      NomorPelanggan: $NomorPelanggan
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
      vat
      postpaidTransaction{
        id
        orderId
        paymentRequestData
        paymentResponseData
        transactionId
        productCode
        customerSubscribeNumber
        customerName
        billPeriod
        nominal
        adminFee
        inquiryResponseCode
        inquiryResponseMessage
        price
        sellingPrice
        refId
        paymentResponseCode
        paymentResponseMessage
        paymentResponseDescription
        lastUpdated
      }
    }
  }
`;
