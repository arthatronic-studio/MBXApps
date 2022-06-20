import static_pasar_master from "./static_pasar_master";

export default [
  {
    id: 9,
    order: 0,
    code: 'block_2_0',
    label: 'ID Pasar',
    placeholder: 'Pilih ID',
    hint_label: '',
    type: 'SELECT_BOX',
    header_id: 2,
    client_type: 'TRIBES_SURVEY_PASAR',
    required: true,
    options: static_pasar_master.slice(0, 300),
    default_value: null,
    validation: {extraData: static_pasar_master},
    multiple: false,
    parent_code: null,
    branching_code: [],
    legacy_code: [],
    status: 1,
  },
  {
    id: 1,
    order: 1,
    code: 'block_2_1',
    label: 'Nama Pasar',
    placeholder: 'Masukan nama pasar',
    hint_label: '',
    type: 'TEXT_INPUT',
    header_id: 2,
    client_type: 'TRIBES_SURVEY_PASAR',
    required: true,
    options: [],
    default_value: null,
    validation: {prefixText: 'Pasar'},
    multiple: false,
    parent_code: null,
    branching_code: [],
    legacy_code: [],
    status: 1,
  },
  
  // {
  //     id: 2,
  //     order: 2,
  //     code: 'block_2_2',
  //     label: 'Pin Lokasi',
  //     placeholder: 'Pilih di Peta',
  //     hint_label: '',
  //     type: 'AUTOFILL_ADDRESS',
  //     header_id: 2,
  //     client_type: 'TRIBES_SURVEY_PASAR',
  //     required: true,
  //     options: [],
  //     default_value: null,
  //     validation: null,
  //     multiple: false,
  //     parent_code: null,
  //     branching_code: [],
  //     legacy_code: [],
  //     status: 1,
  // },
  {
    id: 3,
    order: 3,
    code: 'block_2_3',
    label: 'Pin Lokasi',
    placeholder: 'Pilih di Peta',
    hint_label: '',
    type: 'MAP_VIEW',
    header_id: 2,
    client_type: 'TRIBES_SURVEY_PASAR',
    required: true,
    options: [],
    default_value: null,
    validation: null,
    multiple: false,
    parent_code: null,
    branching_code: [],
    legacy_code: [],
    status: 1,
  },
  {
    id: 4,
    order: 4,
    code: 'block_2_4',
    label: 'Alamat lengkap',
    placeholder: 'Masukan alamat lengkap',
    hint_label: '',
    type: 'TEXT_AREA',
    header_id: 2,
    client_type: 'TRIBES_SURVEY_PASAR',
    required: true,
    options: [],
    default_value: null,
    validation: null,
    multiple: false,
    parent_code: null,
    branching_code: [],
    legacy_code: [],
    status: 1,
  },
  // Branch Prov, Kab, Kec, Kel
  {
    id: 5,
    order: 5,
    code: 'block_2_5',
    label: 'Provinsi',
    name: 'province_id',
    placeholder: 'Pilih provinsi',
    hint_label: '',
    type: 'SELECT_BOX',
    header_id: 2,
    client_type: 'TRIBES_SURVEY_PASAR',
    required: true,
    options: [],
    default_value: null,
    validation: {
      fetch: true,
      shema: 'queryGetProvince',
    },
    multiple: false,
    parent_code: null,
    branching_code: ['block_2_6'],
    legacy_code: ['block_2_6', 'block_2_7', 'block_2_8'],
    status: 1,
  },
  {
    id: 6,
    order: 6,
    code: 'block_2_6',
    label: 'Kabupaten atau Kota',
    name: 'city_id',
    placeholder: 'Pilih kabupaten atau kota',
    hint_label: '',
    type: 'SELECT_BOX',
    header_id: 2,
    client_type: 'TRIBES_SURVEY_PASAR',
    required: true,
    options: [],
    default_value: null,
    validation: {
      fetch: true,
      shema: 'queryGetCity',
    },
    multiple: false,
    parent_code: 'block_2_5',
    branching_code: ['block_2_7'],
    legacy_code: ['block_2_7', 'block_2_8'],
    status: 2,
  },
  {
    id: 7,
    order: 7,
    code: 'block_2_7',
    label: 'Kecamatan',
    name: 'suburb_id',
    placeholder: 'Pilih kecamatan',
    hint_label: '',
    type: 'SELECT_BOX',
    header_id: 2,
    client_type: 'TRIBES_SURVEY_PASAR',
    required: true,
    options: [],
    default_value: null,
    validation: {
      fetch: true,
      shema: 'queryGetSub',
    },
    multiple: false,
    parent_code: 'block_2_6',
    branching_code: ['block_2_8'],
    legacy_code: ['block_2_8'],
    status: 2,
  },
  {
    id: 8,
    order: 8,
    code: 'block_2_8',
    label: 'Kelurahan atau Desa',
    name: 'area_id',
    placeholder: 'Pilih kelurahan atau desa',
    hint_label: '',
    type: 'SELECT_BOX',
    header_id: 2,
    client_type: 'TRIBES_SURVEY_PASAR',
    required: true,
    options: [],
    default_value: null,
    validation: {
      fetch: true,
      shema: 'queryGetArea',
    },
    multiple: false,
    parent_code: 'block_2_7',
    branching_code: [],
    legacy_code: [],
    status: 2,
  },
];