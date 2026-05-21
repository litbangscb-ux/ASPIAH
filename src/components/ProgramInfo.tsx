import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import * as Icons from 'lucide-react';
import { PROGRAM_SECTIONS } from '../data';

// Helper to format RUPIAH
export const formatRupiah = (value: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

interface ProgramInfoProps {
  onApplyWithSimulation: (price: number, dp: number, months: number) => void;
}

export default function ProgramInfo({ onApplyWithSimulation }: ProgramInfoProps) {
  const [activeSectionId, setActiveSectionId] = useState(PROGRAM_SECTIONS[0].id);

  // Simulation State (Locked: Maksimal harga barang Rp 5 juta & tanpa uang muka, Jangka waktu/Tenor maksimal 1 tahun)
  const [originalPrice, setOriginalPrice] = useState<number>(4500000);
  const [months, setMonths] = useState<number>(12); // Pilihan jangka waktu maksimal 12 bulan (1 tahun)
  const downpayment = 0; // Tanpa uang muka (DP Rp 0)

  // Calculator logic matching the guidelines (15% flat rate for 1 year)
  const billingCalculation = useMemo(() => {
    const clampedPrice = Math.min(5000000, originalPrice);
    const financingAmount = clampedPrice; // downpayment is 0
    const rate = 15; // 15% flat per tahun
    const marginAmount = Math.round(financingAmount * (rate / 100));
    const totalSellingPrice = financingAmount + marginAmount;
    const monthlyInstallment = months > 0 ? Math.round(totalSellingPrice / months) : 0;

    return {
      financingAmount,
      rate,
      marginAmount,
      totalSellingPrice,
      monthlyInstallment
    };
  }, [originalPrice, months]);

  const activeSection = useMemo(() => {
    return PROGRAM_SECTIONS.find(s => s.id === activeSectionId) || PROGRAM_SECTIONS[0];
  }, [activeSectionId]);

  // Icon dynamic load helper safely
  const renderSectionIcon = (iconName: string, className: string = "w-5 h-5") => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const IconComponent = (Icons as any)[iconName];
    if (IconComponent) {
      return <IconComponent className={className} />;
    }
    return <Icons.FileText className={className} />;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* LEFT: Guidelines Reader (7 cols) */}
      <div className="lg:col-span-7 bg-white rounded-3xl p-6 md:p-8 shadow-xs border border-slate-100">
        <div className="mb-6">
          <span className="text-xs font-semibold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full inline-block">
            SOP & Pedoman Resmi
          </span>
          <h2 className="text-2xl md:text-3xl font-display font-bold text-slate-800 mt-2">
            Panduan Syariah Pegawai
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Materi penjelasan program kemitraan koperasi Cendekia Corner Syariah (SCB)
          </p>
        </div>

        {/* Categories Tab Pill Selector */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide -mx-6 px-6 lg:mx-0 lg:px-0">
          {PROGRAM_SECTIONS.map((section) => {
            const isActive = section.id === activeSectionId;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSectionId(section.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-emerald-900 text-amber-400 shadow-md shadow-emerald-950/20'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {renderSectionIcon(section.icon, "w-4 h-4")}
                {section.title}
              </button>
            );
          })}
        </div>

        {/* Content Viewer with subtle motion */}
        <motion.div
          key={activeSectionId}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-emerald-50/20 rounded-2xl p-6 border border-emerald-100/30"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-emerald-900 text-amber-400 rounded-2xl shadow-inner">
              {renderSectionIcon(activeSection.icon, "w-6 h-6")}
            </div>
            <div>
              <h3 className="text-lg font-display font-bold text-slate-800">
                {activeSection.title}
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                {activeSection.short}
              </p>
            </div>
          </div>

          <div className="space-y-4 text-slate-600 text-sm leading-relaxed whitespace-pre-line font-sans">
            {Array.isArray(activeSection.content) ? (
              activeSection.content.map((para, i) => (
                <p key={i} className={para.startsWith('•') || para.startsWith('1.') || para.startsWith('Jangka') ? 'pl-4 border-l-2 border-emerald-200 py-0.5 my-1.5 font-medium' : ''}>
                  {para}
                </p>
              ))
            ) : (
              <p>{activeSection.content}</p>
            )}
          </div>
        </motion.div>

        {/* Syariah Badges */}
        <div className="grid grid-cols-3 gap-3 mt-6 pt-6 border-t border-slate-100">
          <div className="text-center p-3 bg-slate-50 rounded-xl">
            <span className="block text-slate-500 text-[10px] font-mono">Asas Syariat</span>
            <span className="text-xs font-semibold text-emerald-800 block mt-0.5">Akad Murabahah</span>
          </div>
          <div className="text-center p-3 bg-slate-50 rounded-xl">
            <span className="block text-slate-500 text-[10px] font-mono font-medium">Bencana/Wafat</span>
            <span className="text-xs font-semibold text-emerald-800 block mt-0.5">Dana Takaful</span>
          </div>
          <div className="text-center p-3 bg-slate-50 rounded-xl">
            <span className="block text-slate-500 text-[10px] font-mono">Denda Keterlambatan</span>
            <span className="text-xs font-semibold text-amber-700 block mt-0.5">Sanksi Non-Riba</span>
          </div>
        </div>
      </div>

      {/* RIGHT: Financial Simulator (5 cols) */}
      <div className="lg:col-span-5 bg-emerald-950 text-white rounded-3xl p-6 md:p-8 shadow-xl border border-emerald-900 relative overflow-hidden">
        {/* Decorative subtle vectors */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-900/40 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-amber-600/15 rounded-full blur-2xl -ml-5 -mb-5 pointer-events-none"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <Icons.Calculator className="w-6 h-6 text-amber-400" />
            <span className="text-xs font-mono uppercase tracking-widest text-emerald-200">
              Kalkulator Simulasi
            </span>
          </div>

          <h3 className="text-2xl font-display font-bold text-amber-400">
            Simulasi Akad Murabahah
          </h3>
          <p className="text-emerald-300 text-xs mt-1 mb-6">
            Rancang rencana pembiayaan Anda secara aman, instan, & halal.
          </p>

          <div className="space-y-5">
            {/* Input: Harga Barang (Terbatas Maksimal Rp 5.000.000) */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-medium text-emerald-200 flex items-center gap-1">
                  <Icons.ShoppingBag className="w-3.5 h-3.5" /> Harga Barang (Toko) - Maks. 5 Jt
                </label>
                <span className="text-xs font-mono text-amber-300 font-bold bg-amber-450/10 px-2 py-0.5 rounded-md">
                  {formatRupiah(Math.min(originalPrice, 5000000))}
                </span>
              </div>
              <input
                type="range"
                min="500000"
                max="5000000"
                step="100000"
                value={Math.min(originalPrice, 5000000)}
                onChange={(e) => {
                  setOriginalPrice(Number(e.target.value));
                }}
                className="w-full h-1.5 bg-emerald-900 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
              <div className="flex justify-between text-[10px] text-emerald-400 font-mono mt-1">
                <span>Rp 500 Ribu</span>
                <span>Rp 2.5 Juta</span>
                <span>Rp 5 Juta (Maksimal)</span>
              </div>
            </div>

            {/* Input: Downpayment / DP - Terkunci tanpa uang muka */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-medium text-emerald-200 flex items-center gap-1">
                  <Icons.ReceiptText className="w-3.5 h-3.5" /> Uang Muka / DP Pegawai
                </label>
                <span className="text-xs font-mono text-emerald-300 font-bold bg-emerald-900/80 px-2 py-0.5 rounded-md">
                  {formatRupiah(0)} (0%)
                </span>
              </div>
              <div className="bg-emerald-900/40 p-3 rounded-xl border border-emerald-800 text-[11px] text-emerald-200 leading-relaxed font-sans">
                📌 <strong className="text-white">Tanpa Uang Muka (DP Rp 0)</strong>: Seluruh harga perolehan barang akan dibiayai penuh 100% oleh Koperasi Syariah.
              </div>
            </div>

            {/* Input: Jangka Waktu Pembiayaan (Maksimal 1 Tahun) */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-medium text-emerald-200 flex items-center gap-1">
                  <Icons.CalendarDays className="w-3.5 h-3.5" /> Jangka Waktu (Maks. 1 Tahun)
                </label>
                <span className="text-xs font-mono text-amber-300 font-bold bg-amber-450/20 px-2.5 py-0.5 rounded-md">
                  {months} Bulan
                </span>
              </div>
              <div className="grid grid-cols-5 gap-1.5 bg-emerald-950 p-1.5 rounded-xl border border-emerald-800">
                {[3, 6, 8, 10, 12].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMonths(m)}
                    className={`py-1.5 text-xs font-mono font-bold rounded-lg transition-all cursor-pointer ${
                      months === m
                        ? "bg-amber-400 text-emerald-950 shadow-md"
                        : "text-emerald-100 hover:bg-emerald-800/60"
                    }`}
                  >
                    {m} Bln
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-emerald-300/80 mt-1.5 text-center font-mono">
                💡 <span className="underline">Skema Margin</span>: Tetap 15% flat untuk jangka waktu pembiayaan (maksimal 1 tahun).
              </p>
            </div>

            {/* Calculations Output Card */}
            <div className="bg-emerald-900/50 rounded-2xl p-4 border border-emerald-800 space-y-3 mt-4">
              <div className="flex justify-between text-xs text-emerald-200">
                <span>Nilai Pokok Pembiayaan:</span>
                <span className="font-mono">{formatRupiah(billingCalculation.financingAmount)}</span>
              </div>

              <div className="flex justify-between text-xs text-emerald-200">
                <span className="flex items-center gap-1">
                  Margin Keuntungan ({billingCalculation.rate}% x {months} bln):
                </span>
                <span className="font-mono text-amber-300">
                  + {formatRupiah(billingCalculation.marginAmount)}
                </span>
              </div>

              <div className="border-t border-emerald-800 my-2 pt-2"></div>

              <div className="flex justify-between text-xs text-emerald-100 font-medium">
                <span>Harga Jual Koperasi:</span>
                <span className="font-mono text-emerald-200 font-bold">
                  {formatRupiah(billingCalculation.totalSellingPrice)}
                </span>
              </div>

              {/* Monthly Installment Highlight */}
              <div className="bg-emerald-900 p-3 rounded-xl border border-emerald-700/50 flex flex-col items-center justify-center">
                <span className="text-[10px] uppercase text-emerald-300 font-semibold tracking-wider">
                  Angsuran Bulanan (Potong Gaji)
                </span>
                <span className="text-2xl md:text-3xl font-mono font-bold text-amber-450 mt-1">
                  {formatRupiah(billingCalculation.monthlyInstallment)}
                </span>
                <span className="text-[10px] text-emerald-400 mt-0.5">
                  Flat hingga bulan ke-{months}
                </span>
              </div>
            </div>

            <button
              onClick={() => onApplyWithSimulation(originalPrice, downpayment, months)}
              className="w-full mt-4 bg-amber-400 hover:bg-amber-300 text-emerald-950 font-display font-semibold transition-all duration-300 py-3 px-4 rounded-xl shadow-lg border-b-4 border-amber-600 active:transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Icons.Send className="w-4 h-4" />
              Ajukan Pembiayaan Sekarang
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
