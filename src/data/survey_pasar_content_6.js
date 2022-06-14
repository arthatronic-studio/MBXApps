export default [
    {
        id: 1,
        order: 1,
        code: 'block_6_1',
        label: 'Foto Toko',
        placeholder: 'Tambah Foto',
        hint_label: '',
        type: 'UPLOAD',
        header_id: 3,
        client_type: 'TRIBES_SURVEY_PASAR',
        required: true,
        options: [],
        default_value: null,
        validation: { uploadType: 'image', uploadLimit: 1, uploadMin: 1 },
        multiple: true,
        parent_code: null,
        branching_code: [],
        legacy_code: [],
        status: 1,
    },
    {
        id: 2,
        order: 2,
        code: 'block_6_2',
        label: 'Nama Toko',
        placeholder: 'Masukan nama toko',
        hint_label: '',
        type: 'TEXT_INPUT',
        header_id: 1,
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
        id: 3,
        order: 3,
        code: 'block_6_3',
        label: 'Nama Pemilik',
        placeholder: 'Masukan nama pemilik',
        hint_label: '',
        type: 'TEXT_INPUT',
        header_id: 1,
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
        code: 'block_6_4',
        label: 'Nomor Telepon',
        placeholder: '81234567890',
        hint_label: '',
        type: 'TEXT_INPUT',
        header_id: 1,
        client_type: 'TRIBES_SURVEY_PASAR',
        required: true,
        options: [],
        default_value: null,
        validation: { keyboardType: 'number-pad', prefixText: '+62' },
        multiple: false,
        parent_code: null,
        branching_code: [],
        legacy_code: [],
        status: 1,
    },
    {
        id: 5,
        order: 5,
        code: 'block_6_5',
        label: 'Proses Distribusi Barang (Mobil)',
        placeholder: '',
        hint_label: '',
        type: 'RADIO',
        header_id: 3,
        client_type: 'TRIBES_SURVEY_PASAR',
        required: true,
        options: [
            { id: 'pribadi', name: 'Pribadi' },
            { id: 'sewa', name: 'Sewa' },
        ],
        default_value: null,
        validation: null,
        multiple: false,
        parent_code: null,
        branching_code: [],
        legacy_code: [],
        status: 1,
    },
    // {
    //     id: 6,
    //     order: 6,
    //     code: 'block_6_6',
    //     label: 'Jenis Survey Komoditi',
    //     placeholder: 'Masukan jenis',
    //     hint_label: '',
    //     type: 'TEXT_INPUT',
    //     header_id: 1,
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
    // Minyak
    {
        id: 7,
        order: 7,
        code: 'block_6_7',
        label: 'Apakah Jualan Minyak Curah',
        placeholder: 'Pilih Opsi',
        hint_label: '',
        type: 'SELECT_BOX',
        header_id: 3,
        client_type: 'TRIBES_SURVEY_PASAR',
        required: true,
        options: [
            { id: '1', name: 'Ya' },
            { id: null, name: 'Tidak' },
        ],
        default_value: null,
        validation: null,
        multiple: false,
        parent_code: null,
        branching_code: ['block_6_8'],
        legacy_code: ['block_6_8'],
        status: 1,
    },
    {
        id: 8,
        order: 8,
        code: 'block_6_8',
        label: 'Berapa Jualan Rata Rata Per Hari',
        placeholder: 'Masukan jumlah',
        hint_label: '',
        type: 'TEXT_INPUT',
        header_id: 1,
        client_type: 'TRIBES_SURVEY_PASAR',
        required: true,
        options: [],
        default_value: null,
        validation: { keyboardType: 'number-pad', suffixText: 'Liter' },
        multiple: false,
        parent_code: 'block_6_7',
        branching_code: [],
        legacy_code: [],
        status: 2,
    },
    // Kedelai
    {
        id: 9,
        order: 9,
        code: 'block_6_9',
        label: 'Apakah Jualan Kedelai',
        placeholder: 'Pilih Opsi',
        hint_label: '',
        type: 'SELECT_BOX',
        header_id: 3,
        client_type: 'TRIBES_SURVEY_PASAR',
        required: true,
        options: [
            { id: '1', name: 'Ya' },
            { id: null, name: 'Tidak' },
        ],
        default_value: null,
        validation: null,
        multiple: false,
        parent_code: null,
        branching_code: ['block_6_10'],
        legacy_code: ['block_6_10'],
        status: 1,
    },
    {
        id: 10,
        order: 10,
        code: 'block_6_10',
        label: 'Berapa Jualan Rata Rata Per Hari',
        placeholder: 'Masukan jumlah',
        hint_label: '',
        type: 'TEXT_INPUT',
        header_id: 1,
        client_type: 'TRIBES_SURVEY_PASAR',
        required: true,
        options: [],
        default_value: null,
        validation: { keyboardType: 'number-pad', suffixText: 'Kg' },
        multiple: false,
        parent_code: 'block_6_9',
        branching_code: [],
        legacy_code: [],
        status: 2,
    },
    // Mie
    {
        id: 11,
        order: 11,
        code: 'block_6_11',
        label: 'Apakah Jualan Mie Instan',
        placeholder: 'Pilih Opsi',
        hint_label: '',
        type: 'SELECT_BOX',
        header_id: 3,
        client_type: 'TRIBES_SURVEY_PASAR',
        required: true,
        options: [
            { id: '1', name: 'Ya' },
            { id: null, name: 'Tidak' },
        ],
        default_value: null,
        validation: null,
        multiple: false,
        parent_code: null,
        branching_code: ['block_6_12', 'block_6_13'],
        legacy_code: ['block_6_12', 'block_6_13'],
        status: 1,
    },
    {
        id: 12,
        order: 12,
        code: 'block_6_12',
        label: 'Berapa Jualan Rata Rata Per Hari',
        placeholder: 'Masukan jumlah',
        hint_label: '',
        type: 'TEXT_INPUT',
        header_id: 1,
        client_type: 'TRIBES_SURVEY_PASAR',
        required: true,
        options: [],
        default_value: null,
        validation: { keyboardType: 'number-pad', suffixText: 'Pcs' },
        multiple: false,
        parent_code: 'block_6_11',
        branching_code: [],
        legacy_code: [],
        status: 2,
    },
    // {
    //     id: 13,
    //     order: 13,
    //     code: 'block_6_13',
    //     label: 'Merk Mie Yang Dijual',
    //     placeholder: 'Masukan merk',
    //     hint_label: '',
    //     type: 'TEXT_INPUT',
    //     header_id: 1,
    //     client_type: 'TRIBES_SURVEY_PASAR',
    //     required: true,
    //     options: [],
    //     default_value: null,
    //     validation: { reviewRemoveLabel: true },
    //     multiple: false,
    //     parent_code: 'block_6_11',
    //     branching_code: [],
    //     legacy_code: [],
    //     status: 2,
    // },
    // Terigu
    {
        id: 14,
        order: 14,
        code: 'block_6_14',
        label: 'Apakah Jualan Tepung Terigu',
        placeholder: 'Pilih Opsi',
        hint_label: '',
        type: 'SELECT_BOX',
        header_id: 3,
        client_type: 'TRIBES_SURVEY_PASAR',
        required: true,
        options: [
            { id: '1', name: 'Ya' },
            { id: null, name: 'Tidak' },
        ],
        default_value: null,
        validation: null,
        multiple: false,
        parent_code: null,
        branching_code: ['block_6_15', 'block_6_16'],
        legacy_code: ['block_6_15', 'block_6_16'],
        status: 1,
    },
    {
        id: 15,
        order: 15,
        code: 'block_6_15',
        label: 'Berapa Jualan Rata Rata Per Hari',
        placeholder: 'Masukan jumlah',
        hint_label: '',
        type: 'TEXT_INPUT',
        header_id: 1,
        client_type: 'TRIBES_SURVEY_PASAR',
        required: true,
        options: [],
        default_value: null,
        validation: { keyboardType: 'number-pad', suffixText: 'Kg' },
        multiple: false,
        parent_code: 'block_6_14',
        branching_code: [],
        legacy_code: [],
        status: 2,
    },
    // {
    //     id: 16,
    //     order: 16,
    //     code: 'block_6_16',
    //     label: 'Merk Yang Dijual',
    //     placeholder: 'Masukan merk',
    //     hint_label: '',
    //     type: 'TEXT_INPUT',
    //     header_id: 1,
    //     client_type: 'TRIBES_SURVEY_PASAR',
    //     required: true,
    //     options: [],
    //     default_value: null,
    //     validation: { reviewRemoveLabel: true },
    //     multiple: false,
    //     parent_code: 'block_6_14',
    //     branching_code: [],
    //     legacy_code: [],
    //     status: 2,
    // },
    // Beras
    {
        id: 17,
        order: 17,
        code: 'block_6_17',
        label: 'Apakah Jualan Beras',
        placeholder: 'Pilih Opsi',
        hint_label: '',
        type: 'SELECT_BOX',
        header_id: 3,
        client_type: 'TRIBES_SURVEY_PASAR',
        required: true,
        options: [
            { id: '1', name: 'Ya' },
            { id: null, name: 'Tidak' },
        ],
        default_value: null,
        validation: null,
        multiple: false,
        parent_code: null,
        branching_code: ['block_6_18'],
        legacy_code: ['block_6_18'],
        status: 1,
    },
    {
        id: 18,
        order: 18,
        code: 'block_6_18',
        label: 'Berapa Jualan Rata Rata Per Hari',
        placeholder: 'Masukan jumlah',
        hint_label: '',
        type: 'TEXT_INPUT',
        header_id: 1,
        client_type: 'TRIBES_SURVEY_PASAR',
        required: true,
        options: [],
        default_value: null,
        validation: { keyboardType: 'number-pad', suffixText: 'Kg' },
        multiple: false,
        parent_code: 'block_6_17',
        branching_code: [],
        legacy_code: [],
        status: 2,
    },
    // Garam
    {
        id: 19,
        order: 19,
        code: 'block_6_19',
        label: 'Apakah Jualan Garam',
        placeholder: 'Pilih Opsi',
        hint_label: '',
        type: 'SELECT_BOX',
        header_id: 3,
        client_type: 'TRIBES_SURVEY_PASAR',
        required: true,
        options: [
            { id: '1', name: 'Ya' },
            { id: null, name: 'Tidak' },
        ],
        default_value: null,
        validation: null,
        multiple: false,
        parent_code: null,
        branching_code: ['block_6_20'],
        legacy_code: ['block_6_20'],
        status: 1,
    },
    {
        id: 20,
        order: 20,
        code: 'block_6_20',
        label: 'Berapa Jualan Rata Rata Per Hari',
        placeholder: 'Masukan jumlah',
        hint_label: '',
        type: 'TEXT_INPUT',
        header_id: 1,
        client_type: 'TRIBES_SURVEY_PASAR',
        required: true,
        options: [],
        default_value: null,
        validation: { keyboardType: 'number-pad', suffixText: 'Kg' },
        multiple: false,
        parent_code: 'block_6_19',
        branching_code: [],
        legacy_code: [],
        status: 2,
    },
    // Gula
    {
        id: 21,
        order: 21,
        code: 'block_6_21',
        label: 'Apakah Jualan Gula',
        placeholder: 'Pilih Opsi',
        hint_label: '',
        type: 'SELECT_BOX',
        header_id: 3,
        client_type: 'TRIBES_SURVEY_PASAR',
        required: true,
        options: [
            { id: '1', name: 'Ya' },
            { id: null, name: 'Tidak' },
        ],
        default_value: null,
        validation: null,
        multiple: false,
        parent_code: null,
        branching_code: ['block_6_22'],
        legacy_code: ['block_6_22'],
        status: 1,
    },
    {
        id: 22,
        order: 22,
        code: 'block_6_22',
        label: 'Berapa Jualan Rata Rata Per Hari',
        placeholder: 'Masukan jumlah',
        hint_label: '',
        type: 'TEXT_INPUT',
        header_id: 1,
        client_type: 'TRIBES_SURVEY_PASAR',
        required: true,
        options: [],
        default_value: null,
        validation: { keyboardType: 'number-pad', suffixText: 'Kg' },
        multiple: false,
        parent_code: 'block_6_21',
        branching_code: [],
        legacy_code: [],
        status: 2,
    },
    // Penjualan Tertinggi
    {
        id: 23,
        order: 23,
        code: 'block_6_23',
        label: 'Produk Penjualan Tertinggi di Toko Anda',
        placeholder: '',
        hint_label: '',
        type: 'LABEL',
        header_id: 3,
        client_type: 'TRIBES_SURVEY_PASAR',
        required: false,
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
        id: 24,
        order: 24,
        code: 'block_6_24',
        name: 'Merk 1',
        label: '',
        placeholder: 'Masukan nama merk',
        hint_label: '',
        type: 'TEXT_INPUT',
        header_id: 1,
        client_type: 'TRIBES_SURVEY_PASAR',
        required: true,
        options: [],
        default_value: null,
        validation: { prefixText: '1' },
        multiple: false,
        parent_code: '',
        branching_code: [],
        legacy_code: [],
        status: 1,
    },
    {
        id: 25,
        order: 25,
        code: 'block_6_25',
        name: 'Merk 2',
        label: '',
        placeholder: 'Masukan nama merk',
        hint_label: '',
        type: 'TEXT_INPUT',
        header_id: 1,
        client_type: 'TRIBES_SURVEY_PASAR',
        required: true,
        options: [],
        default_value: null,
        validation: { prefixText: '2' },
        multiple: false,
        parent_code: '',
        branching_code: [],
        legacy_code: [],
        status: 1,
    },
    {
        id: 26,
        order: 26,
        code: 'block_6_26',
        name: 'Merk 3',
        label: '',
        placeholder: 'Masukan nama merk',
        hint_label: '',
        type: 'TEXT_INPUT',
        header_id: 1,
        client_type: 'TRIBES_SURVEY_PASAR',
        required: true,
        options: [],
        default_value: null,
        validation: { prefixText: '3' },
        multiple: false,
        parent_code: '',
        branching_code: [],
        legacy_code: [],
        status: 1,
    },
    // Produk lain yang diperlukan
    {
        id: 27,
        order: 27,
        code: 'block_6_27',
        label: 'Apa produk lain yang diperlukan untuk dijual',
        placeholder: '',
        hint_label: '',
        type: 'LABEL',
        header_id: 3,
        client_type: 'TRIBES_SURVEY_PASAR',
        required: false,
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
        id: 28,
        order: 28,
        code: 'block_6_28',
        name: 'Merk 1',
        label: '',
        placeholder: 'Masukan nama merk',
        hint_label: '',
        type: 'TEXT_INPUT',
        header_id: 1,
        client_type: 'TRIBES_SURVEY_PASAR',
        required: false,
        options: [],
        default_value: null,
        validation: { prefixText: '1' },
        multiple: false,
        parent_code: '',
        branching_code: [],
        legacy_code: [],
        status: 1,
    },
    {
        id: 29,
        order: 29,
        code: 'block_6_29',
        name: 'Merk 2',
        label: '',
        placeholder: 'Masukan nama merk',
        hint_label: '',
        type: 'TEXT_INPUT',
        header_id: 1,
        client_type: 'TRIBES_SURVEY_PASAR',
        required: false,
        options: [],
        default_value: null,
        validation: { prefixText: '2' },
        multiple: false,
        parent_code: '',
        branching_code: [],
        legacy_code: [],
        status: 1,
    },
    {
        id: 30,
        order: 30,
        code: 'block_6_30',
        name: 'Merk 3',
        label: '',
        placeholder: 'Masukan nama merk',
        hint_label: '',
        type: 'TEXT_INPUT',
        header_id: 1,
        client_type: 'TRIBES_SURVEY_PASAR',
        required: false,
        options: [],
        default_value: null,
        validation: { prefixText: '3' },
        multiple: false,
        parent_code: '',
        branching_code: [],
        legacy_code: [],
        status: 1,
    },
    {
        id: 31,
        order: 31,
        code: 'block_6_31',
        name: 'Merk 4',
        label: '',
        placeholder: 'Masukan nama merk',
        hint_label: '',
        type: 'TEXT_INPUT',
        header_id: 1,
        client_type: 'TRIBES_SURVEY_PASAR',
        required: false,
        options: [],
        default_value: null,
        validation: { prefixText: '4' },
        multiple: false,
        parent_code: '',
        branching_code: [],
        legacy_code: [],
        status: 1,
    },
    {
        id: 32,
        order: 32,
        code: 'block_6_32',
        name: 'Merk 5',
        label: '',
        placeholder: 'Masukan nama merk',
        hint_label: '',
        type: 'TEXT_INPUT',
        header_id: 1,
        client_type: 'TRIBES_SURVEY_PASAR',
        required: false,
        options: [],
        default_value: null,
        validation: { prefixText: '5' },
        multiple: false,
        parent_code: '',
        branching_code: [],
        legacy_code: [],
        status: 1,
    },
]