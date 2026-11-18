import { FinancingApplication } from './types';

export const INITIAL_APPLICATIONS: FinancingApplication[] = [];

export const PROGRAM_SECTIONS = [
  {
    id: "latar-belakang",
    title: "Latar Belakang",
    icon: "BookOpen",
    short: "Landasan filosofis dan operasional program pembiayaan syariah pegawai SCB.",
    content: [
      "Dalam rangka mendukung peningkatan kesejahteraan pegawai dan civitas pesantren, koperasi memegang peranan strategis tidak hanya sebagai unit usaha komersial, tetapi juga sebagai wadah pelayanan dan tolong-menolong (ta'awun) yang berlandaskan prinsip syariah.",
      "Seiring dengan dinamika kebutuhan kerja dan kehidupan, pegawai seringkali memerlukan fasilitas pembiayaan untuk pengadaan perangkat penunjang produktivitas maupun kebutuhan esensial lainnya yang halal, bermanfaat, dan sesuai dengan nilai-nilai syariat.",
      "Mengingat masih maraknya institusi pembiayaan konvensional berbunga tinggi maupun layanan finansial digital ilegal yang berisiko merugikan secara finansial dan spiritual, Koperasi Cendekia Syariah menghadirkan Program Pembiayaan Syariah Pegawai sebagai solusi alternatif yang:",
      "• Aman dan terpercaya",
      "• Transparan tanpa biaya tersembunyi",
      "• Ringan dan terjangkau",
      "• Sesuai mutlak dengan prinsip syariah",
      "• Terintegrasi langsung dengan sistem administrasi lembaga",
      "Seluruh fasilitas pembiayaan ini murni menggunakan akad jual beli (Murabahah), yang terbebas dari unsur riba, denda bergulung, dan ketidakpastian."
    ]
  },
  {
    id: "tujuan",
    title: "Tujuan Program",
    icon: "Target",
    short: "Misi sosial, ekonomi, dan religius Koperasi Cendekia Corner Syariah.",
    content: [
      "1. Membantu pegawai dalam pengadaan sarana penunjang kerja dan peningkatan produktivitas kerja secara optimal.",
      "2. Melindungi segenap civitas akademika dan pegawai dari jeratan praktik riba dan pembiayaan non-formal yang memberatkan.",
      "3. Menyediakan fasilitas pembiayaan yang aman, terstruktur, terkontrol, dan berkeadilan.",
      "4. Mendukung peningkatan taraf kesejahteraan ekonomi keluarga pegawai di lingkungan pesantren.",
      "5. Menguatkan peran strategis koperasi syariah sebagai pilar kemandirian ekonomi lembaga."
    ]
  },
  {
    id: "prinsip",
    title: "Prinsip Syariah",
    icon: "ShieldAlert",
    short: "Kesesuaian operasional berlandaskan akad Murabahah Bil Wakalah.",
    content: [
      "Program pembiayaan ini menggunakan akad Murabahah Bil Wakalah (Jual Beli dengan Penegasan Margin melalui Perwakilan).",
      "Koperasi bertindak sebagai pihak penjual yang membelikan terlebih dahulu barang kebutuhan yang diajukan oleh Pegawai (baik secara langsung maupun melalui penunjukan wakil/mandat kepada pegawai), kemudian menjual kembali barang tersebut kepada pegawai dengan harga jual yang terdiri dari Harga Pokok Perolehan ditambah Margin Keuntungan Koperasi (Ribhun) yang disepakati secara transparan di awal akad.",
      "Harga jual yang telah disepakati bersifat mengikat dan tetap (fixed) hingga akhir masa cicilan. Tidak diperkenankan adanya penambahan harga atau perubahan sepihak di tengah masa cicilan, serta dilarang mengenakan denda penalti berbunga jika terjadi kendala pembayaran.",
      "Karakteristik Utama Akad:",
      "• Kejelasan objek dan spesifikasi barang",
      "• Transparansi besaran margin keuntungan",
      "• Nominal cicilan tetap (flat) setiap bulan",
      "• Tidak ada perubahan harga selama akad berlangsung",
      "• Bebas dari unsur riba dan bunga pinjaman"
    ]
  },
  {
    id: "persyaratan",
    title: "Persyaratan Pengajuan",
    icon: "UserCheck",
    short: "Kriteria administratif dan kualifikasi wajib bagi pemohon.",
    content: [
      "Setiap pemohon pembiayaan wajib memenuhi kriteria berikut:",
      "• Tercatat sebagai Pegawai aktif (Tetap atau Kontrak) di Sekolah Cendekia BAZNAS (SCB).",
      "• Memiliki rekam jejak (track record) kinerja dan kedisiplinan yang baik.",
      "• Tidak sedang memiliki catatan pelanggaran disiplin berat di lembaga.",
      "• Mendapatkan rekomendasi dan persetujuan dari atasan langsung / manajemen.",
      "• Bersedia mengikuti mekanisme pemotongan gaji secara otomatis (autodebet payroll).",
      "• Menandatangani akad perjanjian pembiayaan syariah secara sah."
    ]
  },
  {
    id: "penilaian",
    title: "Penilaian Kelayakan Pembiayaan",
    icon: "ClipboardCheck",
    short: "Parameter dan aspek evaluasi kelayakan permohonan.",
    content: [
      "Keputusan persetujuan pembiayaan didasarkan pada evaluasi objektif yang mencakup aspek:",
      "• Tingkat kinerja dan produktivitas pegawai di unit kerja.",
      "• Kedisiplinan dan kepatuhan terhadap aturan lembaga.",
      "• Integritas, amanah, dan tanggung jawab finansial.",
      "• Riwayat dan catatan pembiayaan sebelumnya (jika ada).",
      "• Masa pengabdian / masa kerja di lembaga.",
      "• Pertimbangan strategis manajemen dan stabilitas keuangan."
    ]
  },
  {
    id: "batas-cicilan",
    title: "Batas Maksimal Cicilan",
    icon: "Percent",
    short: "Ketentuan rasio beban angsuran untuk kesehatan finansial pegawai.",
    content: [
      "Kebijakan Rasio Angsuran:",
      "Untuk menjaga stabilitas keuangan rumah tangga dan mencegah risiko over-indebtedness, total akumulasi potongan angsuran pembiayaan dibatasi secara ketat maksimal 30% hingga 35% dari total penerimaan gaji bulanan pokok pegawai."
    ]
  },
  {
    id: "ketentuan",
    title: "Ketentuan Umum",
    icon: "FileCheck",
    short: "Aturan operasional dan batasan objek pembiayaan.",
    content: [
      "1. Pemohon merupakan pegawai sah Sekolah Cendekia BAZNAS dan terdaftar sebagai anggota Koperasi Cendekia Corner Syariah.",
      "2. Total rasio angsuran bulanan tidak melampaui batas toleransi kemampuan finansial (maksimal 35% dari penghasilan tetap).",
      "3. Barang yang diajukan harus bernilai halal secara syariat, memiliki kegunaan nyata yang produktif atau edukatif, serta tidak bertentangan dengan norma hukum dan agama.",
      "Jenis Pembiayaan yang Diperbolehkan:",
      "✅ Kategori Disetujui",
      "• Laptop / Komputer jinjing",
      "• Perangkat komunikasi (Handphone / Smartphone)",
      "• Tablet / Perangkat gadget penunjang tugas",
      "• Peralatan kerja profesional",
      "• Kebutuhan perlengkapan pendidikan dan referensi belajar",
      "• Barang produktif pendukung usaha atau keahlian",
      "❌ Kategori Ditolak / Tidak Diperbolehkan",
      "• Pembiayaan untuk konsumsi makan harian rutin",
      "• Kebutuhan gaya hidup konsumtif berlebihan (hedonisme)",
      "• Barang yang tidak jelas spesifikasi dan kegunaannya",
      "• Permintaan dana tunai bebas tanpa objek barang yang riil"
    ]
  },
  {
    id: "skema",
    title: "Skema & Alur Pembiayaan",
    icon: "Layers",
    short: "Prosedur operasional standar (SOP) pengajuan hingga realisasi pembiayaan.",
    content: [
      "1. Pengajuan Permohonan Digital via Aplikasi",
      "Pegawai mengisi formulir permohonan baru melalui aplikasi (meliputi biodata lengkap dan rincian barang pembiayaan) kemudian mengirimkannya untuk diproses.",
      "----------------------------------------",
      "2. Unduh Dokumen Pendukung Fisik (Format Word)",
      "Pemohon mengunduh dokumen pendukung yang diperlukan, yang terdiri dari:",
      "• Surat Permohonan Pembiayaan Syariah",
      "• Lembar Rekomendasi Atasan / Kepala Bidang",
      "• Draf Surat Akad Murabahah",
      "----------------------------------------",
      "3. Penyerahan Berkas ke Ketua Koperasi",
      "Pemohon mengisi dan melengkapi berkas fisik tersebut, kemudian menyerahkannya secara langsung kepada Ketua Koperasi.",
      "----------------------------------------",
      "4. Verifikasi dan Persetujuan Kepala Sekolah",
      "Ketua Koperasi mengunduh draf keputusan dari aplikasi, lalu menghadap Kepala Sekolah untuk melaporkan permohonan yang telah dilengkapi rekomendasi atasan. Setelah disetujui, Keputusan Kepala Sekolah ditandatangani dan diserahkan kembali kepada Ketua Koperasi.",
      "----------------------------------------",
      "5. Penerbitan Surat Keputusan & Verifikasi Koperasi",
      "Ketua Koperasi menerbitkan Surat Verifikasi dan Keputusan Koperasi resmi yang diserahkan kepada pemohon pinjaman.",
      "----------------------------------------",
      "6. Pengadaan / Pembelian Barang",
      "Jika disetujui (ACC), pembelian barang dilaksanakan oleh pihak koperasi ATAU dapat diwakilkan kepada pemohon dengan syarat mutlak: toko, alamat lengkap, nomor telepon, dan nomor rekening toko harus jelas agar dapat diverifikasi oleh pengurus koperasi.",
      "----------------------------------------",
      "7. Pelaksanaan Akad Murabahah & Serah Terima Barang",
      "Koperasi mengadakan Akad Murabahah dengan pemohon, wajib disaksikan minimal 1 (satu) orang saksi serta didokumentasikan (difoto). Setelah akad sah, barang diserahterimakan kepada pemohon.",
      "----------------------------------------",
      "8. Koordinasi Eksekusi Pemotongan Gaji (Payroll)",
      "Ketua Koperasi berkoordinasi secara intensif dengan Bagian HRD dan Bagian Keuangan untuk mengaktifkan pemotongan angsuran secara otomatis setiap bulan selama masa pembiayaan berjalan."
    ]
  },
  {
    id: "skema-margin",
    title: "Skema Margin & Simulasi",
    icon: "Calculator",
    short: "Tabel ketentuan margin tetap dan contoh perhitungan angsuran.",
    content: [
      "Tabel Skema Margin Pembiayaan:",
      "• Tenor 12 Bulan : Margin 15% flat",
      "• Tenor 10 Bulan : Margin 15% flat",
      "• Tenor 08 Bulan : Margin 15% flat",
      "• Tenor 06 Bulan : Margin 15% flat",
      "• Tenor 03 Bulan : Margin 15% flat",
      "Kepastian Ketentuan: Besaran margin keuntungan ditetapkan secara transparan di awal akad dan bersifat tetap (fixed) tidak mengalami perubahan hingga cicilan lunas.",
      "----------------------------------------",
      "Ilustrasi Contoh Simulasi Pembiayaan:",
      "• Objek Pembiayaan : Pengadaan Laptop",
      "• Harga Pokok Barang : Rp 5.000.000",
      "• Pilihan Tenor : 12 Bulan",
      "• Margin Koperasi (15%) : Rp 750.000",
      "• Total Harga Jual Akad : Rp 5.750.000",
      "• Angsuran Tetap Bulanan : Rp 479.000 / bulan"
    ]
  },
  {
    id: "pembayaran",
    title: "Sistem Pembayaran",
    icon: "Coins",
    short: "Mekanisme pelunasan angsuran dan alur koordinasi keuangan.",
    content: [
      "Metode Pelunasan Utama:",
      "PEMOTONGAN GAJI OTOMATIS (AUTODEBET PAYROLL)",
      "Pelaksanaan dikoordinasikan secara terpadu bersama:",
      "• Bagian Human Resources Department (HRD)",
      "• Bagian Keuangan / Bendahara Lembaga",
      "• Pengurus Koperasi Cendekia Syariah",
      "----------------------------------------",
      "Alur Prosedur Pembayaran:",
      "• Pengajuan Pembiayaan Disetujui",
      "↓",
      "• Naskah Akad Murabahah Ditandatangani",
      "↓",
      "• Surat Kuasa Potong Gaji Diterbitkan",
      "↓",
      "• Dokumen Diserahkan kepada HRD & Bagian Keuangan",
      "↓",
      "• Eksekusi Potongan Gaji Otomatis Setiap Bulan",
      "↓",
      "• Rekonsiliasi Dana Masuk ke Kas Koperasi"
    ]
  },
  {
    id: "tambahan",
    title: "Ketentuan Tambahan",
    icon: "Briefcase",
    short: "Aturan antisipasi risiko, larangan double pembiayaan, dan prosedur khusus.",
    content: [
      "1. Larangan Pengambilan Pembiayaan Ganda (Double Financing)",
      "Pegawai yang masih memiliki kewajiban cicilan aktif dilarang keras mengajukan permohonan pembiayaan baru sebelum seluruh kewajiban cicilan berjalan dinyatakan lunas.",
      "----------------------------------------",
      "2. Penanganan Kendala Keterlambatan",
      "Dengan diterapkannya sistem potong gaji otomatis, potensi keterlambatan dapat diminimalisasi secara optimal. Apabila terjadi kendala luar biasa:",
      "• Diselesaikan melalui pendekatan musyawarah kekeluargaan",
      "• Bebas dari pengenaan denda keterlambatan berbunga",
      "----------------------------------------",
      "3. Prosedur Pegawai Resign / Berhenti Bekerja",
      "Penyelesaian sisa kewajiban pembiayaan dilakukan melalui:",
      "• Pelunasan langsung dari hak keuangan / hak akhir pegawai (severance/last payroll), ATAU",
      "• Perjanjian restrukturisasi dan kesepakatan pelunasan khusus yang disetujui manajemen."
    ]
  },
  {
    id: "pengelolaan-keuntungan",
    title: "Pengelolaan Keuntungan",
    icon: "TrendingUp",
    short: "Alokasi strategis perolehan margin keuntungan usaha.",
    content: [
      "Seluruh perolehan margin keuntungan bersih dikelola secara akuntabel untuk:",
      "• Penguatan struktur modal dan likuiditas koperasi",
      "• Pembentukan cadangan risiko dan mitigasi piutang",
      "• Pengembangan program dan fasilitas pelayanan anggota",
      "• Pembagian Sisa Hasil Usaha (SHU) kepada anggota aktif",
      "• Alokasi dana sosial dan program kebajikan (ta’awun)"
    ]
  },
  {
    id: "nilai",
    title: "Nilai Luhur Program",
    icon: "Heart",
    short: "Filosofi moral, spiritual, dan sosial berlandaskan syariat Islam.",
    content: [
      "• Tolong-Menolong dalam Kebaikan (Ta'awun): Pengelolaan dana diarahkan bukan semata-mata mencari profit komersial, melainkan sebagai sarana solidaritas nyata untuk membantu civitas lembaga yang memerlukan dukungan finansial mendesak.",
      "• Penolakan Tegas terhadap Riba: Seluruh transaksi menggunakan akad yang dibenarkan syariat (Murabahah, Mudharabah, atau Qardhul Hasan), melindungi peserta dari jeratan bunga ribawi yang dzalim.",
      "• Peningkatan Kesejahteraan Keluarga Pesantren: Fasilitas pembiayaan yang adil membantu guru, staf, dan pengabdi lembaga dalam memenuhi kebutuhan hidup terhormat, sehingga konsentrasi pengabdian pendidikan menjadi lebih tenang dan fokus.",
      "• Penguatan Ekosistem Ekonomi Syariah: Perputaran dana internal membangun kemandirian finansial lembaga serta menjadi sarana edukasi praktis ekonomi syariah yang berkah."
    ]
  },
  {
    id: "penutup",
    title: "Penutup",
    icon: "Flag",
    short: "Visi penutup dan harapan keberkahan institusional.",
    content: [
      "Program Pembiayaan Syariah “CENDEKIA FINANCE” Pegawai dirancang sebagai instrumen solusi finansial yang sehat, aman, berkah, dan sepenuhnya selaras dengan nilai-nilai Islam bagi seluruh pegawai Sekolah Cendekia BAZNAS.",
      "Melalui sinergi program ini, koperasi diharapkan terus berkembang menjadi pilar pelayanan prima, penopang kesejahteraan anggota, serta motor penggerak penguatan ekonomi pesantren yang berkelanjutan dan diridhai Allah SWT."
    ]
  }
];
