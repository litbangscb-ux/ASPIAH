import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import * as Icons from 'lucide-react';
import { FinancingApplication } from '../types';
import { formatRupiah } from './ProgramInfo';

interface NewApplicationFormProps {
  initialSimulationParams: { price: number; dp: number; months: number } | null;
  onSubmit: (application: Omit<FinancingApplication, 'id' | 'createdAt'>) => void;
  userEmail: string;
}

export default function NewApplicationForm({
  initialSimulationParams,
  onSubmit,
  userEmail
}: NewApplicationFormProps) {
  // Personal Info State
  const [employeeName, setEmployeeName] = useState('Fuad Habibi Siregar'); // Default to user or blank
  const [nik, setNik] = useState('SCB-2022-064');
  const [position, setPosition] = useState('Koordinator IT & Sarana');
  const [department, setDepartment] = useState('Teknologi & Operasional');
  const [phone, setPhone] = useState('081299887766');
  const [salaryDeductionAuth, setSalaryDeductionAuth] = useState(false);

  // Goods Details State (Locked: Maksimal harga barang Rp 5 juta & tanpa uang muka)
  const [itemName, setItemName] = useState('');
  const [specification, setSpecification] = useState('');
  const [supplierName, setSupplierName] = useState('');
  const [originalPrice, setOriginalPrice] = useState(4500000);
  const [months, setMonths] = useState(12); // Pilihan jangka waktu maksimal 12 bulan (1 tahun)
  const downpayment = 0; // Tanpa uang muka (DP Rp 0) sesuai instruksi kementerian

  // Load from simulation if exists
  useEffect(() => {
    if (initialSimulationParams) {
      setOriginalPrice(Math.min(5000000, initialSimulationParams.price));
      if (initialSimulationParams.months) {
        setMonths(Math.min(12, initialSimulationParams.months));
      }
    }
  }, [initialSimulationParams]);

  const [formStep, setFormStep] = useState(1);

  // Calculations (15% flat rate for 1 year)
  const financingAmount = Math.min(5000000, originalPrice); // DP is 0
  const marginRate = 15; // 15% flat per tahun
  const marginAmount = Math.round(financingAmount * (marginRate / 100));
  const totalSellingPrice = financingAmount + marginAmount;
  const monthlyInstallment = months > 0 ? Math.round(totalSellingPrice / months) : 0;

  const handleNextStep = () => {
    if (formStep === 1) {
      if (!employeeName || !nik || !position || !phone) {
        alert('Mohon lengkapi seluruh Biodata Pegawai terlebih dahulu.');
        return;
      }
      setFormStep(2);
    }
  };

  const handlePrevStep = () => {
    setFormStep(1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!itemName || !supplierName || originalPrice <= 0) {
      alert('Mohon lengkapi detail barang dan toko rujukan.');
      return;
    }

    if (originalPrice > 5000000) {
      alert('Maksimal harga barang yang diajukan adalah Rp 5.000.000 sesuai kebijakan SOP.');
      return;
    }

    if (!salaryDeductionAuth) {
      alert('Anda wajib menyetujui otorisasi pemotongan gaji bulanan untuk mengajukan pembiayaan.');
      return;
    }

    const applicationData: Omit<FinancingApplication, 'id' | 'createdAt'> = {
      employee: {
        name: employeeName,
        nik,
        position,
        phone,
        department,
        salaryDeductionAuth
      },
      goods: {
        itemName,
        specification,
        supplierName,
        originalPrice,
        downpayment,
        financingAmount,
        marginRate,
        marginAmount,
        totalSellingPrice,
        months,
        monthlyInstallment
      },
      status: 'PENDING_RECOMMENDATION',
      managementRecommendation: {
        status: 'PENDING',
        reviewerName: 'Pihak Manajemen Sekolah',
        notes: ''
      },
      cooperativeVerification: {
        status: 'PENDING',
        verifierName: 'Fuad Habibi Siregar (Ketua Koperasi)',
        notes: ''
      },
      akadMurabahah: {
        contractNumber: `CCS/SCB/AKAD-MRB/${new Date().getFullYear()}`,
        isSigned: false
      }
    };

    onSubmit(applicationData);

    // Reset Form fields for next time but go to step 3 for downloading files
    setFormStep(3);
  };

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xs border border-slate-100 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6 pb-6 border-b border-slate-100">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full inline-block">
            Formulir Permohonan Pembiayaan
          </span>
          <h2 className="text-2xl font-display font-bold text-slate-800 mt-2">
            Surat Permohonan Baru
          </h2>
          <p className="text-slate-500 text-xs mt-1">
            Silakan lengkapi formulir pengajuan pembiayaan syariah pegawai Sekolah Cendekia BAZNAS (SCB).
          </p>
        </div>
        <div className="hidden sm:flex flex-col items-end text-right">
          <span className="text-xs text-slate-400 font-mono">User Aktif</span>
          <span className="text-xs font-semibold text-emerald-900 bg-emerald-100/60 px-2 py-0.5 rounded-md mt-0.5">
            {userEmail || 'Fuad Habibi Siregar'}
          </span>
        </div>
      </div>

      {/* Steps indicator */}
      <div className="flex items-center justify-center gap-4 mb-8">
        <div className="flex items-center gap-2">
          <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono font-bold transition-all ${
            formStep === 1 ? 'bg-emerald-950 text-amber-400 font-extrabold scale-110' : 'bg-emerald-100 text-emerald-800'
          }`}>
            1
          </span>
          <span className="text-xs font-medium text-slate-700 hidden sm:inline">Biodata Pegawai</span>
        </div>
        <div className="h-0.5 w-12 bg-slate-200"></div>
        <div className="flex items-center gap-2">
          <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono font-bold transition-all ${
            formStep === 2 ? 'bg-emerald-950 text-amber-400 font-extrabold scale-110' : 'bg-slate-100 text-slate-400'
          }`}>
            2
          </span>
          <span className="text-xs font-medium text-slate-700 hidden sm:inline">Rincian Barang</span>
        </div>
        <div className="h-0.5 w-12 bg-slate-200"></div>
        <div className="flex items-center gap-2">
          <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono font-bold transition-all ${
            formStep === 3 ? 'bg-emerald-950 text-amber-400 font-extrabold scale-110' : 'bg-slate-100 text-slate-400'
          }`}>
            3
          </span>
          <span className="text-xs font-medium text-slate-700 hidden sm:inline">Unduh Berkas Pinjaman</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {formStep === 1 && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="bg-amber-500/10 rounded-2xl p-4 border border-amber-500/20 flex gap-3 mb-2">
              <Icons.UserCheck className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-amber-900 font-display">Simulasi Pemohon</h4>
                <p className="text-[11px] text-amber-800 mt-0.5 leading-relaxed">
                  Secara default, form diisi dengan data pengurus/pegawai untuk simulasi langsung. Anda bebas mengganti nama & NIK pegawai lain jika ingin menguji proses verifikasinya.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-2">
                  Nama Lengkap Pegawai
                </label>
                <div className="relative">
                  <Icons.User className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={employeeName}
                    onChange={(e) => setEmployeeName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-700 focus:outline-hidden text-sm"
                    placeholder="Nama lengkap sesuai KTP"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-2">
                  NIK (Nomor Induk Karyawan) SCB
                </label>
                <div className="relative">
                  <Icons.CreditCard className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={nik}
                    onChange={(e) => setNik(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-700 focus:outline-hidden text-sm font-mono"
                    placeholder="Contoh: SCB-2022-XXX"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-2">
                  Jabatan Saat Ini
                </label>
                <div className="relative">
                  <Icons.Briefcase className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-700 focus:outline-hidden text-sm"
                    placeholder="Contoh: Guru Matematika"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-2">
                  Bidang Kerja / Divisi
                </label>
                <div className="relative">
                  <Icons.Network className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-700 focus:outline-hidden text-sm"
                    placeholder="Contoh: Kurikulum / Sarpras"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-600 mb-2">
                  Nomor HP WhatsApp Aktif
                </label>
                <div className="relative">
                  <Icons.MessageSquareQuote className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-700 focus:outline-hidden text-sm font-mono"
                    placeholder="Hubungkan nomer WA untuk info notifikasi"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={handleNextStep}
                className="bg-emerald-900 hover:bg-emerald-800 text-white font-semibold py-3 px-6 rounded-xl text-sm transition-all flex items-center gap-2 cursor-pointer"
              >
                Lanjutkan
                <Icons.ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {formStep === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column: Form Inputs */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-800 font-display flex items-center gap-1.5 pb-2 border-b border-slate-100">
                  <Icons.PackageOpen className="w-4 h-4 text-emerald-800" /> Detail Barang
                </h3>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-2">
                    Nama Barang yang Diajukan
                  </label>
                  <input
                    type="text"
                    required
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-700 focus:outline-hidden text-sm"
                    placeholder="Contoh: Asus Laptop, Lemari es, HP Samsung"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-2">
                    Spesifikasi & Rencana Penggunaan
                  </label>
                  <textarea
                    required
                    value={specification}
                    onChange={(e) => setSpecification(e.target.value)}
                    rows={2}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-700 focus:outline-hidden text-sm"
                    placeholder="Sebutkan spesifikasi penting & alasan pembelian demi kelayakan rekomendasi..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-2">
                    Rujukan Toko / Supplier Pembelian
                  </label>
                  <input
                    type="text"
                    required
                    value={supplierName}
                    onChange={(e) => setSupplierName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-700 focus:outline-hidden text-sm"
                    placeholder="Sebutkan merchant penjual (e.g. Tokopedia Official, iBox, dsb)"
                  />
                </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                      Harga Barang Toko (Maks. {formatRupiah(5000000)})
                    </label>
                    <input
                      type="number"
                      required
                      min="500000"
                      max="5000000"
                      value={originalPrice}
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || 0;
                        setOriginalPrice(Math.min(5000000, val));
                      }}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-700 focus:outline-hidden text-sm font-mono"
                      placeholder="Masukkan harga barang"
                    />
                    <p className="text-[10px] text-slate-400 mt-1">
                      💡 Batas maksimal pengajuan pembiayaan sesuai SOP adalah Rp 5.000.000.
                    </p>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                      Uang Muka (DP)
                    </label>
                    <div className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-100/80 text-sm font-mono font-bold text-slate-500 flex justify-between items-center select-none">
                      <span>Rp 0</span>
                      <span className="text-[9px] font-mono bg-slate-350 text-slate-700 px-2 py-0.5 rounded leading-none">Tanpa DP (Terkunci)</span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1">
                      Koperasi mendanai 100% dari harga barang.
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-2">
                    Jangka Waktu Cicilan (Maks. 1 Tahun)
                  </label>
                  <select
                    value={months}
                    onChange={(e) => setMonths(Number(e.target.value))}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-700 focus:outline-hidden text-sm font-semibold bg-white text-slate-700"
                  >
                    {[3, 6, 8, 10, 12].map((m) => (
                      <option key={m} value={m}>
                        {m} Bulan / Tenor {m === 12 ? "1 Tahun (Maksimal)" : `${m} Bln`}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Right Column: Dynamic Sharia Calc Review */}
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/60 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-800 font-display flex items-center gap-1.5 pb-2 border-b border-slate-200">
                    <Icons.Scale className="w-4 h-4 text-emerald-800" /> Ringkasan Akad Syariah
                  </h3>

                  <div className="space-y-3 mt-4 text-xs text-slate-600">
                    <div className="flex justify-between">
                      <span>Harga Pembelian Toko:</span>
                      <span className="font-mono text-slate-800 font-medium">
                        {formatRupiah(originalPrice)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Uang Muka (DP Dibayar):</span>
                      <span className="font-mono text-slate-800">
                        {formatRupiah(downpayment)}
                      </span>
                    </div>
                    <div className="flex justify-between font-semibold text-slate-800">
                      <span>Pokok Pembiayaan Koperasi:</span>
                      <span className="font-mono">
                        {formatRupiah(financingAmount)}
                      </span>
                    </div>

                    <div className="border-t border-slate-200 my-2"></div>

                    <div className="flex justify-between">
                      <span>Persentase Margin Keuntungan:</span>
                      <span className="font-semibold text-emerald-800">{marginRate}% / Tahun Flat</span>
                    </div>

                    <div className="flex justify-between">
                      <span>Jumlah Margin Keuntungan:</span>
                      <span className="font-mono text-emerald-800 font-semibold">
                        {formatRupiah(marginAmount)}
                      </span>
                    </div>

                    <div className="flex justify-between font-bold text-slate-800 bg-emerald-100/40 p-2.5 rounded-lg border border-emerald-100 mt-2">
                      <span className="text-[11px] text-emerald-950 uppercase">Total Harga Jual (Koperasi):</span>
                      <span className="font-mono text-emerald-900">
                        {formatRupiah(totalSellingPrice)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200 space-y-4">
                  {/* Autodebet Authorization - MANDATORY */}
                  <label className="flex items-start gap-2.5 cursor-pointer text-slate-600 select-none">
                    <input
                      type="checkbox"
                      required
                      checked={salaryDeductionAuth}
                      onChange={(e) => setSalaryDeductionAuth(e.target.checked)}
                      className="mt-0.5 rounded cursor-pointer accent-emerald-800"
                    />
                    <span className="text-[11px] leading-relaxed font-sans">
                      Saya memberikan kuasa penuh kepada juru bayar / bendahara Sekolah Cendekia BAZNAS untuk melakukan **potong gaji bulanan** senilai <span className="font-mono font-bold text-emerald-800">{formatRupiah(monthlyInstallment)}</span> sebanyak <span className="font-bold">{months} kali</span> untuk pembayaran angsuran murabahah ini secara otomatis.
                    </span>
                  </label>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={handlePrevStep}
                      className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold py-3 px-4 rounded-xl text-xs transition-all flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Icons.ArrowLeft className="w-3.5 h-3.5" /> Kembali
                    </button>
                    <button
                      type="submit"
                      className="bg-emerald-900 hover:bg-emerald-800 text-white font-semibold py-3 px-4 rounded-xl text-xs transition-all shadow-md flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Icons.Send className="w-3.5 h-3.5" /> Kirim Permohonan
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {formStep === 3 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6 text-center py-6"
          >
            <div className="w-16 h-16 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <Icons.CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-xl font-display font-bold text-slate-900">
                Permohonan Berhasil Dikirim!
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                Data pengajuan Anda telah tercatat di sistem. Sesuai prosedur SOP, silakan unduh dokumen fisik (PDF) resmi berikut untuk dicetak, diisi, dan diserahkan kepada Ketua Koperasi.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-left max-w-2xl mx-auto space-y-4 shadow-xs">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-900 font-display flex items-center gap-2">
                <Icons.Download className="w-4 h-4 text-emerald-700" /> Nomor 3: Pendownloadan Berkas Peminjaman Syariah
              </h4>
              <p className="text-xs text-slate-600">
                Silakan klik tombol unduh pada masing-masing dokumen resmi berikut:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {[
                  {
                    title: "Surat Permohonan Pembiayaan Syariah",
                    desc: "Formulir permohonan pemohon",
                    file: "/assets/aistudio/SURAT_PERMOHONAN_PEMBIAYAAN_SYARIAH_84bb84fd.pdf"
                  },
                  {
                    title: "Lembar Rekomendasi Atasan",
                    desc: "Persetujuan atasan / kepala bidang",
                    file: "/assets/aistudio/REKOMENDASI_ATASAN_7d56605f.pdf"
                  },
                  {
                    title: "Keputusan Kepala Sekolah",
                    desc: "Persetujuan administratif internal",
                    file: "/assets/aistudio/KEPUTUSAN_KEPALA_SEKOLAH_74f5dd20.pdf"
                  },
                  {
                    title: "Verifikasi & Keputusan Koperasi",
                    desc: "Hasil evaluasi & persetujuan koperasi",
                    file: "/assets/aistudio/VERIFIKASI_DAN_KEPUTUSAN_KOPERASI_61d0720e.pdf"
                  },
                  {
                    title: "Surat Akad Murabahah",
                    desc: "Naskah perjanjian jual beli syariah",
                    file: "/assets/aistudio/SURAT_AKAD_MURABAHAH_5de09cd7.pdf"
                  },
                  {
                    title: "Buku Program Pembiayaan Syariah",
                    desc: "SOP & panduan lengkap program",
                    file: "/assets/aistudio/PROGRAM_PEMBIAYAAN_SYARIAH_PEGAWAI_dc442b7f.pdf"
                  }
                ].map((doc, idx) => (
                  <div key={idx} className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <h5 className="text-xs font-semibold text-slate-800 truncate">{doc.title}</h5>
                      <p className="text-[10px] text-slate-400 truncate">{doc.desc}</p>
                    </div>
                    <a
                      href={doc.file}
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 p-2.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all border border-emerald-200/60 cursor-pointer"
                      title="Unduh Dokumen"
                    >
                      <Icons.Download className="w-3.5 h-3.5" /> Unduh
                    </a>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 flex justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setItemName('');
                  setSpecification('');
                  setSupplierName('');
                  setSalaryDeductionAuth(false);
                  setFormStep(1);
                }}
                className="bg-emerald-900 hover:bg-emerald-800 text-white font-semibold py-3 px-6 rounded-xl text-xs transition-all shadow-md flex items-center gap-2 cursor-pointer"
              >
                <Icons.PlusCircle className="w-4 h-4" /> Buat Permohonan Baru
              </button>
            </div>
          </motion.div>
        )}
      </form>
    </div>
  );
}
