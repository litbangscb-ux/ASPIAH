import * as Icons from 'lucide-react';
import { UserRole } from '../types';

interface RoleSelectorProps {
  currentRole: UserRole;
  onChangeRole: (role: UserRole) => void;
}

export default function RoleSelector({ currentRole, onChangeRole }: RoleSelectorProps) {
  const roles = [
    {
      id: 'EMPLOYEE' as UserRole,
      label: 'Pegawai (Pemohon)',
      icon: 'User',
      colorClassName: 'border-emerald-500 bg-emerald-50 text-emerald-950',
      desc: 'Mengajukan pembiayaan, mengecek status, dan menandatangani akad Murabahah.',
    },
    {
      id: 'MANAGEMENT' as UserRole,
      label: 'Manajemen Sekolah',
      icon: 'ShieldAlert',
      colorClassName: 'border-blue-500 bg-blue-50 text-blue-950',
      desc: 'Memberikan rekomendasi tertulis kelayakan moral & kerja pegawai.',
    },
    {
      id: 'COOPERATIVE' as UserRole,
      label: 'Ketua Koperasi (CC Syariah)',
      icon: 'Award',
      colorClassName: 'border-amber-500 bg-amber-50 text-amber-950',
      desc: 'Fuad Habibi Siregar - Memverifikasi, menyetujui, & menandatangani akad.',
    },
  ];

  return (
    <div className="bg-white text-slate-800 p-5 rounded-2xl border border-slate-200 shadow-sm mb-6 relative overflow-hidden">
      {/* Absolute subtle glowing sphere */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl -mr-6 -mt-6"></div>

      <div className="relative z-10 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
        <div>
          <div className="flex items-center gap-1.5 mb-1 bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-md w-fit">
            <Icons.Layers3 className="w-3.5 h-3.5" />
            <h4 className="text-[10px] font-mono font-bold tracking-widest uppercase">
              Simulator Ruang Pengguna (Multi-Role Mode)
            </h4>
          </div>
          <h3 className="text-base font-bold text-slate-800">
            Alur Simulasi Kemitraan Koperasi
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-xl">
            Sistem pembiayaan syariah ini melalui persetujuan berantai. Gunakan panel peran di bawah untuk mensimulasikan alur pengajuan, rekomendasi manajemen, dan penandatanganan akad.
          </p>
        </div>

        {/* Pill Switches */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full xl:w-auto shrink-0">
          {roles.map((item) => {
            const isActive = currentRole === item.id;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const Icon = (Icons as any)[item.icon] || Icons.User;
            return (
              <button
                key={item.id}
                onClick={() => onChangeRole(item.id)}
                className={`flex flex-col text-left p-3 rounded-xl border-2 transition-all duration-200 shadow-xs cursor-pointer ${
                  isActive
                    ? 'border-emerald-600 bg-emerald-50/50 text-emerald-950 ring-2 ring-emerald-650/10'
                    : 'border-slate-100 bg-slate-50/40 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className={`p-1.5 rounded-lg ${isActive ? 'bg-emerald-850 text-amber-300' : 'bg-slate-200 text-slate-600'}`}>
                    <Icon className="w-3.5 h-3.5" />
                  </span>
                  <span className="text-xs font-bold font-sans">{item.label}</span>
                </div>
                <span className="text-[10px] text-slate-400 mt-1 lines-clamp-2">
                  {item.desc}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
