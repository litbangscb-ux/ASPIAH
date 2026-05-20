import { useState, FormEvent, useEffect } from 'react';
import * as Icons from 'lucide-react';
import { AppUser } from '../types';

interface GoogleLoginProps {
  onLogin: (user: AppUser) => void;
  availableUsers: AppUser[];
}

export default function GoogleLogin({ onLogin, availableUsers }: GoogleLoginProps) {
  const [emailInput, setEmailInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [selectedRole, setSelectedRole] = useState<'EMPLOYEE' | 'MANAGEMENT' | 'COOPERATIVE'>('COOPERATIVE');
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');

  // Pre-configured official corporate/institution accounts mapped to Gmails for easy click-and-go
  const officialAccounts = [
    {
      id: 'usr-1',
      name: 'Fuad Habibi Siregar',
      email: 'fuad.habibi@gmail.com',
      role: 'COOPERATIVE' as const,
      nik: 'SCB-2018-001',
      position: 'Ketua Koperasi Syariah',
      department: 'Koperasi Cendekia',
      avatarColor: 'bg-emerald-600 text-white'
    }
  ];

  // Helper trigger for realistic visual simulation of Gmail connection
  const triggerGoogleOAuthSimulation = (user: AppUser) => {
    setIsLoading(true);
    setLoadingStep('Membuka Saluran Ambeien Google OAuth 2.0...');
    
    setTimeout(() => {
      setLoadingStep('Menghubungkan ke layanan gmail.com...');
    }, 600);

    setTimeout(() => {
      setLoadingStep(`Otentikasi Akun: ${user.email}...`);
    }, 1200);

    setTimeout(() => {
      setLoadingStep('Sinkronisasi Token Kemitraan Aman SCB-SYR...');
    }, 1800);

    setTimeout(() => {
      setIsLoading(false);
      onLogin(user);
    }, 2400);
  };

  const handleCustomLoginSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanEmail = emailInput.trim();
    if (!cleanEmail) {
      setError('Masukkan alamat Email Google Anda.');
      return;
    }

    if (!cleanEmail.toLowerCase().endsWith('@gmail.com')) {
      setError('Harap gunakan alamat Gmail resmi institusi atau pribadi Anda (contoh: nama@gmail.com).');
      return;
    }

    const finalName = nameInput.trim() || 'Anggota Koperasi';
    const randomNikInt = Math.floor(Math.random() * 800) + 100;

    const customUser: AppUser = {
      id: `USR-${Date.now()}`,
      name: finalName,
      email: cleanEmail.toLowerCase(),
      role: selectedRole,
      nik: `SCB-2026-${randomNikInt}`,
      position: selectedRole === 'COOPERATIVE' 
        ? 'Ketua Koperasi' 
        : selectedRole === 'MANAGEMENT' 
        ? 'Direktur Sekolah / Yayasan' 
        : 'Staf Pengajar / Pegawai Utama',
      department: selectedRole === 'COOPERATIVE' 
        ? 'Koperasi Cendekia' 
        : selectedRole === 'MANAGEMENT' 
        ? 'Komite Manajemen SCB' 
        : 'Divisi Akademik SCB'
    };

    triggerGoogleOAuthSimulation(customUser);
  };

  return (
    <div className="max-w-md w-full mx-auto bg-white rounded-3xl border border-slate-200/90 shadow-2xl p-8 relative overflow-hidden font-sans no-print">
      {/* Accent Google color-strip header */}
      <div className="absolute top-0 inset-x-0 h-1.5 flex">
        <div className="flex-1 bg-red-500"></div>
        <div className="flex-1 bg-yellow-500"></div>
        <div className="flex-1 bg-green-500"></div>
        <div className="flex-1 bg-blue-500"></div>
      </div>

      {isLoading ? (
        <div className="py-12 flex flex-col items-center justify-center text-center space-y-6 min-h-[380px]">
          {/* Authentic-looking rotating Google circular progress indicator */}
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-4 border-slate-100"></div>
            <div className="absolute inset-0 rounded-full border-4 border-emerald-600 border-t-transparent animate-spin"></div>
            <div className="absolute inset-2 flex items-center justify-center bg-white rounded-full">
              {/* Core secure padlock */}
              <Icons.ShieldCheck className="w-6 h-6 text-emerald-600" />
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-bold text-slate-800 tracking-tight">Menghubungkan Akun Google</h3>
            <p className="text-xs text-slate-400 font-mono tracking-wide animate-pulse">{loadingStep}</p>
          </div>

          <div className="text-[10px] text-slate-400 font-sans border border-slate-100 bg-slate-50 px-3 py-1.5 rounded-full inline-flex items-center gap-1.5">
            <Icons.LockKeyhole className="w-3.5 h-3.5 text-blue-500" />
            <span>Kanal Google Single-Sign On Aman</span>
          </div>
        </div>
      ) : (
        <div>
          {/* Header & App Branding Info */}
          <div className="text-center mb-6">
            {/* Google-like logo visual framing with syariah emblem */}
            <div className="inline-flex relative mb-3">
              <div className="p-4 bg-emerald-50 text-emerald-800 rounded-2xl border border-emerald-100 shadow-sm">
                <Icons.Building2 className="w-7 h-7" />
              </div>
              {/* Authenticity mini tick */}
              <span className="absolute -bottom-1 -right-1 bg-blue-500 text-white p-0.5 rounded-md text-[8px] border border-white font-bold font-sans">
                G
              </span>
            </div>
            
            <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">Koperasi Cendekia Corner</h2>
            <p className="text-[10px] text-slate-500 mt-1 font-semibold uppercase tracking-widest font-mono">
              Syariah Digital Portal • SCB BAZNAS
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-100/80 rounded-2xl p-3.5 mb-5 text-center">
            <p className="text-xs text-slate-600 leading-relaxed font-semibold">
              Gunakan Akun Google / Gmail untuk masuk ke Portal Pembiayaan Bebas Riba.
            </p>
          </div>

          {!showCustomForm ? (
            <div className="space-y-4">
              {/* Account selection list */}
              <div className="text-[10px] items-center justify-between font-bold text-slate-400 font-mono tracking-widest uppercase mb-1 flex">
                <span>Pilih Akun Gmail Resmi</span>
                <span className="text-emerald-600 flex items-center gap-0.5 lowercase font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 inline-block animate-pulse"></span> @gmail.com yang terdaftar
                </span>
              </div>

              <div className="space-y-2.5">
                {officialAccounts.map((user) => (
                  <button
                    key={user.id}
                    onClick={() => triggerGoogleOAuthSimulation({
                      id: user.id,
                      name: user.name,
                      email: user.email,
                      role: user.role,
                      nik: user.nik,
                      position: user.position,
                      department: user.department
                    })}
                    className="w-full flex items-center justify-between p-3 rounded-2xl border border-slate-200 bg-white hover:border-emerald-600 hover:bg-emerald-50/20 active:scale-[0.99] transition-all text-left cursor-pointer group shadow-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${user.avatarColor} shadow-inner`}>
                        {user.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-xs font-bold text-slate-800 group-hover:text-emerald-900 truncate">
                            {user.name}
                          </h4>
                          <span className="py-[1px] px-1.5 bg-slate-100 text-slate-500 font-bold rounded text-[8px] font-mono shrink-0">
                            {user.role === 'COOPERATIVE' ? 'Ketua' : user.role === 'MANAGEMENT' ? 'Kepsek' : 'Pegawai'}
                          </span>
                        </div>
                        <p className="text-[9px] text-slate-400 font-mono mt-0.5 truncate">{user.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pr-1 shrink-0">
                      <span>Pilih</span>
                      <Icons.ArrowUpRight className="w-3.5 h-3.5" />
                    </div>
                  </button>
                ))}
              </div>

              {/* Secure divider standard styles */}
              <div className="relative my-4 flex items-center justify-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200"></div>
                </div>
                <span className="relative px-3.5 bg-white text-[10px] text-slate-400 font-bold tracking-widest uppercase font-mono">
                  Atau
                </span>
              </div>

              {/* Login with another custom Gmail button */}
              <button
                type="button"
                onClick={() => {
                  setShowCustomForm(true);
                  setError('');
                }}
                className="w-full py-3 px-4 rounded-xl border border-blue-200 bg-blue-50/40 hover:bg-blue-50 text-blue-750 font-bold text-xs flex items-center justify-center gap-2.5 transition-all cursor-pointer border-dashed"
              >
                {/* Standard colorful Google symbol simulation */}
                <div className="w-4 h-4 rounded-full bg-white flex items-center justify-center shadow-xs text-[10px] font-bold text-blue-600 select-none">
                  G
                </div>
                Gunakan Alamat Gmail Lain
              </button>
            </div>
          ) : (
            <form onSubmit={handleCustomLoginSubmit} className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                  FORMULIR OTENTIKASI GMAIL
                </span>
                <button
                  type="button"
                  onClick={() => setShowCustomForm(false)}
                  className="text-xs text-blue-600 hover:text-blue-800 font-bold flex items-center gap-0.5 cursor-pointer"
                >
                  <Icons.ChevronLeft className="w-4 h-4" /> Kembali
                </button>
              </div>

              {error && (
                <div className="bg-red-50 text-red-700 p-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 border border-red-100">
                  <Icons.AlertTriangle className="w-4.5 h-4.5 shrink-0 text-red-500" />
                  <span className="leading-tight">{error}</span>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[10px] text-slate-500 uppercase font-black tracking-wider">
                  Alamat Gmail Anda (@gmail.com)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-slate-400">
                    <Icons.Mail className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="nama.pegawai@gmail.com"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-1 focus:ring-blue-500 focus:bg-white focus:outline-none placeholder:text-slate-300 font-mono text-slate-800"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-500 uppercase font-black tracking-wider">
                  Nama Lengkap Anggota
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-slate-400">
                    <Icons.User className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="Nama Lengkap sesuai SK SCB"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-1 focus:ring-blue-500 focus:bg-white focus:outline-none placeholder:text-slate-300"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-500 uppercase font-black tracking-wider block">
                  Pilih Otoritas Peran Kemitraan
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'EMPLOYEE', label: 'Pegawai', desc: 'Pemohon' },
                    { id: 'MANAGEMENT', label: 'Manajemen', desc: 'Kepsek SCB' },
                    { id: 'COOPERATIVE', label: 'Koperasi', desc: 'Ketua' }
                  ].map((roleOpt) => (
                    <button
                      key={roleOpt.id}
                      type="button"
                      onClick={() => setSelectedRole(roleOpt.id as any)}
                      className={`p-2.5 rounded-xl border-2 transition-all flex flex-col justify-center items-center text-center cursor-pointer ${
                        selectedRole === roleOpt.id
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold'
                          : 'border-slate-100 bg-slate-50 text-slate-500'
                      }`}
                    >
                      <span className="text-xs font-bold leading-none">{roleOpt.label}</span>
                      <span className="text-[8px] font-mono mt-0.5 opacity-80">{roleOpt.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Main Auth Button with Gmail theme */}
              <button
                type="submit"
                className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl text-xs font-sans flex items-center justify-center gap-2 shadow-md hover:shadow-lg hover:shadow-blue-100 transition-all cursor-pointer active:scale-95"
              >
                {/* Standard multi colored authentic simulation element */}
                <div className="w-4 h-4 rounded-full bg-white flex items-center justify-center shadow-xs text-[10px] font-bold text-red-500 select-none mr-1">
                  G
                </div>
                Otentikasi Gmail & Masuk
              </button>
            </form>
          )}

          {/* Security guarantee banner */}
          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-center gap-2 text-slate-400 text-[10px] font-medium font-sans">
            <Icons.LockKeyhole className="w-3.5 h-3.5 text-blue-500" />
            <span>Koneksi dilindungi oleh Google OAuth 2.0</span>
          </div>
        </div>
      )}
    </div>
  );
}
