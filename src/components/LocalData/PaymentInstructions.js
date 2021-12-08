const BNIVA = [
    {
      title: 'Pembayaran melalui ATM BNI',
      desc: [
        { text: 'Masukkan kartu Anda.' },
        { text: 'Pilih Bahasa.' },
        { text: 'Masukkan PIN ATM Anda.' },
        { text: 'Pilih “Menu Lainnya”.' },
        { text: 'Pilih “Transfer”.' },
        { text: 'Pilih “Rekening Tabungan”.' },
        { text: 'Pilih “Ke Rekening BNI”.' },
        { text: 'Masukkan nomor rekening tujuan dengan 16 digit Nomor VA.' },
        { text: 'Masukkan nominal transfer sesuai jumlah yang harus dibayarkan.' },
        { text: 'Konfirmasi, apabila telah sesuai, lanjutkan transaksi.' },
        { text: 'Transaksi telah selesai.' }
      ]
    },
    {
      title: 'Pembayaran melalui ATM BCA / Mandiri / ATM Bersama',
      desc: [
        { text: 'Masukkan kartu ke mesin ATM bersama.' },
        { text: 'Pilih "Transaksi Lainnya".' },
        { text: 'Pilih menu "Transfer".' },
        { text: 'Pilih "Transfer ke Bank Lain".' },
        { text: 'Masukkan kode bank BNI (009) dan 16 Digit.' },
        { text: 'Masukkan nomor VA.' },
        { text: 'Masukkan jumlah pembayaran.' },
        { text: 'Konfirmasi rincian Anda akan tampil di layar.' },
        { text: 'Cek dan tekan "Ya" untuk melanjutkan.' }
      ]
    },
    {
      title: 'Pembayaran melalui Transfer bank lain',
      desc: [
        { text: 'Pilih menu "Transfer antar bank" atau “Transfer online antarbank”.' },
        { text: 'Masukkan kode bank BNI (009) atau pilih bank yang dituju yaitu BNI.' },
        { text: 'Masukan 16 Digit Nomor VA pada kolom rekening tujuan.' },
        { text: 'Masukkan jumlah pembayaran.' },
        { text: 'Konfirmasi rincian Anda akan tampil di layar, cek dan apabila sudah sesuai silahkan.' },
        { text: 'Lanjutkan transaksi sampai dengan selesai.' }
      ]
    },
    {
      title: 'Pembayaran melalui SMS Banking BNI',
      desc: [
        { text: 'Buka aplikasi SMS Banking BNI.' },
        { text: 'Pilih menu "Transfer".' },
        { text: 'Pilih menu "Trf rekening BNI".' },
        { text: 'Ketik nomor Rekening Tujuan dan Nominal Transfer.' },
        { text: 'Pilih “Proses” kemudian “Setuju”.' },
        { text: 'Reply SMS dengan ketik pin sesuai perintah.' },
        { text: 'Transaksi Berhasil.' }
      ],
      info: [
        { text: 'Atau Dapat juga langsung mengetik sms dengan format:' },
        { text: 'TRF[SPASI]NomorVA[SPASI]NOMINAL ' },
        { text: 'dan kemudian kirim ke 3346' },
        { text: 'Contoh : TRF 8000111122223333 123000' }
      ]
    },
    {
      title: 'Pembayaran melalui iBank personal BNI',
      desc: [
        { text: 'Ketik alamat https://ibank.bni.co.id kemudian klik “Enter”.' },
        { text: 'Masukkan User ID dan Password.' },
        { text: 'Klik menu “TRANSFER” kemudian pilih “TAMBAH REKENING FAVORIT”. Jika menggunakan desktop untuk menambah rekening, pada menu “Transaksi”lalu pilih "Info & Administrasi Transfer" kemudian “Atur Rekening Tujuan” lalu “Tambah Rekening Tujuan”.' },
        { text: 'Masukkan nomor VA sebagai nomor rekening tujuan.' },
        { text: 'Masukkan Kode Otentikasi Token. Nomor rekening tujuan berhasil ditambahkan.' },
        { text: 'Kembali ke menu “TRANSFER”. Pilih “TRANSFER ANTAR REKENING BNI”, kemudian pilih rekening tujuan.' },
        { text: 'Pilih Rekening Debit dan ketik nominal yang akan ditransfer.' },
        { text: 'Lalu masukkan kode otentikasi token.' },
        { text: 'Transfer Anda Telah Berhasil.' }
      ]
    },
    {
      title: 'Pembayaran VA melalui Mobile Banking',
      desc: [
        { text: 'Akses BNI Mobile Banking dari handphone kemudian masukkan user ID dan password.' },
        { text: 'Pilih menu Transfer.' },
        { text: 'Pilih “Antar Rekening BNI” kemudian “Input Rekening Baru”.' },
        { text: 'Masukkan nomor Rekening Debit dan Rekening Tujuan.' },
        { text: 'Konfirmasi transaksi dan masukkan Password Transaksi.' },
        { text: 'Transaksi Anda Telah berhasil.' }
      ]
    }
  ];
  
  const ATMTransfer = [
    {
      title: 'Pembayaran melalui ATM Bersama',
      desc: [
        { text: 'Pilih Bahasa.' },
        { text: 'Masukkan PIN.' },
        { text: 'Pilih “Transaksi Lainnya”.' },
        { text: 'Pilih “Transfer”.' },
        { text: 'Pilih “Ke Rekening Bank Lain”.' },
        { text: 'Masukkan nomor rekening tujuan Kode Bank Permata (013) + 14 Digit Virtual Account, lalu tekan “Benar” (Jumlah yang ditransfer harus sama dengan yang ada pada tagihan, tidak lebih dan tidak kurang).', important: 'Jumlah nominal yang tidak sesuai dengan tagihan akan menyebabkan transaksi gagal.' },
        { text: 'Silakan isi atau kosongkan nomor referensi transfer kemudian tekan “Benar”.' },
        { text: 'Muncul Layar Konfirmasi Transfer yang berisi nomor rekening tujuan bank permata beserta jumlah yang dibayar.' },
        { text: 'Jika sudah benar, Tekan “Benar”.' },
        { text: 'Selesai.' }
      ]
    },
    {
      title: 'Pembayaran melalui ATM Prima',
      desc: [
        { text: 'Masukkan PIN.' },
        { text: 'Pilih “Transaksi Lainnya”.' },
        { text: 'Pilih “Transfer”.' },
        { text: 'Pilih “Ke Rek Bank Lain”.' },
        { text: 'Masukkan Kode sandi Bank Permata (013) kemudian tekan “Benar” Masukkan Jumlah pembayaran sesuai dengan yang ditagihkan dalam tiket. (Jumlah yang ditransfer harus sama dengan yang ada pada tagihan, tidak lebih dan tidak kurang).', important: 'Jumlah nominal yang tidak sesuai dengan tagihan akan menyebabkan transaksi gagal.' },
        { text: 'Masukkan Nomor Rekening tujuan kode Bank Permata (013) + 14 Digit Virtual Account, lalu tekan “Benar”.' },
        { text: 'Muncul Layar Konfirmasi Transfer yang berisi nomor rekening tujuan Bank Permata beserta jumlah yang dibayar, jika sudah benar, Tekan “Benar”.' },
        { text: 'Selesai.' }
      ]
    },
    {
      title: 'Pembayaran melalui Transfer Internet Banking',
      desc: [
        { text: 'Silahkan login internet banking kemudian pilih Menu Pembayaran.' },
        { text: 'Lalu pilih sub menu Pembayaran Tagihan dan klik Virtual Account.' },
        { text: 'Silahkan pilih rekening anda lalu masukkan nomor rekening dengan nomor Virtual Account (contoh: 78102021539202) lalu klik Lanjut.' },
        { text: 'Masukkan jumlah nominal tagihan pada bagian Total Pembayaran sesuai dengan invoice yang dikirimkan. Kemudian klik Submit.' },
        { text: 'Tunggu sebentar hingga anda memperoleh SMS notifikasi yang berisi sebuah KODE. Nah, setelah itu masukkan KODE tersebut.' },
        { text: 'Proses transfer internet banking telah selesai.' }
      ]
    },
    {
      title: 'Pembayaran melalui Transfer Mobile Banking',
      desc: [
        { text: 'Silahkan login mobile banking yang dimiliki Permata Bank.' },
        { text: 'Lalu klik Menu Pembayaran Tagihan dan pilih Menu Virtual Account.' },
        { text: 'Kemudian pilih Tagihan Anda dan pilih Daftar Tagihan Baru.' },
        { text: 'Masukkan nomor rekening dengan nomor Virtual Account Anda (contoh: 78102021539202) sebagai Nomor Tagihan. Apabila selesai silahkan klik Konfirmasi.' },
        { text: 'Masukkan Nama Pengingat setelah itu klik Lanjut. Apabila selesai silahkan klik Konfirmasi.' },
        { text: 'Masukkan jumlah nominal tagihan sesuai dengan invoice. Apabila selesai silahkan klik Konfirmasi.' },
        { text: 'Masukkan Response Code dan klik Konfirmasi apabila telah selesai.' },
        { text: 'Proses transfer telah selesai.' }
      ]
    }
  ];
  
  const PERMATAVA = [
    {
      title: 'Pembayaran melalui ATM Permata',
      desc: [
        { text: 'Pilih “Transaksi Lainnya”.' },
        { text: 'Pilih Pembayaran.' },
        { text: 'Pilih Pembayaran Lainnya.' },
        { text: 'Pilih Virtual Account.' },
        { text: 'Masukkan nomor 14 Digit Virtual Account, lalu tekan “Benar”.' },
        { text: 'Informasi pembayaran akan tertera, lalu tekan “Benar”.' },
        { text: 'Silahkan pilih akun pembayaran.' },
        { text: 'Selesai.' }
      ],
    },
    {
      title: 'Pembayaran melalui ATM Bersama',
      desc: [
        { text: 'Pilih Bahasa.' },
        { text: 'Masukkan PIN.' },
        { text: 'Pilih “Transaksi Lainnya”.' },
        { text: 'Pilih “Transfer”.' },
        { text: 'Pilih “Ke Rekening Bank Lain”.' },
        { text: 'Masukkan nomor rekening tujuan Kode Bank Permata (013) + 14 Digit Virtual Account, lalu tekan “Benar” (Jumlah yang ditransfer harus sama dengan yang ada pada tagihan, tidak lebih dan tidak kurang).', important: 'Jumlah nominal yang tidak sesuai dengan tagihan akan menyebabkan transaksi gagal.' },
        { text: 'Silakan isi atau kosongkan nomor referensi transfer kemudian tekan “Benar”.' },
        { text: 'Muncul Layar Konfirmasi Transfer yang berisi nomor rekening tujuan bank permata beserta jumlah yang dibayar.' },
        { text: 'Jika sudah benar, Tekan “Benar”.' },
        { text: 'Selesai.' }
      ]
    },
    {
      title: 'Pembayaran melalui ATM Prima',
      desc: [
        { text: 'Masukkan PIN.' },
        { text: 'Pilih “Transaksi Lainnya”.' },
        { text: 'Pilih “Transfer”.' },
        { text: 'Pilih “Ke Rek Bank Lain”.' },
        { text: 'Masukkan Kode sandi Bank Permata (013) kemudian tekan “Benar” Masukkan Jumlah pembayaran sesuai dengan yang ditagihkan dalam tiket. (Jumlah yang ditransfer harus sama dengan yang ada pada tagihan, tidak lebih dan tidak kurang).', important: 'Jumlah nominal yang tidak sesuai dengan tagihan akan menyebabkan transaksi gagal.' },
        { text: 'Masukkan Nomor Rekening tujuan kode Bank Permata (013) + 14 Digit Virtual Account, lalu tekan “Benar”.' },
        { text: 'Muncul Layar Konfirmasi Transfer yang berisi nomor rekening tujuan Bank Permata beserta jumlah yang dibayar, jika sudah benar, Tekan “Benar”.' },
        { text: 'Selesai.' }
      ]
    },
    {
      title: 'Pembayaran melalui Transfer Internet Banking',
      desc: [
        { text: 'Silahkan login internet banking kemudian pilih Menu Pembayaran.' },
        { text: 'Lalu pilih sub menu Pembayaran Tagihan dan klik Virtual Account.' },
        { text: 'Silahkan pilih rekening anda lalu masukkan nomor rekening dengan nomor Virtual Account (contoh: 78102021539202) lalu klik Lanjut.' },
        { text: 'Masukkan jumlah nominal tagihan pada bagian Total Pembayaran sesuai dengan invoice yang dikirimkan. Kemudian klik Submit.' },
        { text: 'Tunggu sebentar hingga anda memperoleh SMS notifikasi yang berisi sebuah KODE. Nah, setelah itu masukkan KODE tersebut.' },
        { text: 'Proses transfer internet banking telah selesai.' }
      ]
    },
    {
      title: 'Pembayaran melalui Transfer Mobile Banking',
      desc: [
        { text: 'Silahkan login mobile banking yang dimiliki Permata Bank.' },
        { text: 'Lalu klik Menu Pembayaran Tagihan dan pilih Menu Virtual Account.' },
        { text: 'Kemudian pilih Tagihan Anda dan pilih Daftar Tagihan Baru.' },
        { text: 'Masukkan nomor rekening dengan nomor Virtual Account Anda (contoh: 78102021539202) sebagai Nomor Tagihan. Apabila selesai silahkan klik Konfirmasi.' },
        { text: 'Masukkan Nama Pengingat setelah itu klik Lanjut. Apabila selesai silahkan klik Konfirmasi.' },
        { text: 'Masukkan jumlah nominal tagihan sesuai dengan invoice. Apabila selesai silahkan klik Konfirmasi.' },
        { text: 'Masukkan Response Code dan klik Konfirmasi apabila telah selesai.' },
        { text: 'Proses transfer telah selesai.' }
      ]
    }
  ];
  
  const CIMBVA = [
    {
      title: 'Pembayaran melalui ATM CIMB Niaga',
      desc: [
        { text: 'Menu Transfer.' },
        { text: 'Pilih Antar Rekening CIMB Niaga.' },
        { text: 'Masukkan Nominal Rekening Tujuan.' },
        { text: 'Pada Rekening Tujuan, Masukkan Nomor Virtual Account.' },
        { text: 'Konfirmasi dan Proses pembayaran.' },
      ]
    },
    {
      title: 'Pembayaran melalui ATM Prima / Bersama',
      desc: [
        { text: 'Menu Transfer.' },
        { text: 'Menu Rekening Bank Lain.' },
        { text: 'Pilih Kode Bank 022.' },
        { text: 'Pada rekening tujuan, masukan Nomor Virtual Account.' },
        { text: 'Masukkan Nominal Pembayaran.' },
        { text: 'Konfirmasi dan Proses pembayaran.' },
      ]
    },
    {
      title: 'Pembayaran melalui Teller Bank CIMB Niaga',
      desc: [
        { text: 'Rekening tujuan diisi dengan nomor virtual account.' },
        { text: 'Nama penerima diisi dengan "Nama Virtual Account".' },
        { text: 'Jumlah yang akan dibayar diisi sesuai invoice.' },
      ]
    },
    {
      title: 'Pembayaran melalui Teller Bank Lain',
      desc: [
        { text: 'Rekening tujuan diisi dengan Nomor Virtual Account.' },
        { text: 'Nama penerima diisi dengan "Nama Virtual Account"' },
        { text: 'Bank Penerima diisi dengan "CIMB Niaga" Kantor Pusat atau Cabang Jakarta' },
      ]
    },
    {
      title: 'Pembayaran melalui Internet Banking CIMB Niaga',
      desc: [
        { text: 'Pilih Menu Transfer.' },
        { text: 'Rekening Tujuan diisi dengan No Virtual Account.' },
        { text: 'Masukkan Nominal Pembayaran.' },
      ]
    },
    {
      title: 'Pembayaran melalui Internet Banking Bank Lain',
      desc: [
        { text: 'Rekening Tujuan diisi dengan No Virtual Account.' },
        { text: 'Untuk On Line Transaction / Real Time via ATM, Nama penerima diisi dengan "Nama Virtual Account".' },
        { text: 'Untuk transfer via LLG / RTGS Nama penerima diisi dengan "Nama Virtual Account"' },
        { text: 'Bank Penerima diisi dengan "CIMB Niaga" Kantor Pusat atau Cabang Jakarta' },
      ]
    }
  ];
  
  const BCAVA = [
    {
      title: 'Pemberitahuan',
      desc: [
        { text: 'Pembayaran Internet Banking tidak berlaku menggunakan LLG dan RTGS.' },
        { text: 'Pembayaran total transaksi tidak boleh kurang atau lebih dari IDR XXXXXXXX untuk menghindari kegagalan transaksi.' },
        { text: 'Perhatikan limit kartu anda sebelum membayar melalui ATM untuk menghindari kegagalan transaksi.' },
        { text: 'Order akan batal secara otomatis jika dalam 4 jam tidak dibayar.' },
      ]
    },
    {
      title: 'Pembayaran Akun Virtual Bank BCA melalui ATM',
      desc: [
        { text: 'Pilih menu Transfer.' },
        { text: 'Pilih Ke Rek. BCA Virtual Account.' },
        { text: 'Masukkan nomor Virtual Account BCA yang di dapat (10083XXXXXXXXX).' },
        { text: 'Masukan jumlah pembayaran sebesar IDR XXXXXXXX.' },
        { text: 'Maka akan ditampilkan halaman konfirmasi no Virtual Account BCA, nama dan jumlah pembayaran.' },
        { text: 'Pilih Ya.' },
      ]
    },
    {
      title: 'Pembayaran Akun Rekening Virtual Bank BCA',
      desc: [
        { text: 'Log in di situs Bank BCA www.klikbca.com.' },
        { text: 'Pilih Menu Transfer Dana – Transfer ke BCA Virtual Account.' },
        { text: 'Masukkan nomor Virtual Account BCA (10083XXXXXXXXX).' },
        { text: 'Akan tampil konfirmasi transaksi.' },
        { text: 'Masukkan jumlah nominal transfer sebesar IDR XXXXXXXX.' },
        { text: 'Masukkan berita.' },
        { text: 'Ikuti langkah selanjutnya sampai transaksi selesai.' },
      ]
    }
  ];
  
  const GENERAL_INSTRUCTION = [
    {
      title: 'Pembayaran Melalui ATM',
      desc: [
        { text: 'Masukkan kartu ATM & PIN.' },
        { text: 'Pilih Transaksi Lainnya.' },
        { text: 'Pilih Transfer.' },
        { text: 'Pilih ke Rekening Virtual Account.' },
        { text: 'Masukkan nomor Virtual Account.' },
        { text: 'Masukkan jumlah yang harus dibayarkan.' },
        { text: 'Pastikan kembali nomor Virtual Account dan jumlah pembayaran sudah benar.' },
        { text: 'Transaksi Selesai.' },
      ]
    }
  ];
  
  const PaymentInstructions = {
    BNIVA, ATMTransfer, PERMATAVA, CIMBVA, BCAVA, GENERAL_INSTRUCTION
  };
  
  export default PaymentInstructions;
  