import React, { useState, useRef, useEffect } from 'react';
import * as Icons from 'lucide-react';
import { FinancingApplication, UserRole } from '../types';
import { formatRupiah } from './ProgramInfo';

interface DocViewerProps {
  application: FinancingApplication;
  currentRole: UserRole;
  onUpdateApplication: (app: FinancingApplication) => void;
  onBack: () => void;
}

export default function DocViewer({
  application,
  currentRole,
  onUpdateApplication,
  onBack
}: DocViewerProps) {
  const [activeTab, setActiveTab] = useState<'ALL_PAPERS' | 'AKAD_ONLY' | 'PERMOHONAN_ONLY'>('ALL_PAPERS');

  // Drawing Pad States
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [sigType, setSigType] = useState<'DRAW' | 'TYPE'>('DRAW');
  const [typedSigName, setTypedSigName] = useState('');

  // Setup Canvas listeners
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.strokeStyle = '#022c22'; // Emerald Black
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
  }, [canvasRef, sigType, activeTab]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    setHasDrawn(true);

    const pos = getPos(e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const pos = getPos(e);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const getPos = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();

    // Touch vs Mouse
    if ('touches' in e) {
      if (e.touches.length === 0) return { x: 0, y: 0 };
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top
      };
    } else {
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
  };

  // Trigger Sign on the current application document
  const handleApplySignature = () => {
    let signatureResult = '';

    if (sigType === 'TYPE') {
      if (!typedSigName.trim()) {
        alert('Silakan ketik nama Anda untuk generate tanda tangan digital.');
        return;
      }
      signatureResult = `[Tanda Tangan Digital: ${typedSigName}]`;
    } else {
      if (!hasDrawn) {
        alert('Silakan goreskan tanda tangan Anda pada canvas terlebih dahulu.');
        return;
      }
      const canvas = canvasRef.current;
      if (canvas) {
        signatureResult = canvas.toDataURL('image/png');
      }
    }

    // Determine who is signing based on Role
    let updatedApp: FinancingApplication;
    if (currentRole === 'EMPLOYEE') {
      updatedApp = {
        ...application,
        status: application.cooperativeVerification.status === 'APPROVED' ? 'SIGNED' : application.status,
        akadMurabahah: {
          ...application.akadMurabahah,
          isSigned: true,
          employeeSignature: signatureResult,
          signedAt: new Date().toISOString()
        }
      };
    } else if (currentRole === 'COOPERATIVE') {
      updatedApp = {
        ...application,
        akadMurabahah: {
          ...application.akadMurabahah,
          cooperativeSignature: signatureResult,
          witnessName1: 'Manajemen Sekolah (Saksi)',
          witnessSignature1: '[Witness Approved Box]'
        }
      };
    } else {
      alert('Peran Anda saat ini tidak memiliki wewenang menandatangani Akad Murabahah.');
      return;
    }

    onUpdateApplication(updatedApp);
    alert('Tanda tangan digital berhasil disematkan ke dalam berkas Akad.');
  };

  const handlePrint = () => {
    window.print();
  };

  const cDate = application.cooperativeVerification.date 
    ? new Date(application.cooperativeVerification.date) 
    : new Date();
  const dateFormatted = cDate.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="space-y-6">
      {/* Document controls toolbar - hidden during print */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 flex flex-wrap gap-3 justify-between items-center shadow-xs no-print">
        <button
          onClick={onBack}
          className="bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold py-2 px-4 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer"
        >
          <Icons.ChevronLeft className="w-4 h-4" /> Kembali
        </button>

        {/* Tab filters inside document */}
        <div className="flex gap-1 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('ALL_PAPERS')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer ${
              activeTab === 'ALL_PAPERS' ? 'bg-emerald-900 text-amber-400 font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Semua Berkas (Lengkap)
          </button>
          <button
            onClick={() => setActiveTab('PERMOHONAN_ONLY')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer ${
              activeTab === 'PERMOHONAN_ONLY' ? 'bg-emerald-900 text-amber-400 font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Hanya Permohonan
          </button>
          <button
            onClick={() => setActiveTab('AKAD_ONLY')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer ${
              activeTab === 'AKAD_ONLY' ? 'bg-emerald-900 text-amber-400 font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Hanya Akad Murabahah
          </button>
        </div>

        <button
          onClick={handlePrint}
          className="bg-emerald-900 hover:bg-emerald-800 text-amber-300 font-semibold py-2 px-5 rounded-xl text-xs flex items-center gap-2 cursor-pointer shadow-md"
        >
          <Icons.Printer className="w-4 h-4" /> Cetak / Unduh Dokumen (PDF)
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: The Document Paper Mockup (8 cols) */}
        <div className="lg:col-span-8 space-y-8">

          {/* DOCUMENT 1: SURAT PERMOHONAN PEMBIAYAAN SYARIAH */}
          {(activeTab === 'ALL_PAPERS' || activeTab === 'PERMOHONAN_ONLY') && (
            <div className="document-paper p-8 sm:p-12 text-slate-800 select-text relative">
              {/* Kop Surat Sekolah Cendekia BAZNAS */}
              <div className="text-center border-b-4 border-double border-slate-800 pb-5 mb-6">
                <h1 className="text-lg font-bold uppercase tracking-wider document-heading">
                  SEKOLAH CENDEKIA BAZNAS
                </h1>
                <p className="text-xs font-serif mt-0.5 italic">
                  Jalan KH. Sholeh Iskandar, Cibadak, Kec. Ciampea, Kab. Bogor, Jawa Barat 16620
                </p>
                <p className="text-[10px] font-serif/loose text-slate-500 font-mono mt-1">
                  Email: info@cendekiabaznas.sch.id | Website: www.cendekiabaznas.sch.id
                </p>
              </div>

              {/* Title */}
              <div className="text-center mb-6">
                <h2 className="underline text-base font-bold uppercase document-heading">
                  SURAT PERMOHONAN PEMBIAYAAN SYARIAH PEGAWAI
                </h2>
                <span className="text-xs font-mono">Nomor Lampiran: SPP-CCS/SCB/{application.id}</span>
              </div>

              {/* Body */}
              <div className="space-y-4 font-serif text-sm text-justify">
                <p>
                  Kepada Yth.<br />
                  <strong>Pengurus Koperasi Cendekia Corner Syariah</strong><br />
                  Sekolah Cendekia BAZNAS, Bogor
                </p>

                <p>
                  Dengan hormat,<br />
                  Saya yang bertandatangan di bawah ini selaku pegawai di lingkungan Sekolah Cendekia BAZNAS, dengan rincian data diri sebagai berikut:
                </p>

                <div className="grid grid-cols-12 gap-1.5 pl-4 py-2 border-l-2 border-slate-350">
                  <div className="col-span-4 font-semibold">Nama Lengkap</div>
                  <div className="col-span-8">: {application.employee.name}</div>

                  <div className="col-span-4 font-semibold">NIK Pegawai</div>
                  <div className="col-span-8">: {application.employee.nik}</div>

                  <div className="col-span-4 font-semibold">Jabatan</div>
                  <div className="col-span-8">: {application.employee.position}</div>

                  <div className="col-span-4 font-semibold">Bidang / Divisi</div>
                  <div className="col-span-8">: {application.employee.department}</div>

                  <div className="col-span-4 font-semibold">No. WhatsApp</div>
                  <div className="col-span-8">: {application.employee.phone}</div>
                </div>

                <p>
                  Melalui surat ini bermaksud mengajukan permohonan pembiayaan syariah kepada Koperasi Cendekia Corner Syariah untuk membelikan barang berupa:
                </p>

                <div className="grid grid-cols-12 gap-1.5 pl-4 py-2 border-l-2 border-slate-350 bg-slate-50/50">
                  <div className="col-span-4 font-semibold">Nama Barang</div>
                  <div className="col-span-8">: {application.goods.itemName}</div>

                  <div className="col-span-4 font-semibold">Spesifikasi</div>
                  <div className="col-span-8">: {application.goods.specification}</div>

                  <div className="col-span-4 font-semibold">Rekomendasi Toko</div>
                  <div className="col-span-8">: {application.goods.supplierName}</div>

                  <div className="col-span-4 font-semibold">Harga Jual Toko</div>
                  <div className="col-span-8">: {formatRupiah(application.goods.originalPrice)}</div>

                  <div className="col-span-4 font-semibold">Uang Muka (DP)</div>
                  <div className="col-span-8">: {formatRupiah(application.goods.downpayment)}</div>

                  <div className="col-span-4 font-semibold">Nilai Pengajuan</div>
                  <div className="col-span-8 font-bold border-t border-slate-200 pt-0.5">: {formatRupiah(application.goods.financingAmount)}</div>
                </div>

                <p>
                  Saya merencanakan jangka waktu pengembalian pembiayaan ini selama <strong>{application.goods.months} Bulan</strong> dengan perkiraan cicilan flat senilai <strong>{formatRupiah(application.goods.monthlyInstallment)} / Bulan</strong> melalui pemotongan gaji pokok saya secara langsung setiap bulan.
                </p>

                <p>
                  Demikian permohonan ini saya ajukan dengan kesadaran penuh tanpa paksaan pihak mana pun. Saya bersedia mengikuti seluruh regulasi koperasi dan mengotorisasi bendahara sekolah untuk autodebet gaji bulanan pokok saya. Atas perhatian bapak, saya haturkan jazakumullah khairan katsiran.
                </p>

                {/* Signatures */}
                <div className="pt-8 grid grid-cols-2 gap-4 text-center">
                  <div>
                    <span className="block mb-10">Mengetahui, <br />Manajemen Sekolah Cendekia BAZNAS</span>
                    <span className="block font-bold underline">
                      {application.managementRecommendation.status !== 'PENDING' 
                        ? application.managementRecommendation.reviewerName.replace(/\(.*?\)/g, '')
                        : '___________________________'}
                    </span>
                    <span className="text-[10px] block font-mono text-slate-500">
                      {application.managementRecommendation.status === 'RECOMMENDED' ? '✓ STATUS: DIREKOMENDASIKAN' : 'STATUS: MENUNGGU'}
                    </span>
                  </div>
                  <div>
                    <span className="block mb-10">Bogor, {dateFormatted}<br />Pemohon Pegawai</span>
                    
                    {application.akadMurabahah.employeeSignature ? (
                      <div className="flex justify-center my-1.5">
                        {application.akadMurabahah.employeeSignature.startsWith('data:image') ? (
                          <img
                            src={application.akadMurabahah.employeeSignature}
                            alt="Employee Sign"
                            className="h-12 object-contain bg-emerald-50/10 p-1"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <span className="font-mono text-xs text-emerald-900 border border-emerald-900/10 p-1 rounded-sm">
                            {application.akadMurabahah.employeeSignature}
                          </span>
                        )}
                      </div>
                    ) : (
                      <div className="h-12 border-b border-dashed border-slate-350 max-w-[160px] mx-auto mb-1.5"></div>
                    )}

                    <span className="block font-bold underline">{application.employee.name}</span>
                    <span className="text-[10px] block font-mono">NIK: {application.employee.nik}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* DOCUMENT 2: AKAD MURABAHAH (THE CORE AGREEMENT CONTRACT) */}
          {(activeTab === 'ALL_PAPERS' || activeTab === 'AKAD_ONLY') && (
            <div className="document-paper p-8 sm:p-12 text-slate-800 select-text relative">
              
              {/* Kop Surat Koperasi. Let's make it look formal and syariah! */}
              <div className="text-center border-b-4 border-double border-slate-800 pb-5 mb-6">
                <span className="text-xs tracking-wider uppercase font-semibold text-emerald-800">Koperasi Karyawan Sekolah Cendekia BAZNAS</span>
                <h1 className="text-xl font-bold uppercase tracking-wider document-heading mt-0.5 text-emerald-950">
                  CENDEKIA CORNER SYARIAH (CCS)
                </h1>
                <p className="text-xs font-serif mt-0.5">
                  Pengesahan Menkumham No: AHU-0012423.AH.01.26 Tahun 2021
                </p>
                <p className="text-[9px] font-serif italic text-slate-500 font-mono mt-0.5">
                  Sekolah Cendekia BAZNAS, Bogor, Jawa Barat | No Telepon: 0812-3456-7890
                </p>
              </div>

              {/* Title Contract */}
              <div className="text-center mb-6">
                <h2 className="underline text-base font-bold uppercase document-heading text-emerald-950">
                  SURAT SURAT AKAD PERJANJIAN JUAL-BELI SYARIAH (MURABAHAH)
                </h2>
                <span className="text-xs font-mono font-bold">
                  Nomor Kontrak: {application.akadMurabahah.contractNumber || 'PENDING/CCS/SCB/V/2026'}
                </span>
              </div>

              {/* Body Contract with classical legal serif style */}
              <div className="space-y-4 font-serif text-sm text-justify">
                <p>
                  Pada hari ini, tanggal <strong>{dateFormatted}</strong> di lingkungan Sekolah Cendekia BAZNAS Bogor, kami yang bertandatangan di bawah ini secara sadar dan sukarela bermufakat mengikatkan diri dalam Akad Jual Beli Murabahah:
                </p>

                <div className="space-y-2 pl-4">
                  <p>
                    <strong>1. PIHAK PERTAMA (Penjual):</strong><br />
                    Koperasi Cendekia Corner Syariah, diwakili secara sah oleh bapak <strong>Fuad Habibi Siregar</strong> selaku Ketua Koperasi, berkedudukan di Sekolah Cendekia BAZNAS.
                  </p>
                  <p>
                    <strong>2. PIHAK KEDUA (Pembeli):</strong><br />
                    Nama: <strong>{application.employee.name}</strong>, NIK: <strong>{application.employee.nik}</strong>, Jabatan: <strong>{application.employee.position}</strong> di bawah naungan Sekolah Cendekia BAZNAS.
                  </p>
                </div>

                <p>
                  Kedua belah pihak sepakat untuk melakukan transaksi akad jual beli Murabahah dengan ketentuan khusus sebagai berikut:
                </p>

                {/* Pasal 1 */}
                <div>
                  <h4 className="font-bold document-heading text-slate-900 mb-1">
                    PASAL 1: OBJEK AKAD & SPESIFIKASI BARANG
                  </h4>
                  <p>
                    Pihak Pertama membelikan barang yang tertulis di dalam Surat Permohonan Pegawai berupa <strong>{application.goods.itemName}</strong>, spesifikasi: <strong>{application.goods.specification}</strong>, rujukan toko: <strong>{application.goods.supplierName}</strong>, lalu menjualnya kembali kepada Pihak Kedua setelah barang tersebut berpindah hak miliknya secara syar'i.
                  </p>
                </div>

                {/* Pasal 2 */}
                <div>
                  <h4 className="font-bold document-heading text-slate-900 mb-1">
                    PASAL 2: HARGA PEROLEHAN, MARGIN & HARGA JUAL KOPERASI
                  </h4>
                  <p>
                    Kedua belah pihak bermufakat menegaskan perhitungan biaya porsi pembiayaan ini secara terbuka tanpa ada riba tersembunyi sebagai berikut:
                  </p>
                  <div className="grid grid-cols-12 gap-1 px-4 py-2 my-1 border bg-slate-50 rounded-xl">
                    <div className="col-span-6 font-semibold">Harga Perolehan Toko</div>
                    <div className="col-span-6 font-mono">: {formatRupiah(application.goods.originalPrice)}</div>

                    <div className="col-span-6 font-semibold">Uang Muka Pegawai (DP)</div>
                    <div className="col-span-6 font-mono">: {formatRupiah(application.goods.downpayment)} (Lunas/Dipotong di Awal)</div>

                    <div className="col-span-6 font-semibold">Pokok Pembiayaan Koperasi</div>
                    <div className="col-span-6 font-mono">: {formatRupiah(application.goods.financingAmount)}</div>

                    <div className="col-span-6 font-semibold">Margin Keuntungan Koperasi (Ribhun)</div>
                    <div className="col-span-6 font-mono text-emerald-800 font-bold">: {formatRupiah(application.goods.marginAmount)} ({application.cooperativeVerification.finalMarginRate || application.goods.marginRate}% flat/bulan x {application.goods.months} bln)</div>

                    <div className="col-span-6 font-bold text-slate-900 border-t border-slate-300 pt-1">Total Harga Jual Koperasi</div>
                    <div className="col-span-6 font-mono text-emerald-950 font-bold border-t border-slate-300 pt-1">: {formatRupiah(application.goods.totalSellingPrice)} (Sesudah dikurang DP)</div>
                  </div>
                </div>

                {/* Pasal 3 */}
                <div>
                  <h4 className="font-bold document-heading text-slate-900 mb-1">
                    PASAL 3: SISTEM PEMBAYARAN & ANGSURAN BULANAN
                  </h4>
                  <p>
                    Pihak Kedua mengikatkan diri membayar kewajiban ini kepada Pihak Pertama secara tangguh/metode angsuran flat senilai <strong>{formatRupiah(application.goods.monthlyInstallment)} / Bulan</strong> selama <strong>{application.goods.months} Bulan</strong> berturut-turut melalui sistem Pemotongan Gaji pokok bulanan otomatis pada tanggal gajian Sekolah Cendekia BAZNAS.
                  </p>
                </div>

                {/* Pasal 4 */}
                <div>
                  <h4 className="font-bold document-heading text-slate-900 mb-1">
                    PASAL 4: KETENTUAN KENDALA PEMBAYARAN & JAMINAN TAKAFUL
                  </h4>
                  <p>
                    Apabila terjadi keterlambatan pembayaran di luar kendali pihak kedua (karena kegagalan transfer sekolah dsb), Pihak Pertama tidak akan mengenakan bunga denda riba tambahan. Jika Pihak Kedua mengalami uzur syar'i (meninggal dunia atau cacat permanen dalam tugas), sisa sanksi angsuran akan diputihkan atau dilunasi menggunakan Dana Takaful/Kas Kebajikan Koperasi Cendekia Corner Syariah.
                  </p>
                </div>

                {/* Surat Verifikasi Koperasi results */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 mt-2 text-xs">
                  <strong>Lampiran Verifikasi Jawaban Koperasi:</strong> Berdasarkan kajian fungsional komite pengurus diketuai Fuad Habibi Siregar, permohonan ini dinyatakan: <strong className="text-emerald-900 underline uppercase">{application.cooperativeVerification.status}</strong>, catatan verifikasi: <em>"{application.cooperativeVerification.notes || 'Pengajuan terverifikasi sehat dan aman.'}"</em>.
                </div>

                <p className="text-xs pt-2">
                  Demikian akad tertulis ini dibuat rangkap dua bermeterai, untuk masing-masing pihak yang mengikatkan diri dalam kemitraan syariah demi meraih keberkahan usaha bersama.
                </p>

                {/* Signatures on contract */}
                <div className="pt-8 grid grid-cols-3 gap-3 text-center text-[11px]">
                  {/* Cooperative Sign */}
                  <div>
                    <span className="block mb-6">Pihak Pertama (Penjual)<br /><strong>Ketua Koperasi CC Syariah</strong></span>
                    
                    {application.akadMurabahah.cooperativeSignature ? (
                      <div className="flex justify-center my-1.5 h-12">
                        {application.akadMurabahah.cooperativeSignature.startsWith('data:image') ? (
                          <img
                            src={application.akadMurabahah.cooperativeSignature}
                            alt="Coop Sign"
                            className="h-12 object-contain bg-slate-50/50 p-1"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <span className="font-mono text-xs text-emerald-900 border p-1 rounded-sm">
                            {application.akadMurabahah.cooperativeSignature}
                          </span>
                        )}
                      </div>
                    ) : (
                      <div className="h-12 border-b border-dashed border-slate-350 max-w-[120px] mx-auto mb-1.5 flex items-center justify-center text-[9px] text-slate-400 font-mono no-print">
                        [Fuad Habibi - Unsigned]
                      </div>
                    )}

                    <span className="block font-bold underline">Fuad Habibi Siregar</span>
                    <span className="block text-[9px] text-slate-500">Ketua Cendekia Corner Syariah</span>
                  </div>

                  {/* Employees Sign */}
                  <div>
                    <span className="block mb-6">Pihak Kedua (Pembeli)<br /><strong>Pegawai Pemohon</strong></span>
                    
                    {application.akadMurabahah.employeeSignature ? (
                      <div className="flex justify-center my-1.5 h-12">
                        {application.akadMurabahah.employeeSignature.startsWith('data:image') ? (
                          <img
                            src={application.akadMurabahah.employeeSignature}
                            alt="Employee Sign"
                            className="h-12 object-contain bg-slate-50/50 p-1"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <span className="font-mono text-xs text-emerald-900 border p-1 rounded-sm">
                            {application.akadMurabahah.employeeSignature}
                          </span>
                        )}
                      </div>
                    ) : (
                      <div className="h-12 border-b border-dashed border-slate-350 max-w-[120px] mx-auto mb-1.5 flex items-center justify-center text-[9px] text-slate-400 font-mono no-print">
                        [Employee - Unsigned]
                      </div>
                    )}

                    <span className="block font-bold underline">{application.employee.name}</span>
                    <span className="block text-[9px] text-slate-500">Nomer NIK: {application.employee.nik}</span>
                  </div>

                  {/* Witness Sign */}
                  <div>
                    <span className="block mb-6">Saksi Komite<br /><strong>Manajemen Sekolah (SCB)</strong></span>
                    
                    {application.akadMurabahah.isSigned ? (
                      <div className="flex justify-center my-1.5 h-12 items-center text-[10px] text-emerald-800 font-mono">
                        ✓ APPROVED (STAMPED)
                      </div>
                    ) : (
                      <div className="h-12 border-b border-dashed border-slate-350 max-w-[120px] mx-auto mb-1.5 flex items-center justify-center text-[9px] text-slate-400 font-mono no-print">
                        [Saksi SCB]
                      </div>
                    )}

                    <span className="block font-bold underline">Pihak Manajemen Sekolah</span>
                    <span className="block text-[9px] text-slate-500">Saksi Cendekia BAZNAS</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Digital Sign pad (4 cols) - hidden during print */}
        <div className="lg:col-span-4 bg-white p-5 rounded-3xl border border-slate-205 shadow-xs space-y-5 no-print">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <Icons.Signature className="w-5 h-5 text-emerald-900" />
            <h4 className="text-sm font-bold text-slate-800 font-display">Penandatanganan Akad</h4>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">
            Permohonan ini berada pada tahap pengisian tanda tangan syariah. Silakan gunakan pad lukis digital di bawah ini sesuai peran aktif Anda.
          </p>

          {/* Role Check warning */}
          <div className="p-3.5 bg-emerald-50 text-emerald-950 rounded-2xl text-xs space-y-1">
            <span className="font-semibold block font-display">Peran Aktif Anda Saat Ini:</span>
            <span className="font-mono font-bold text-emerald-800 bg-white/80 px-2 py-0.5 rounded-md inline-block mt-0.5">
              {currentRole === 'EMPLOYEE' ? 'Pegawai (Pemohon)' : currentRole === 'COOPERATIVE' ? 'Fuad Habibi Siregar' : 'Manajemen Sekolah (Saksi)'}
            </span>
          </div>

          {/* Signature Type Switch: Draw vs Type */}
          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setSigType('DRAW')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                sigType === 'DRAW' ? 'bg-white text-emerald-950 shadow-xs' : 'text-slate-550'
              }`}
            >
              Lukis Tangan
            </button>
            <button
              onClick={() => setSigType('TYPE')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                sigType === 'TYPE' ? 'bg-white text-emerald-950 shadow-xs' : 'text-slate-550'
              }`}
            >
              Ketik Nama
            </button>
          </div>

          {sigType === 'DRAW' ? (
            <div className="space-y-3">
              <div className="relative">
                <canvas
                  ref={canvasRef}
                  width={300}
                  height={150}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                  className="signature-canvas w-full rounded-2xl h-[160px] cursor-crosshair shadow-inner"
                />
                <button
                  onClick={clearCanvas}
                  className="absolute bottom-2 right-2 p-1.5 bg-slate-200 hover:bg-slate-300 rounded-lg text-slate-650 text-[10px] font-semibold transition-all cursor-pointer flex items-center gap-1"
                >
                  <Icons.Eraser className="w-3 h-3" /> Bersihkan
                </button>
              </div>
              <p className="text-[10px] text-slate-400 text-center italic">
                Sapu jari atau kursor mouse Anda untuk menulis tanda tangan syariah asli Anda.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-slate-600">
                Nama Lengkap Anda
              </label>
              <input
                type="text"
                value={typedSigName}
                onChange={(e) => setTypedSigName(e.target.value)}
                placeholder="Contoh: Fuad Habibi Siregar"
                className="w-full px-4 py-2 text-sm border border-slate-200 rounded-xl font-mono"
              />
              <p className="text-[11px] font-serif italic text-slate-400 p-3 text-center border bg-slate-50 rounded-xl font-medium tracking-wide">
                {typedSigName || '[Gaya Tanda Tangan Kaligrafi]'}
              </p>
            </div>
          )}

          {/* Action Sign button */}
          <button
            onClick={handleApplySignature}
            className="w-full bg-emerald-900 hover:bg-emerald-800 text-amber-300 font-display font-semibold transition-all py-3 rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            <Icons.PenTool className="w-4 h-4" />
            Sematkan Tanda Tangan Sekarang
          </button>

          <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-[10px] text-amber-900 leading-relaxed">
            ⚠️ <strong>Legalitas Syariah:</strong> Penandatanganan ini bernilai ikatan jual beli mutlak yang sah secara perdata dan rukun syariat Islam Sekolah Cendekia BAZNAS.
          </div>
        </div>
      </div>
    </div>
  );
}
