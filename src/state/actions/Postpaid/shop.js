import gql from 'graphql-tag';
import Client from '../../../lib/apollo';

export const shopPostpaid = (variables) => {
    return (dispatch, getState) => {
        dispatch({ type: 'BOOKING.REQUEST_BOOKING' });

        const user = getState()['user.auth'].login.user;

        console.log(variables, 'variables')

        return (
            Client.mutate({
                mutation: mutationPayTeleponPascaBayar,
                variables
              })
              .then(res => {
                console.log(res, 'res pulsa postpaid');
                if (res.data.Pay_Telepon_PascaBayar) {
                  console.log('booking add');
                  dispatch({
                    type: 'BOOKING.ADD_BOOKING',
                    data: res.data.Pay_Telepon_PascaBayar
                  });
        
                  if(user){
                    console.log('booking user');
                    dispatch({
                      type: 'USER.UPDATE_BOOKING_LOGIN',
                      data: res.data.Pay_Telepon_PascaBayar
                    });
                  }else {
                    dispatch({
                      type: 'BOOKING.ADD_BOOKING_HISTORY',
                      data: res.data.Pay_Telepon_PascaBayar
                    })
                  }
                }
                console.log(res.data.Pay_Telepon_PascaBayar, 'res data');
              })
              .catch(error => {
                console.log(JSON.stringify(error),'error pulsa');

                let message = 'Gagal melakukan pembelian pulsa';
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

const mutationPayTeleponPascaBayar = gql`
  mutation(
    $productId: Int!,
  ) {
    ecommerceCreateNewOrder(
      productId: $productId
    ) {
        orderId
        orderNumber
        totalPrice
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