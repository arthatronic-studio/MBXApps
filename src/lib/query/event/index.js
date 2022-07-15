import gql from 'graphql-tag';

export const mutatuinEventManage = gql`
  mutation ($type: EventManageEnum!, $newEvent: EventInput, $eventId: Int) {
    eventManage(type: $type, newEvent: $newEvent, eventId: $eventId) {
      success
      message
      data {
        id
        userId
        author
        category
        name
        description
        date
        startTime
        endTime
        location
        lat
        lng
        images
        startPrice
        discountPrice
        bookedCounts
        isFavorite
        tickets {
          id
          userId
          eventId
          name
          quota
          type
          refund
          reservation
          categories
          price
          discountType
          discountValue
          createdAt
          updatedAt
          deletedAt
        }
        refundPolicy
        tnc
        provinsi
        kota
        kecamatan
        kelurahan
        ordered
        bookmarked
        createdAt
        updatedAt
        deletedAt
      }
    }
  }
`;


export const mutationAddEvent = gql`
mutation(
  $type: EventManageEnum!
  $newEvent: EventInput
){
eventManage(
    type: $type
    newEvent: $newEvent
  ){
    message
    success
    data{
      name
    }
  }
}
`;

export const getHistory = gql`
  query (
    $page: Int
    $itemPerPage: Int
    $userId: Int
  ) {
    eventTicketOrderList(
      page: $page
      itemPerPage: $itemPerPage
      userId: $userId
    ) {
      id
      status
      orderNumber
      discount
      totalAmount
      price
      createdAt
      expiredAt
      userOrderName
      userOrderPhone
      userOrderEmail
      qty
      event {
        name
        date
        startTime
        endTime
        author
        images
        provinsi
        kota
        kecamatan
        kelurahan
      }
      items {
        title
        name
        phone
        email
        idCardNumber
      }
    }
  }
`;

export const getDetailOrderEvent = gql`
  query (
    $id: Int
  ) {
    eventTicketOrderDetail(
      id: $id
    ) {
      id
      eventId
      orderNumber
      bookingId
      status
      orderNumber
      discount
      totalAmount
      price
      createdAt
      expiredAt
      userOrderName
      userOrderPhone
      userOrderEmail
      qty
      event{
        images
        ordered
        name
        date
        startTime
        endTime
        author
        images
        provinsi
        kota
        kecamatan
        kelurahan
        tickets{
          name
          id
          eventId
          quota
          reservation
          refund
          type
          createdAt
          userId
        }
      }
      items {
        name
        title
        name
        phone
        email
        idCardNumber
        uniqueCode
      }
      ticket{
        name
        id
        eventId
        quota
        reservation
        refund
        type
        createdAt
        userId
      }
      payment{
        name
      }
    }
  }
`;

export const getEventList = gql`
  query (
    $page: Int
    $itemPerPage: Int
    $isFavorite: Boolean
    $category: EventCategoryEnum
    $type: EventTypeEnum
    $userId: Int
    $bookmarked: Boolean
  ) {
    eventList(
      page: $page
      itemPerPage: $itemPerPage
      isFavorite: $isFavorite
      category: $category
      type: $type
      userId: $userId
      bookmarked: $bookmarked
    ) {
      id
      userId
      author
      category
      type
      name
      description
      date
      startTime
      endTime
      location
      lat
      lng
      images
      startPrice
      discountPrice
      bookedCounts
      isFavorite
      refundPolicy
      ordered
      tickets{
        id
        userId
        eventId
        name
        quota
        type
        refund
        reservation
        categories
        price
        discountType
        discountValue
        createdAt
        updatedAt
        deletedAt
      }
      refundPolicy
      tnc
      provinsi
      kota
      kecamatan
      kelurahan
      ordered
      bookmarked
      createdAt
      updatedAt
      deletedAt
    }
  }
`;

export const getDetailEvent = gql`
  query ($id: Int) {
    eventDetail(id: $id) {
      id
      author
      category
      name
      description
      date
      startTime
      type
      endTime
      location
      images
      startPrice
      discountPrice
      bookedCounts
      isFavorite
      refundPolicy
      ordered
      tickets {
        id
        userId
        eventId
        name
        quota
        type
        refund
        reservation
        categories
        price
        discountType
        discountValue
      }
      refundPolicy
      tnc
      provinsi
      kota
      kecamatan
      kelurahan
      ordered
      bookmarked
      createdAt
      updatedAt
      deletedAt
    }
  }
`;

export const mutationOrderEvent = gql`
  mutation eventTicketOrderManage(
    $type: EventTicketOrderManageEnum!
    $newOrder: EventTicketOrderInput
  ) {
    eventTicketOrderManage(type: $type, newOrder: $newOrder) {
      success
      message
      data {
        id
        bookingId
        ticketId
        orderNumber
        price
        vat
        discount
        totalTicketPrice
        status
        createdAt
        paidAt
        expiredAt
        totalAmount
      }
    }
  }
`;
