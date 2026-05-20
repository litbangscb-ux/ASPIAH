import { FinancingApplication } from './types';

export const INITIAL_APPLICATIONS: FinancingApplication[] = [];

export const PROGRAM_SECTIONS = [
  {
    id: "latar-belakang",
    title: "Latar Belakang",
    icon: "BookOpen",
    short: "Mengapa program pembiayaan syariah ini dibentuk untuk pegawai SCB.",
    content: [
      "Koperasi Karyawan 'Cendekia Corner Syariah' di bawah bimbingan Yayasan Sekolah Cendekia BAZNAS (SCB) menyadari pentingnya kesejahteraan finansial yang berlandaskan keberkahan.",
      "Sering kali pegawai dihadapkan pada kebutuhan sarana bekerja maupun kebutuhan mendesak yang membutuhkan dana tunai atau transaksi cicilan. Sayangnya, banyak sekali produk di luar sana yang menggunakan sistem bunga (riba) atau platform pinjaman online ilegal yang membahayakan reputasi dan keberkahan hidup guru serta karyawan Sekolah Cendekia BAZNAS.",
      "Program Pembiayaan Syariah Pegawai ini hadir sebagai solusi konkret. Dengan skema syariah murni tanpa unsur riba, denda berlipat ganda, atau penalti terselebung, koperasi siap bermitra dengan pegawai demi menopang hajat hidup yang halal secara asasi."
    ]
  },
  {
    id: "tujuan",
    title: "Tujuan Program",
    icon: "Target",
    short: "Misi sosial dan religius dari koperasi Cendekia Corner Syariah.",
    content: [
      "1. Membantu pegawai Sekolah Cendekia BAZNAS untuk memperoleh barang kebutuhan penopang kerja maupun pribadi tanpa terjerumus praktik ribawi.",
      "2. Melindungi segenap guru dan tenaga kependidikan Cendekia BAZNAS dari jebakan pinjaman online atau angsuran berbunga tinggi.",
      "3. Mendorong percepatan implementasi iklim ekonomi syariah yang bersih dan berkeadilan di lingkungan lembaga pendidikan BAZNAS.",
      "4. Membagikan berkah margin usaha kembali kepada anggota dalam bentuk Sisa Hasil Usaha (SHU) tahunan secara sirkular."
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
      "Harga jual yang sudah disepakati dalam akad bersifat mengikat dan tetap (fixed) hingga akhir masa cicilan. Tidak diperkenankan adanya perubahan harga jual sepihak oleh koperasi di tengah jalan tanpa persetujuan, dan tidak ada pengenaan denda bunga bergulung apabila nasabah mengalami kendala pembayaran."
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
      "4. Barang yang diajukan adalah barang yang halal secara syariat, memiliki kegunaan yang jelas, dan tidak diperuntukkan bagi transaksi non-halal/konsumsi haram."
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
      "• Jangka Waktu 1-6 Bulan: Margin flat sebesar 0.8% per bulan dari nilai pembiayaan.",
      "• Jangka Waktu 7-12 Bulan: Margin flat sebesar 1.0% per bulan dari nilai pembiayaan.",
      "Keuntungan ini dirumuskan terbuka secara transparan sejak awal. Sebagai contoh: Jika Anda membiayai sisa Laptop sebesar Rp 5.000.000 selama 10 bulan dengan margin 1% per bulan, maka margin bulanan Anda adalah Rp 50.000. Total margin 10 bulan adalah Rp 500.000, sehingga angsuran flat Anda adalah (Rp 5.000.000 + Rp 500.000) / 10 = Rp 550.000 per bulan."
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
