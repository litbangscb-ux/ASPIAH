import { FinancingApplication } from './types';

export const INITIAL_APPLICATIONS: FinancingApplication[] = [];

export const PROGRAM_SECTIONS = [
  {
    id: "latar-belakang",
    title: "Latar Belakang",
    icon: "BookOpen",
    short: "Mengapa program pembiayaan syariah ini dibentuk untuk pegawai SCB.",
    content: [
      "Dalam mendukung kesejahteraan pegawai dan civitas pesantren, koperasi memiliki peran tidak hanya sebagai unit usaha, tetapi juga sebagai sarana pelayanan dan tolong-menolong yang sesuai dengan prinsip syariah. Seiring perkembangan kebutuhan, pegawai seringkali membutuhkan fasilitas penunjang kerja maupun kebutuhan penting lainnya seperti:",
      "• Laptop",
      "• Handphone",
      "• Tablet",
      "• Perangkat penunjang pekerjaan",
      "• Kebutuhan peralatan dan perlengkapan pendidikan dan produktivitas",
      "Namun di sisi lain, akses pembiayaan di luar lembaga seringkali menggunakan sistem ribawi, bunga tinggi, atau mekanisme yang memberatkan. Oleh karena itu, Koperasi Cendekia Syariah merancang Program Pembiayaan Syariah Pegawai sebagai solusi pembiayaan yang:",
      "• Aman",
      "• Transparan",
      "• Ringan",
      "• Sesuai prinsip syariah",
      "• Terintegrasi dengan sistem lembaga",
      "Program ini menggunakan akad murabahah (jual beli dengan margin keuntungan yang disepakati di awal), bukan sistem pinjaman berbunga."
    ]
  },
  {
    id: "tujuan",
    title: "Tujuan Program",
    icon: "Target",
    short: "Misi sosial dan religius dari koperasi Cendekia Corner Syariah.",
    content: [
      "1. Membantu pegawai memenuhi kebutuhan penunjang kerja dan produktivitas",
      "2. Menghindarkan pegawai dari praktik riba",
      "3. Memberikan fasilitas pembiayaan yang aman dan terkontrol",
      "4. Mendukung kesejahteraan pegawai pesantren",
      "5. Menguatkan peran koperasi syariah di lingkungan lembaga"
    ]
  },
  {
    id: "prinsip",
    title: "Prinsip Syariah",
    icon: "ShieldAlert", // wait let's use a nice icon from lucide like ShieldCheck
    short: "Kesesuaian syariah berlandaskan akad Murabahah.",
    content: [
      "Program pembiayaan ini menggunakan akad Murabahah Bil Wakalah (Jual Beli dengan Penegasan Margin melalui Perwakilan).",
      "Koperasi bertindak sebagai Penjual yang membelikan terlebih dahulu barang yang diajukan oleh Pegawai (baik secara langsung maupun diwakilkan kepada pegawai menggunakan uang koperasi), kemudian koperasi menjual barang tersebut kepada pegawai dengan harga jual yang terdiri dari Harga Beli Asli ditambah Margin Keuntungan Koperasi (Ribhun) yang disepakati bertahap di awal akad.",
      "Harga jual yang sudah disepakati dalam akad bersifat mengikat dan tetap (fixed) hingga akhir masa cicilan. Tidak diperkenankan adanya perubahan harga jual sepihak oleh koperasi di tengah jalan tanpa persetujuan, dan tidak ada pengenaan denda bunga bergulung apabila nasabah mengalami kendala pembayaran.",
      "Karakteristik:",
      "• Harga barang jelas",
      "• Margin keuntungan jelas",
      "• Cicilan tetap",
      "• Tidak berubah selama akad",
      "• Tidak menggunakan bunga"
    ]
  },
  {
    id: "ketentuan",
    title: "Ketentuan Umum",
    icon: "FileCheck",
    short: "Syarat-syarat pengajuan pembiayaan bagi pegawai.",
    content: [
      "1. Pemohon berstatus sebagai Pegawai Tetap atau Pegawai Kontrak Sekolah Cendekia BAZNAS (SCB).",
      "2. Pemohon terdaftar sebagai Anggota Koperasi Simpan Pinjam Cendekia Corner Syariah.",
      "3. Rasio total potongan angsuran pembiayaan tidak boleh melebihi 30% dari total gaji bulanan pokok bersangkutan (demi menjaga stabilitas keuangan rumah tangga pegawai).",
      "4. Barang yang diajukan adalah barang yang halal secara syariat, memiliki kegunaan yang jelas, dan tidak diperuntukkan bagi transaksi non-halal/konsumsi haram.",
      "Jenis Pembiayaan yang Diperbolehkan:",
      "✅ Diperbolehkan",
      "• Laptop",
      "• HP",
      "• Tablet",
      "• Peralatan kerja",
      "• Kebutuhan peralatan dan perlengkapan pendidikan",
      "• Barang produktif lainnya",
      "❌ Tidak Diperbolehkan",
      "• Pembiayaan makan harian",
      "• Kebutuhan konsumtif berlebihan",
      "• Barang tidak jelas",
      "• Dana tunai bebas tanpa objek barang"
    ]
  },
  {
    id: "skema",
    title: "Skema Pembiayaan & Margin",
    icon: "Layers",
    short: "Informasi persentase margin keuntungan pembiayaan koperasi.",
    content: [
      "Pembiayaan ini bersifat murni jual beli dengan margin keuntungan koperasi yang sangat kompetitif dan bersahabat.",
      "Ketentuan Margin Keuntungan Koperasi sebagai berikut:",
      "• Jangka Waktu (Tenor): Tenor pembiayaan dikunci tetap selama 1 tahun (12 bulan). Tidak ada pilihan jangka waktu lainnya.",
      "• Margin Keuntungan Koperasi: Margin flat sebesar 15% dari pokok nilai pembiayaan selama jangka waktu 1 tahun tersebut.",
      "Keuntungan ini dirumuskan terbuka secara transparan sejak awal. Sebagai contoh: Jika Anda melakukan pembiayaan laptop dengan sisa Rp 10.000.000, maka margin keuntungan koperasi adalah Rp 1.500.000 (15%). Total harga jual koperasi adalah Rp 11.500.000, dan angsuran bulanan tetap selama 1 tahun adalah Rp 11.500.000 / 12 = Rp 958.333 per bulan."
    ]
  },
  {
    id: "pembayaran",
    title: "Sistem Pembayaran",
    icon: "Coins",
    short: "Tata cara pelunasan angsuran bulanan pembiayaan pegawai.",
    content: [
      "Guna mempermudah administrasi dan meminimalisir risiko kelupaan yang berujung denda sosial, pembayaran dilakukan secara autodebet/potong gaji langsung melui Bendahara Keuangan Sekolah Cendekia BAZNAS.",
      "Pegawai wajib menandatangani Surat Kuasa Potong Gaji (Salary Deduction Authorization) yang terdapat di dalam lembar permohonan pembiayaan.",
      "Pemotongan angsuran per bulan akan dilakukan tepat saat tanggal gajian pegawai setiap bulannya sampai limit jangka waktu pelunasan akad berakhir."
    ]
  },
  {
    id: "tambahan",
    title: "Ketentuan Tambahan & Pengelolaan Untung",
    icon: "Briefcase",
    short: "Informasi seputar kepemilikan barang dan sisa hasil usaha koperasi.",
    content: [
      "• Kepemilikan Barang: Segera setelah akad Murabahah ditandatangani dan barang diserahterimakan, hak milik barang sepenuhnya beralih dari koperasi ke pegawai, namun menjadi jaminan moral untuk diselesaikan cicilannya.",
      "• Larangan Pemindahtanganan: Pegawai dilarang menjual, menghibahkan, atau menggadaikan barang pembiayaan sebelum masa angsuran dinyatakan lunas secara formal oleh manajemen koperasi.",
      "• Distribusi Sisa Hasil Usaha (SHU): Seluruh margin keuntungan pembiayaan yang terkumpul akan dibukukan dalam Laporan Keuangan Tahunan Koperasi Cendekia Corner Syariah, dan 40% - 60% keuntungan bersih dialokasikan untuk dibagikan kembali kepada Pegawai yang menjadi anggota aktif dalam bentuk SHU Koperasi di Rapat Anggota Tahunan (RAT)."
    ]
  },
  {
    id: "nilai",
    title: "Nilai luhur Program",
    icon: "Heart",
    short: "Nilai kebaikan syariah yang dijunjung tinggi bersama.",
    content: [
      "• KEHALALAN: Terhindar dari sanksi riba dan dosa bunga pinjaman.",
      "• TRANSFARI: Terbuka dan tidak ada jaminan sitaan paksa yang merugikan sepihak.",
      "• KEKELUARGAAN: Apabila pegawai wafat atau mengalami cacat tetap dalam masa bakti, koperasi akan menyelesaikan sisa angsuran secara kekeluargaan melalui Dana Kebajikan/Takaful internal koperasi.",
      "• DARI ANGGOTA, UNTUK ANGGOTA: Margin profit koperasi ujungnya akan kembali dinikmati bersama oleh para pengajar Sekolah Cendekia BAZNAS sebagai pemilik koperasi."
    ]
  }
];
