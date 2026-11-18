import { FinancingApplication } from './types';

export const INITIAL_APPLICATIONS: FinancingApplication[] = [];

export const PROGRAM_SECTIONS = [
  {
    id: "latar-belakang",
    title: "Latar Belakang",
    icon: "BookOpen",
    short: "Mengapa program pembiayaan syariah ini dibentuk untuk pegawai SCB.",
    content: [
      "Dalam mendukung kesejahteraan pegawai dan civitas pesantren, koperasi memiliki peran tidak hanya sebagai unit usaha, tetapi juga sebagai sarana pelayanan dan tolong-menolong yang sesuai dengan prinsip syariah. Seiring perkembangan kebutuhan, pegawai seringkali membutuhkan fasilitas penunjang kerja maupun kebutuhan penting lainnya yang halal, bermanfaat, dan diperbolehkan dalam syariat. Namun di sisi lain, akses pembiayaan di luar lembaga seringkali menggunakan sistem ribawi, bunga tinggi, atau mekanisme yang memberatkan. Oleh karena itu, Koperasi Cendekia Syariah merancang Program Pembiayaan Syariah Pegawai sebagai solusi pembiayaan yang:",
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
    id: "persyaratan",
    title: "Persyaratan Pengajuan",
    icon: "UserCheck",
    short: "Kriteria dan syarat wajib bagi peminjam.",
    content: [
      "Peminjam wajib:",
      "• Pegawai aktif dengan masa kerja minimal 1 tahun.",
      "• Memiliki track record yang baik",
      "• Tidak memiliki pelanggaran berat",
      "• Mendapat persetujuan manajemen",
      "• Bersedia mengikuti sistem potong gaji otomatis",
      "• Menandatangani akad syariah"
    ]
  },
  {
    id: "penilaian",
    title: "Penilaian Kelayakan Pembiayaan",
    icon: "ClipboardCheck",
    short: "Kriteria dan aspek penilaian persetujuan pembiayaan.",
    content: [
      "Persetujuan pembiayaan dilakukan berdasarkan:",
      "• Kinerja pegawai",
      "• Kedisiplinan",
      "• Amanah dan tanggung jawab",
      "• Riwayat pembiayaan sebelumnya",
      "• Masa kerja",
      "• Pertimbangan manajemen"
    ]
  },
  {
    id: "batas-cicilan",
    title: "Batas Maksimal Cicilan",
    icon: "Percent",
    short: "Aturan batas maksimal cicilan terhadap gaji bulanan.",
    content: [
      "Untuk menjaga kesehatan finansial pegawai:",
      "Maksimal cicilan disarankan 30–35% dari gaji bulanan."
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
    title: "Skema Pembiayaan",
    icon: "Layers",
    short: "Tahapan alur proses pengajuan pembiayaan syariah.",
    content: [
      "1. Pegawai Mengajukan Permohonan",
      "Pegawai mengajukan:",
      "• Nama barang",
      "• Harga barang",
      "• Tujuan penggunaan",
      "• Estimasi tenor cicilan",
      "----------------------------------------",
      "2. Verifikasi Koperasi",
      "Koperasi melakukan pengecekan:",
      "• Track record",
      "• Kemampuan pembayaran",
      "• Riwayat cicilan",
      "----------------------------------------",
      "3. Persetujuan Manajemen",
      "Manajemen memberikan ACC berdasarkan:",
      "• Kinerja",
      "• Kedisiplinan",
      "• Kepentingan kebutuhan",
      "----------------------------------------",
      "4. Koperasi Membeli Barang",
      "Koperasi membeli barang yang diajukan pegawai.",
      "----------------------------------------",
      "5. Akad Murabahah",
      "Koperasi menjual kembali barang kepada pegawai dengan margin yang telah disepakati.",
      "----------------------------------------",
      "6. Cicilan Bulanan",
      "Pegawai membayar melalui sistem potong gaji otomatis."
    ]
  },
  {
    id: "skema-margin",
    title: "Skema Margin & Simulasi",
    icon: "Calculator",
    short: "Informasi skema margin dan contoh perhitungan simulasi.",
    content: [
      "Skema Margin:",
      "• 12 bulan : 15%",
      "• 10 bulan : 15%",
      "• 08 bulan : 15%",
      "• 06 bulan : 15%",
      "• 03 bulan : 15%",
      "Margin ditentukan di awal akad dan tidak berubah selama masa pembiayaan.",
      "----------------------------------------",
      "Contoh Simulasi:",
      "Laptop Rp5.000.000",
      "Tenor:",
      "• 12 bulan",
      "Margin:",
      "• 15%",
      "Harga jual:",
      "• Rp5.750.000",
      "Cicilan:",
      "• Rp479.000/bulan"
    ]
  },
  {
    id: "pembayaran",
    title: "Sistem Pembayaran",
    icon: "Coins",
    short: "Tata cara pelunasan angsuran bulanan pembiayaan pegawai.",
    content: [
      "Pembayaran dilakukan melalui:",
      "POTONG GAJI OTOMATIS",
      "yang dikoordinasikan bersama:",
      "• HRD",
      "• Bagian Keuangan",
      "• Koperasi Cendekia Syariah",
      "----------------------------------------",
      "Alur Pembayaran:",
      "• Pengajuan Disetujui",
      "↓",
      "• Akad Ditandatangani",
      "↓",
      "• Persetujuan Potong Gaji",
      "↓",
      "• Data Diserahkan ke HRD & Keuangan",
      "↓",
      "• Potongan Gaji Otomatis Tiap Bulan",
      "↓",
      "• Dana Masuk ke Koperasi"
    ]
  },
  {
    id: "tambahan",
    title: "Ketentuan Tambahan",
    icon: "Briefcase",
    short: "Informasi seputar ketentuan tambahan pembiayaan.",
    content: [
      "1. Tidak Diperbolehkan Double Pembiayaan",
      "Pegawai yang masih memiliki cicilan aktif tidak diperbolehkan mengambil pembiayaan baru sebelum pembiayaan sebelumnya selesai.",
      "----------------------------------------",
      "2. Keterlambatan Pembayaran",
      "Karena menggunakan sistem potong gaji otomatis, keterlambatan diharapkan dapat diminimalisasi.",
      "Jika terjadi kendala:",
      "• Akan dilakukan musyawarah",
      "• Tidak menggunakan denda berbunga",
      "----------------------------------------",
      "3. Pegawai Resign / Berhenti",
      "Sisa kewajiban:",
      "• Diselesaikan melalui hak keuangan terakhir ATAU",
      "• Kesepakatan pelunasan khusus"
    ]
  },
  {
    id: "pengelolaan-keuntungan",
    title: "Pengelolaan Keuntungan",
    icon: "TrendingUp",
    short: "Alokasi dan pemanfaatan keuntungan margin pembiayaan.",
    content: [
      "Keuntungan margin digunakan untuk:",
      "• Penguatan modal koperasi",
      "• Dana cadangan risiko",
      "• Pengembangan program koperasi",
      "• SHU koperasi",
      "• Dana sosial/ta’awun"
    ]
  },
  {
    id: "nilai",
    title: "Nilai luhur Program",
    icon: "Heart",
    short: "Nilai kebaikan syariah yang dijunjung tinggi bersama.",
    content: [
      "• Tolong-menolong dalam kebaikan. Poin ini berlandaskan prinsip ta'awun (saling membantu) dalam Islam. Dana yang dikelola tidak semata-mata mencari keuntungan komersial, melainkan menjadi sarana solidaritas bagi anggota yang membutuhkan bantuan modal atau kebutuhan mendesak.",
      "• Menghindari praktik riba. Program ini menggunakan akad-akad sesuai syariat Islam, seperti jual beli dengan margin yang disepakati (murabahah), bagi hasil (mudharabah), atau pinjaman kebajikan tanpa tambahan (qardhul hasan). Cara ini melindungi peserta dari jeratan bunga pinjaman konvensional maupun rentenir yang memberatkan.",
      "• Mendukung kesejahteraan keluarga pesantren. Akses pembiayaan yang adil membantu guru, staf, maupun wali santri memenuhi kebutuhan keluarga atau mengembangkan usaha mikro. Ketika ekonomi keluarga stabil, proses pendidikan dan pengabdian di pesantren dapat berjalan lebih tenang.",
      "• Menguatkan ekonomi syariah di lingkungan lembaga. Perputaran dana yang dikelola secara internal menciptakan kemandirian finansial bagi pesantren. Langkah ini sekaligus membangun ekosistem ekonomi halal yang sehat dan menjadi sarana edukasi praktik keuangan syariah secara nyata bagi warga lembaga."
    ]
  }
];
