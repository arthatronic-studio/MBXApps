import gql from 'graphql-tag';
import Client from '../../../lib/apollo';

export const pdamPostpaid = (variables) => {
    return (dispatch, getState) => {
        dispatch({ type: 'BOOKING.REQUEST_BOOKING' });

        const user = getState()['user.auth'].login.user;

        console.log(variables, 'variables');

        return (
            Client.mutate({
                mutation: mutationPayPDAM,
                variables
              })
              .then(res => {
                console.log(res, 'res pulsa postpaid');
                if (res.data.Pay_PDAM) {
                  dispatch({
                    type: 'BOOKING.ADD_BOOKING',
                    data: res.data.Pay_PDAM
                  });
        
                  if (user) {
                    dispatch({
                      type: 'USER.UPDATE_BOOKING_LOGIN',
                      data: res.data.Pay_PDAM
                    });
                  } else {
                    dispatch({
                      type: 'BOOKING.ADD_BOOKING_HISTORY',
                      data: res.data.Pay_PDAM
                    })
                  }
                }
              })
              .catch(error => {
                console.log(JSON.stringify(error),'error pdam');

                let message = 'Gagal melakukan pembelian pdam';
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

const mutationPayPDAM = gql`
  mutation(
    $Kode_Area: PDAM_AREA_CODE,
    $NomorPelanggan: String!
  ) {
    Pay_PDAM(
      Kode_Area: $Kode_Area
      NomorPelanggan: $NomorPelanggan
    ) {
      id
      userId
      invoiceNumber
      contact {
        title {
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
      bookingStatus {
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
      postpaidTransaction {
        id
        orderId
        paymentRequestData
        paymentResponseData
        transactionId
        productCode
        productCode
        customerSubscribeNumber
        customerName
        billPeriod
        nominal
        adminFee
        inquiryResponseCode
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