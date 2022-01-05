import gql from 'graphql-tag';

export const queryCheckBookingStatus = gql`
  query(
    $bookingId: Int!
  ) {
   bookingDetail(
      bookingId: $bookingId
   ) {
      id
      bookingStatus { id name }
   }
 }
`;

export const queryCancelBooking = gql`
  mutation(
    $bookingId: Int!
  ) {
    cancelBooking( bookingId: $bookingId ) { bookingStatus { id name } }
  }
`;

export const queryCurrentUserBookings = gql`
  query(
    $page: Int
    $itemPerPage: Int
    $type: BookingStatusType
    $productType: BookingProductType
  ) {
    currentUserBookings(
      page: $page
      itemPerPage: $itemPerPage
      type: $type
      productType: $productType
    ){
      id
      userId
      invoiceNumber
      contact {
        title { id name abbr isAdult }
        firstName
        lastName
        email
        countryCode
        phone
        address
        postalCode
      }
      bookingStatus { id name }
      amount
      discount
      vat
      adminFee
      finalAmount
      isFullPayment
      payments {
        type { id name }
        amount
        discount
        transactionFee
        finalAmount
        paidAt
        transferAccountNumber
      }
      paymentTryCount
      createdAt
      updatedAt
      expiresAt
      productTypes
      name
      description
      vestabalance{
        id
        user_id
        order_id
        deposit_id
        transaction_id
        amount
        created_date
        expired_date
        updated_date
        paid_date
        status
        req_request
        req_response
        paid_request
        paid_response
      }
      vestaPlan{
        id
        bookingId
        code
        planId
        userId
        amount
        discount
        vat
        finalAmount
        createdDate
        expiredDate
        status
      }
      vestaBiller{
        user_id
        transaction_id
        amount
        created_date
        expired_date
        updated_date
        paid_date
        status
        type
        due_date_label
        payment_status
        payment_status_color
        is_closed
        parent_transaction_id
        schema
        billing_record{
          order_id
          name
          due_date_label
          payment_status
          payment_status_color
          full_name
        }
        discount_term{
          name
          month
          amount
          discount
          final_amount
        }
        total_record
        total_amount
        progress_percentage
        image
      }
      prepaidTransaction {
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
        requestData
        responseData{
          token
          sn
          message
        }
        order_status
        request_data
        response_data
        lastUpdated
      }
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
      general{
        id
        order_id
        status
        final_amount
        email
        markup
        amount
        discount
        additional_fee
        transaction_fee
        ppn
        created_at
        updated_at
        confirm_date
        cancellation_date
        product_code
        quantity
        product_name
        product_image
        product_detail
      }
    }
  }
`;

// export const queryCurrentUserBookings = gql`
//   query(
//     $page: Int
//     $itemPerPage: Int
//     $type: BookingStatusType
//     $productType: BookingProductType
//   )
//   {
//     currentUserBookings(
//       page: $page
//       itemPerPage: $itemPerPage
//       type: $type
//       productType: $productType
//     ){
//       id
//       userId
//       invoiceNumber
//       createdAt
//       expiresAt
//       amount
//       discount
//       vat
//       adminFee
//       finalAmount
//       name
//       description
//       contact {
//         title { name abbr }
//         firstName
//         lastName
//         email
//         countryCode
//         phone
//         address
//         postalCode
//       }
//       bookingStatus { id name }
//       payments {
//         type { id name }
//         amount
//       }
//       flights {
//         departure {
//           bookingCode
//           fareDetail
//           total
//           journeys {
//             origin { code name cityName countryCode }
//             destination { code name cityName countryCode }
//             airline { name code logoUrl }
//             departsAt
//             arrivesAt
//             flightNumber
//             seatClass
//           }
//         }
//         return {
//           bookingCode
//           fareDetail
//           total
//           journeys {
//             origin { code name cityName countryCode }
//             destination { code name cityName countryCode }
//             airline { name code logoUrl }
//             departsAt
//             arrivesAt
//             flightNumber
//             seatClass
//           }
//         }
//         passengers {
//           type
//           title { name abbr }
//           firstName
//           lastName
//           birthDate
//           nationality
//           idNumber
//           phone
//           passport { number expirationDate issuingCountry }
//         }
//       }
//       tours {
//         price { subTotal vat airportTaxAndFuel visa discount total }
//         paymentAmount
//         priceDetail {
//           specs { type price count total }
//           dp
//           isDp
//           isIncludeVisa
//         }
//         tourSnapshot {
//           id
//           name
//           slug
//           departure {
//             date
//             duration
//             airlines { name logoUrl code }
//           }
//         }
//         rooms {
//           travellers { type titleAbbr priceType firstName lastName birthDate }
//         }
//       }
//       vestabalance {
//         id amount status
//       }
//       attractions {
//         id
//         paxPrice { adults children seniors }
//         timeslottxt
//         message
//         adults
//         children
//         seniors
//         arrivaldate
//         attraction_name
//         confirm_date
//         status
//         discount
//         ppn
//         final_amount
//       }
//       buses {
//         booking_code
//         booking_id
//         order_id
//         seats {
//           busesCode
//           busesName
//           departureCode
//           arrivalCode
//           departureName
//           arrivalName
//           departureDate
//           arrivalDate
//           seatPosition
//           rateCode
//           date
//           type
//           boardingPoint{
//             pointId
//             pointName
//             pointTime
//             pointAddress
//             pointLandmark
//             pointContact
//           }
//           droppingPoint{
//             pointId
//             pointName
//             pointTime
//             pointAddress
//             pointLandmark
//             pointContact
//           }
//           passenger{
//             title
//             fullname
//             name
//             surname
//             birthdate
//             address
//             city
//             country
//             postal_code
//             phone_number
//             age
//             email
//             id_card
//           }
//         }
//       }
//       hotels {
//         HotelConfig { name value }
//         id
//         bookingId
//         bookingDate
//         checkInDate
//         checkOutDate
//         hotelName
//         hotelBoardName
//         hotelCategory
//         cancellationAmount
//         rateClass
//         rateClassName
//         hotelImage
//         hotelCustomerRemark
//         hotelAdult
//         hotelChild
//         hotelInfant
//         hotelRoomCodeName
//         hotelAddress
//         amount
//         markup
//         discount
//         additionalFee
//         transactionFee
//         ppn
//         finalAmount
//       }
//       prepaidTransaction {
//         id
//         orderId
//         refId
//         status
//         code
//         destinationNumber
//         price
//         message
//         balance
//         tr_id
//         rc
//         category
//         order_status
//         request_data
//         response_data
//         lastUpdated
//         responseData{
//           token
//           sn
//           message
//         }
//       }
//       postpaidTransaction{
//         id
//         orderId
//         paymentRequestData
//         paymentResponseData
//         transactionId
//         productCode
//         customerSubscribeNumber
//         customerName
//         billPeriod
//         nominal
//         adminFee
//         inquiryResponseCode
//         inquiryResponseMessage
//         price
//         sellingPrice
//         refId
//         paymentResponseCode
//         paymentResponseMessage
//         paymentResponseDescription
//         lastUpdated
//       }
//       vestaBiller{
//         user_id
//         transaction_id
//         amount
//         created_date
//         expired_date
//         updated_date
//         paid_date
//         status
//         type
//         due_date_label
//         payment_status
//         payment_status_color
//         is_closed
//         parent_transaction_id
//         billing_record{
//           order_id
//           name
//           due_date_label
//           payment_status
//           payment_status_color
//         }
//         discount_term{
//           name
//           month
//           amount
//           discount
//           final_amount
//         }
//       }
//     }
//   }`
// ;