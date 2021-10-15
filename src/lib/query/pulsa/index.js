import gql from 'graphql-tag';

export const queryCheckOperator = gql`
  query(
      $mobileNumber: String
  ){
    mobilePulsaCheckOperator(
      mobileNumber: $mobileNumber
    )
  }
`;

export const queryPrepaidPriceList = gql`
  query(
      $param: RequestServiceType!
  ){
    mobilePulsaPrepaidPriceList(
      param: $param
    ){
      pulsa_code
      pulsa_op
      pulsa_nominal
      pulsa_price
      pulsa_type
      masaaktif
      status
    }
  }
`;

export const queryCheckSubscriber = gql`
  query(
    $operator_pascabayar: EnumPascaBayarTelpon!
    $nomor_pelanggan: String!
  ){
    Inquiry_PascaBayar_TELEPON(
      operator_pascabayar: $operator_pascabayar
      nomor_pelanggan: $nomor_pelanggan
    ){
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
        kode_area
        divre
        datel
        jumlah_tagihan
        tagihan{
          detail{
            periode
            nilai_tagihan
            admin
            total
          }
        }
      }
    }
  }
`;