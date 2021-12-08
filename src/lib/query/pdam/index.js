import gql from 'graphql-tag';

export const queryInquiryPascaBayarPDAM = gql `
  query(
    $area_pelayanan: PDAM_AREA_CODE
    $nomor_pelanggan: String!
  ){
    Inquiry_PascaBayar_PDAM(
      area_pelayanan: $area_pelayanan
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
        bill_quantity
        address
        biller_admin
        pdam_name
        stamp_dut
        due_date
        kode_tarif
        bill{
          detail{
            period
            first_meter
            last_meter
            penalty
            bill_amount
            misc_amount
            stand
          }
        }
      }
    }
  }
`;

export const queryListArea = gql`
  {
    GET_LIST_PDAM_AREA
  }
`;