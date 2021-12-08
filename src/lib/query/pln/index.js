import gql from 'graphql-tag';

export const queryPlnPrepaidSubs = gql`
  query(
    $customerID: String
  ){
    mobilePulsaCheck_PLN_Prabayar_Subcriber(
      customerID: $customerID
    ){
      status
      hp
      meter_no
      subscriber_id
      name
      segment_power
      message
      rc
    }
  }
`;

export const queryPlnPrepaidList = gql`
  query(
    $param: RequestServiceType!
  ){
    mobilePulsaPrepaidPriceList(
      param:$param
    )
    {
     pulsa_code
      pulsa_op
      pulsa_nominal
      pulsa_price
      pulsa_type
      masaaktif
      status
    }
  }`
;

export const queryInquiryPascaBayarPLN = gql`
  query(
    $nomor_pelanggan: String!
  ){
    Inquiry_PascaBayar_PLN(
      nomor_pelanggan: $nomor_pelanggan
    ) {
      tr_id
      code
      hp
      tr_name
      period
      nominal
      admin
      ref_id
      response_code
      message
      price
      selling_price
      desc{
        tarif
        daya
        lembar_tagihan
        tagihan{
          detail{
            periode
            nilai_tagihan
            admin
            denda
            total
          }
        }
      }
    }
  }
`;