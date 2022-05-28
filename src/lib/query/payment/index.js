import gql from 'graphql-tag';

export const queryPaymentMethods = gql`
  query(
    $bookingId: Int!
    $batchBookingId: [Int]
  ) {
   paymentMethods(
     bookingId: $bookingId
     batchBookingId: $batchBookingId
   ) {
      id name items { id class name installment minPaymentAmount logo discount transactionFee finalAmount }
   }
  }
`;

export const queryVestaBalance = gql`
  query{
    vestaBalance { amount wallet }
  }
`;

export const queryVestaOpenBalance = gql`
  query {
    vestaOpenBalance { success message }
  }
`;

export const queryVoucherCheck = gql`
  query(
    $voucherCode: String!
    $bookingId: Int!
    $paymentId: Int!
  ) {
    voucherCheck(
      voucherCode: $voucherCode
      bookingId: $bookingId
      paymentId: $paymentId
    ) {
      discountAmount transactionFee finalAmount
    }
  }
`;

export const queryPay = gql`
  mutation pay(
    $bookingId: Int!
    $paymentId: Int!
    $voucherCode: String
    $paymentPhoneNumber: String
    $batchBookingId: [Int]
  ){
    pay(
      bookingId: $bookingId
      paymentId: $paymentId
      voucherCode: $voucherCode
      paymentPhoneNumber: $paymentPhoneNumber
      batchBookingId: $batchBookingId
    ) {
      redirectUrl transferAccountNumber paymentAmount
    }
  }
`;