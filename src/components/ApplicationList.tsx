import { useState, useEffect } from 'react';
import * as Icons from 'lucide-react';
import { FinancingApplication, UserRole, AppUser } from '../types';
import { formatRupiah } from './ProgramInfo';

interface ApplicationListProps {
  applications: FinancingApplication[];
  currentRole: UserRole;
  onUpdateApplication: (app: FinancingApplication) => void;
  onSelectDocument: (appId: string) => void;
  currentUser?: AppUser | null;
}

export default function ApplicationList({
  applications,
  currentRole,
  onUpdateApplication,
  onSelectDocument,
  currentUser
}: ApplicationListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Review Form state local
  const [activeReviewId, setActiveReviewId] = useState<string | null>(null);
  const [reviewerName, setReviewerName] = useState('Pihak Manajemen Sekolah');
  const [notes, setNotes] = useState('');
  const [coopNotes, setCoopNotes] = useState('');
  const [coopVerifier, setCoopVerifier] = useState('Fuad Habibi Siregar');
  const [finalMarginOverride, setFinalMarginOverride] = useState<number>(0);

  useEffect(() => {
    if (currentUser) {
      if (currentUser.role === 'MANAGEMENT') {
        setReviewerName(currentUser.name);
      } else if (currentUser.role === 'COOPERATIVE') {
        setCoopVerifier(currentUser.name);
      }
    }
  }, [currentUser]);

  // Filter application list
  const filteredApps = applications.filter((app) => {
    const matchesSearch =
      app.employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.goods.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.id.toLowerCase().includes(searchTerm.toLowerCase());

    if (statusFilter === 'ALL') return matchesSearch;
    return app.status === statusFilter && matchesSearch;
  });

  // Handle Management Recommendation submit
  const submitRecommendation = (app: FinancingApplication, isRecommended: boolean) => {
    if (!notes.trim()) {
      alert('Mohon tuliskan catatan rekomendasi singkat terlebih dahulu.');
      return;
    }

    const updatedApp: FinancingApplication = {
      ...app,
      status: isRecommended ? 'PENDING_COOPERATIVE' : 'REJECTED',
      managementRecommendation: {
        status: isRecommended ? 'RECOMMENDED' : 'NOT_RECOMMENDED',
        reviewerName: reviewerName || 'Pihak Manajemen Sekolah',
        notes: notes,
        date: new Date().toISOString()
      }
    };

    onUpdateApplication(updatedApp);
    setActiveReviewId(null);
    setNotes('');
  };

  // Handle Cooperative response (Verifikasi Koperasi)
  const submitCooperativeVerification = (
    app: FinancingApplication,
    status: 'APPROVED' | 'CONSIDERED' | 'REJECTED'
  ) => {
    if (!coopNotes.trim()) {
      alert('Mohon masukkan catatan verifikasi koperasi terlebih dahulu.');
      return;
    }

    // Allocate automatic contract number if approved or considered
    let randomNum = Math.floor(Math.random() * 800) + 100;
    const contractNumber = status !== 'REJECTED' 
      ? `0${randomNum}/CCS-SCB/AKAD-MRB/V/${new Date().getFullYear()}`
      : `REJ/CCS-SCB/${new Date().getFullYear()}`;

    const updatedApp: FinancingApplication = {
      ...app,
      status: status === 'APPROVED' ? 'APPROVED' : status === 'CONSIDERED' ? 'CONSIDERED' : 'REJECTED',
      cooperativeVerification: {
        status: status,
        verifierName: coopVerifier || 'Fuad Habibi Siregar (Ketua Koperasi)',
        notes: coopNotes,
        date: new Date().toISOString(),
        finalMarginRate: finalMarginOverride || app.goods.marginRate
      },
      akadMurabahah: {
        ...app.akadMurabahah,
        contractNumber,
        date: status !== 'REJECTED' ? new Date().toISOString().split('T')[0] : undefined
      }
    };

    onUpdateApplication(updatedApp);
    setActiveReviewId(null);
    setCoopNotes('');
  };

  const getStatusBadge = (status: FinancingApplication['status']) => {
    switch (status) {
      case 'PENDING_RECOMMENDATION':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-800 border border-blue-100">
            <Icons.Hourglass className="w-3.5 h-3.5 animate-spin" /> Menunggu Rekomendasi Sekolah
          </span>
        );
      case 'PENDING_COOPERATIVE':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-100">
            <Icons.Loader className="w-3.5 h-3.5 animate-spin" /> Verifikasi Koperasi
          </span>
        );
      case 'APPROVED':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-100">
            <Icons.CheckCircle2 className="w-3.5 h-3.5" /> Approved (Siap Akad)
          </span>
        );
      case 'CONSIDERED':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-800 border border-purple-100">
            <Icons.AlertTriangle className="w-3.5 h-3.5" /> Dipertimbangkan Koperasi
          </span>
        );
      case 'REJECTED':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-800 border border-red-100">
            <Icons.XCircle className="w-3.5 h-3.5" /> Pengajuan Ditolak
          </span>
        );
      case 'SIGNED':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-900 text-amber-300 border border-emerald-900 shadow-xs">
            <Icons.FileKey2 className="w-3.5 h-3.5 text-amber-400" /> Akad Murabahah Lunas Ditandatangani
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Search & Filter Header */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 flex flex-col md:flex-row gap-3 justify-between items-center shadow-xs">
        <div className="relative w-full md:w-1/3">
          <Icons.Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:border-emerald-700"
            placeholder="Cari nama pemohon atau barang..."
          />
        </div>

        <div className="flex gap-1.5 overflow-x-auto w-full md:w-auto scrollbar-hide py-1">
          {[
            { id: 'ALL', label: 'Semua Pengajuan' },
            { id: 'PENDING_RECOMMENDATION', label: 'Butuh Rekomendasi' },
            { id: 'PENDING_COOPERATIVE', label: 'Butuh Verifikasi' },
            { id: 'APPROVED', label: 'Disetujui Koperasi' },
            { id: 'SIGNED', label: 'Sudah Akad' }
          ].map((filt) => (
            <button
              key={filt.id}
              onClick={() => setStatusFilter(filt.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer shrink-0 transition-colors ${
                statusFilter === filt.id
                  ? 'bg-emerald-900 text-amber-400'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {filt.label}
            </button>
          ))}
        </div>
      </div>

      {filteredApps.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-slate-200">
          <Icons.FileArchive className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h4 className="text-sm font-bold text-slate-800 font-display">Belum ada pengajuan</h4>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Tidak ditemukan pengajuan pembiayaan pemohon dengan kriteria penyaringan di atas. Masuk ke halaman "Informasi Program" atau "Buat Permohonan" untuk mengirim yang baru.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredApps.map((app) => {
            const isReviewOpen = activeReviewId === app.id;
            return (
              <div
                key={app.id}
                className="bg-white rounded-3xl shadow-xs border border-slate-200/60 p-5 md:p-6 transition-all duration-300 hover:shadow-md"
              >
                {/* Header Information */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <span className="p-2.5 bg-emerald-50 rounded-xl text-emerald-800 shrink-0 font-mono font-bold text-xs">
                      #{app.id}
                    </span>
                    <div>
                      <h3 className="text-base font-bold text-slate-800 font-display">
                        {app.employee.name}
                      </h3>
                      <p className="text-[11px] text-slate-500 font-mono">
                        {app.employee.nik} • {app.employee.position} ({app.employee.department})
                      </p>
                    </div>
                  </div>
                  <div>
                    {getStatusBadge(app.status)}
                  </div>
                </div>

                {/* Grid with Details */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 py-4">
                  {/* Goods Section */}
                  <div className="md:col-span-2 space-y-2">
                    <div className="flex items-center gap-2">
                      <Icons.ShoppingBag className="w-4 h-4 text-emerald-800" />
                      <span className="text-xs font-bold text-slate-700 font-display">Barang & Supplier</span>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <span className="block text-xs font-semibold text-slate-800">{app.goods.itemName}</span>
                      <span className="block text-[11px] text-slate-500 mt-0.5 max-w-md italic">{app.goods.specification}</span>
                      <span className="block text-[10px] text-emerald-800 font-medium mt-1.5">Supplier: {app.goods.supplierName}</span>
                    </div>
                  </div>

                  {/* Pricing and Sharia Specs */}
                  <div className="space-y-1 my-auto">
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>Harga Toko:</span>
                      <span className="font-mono font-medium text-slate-800">{formatRupiah(app.goods.originalPrice)}</span>
                    </div>
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>Sisa Pembiayaan:</span>
                      <span className="font-mono font-medium text-slate-800">{formatRupiah(app.goods.financingAmount)}</span>
                    </div>
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>Margin Koperasi:</span>
                      <span className="font-mono font-semibold text-emerald-800">
                        {formatRupiah(app.goods.marginAmount)} ({app.goods.marginRate}% Flat/Thn)
                      </span>
                    </div>
                    <div className="flex justify-between text-xs text-slate-500 font-medium pt-1 border-t border-slate-100">
                      <span>Total Jual:</span>
                      <span className="font-mono text-emerald-900 font-bold">{formatRupiah(app.goods.totalSellingPrice)}</span>
                    </div>
                  </div>

                  {/* Installment Badge */}
                  <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100 flex flex-col justify-center items-center text-center">
                    <span className="text-[10px] uppercase font-semibold text-emerald-800 tracking-wider">
                      Target Cicilan Bulanan
                    </span>
                    <span className="text-xl font-mono font-bold text-emerald-900 mt-1">
                      {formatRupiah(app.goods.monthlyInstallment)}
                    </span>
                    <span className="text-[10px] text-slate-500 mt-0.5">
                      Selama {app.goods.months} Bulan
                    </span>
                  </div>
                </div>

                {/* Progress Tracking Timeline */}
                <div className="bg-slate-50/70 py-4 px-5 rounded-2xl border border-slate-100 grid grid-cols-1 sm:grid-cols-4 gap-4 items-center">
                  {/* Step 1: Submited */}
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 bg-emerald-900 text-amber-300 rounded-lg">
                      <Icons.FileDown className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="block text-[10px] font-mono text-slate-400">Tahap 1</span>
                      <span className="font-semibold text-[11px] text-slate-800">Permohonan Dikirim</span>
                    </div>
                  </div>

                  {/* Step 2: Management Recommendation */}
                  <div className="flex items-center gap-2.5">
                    <div className={`p-1.5 rounded-lg ${
                      app.managementRecommendation.status === 'RECOMMENDED' 
                        ? 'bg-emerald-150 text-emerald-800' 
                        : app.managementRecommendation.status === 'NOT_RECOMMENDED'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-slate-100 text-slate-400'
                    }`}>
                      <Icons.School className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="block text-[10px] font-mono text-slate-400">Tahap 2</span>
                      <span className="font-semibold text-[11px] text-slate-800">
                        {app.managementRecommendation.status === 'RECOMMENDED'
                          ? 'Direkomendasikan'
                          : app.managementRecommendation.status === 'NOT_RECOMMENDED'
                          ? 'Ditolak Sekolah'
                          : 'Proses Manajemen'}
                      </span>
                    </div>
                  </div>

                  {/* Step 3: Cooperative verification */}
                  <div className="flex items-center gap-2.5">
                    <div className={`p-1.5 rounded-lg ${
                      app.cooperativeVerification.status === 'APPROVED' 
                        ? 'bg-emerald-150 text-emerald-800' 
                        : app.cooperativeVerification.status === 'CONSIDERED'
                        ? 'bg-purple-150 text-purple-800'
                        : app.cooperativeVerification.status === 'REJECTED'
                        ? 'bg-red-105 text-red-800'
                        : 'bg-slate-100 text-slate-400'
                    }`}>
                      <Icons.FileCheck2 className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="block text-[10px] font-mono text-slate-400">Tahap 3</span>
                      <span className="font-semibold text-[11px] text-slate-800 font-display">
                        {app.cooperativeVerification.status === 'APPROVED'
                          ? 'Persetujuan Koperasi'
                          : app.cooperativeVerification.status === 'CONSIDERED'
                          ? 'Dipertimbangkan'
                          : app.cooperativeVerification.status === 'REJECTED'
                          ? 'Ditolak Koperasi'
                          : 'Proses Koperasi'}
                      </span>
                    </div>
                  </div>

                  {/* Step 4: Akad Signed */}
                  <div className="flex items-center gap-2.5">
                    <div className={`p-1.5 rounded-lg ${
                      app.status === 'SIGNED' ? 'bg-emerald-900 text-amber-300' : 'bg-slate-100 text-slate-400'
                    }`}>
                      <Icons.PencilLine className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="block text-[10px] font-mono text-slate-400">Tahap 4</span>
                      <span className="font-semibold text-[11px] text-slate-800">
                        {app.status === 'SIGNED' ? 'Akad Selesai (Lunas)' : 'Menunggu Akad'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Sub-panels detailing specific historical recommendation reviews if they exist */}
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Display management note if submitted */}
                  {app.managementRecommendation.status !== 'PENDING' && (
                    <div className="p-3 bg-blue-50/20 border border-blue-100/50 rounded-xl text-xs">
                      <div className="flex justify-between items-center text-blue-900 font-semibold mb-1">
                        <span className="flex items-center gap-1">📋 Rekomendasi Manajemen</span>
                        <span className="text-[9px] text-slate-400 font-mono">
                          {app.managementRecommendation.date?.split('T')[0]}
                        </span>
                      </div>
                      <p className="text-slate-600 text-xs italic">
                        "{app.managementRecommendation.notes}"
                      </p>
                      <span className="block text-[10px] text-slate-550 mt-1 font-medium">
                        Oleh: {app.managementRecommendation.reviewerName}
                      </span>
                    </div>
                  )}

                  {/* Display cooperative note if submitted */}
                  {app.cooperativeVerification.status !== 'PENDING' && (
                    <div className="p-3 bg-amber-50/20 border border-amber-100/50 rounded-xl text-xs">
                      <div className="flex justify-between items-center text-amber-900 font-semibold mb-1">
                        <span className="flex items-center gap-1">🌿 Verifikasi Koperasi (Syariah)</span>
                        <span className="text-[9px] text-slate-400 font-mono">
                          {app.cooperativeVerification.date?.split('T')[0]}
                        </span>
                      </div>
                      <p className="text-slate-600 text-xs italic">
                        "{app.cooperativeVerification.notes}"
                      </p>
                      <span className="block text-[10px] text-slate-550 mt-1 font-medium">
                        Oleh: {app.cooperativeVerification.verifierName}
                      </span>
                    </div>
                  )}
                </div>

                {/* Action Panels depending on Role */}
                <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap gap-2.5 items-center justify-between">
                  {/* Non-review standard text */}
                  <span className="text-[11px] text-slate-400 font-mono">
                    Diajukan: {new Date(app.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </span>

                  <div className="flex gap-2.5">
                    {/* -------------------- ROLE: EMPLOYEE ACTIONS -------------------- */}
                    {currentRole === 'EMPLOYEE' && (
                      <>
                        {(app.status === 'APPROVED' || app.status === 'CONSIDERED') && (
                          <button
                            onClick={() => onSelectDocument(app.id)}
                            className="bg-emerald-900 hover:bg-emerald-800 text-amber-300 font-semibold py-2 px-4 rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <Icons.Signpost className="w-3.5 h-3.5" />
                            Tandatangan Surat Akad Murabahah
                          </button>
                        )}
                        {app.status === 'SIGNED' && (
                          <button
                            onClick={() => onSelectDocument(app.id)}
                            className="bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 font-semibold py-2 px-4 rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                          >
                            <Icons.FileCheck className="w-3.5 h-3.5" />
                            Cetak Surat Akad Murabahah & Permohonan
                          </button>
                        )}
                        {app.status !== 'SIGNED' && app.status !== 'APPROVED' && app.status !== 'CONSIDERED' && (
                          <span className="text-xs text-slate-400 italic">
                            Sedang dalam review pengurus. Harap cek kembali secara berkala.
                          </span>
                        )}
                      </>
                    )}

                    {/* -------------------- ROLE: MANAGEMENT ACTIONS -------------------- */}
                    {currentRole === 'MANAGEMENT' && (
                      <>
                        {app.status === 'PENDING_RECOMMENDATION' && !isReviewOpen && (
                          <button
                            onClick={() => {
                              setActiveReviewId(app.id);
                              setNotes('');
                            }}
                            className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 px-4 rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer animate-pulse"
                          >
                            <Icons.Award className="w-3.5 h-3.5" /> Provide Recommendation
                          </button>
                        )}

                        {app.status !== 'PENDING_RECOMMENDATION' && (
                          <span className="text-xs text-slate-400 font-medium">
                            ✓ Tugas Anda Selesai (Rekomendasi Terkirim)
                          </span>
                        )}
                      </>
                    )}

                    {/* -------------------- ROLE: COOPERATIVE ACTIONS -------------------- */}
                    {currentRole === 'COOPERATIVE' && (
                      <>
                        {app.status === 'PENDING_COOPERATIVE' && !isReviewOpen && (
                          <button
                            onClick={() => {
                              setActiveReviewId(app.id);
                              setCoopNotes('');
                              setFinalMarginOverride(app.goods.marginRate);
                            }}
                            className="bg-amber-500 hover:bg-amber-450 text-slate-950 font-bold py-2 px-4 rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <Icons.Scale className="w-3.5 h-3.5" /> Berikan Hasil Verifikasi Koperasi
                          </button>
                        )}

                        {app.status === 'APPROVED' && (
                          <button
                            onClick={() => onSelectDocument(app.id)}
                            className="bg-emerald-900 text-amber-300 font-semibold py-2 px-4 rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                          >
                            <Icons.PenSquare className="w-3.5 h-3.5" />
                            Sign Akad on behalf of Cooperative
                          </button>
                        )}

                        {app.status === 'SIGNED' && (
                          <button
                            onClick={() => onSelectDocument(app.id)}
                            className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold py-2 px-4 rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                          >
                            <Icons.Eye className="w-3.5 h-3.5" />
                            Review Lengkap Dokumen / Akad
                          </button>
                        )}

                        {app.status === 'REJECTED' && (
                          <span className="text-xs text-red-500 font-semibold">
                            Selesai: Permohonan Ditolak
                          </span>
                        )}
                      </>
                    )}
                  </div>
                </div>

                {/* Inline Review Drawer for management and cooperative */}
                {isReviewOpen && (
                  <div className="mt-4 p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
                    <div className="flex justify-between items-center pb-2 border-b border-slate-250">
                      <h4 className="text-xs font-bold text-slate-800 font-display flex items-center gap-1">
                        <Icons.ClipboardList className="w-3.5 h-3.5 text-emerald-800" />
                        Aksi Penilaian / Review Form Pengajuan
                      </h4>
                      <button
                        onClick={() => setActiveReviewId(null)}
                        className="text-slate-400 hover:text-slate-600 text-xs cursor-pointer"
                      >
                        Batal
                      </button>
                    </div>

                    {/* -------------------- MGT INPUTS -------------------- */}
                    {currentRole === 'MANAGEMENT' && (
                      <div className="space-y-3">
                        <div>
                          <label className="block text-[10px] font-semibold text-slate-500 mb-1">
                            Nama Peninjau Manajemen Sekolah
                          </label>
                          <input
                            type="text"
                            value={reviewerName}
                            onChange={(e) => setReviewerName(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-semibold text-slate-500 mb-1">
                            Isi Catatan Rekomendasi Kelayakan Pegawai
                          </label>
                          <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            rows={2}
                            placeholder="Tuliskan catatan etos kerja, ketaatan, dan pentingnya sarana kerja ini..."
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                          />
                        </div>

                        <div className="flex gap-2 justify-end pt-2">
                          <button
                            onClick={() => submitRecommendation(app, false)}
                            className="bg-red-50 hover:bg-red-100 text-red-700 font-semibold py-2 px-4 rounded-xl text-xs cursor-pointer"
                          >
                            Tolak Pengajuan
                          </button>
                          <button
                            onClick={() => submitRecommendation(app, true)}
                            className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 px-4 rounded-xl text-xs cursor-pointer"
                          >
                            ✓ Terbitkan Rekomendasi
                          </button>
                        </div>
                      </div>
                    )}

                    {/* -------------------- COOP INPUTS -------------------- */}
                    {currentRole === 'COOPERATIVE' && (
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[10px] font-semibold text-slate-500 mb-1">
                              Verifier Pengurus Koperasi
                            </label>
                            <input
                              type="text"
                              value={coopVerifier}
                              onChange={(e) => setCoopVerifier(e.target.value)}
                              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-semibold text-slate-500 mb-1">
                              Konfirmasi Margin (% Flat/Tahun)
                            </label>
                            <input
                              type="number"
                              step="0.1"
                              value={finalMarginOverride}
                              onChange={(e) => setFinalMarginOverride(parseFloat(e.target.value) || 0)}
                              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-mono"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] font-semibold text-slate-500 mb-1">
                            Catatan Verifikasi Koperasi
                          </label>
                          <textarea
                            value={coopNotes}
                            onChange={(e) => setCoopNotes(e.target.value)}
                            rows={2}
                            placeholder="Sebutkan tanggapan atas harga barang, kemampuan potong gaji, atau penentuan akad..."
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                          />
                        </div>

                        <div className="flex gap-2 justify-end pt-2">
                          <button
                            onClick={() => submitCooperativeVerification(app, 'REJECTED')}
                            className="bg-red-55 hover:bg-red-100 text-red-750 font-semibold py-2 px-4-rounded border border-red-200 rounded-xl text-xs cursor-pointer"
                          >
                            X Tolak
                          </button>
                          <button
                            onClick={() => submitCooperativeVerification(app, 'CONSIDERED')}
                            className="bg-purple-50 hover:bg-purple-100 text-purple-700 font-semibold py-2 px-4 rounded-xl text-xs cursor-pointer"
                          >
                            ⚡ Dipertimbangkan
                          </button>
                          <button
                            onClick={() => submitCooperativeVerification(app, 'APPROVED')}
                            className="bg-emerald-900 hover:bg-emerald-800 text-white font-semibold py-2 px-4 rounded-xl text-xs cursor-pointer"
                          >
                            ✓ Setujui (Lolos ke Akad)
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
