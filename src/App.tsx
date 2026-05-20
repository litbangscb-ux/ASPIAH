import { useState, useEffect, useMemo } from 'react';
import * as Icons from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { FinancingApplication, UserRole, AppUser } from './types';
import { INITIAL_APPLICATIONS } from './data';
import ProgramInfo from './components/ProgramInfo';
import NewApplicationForm from './components/NewApplicationForm';
import ApplicationList from './components/ApplicationList';
import DocViewer from './components/DocViewer';
import GoogleLogin from './components/GoogleLogin';
import SettingsPanel from './components/SettingsPanel';

export default function App() {
  const [usersList, setUsersList] = useState<AppUser[]>(() => {
    const saved = localStorage.getItem('SCB_COOP_USERS_LIST');
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as AppUser[];
        const filtered = parsed.filter((u) => u.name.toLowerCase().includes('fuad habibi') || u.email.toLowerCase().includes('fuad.habibi'));
        if (filtered.length > 0) return filtered;
      } catch (e) {
        console.error(e);
      }
    }
    return [
      {
        id: 'usr-1',
        name: 'Fuad Habibi Siregar',
        email: 'fuad.habibi@gmail.com',
        role: 'COOPERATIVE',
        nik: 'SCB-2018-001',
        position: 'Ketua Koperasi',
        department: 'Koperasi Cendekia'
      }
    ];
  });

  const [currentUser, setCurrentUser] = useState<AppUser | null>(() => {
    const saved = localStorage.getItem('SCB_COOP_CURRENT_USER');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && (parsed.name.toLowerCase().includes('fuad habibi') || parsed.email.toLowerCase().includes('fuad.habibi'))) {
          return parsed;
        }
      } catch (e) {
        console.error(e);
      }
    }
    // Default to logged-in as Fuad Habibi Siregar
    return {
      id: 'usr-1',
      name: 'Fuad Habibi Siregar',
      email: 'fuad.habibi@gmail.com',
      role: 'COOPERATIVE',
      nik: 'SCB-2018-001',
      position: 'Ketua Koperasi',
      department: 'Koperasi Cendekia'
    };
  });

  const [currentRole, setCurrentRole] = useState<UserRole>(currentUser?.role || 'COOPERATIVE');
  const [activeTab, setActiveTab] = useState<'INFO' | 'ADD' | 'LIST' | 'DOC' | 'SETTINGS'>('INFO');

  // Applications Local Storage persistence
  const [applications, setApplications] = useState<FinancingApplication[]>([]);
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);

  // Transfer parameters from simulation calculator directly to Form
  const [simulatedParams, setSimulatedParams] = useState<{ price: number; dp: number; months: number } | null>(null);

  // Sync state values to localStorage on change
  useEffect(() => {
    localStorage.setItem('SCB_COOP_USERS_LIST', JSON.stringify(usersList));
  }, [usersList]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('SCB_COOP_CURRENT_USER', JSON.stringify(currentUser));
      setCurrentRole(currentUser.role);
    } else {
      localStorage.removeItem('SCB_COOP_CURRENT_USER');
    }
  }, [currentUser]);

  // Load and Save localStorage
  useEffect(() => {
    const cleared = localStorage.getItem('SCB_COOP_APPLICATIONS_CLEARED_V3');
    if (!cleared) {
      localStorage.setItem('SCB_COOP_APPLICATIONS', JSON.stringify([]));
      localStorage.setItem('SCB_COOP_APPLICATIONS_CLEARED_V3', 'true');
      setApplications([]);
    } else {
      const saved = localStorage.getItem('SCB_COOP_APPLICATIONS');
      if (saved) {
        try {
          setApplications(JSON.parse(saved));
        } catch (e) {
          console.error('Error loading stored applications', e);
          setApplications([]);
        }
      } else {
        setApplications([]);
      }
    }
  }, []);

  const saveApplications = (updatedApps: FinancingApplication[]) => {
    setApplications(updatedApps);
    localStorage.setItem('SCB_COOP_APPLICATIONS', JSON.stringify(updatedApps));
  };

  // Add new application initiated by employee
  const handleCreateApplication = (
    newAppBase: Omit<FinancingApplication, 'id' | 'createdAt'>
  ) => {
    const newId = `CCS-2026-${String(applications.length + 1).padStart(3, '0')}`;
    const newApp: FinancingApplication = {
      ...newAppBase,
      id: newId,
      createdAt: new Date().toISOString()
    };

    const updated = [newApp, ...applications];
    saveApplications(updated);
    setSimulatedParams(null); // Clear simulation transfer
    setActiveTab('LIST'); // Direct user to the tracking board

    alert(`Alhamdulillah! Pengisian formulir berhasil. Permohonan Anda terdaftar dengan nomor: ${newId}. Selesaikan rincian draf Anda sekarang.`);
  };

  // Update application reviews or signatures
  const handleUpdateApplication = (updatedApp: FinancingApplication) => {
    const updated = applications.map((app) => (app.id === updatedApp.id ? updatedApp : app));
    saveApplications(updated);

    // Sync active viewed document with changes
    if (selectedAppId === updatedApp.id) {
      setSelectedAppId(updatedApp.id);
    }
  };

  // Handle direct navigation to and populating the Apply tab from the simulator
  const handleApplyWithSimulation = (price: number, dp: number, months: number) => {
    setSimulatedParams({ price, dp, months });
    setActiveTab('ADD');
  };

  // Add mobile drawer state
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Get current active document
  const selectedApplication = useMemo(() => {
    return applications.find((app) => app.id === selectedAppId) || null;
  }, [selectedAppId, applications]);

  // Notifications or pending alerts count helper
  const pendingCount = useMemo(() => {
    return applications.filter((app) => {
      if (currentRole === 'MANAGEMENT') return app.status === 'PENDING_RECOMMENDATION';
      if (currentRole === 'COOPERATIVE') return app.status === 'PENDING_COOPERATIVE';
      // If employee, count approved and unsigned items
      return app.status === 'APPROVED' && !app.akadMurabahah.isSigned;
    }).length;
  }, [applications, currentRole]);

  // Define sidebar menu options dynamically
  const menuItems = useMemo(() => {
    return [
      {
        id: 'INFO' as const,
        label: 'Panduan & Simulasi',
        icon: Icons.BookOpenCheck,
        desc: 'SOP & Kalkulator'
      },
      {
        id: 'ADD' as const,
        label: 'Permohonan Baru',
        icon: Icons.FilePlus2,
        desc: 'Isi Formulir'
      },
      {
        id: 'LIST' as const,
        label: 'Monitoring & Akad',
        icon: Icons.Activity,
        desc: 'Verifikasi Berkas',
        badge: applications.length > 0 ? applications.length : undefined
      },
      {
        id: 'SETTINGS' as const,
        label: 'Pengaturan',
        icon: Icons.Settings,
        desc: 'Profil & Google Account'
      }
    ];
  }, [applications.length]);

  // Current user profiles information to match currentRole
  const activeProfile = useMemo(() => {
    if (currentUser && currentUser.role === currentRole) {
      return {
        initials: currentUser.name.substring(0, 2).toUpperCase(),
        name: currentUser.name,
        roleName: currentUser.role === 'COOPERATIVE' ? 'Ketua Koperasi' : currentUser.role === 'MANAGEMENT' ? 'Manajemen Sekolah' : 'Pegawai Pemohon',
        dept: currentUser.department || 'Cendekia Corner'
      };
    }

    if (currentRole === 'EMPLOYEE') {
      return {
        initials: 'AP',
        name: 'Anggota Pegawai',
        roleName: 'Pegawai Pemohon',
        dept: 'Litbang SCB'
      };
    } else if (currentRole === 'MANAGEMENT') {
      return {
        initials: 'PM',
        name: 'Pihak Manajemen',
        roleName: 'Manajemen Sekolah',
        dept: 'Kepala Sekolah SCB'
      };
    } else {
      return {
        initials: 'FH',
        name: 'Fuad Habibi Siregar', // Ganti nama user menjadi Fuad Habibi Siregar
        roleName: 'Ketua Koperasi',
        dept: 'Koperasi Cendekia'
      };
    }
  }, [currentRole, currentUser]);

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <GoogleLogin
          onLogin={(user) => {
            setCurrentUser(user);
            setUsersList((prev) => {
              if (prev.some((u) => u.email.toLowerCase() === user.email.toLowerCase())) {
                return prev.map((u) => u.email.toLowerCase() === user.email.toLowerCase() ? { ...u, ...user } : u);
              }
              return [...prev, user];
            });
          }}
          availableUsers={usersList}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row font-sans selection:bg-emerald-900 selection:text-white">
      {/* SIDEBAR FOR DESKTOP - hidden during print */}
      <aside className="no-print w-68 bg-emerald-900 border-r border-emerald-800/40 text-white shrink-0 hidden lg:flex flex-col relative overflow-hidden">
        {/* Subtle decorative pattern in background */}
        <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:20px_20px] opacity-10 pointer-events-none"></div>
        
        {/* Branding header */}
        <div className="p-6 border-b border-emerald-800/60 relative z-10 flex items-center gap-3">
          <div className="p-2 bg-amber-400 text-emerald-950 rounded-xl shadow-md cursor-pointer hover:rotate-6 transition-transform shrink-0">
            <Icons.Building2 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight text-white leading-tight">Cendekia Corner</h1>
            <p className="text-emerald-300 text-[10px] uppercase font-mono tracking-widest mt-0.5">Syariah Cooperative</p>
          </div>
        </div>

        {/* Dynamic Navigation Menu */}
        <nav className="flex-1 p-4 space-y-1.5 relative z-10 overflow-y-auto">
          <div className="text-[10px] font-mono uppercase tracking-wider text-emerald-300/60 px-3 mb-2 font-bold">Menu Utama</div>
          {menuItems.map((item) => {
            const isActive = activeTab === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  if (item.id !== 'DOC') {
                    setSelectedAppId(null);
                  }
                }}
                className={`w-full flex items-center justify-between p-3 rounded-xl transition-all font-sans text-sm text-left hover:bg-emerald-800/40 relative group cursor-pointer ${
                  isActive
                    ? 'bg-emerald-950 text-amber-300 font-bold border-l-4 border-amber-450 pl-2'
                    : 'text-emerald-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${isActive ? 'text-amber-450' : 'text-emerald-300'}`} />
                  <div className="flex flex-col">
                    <span className="font-semibold block leading-tight">{item.label}</span>
                    <span className="text-[10px] text-emerald-400 block leading-tight mt-0.5 font-normal">{item.desc}</span>
                  </div>
                </div>
                {item.badge !== undefined && (
                  <span className="bg-amber-400 text-emerald-950 font-mono text-[9px] px-2 py-0.5 rounded-full font-bold">
                    {item.badge}
                  </span>
                )}
              </button>
            )
          })}

          {selectedAppId && (
            <div className="pt-4 mt-4 border-t border-emerald-800/40">
              <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-300/60 px-3 block mb-2 font-bold">Dokumen Terpilih</span>
              <button
                onClick={() => setActiveTab('DOC')}
                className={`w-full flex items-center justify-between p-3 rounded-xl transition-all font-sans text-sm text-left hover:bg-emerald-800/40 relative group cursor-pointer ${
                  activeTab === 'DOC'
                    ? 'bg-emerald-950 text-amber-300 font-bold border-l-4 border-amber-450 pl-2'
                    : 'text-emerald-100/70 border border-emerald-800/40 bg-emerald-950/20'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icons.FileSignature className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${activeTab === 'DOC' ? 'text-amber-455' : 'text-emerald-400'}`} />
                  <div className="flex flex-col">
                    <span className="font-semibold block leading-tight text-xs truncate max-w-[130px]">{selectedApplication?.goods.itemName || 'Pratinjau Akad'}</span>
                    <span className="text-[9px] font-mono text-emerald-400 block mt-0.5">{selectedAppId}</span>
                  </div>
                </div>
                <Icons.CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              </button>
            </div>
          )}
        </nav>

        {/* Dynamic authenticated Actor Profile Widget */}
        <div className="p-4 bg-emerald-950/80 border-t border-emerald-800/60 relative z-10 w-full shrink-0">
          <div className="flex items-center justify-between gap-1.5 min-w-0">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8.5 h-8.5 rounded-xl bg-emerald-850 border border-emerald-800 text-amber-300 flex items-center justify-center font-bold tracking-tight text-xs uppercase shrink-0">
                {activeProfile.initials}
              </div>
              <div className="min-w-0 font-sans">
                <p className="text-xs font-bold text-slate-100 truncate">{activeProfile.name}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 animate-pulse"></span>
                  <p className="text-[10px] text-emerald-300 truncate font-mono leading-none">{activeProfile.roleName}</p>
                </div>
              </div>
            </div>
            
            <button
              onClick={() => {
                setCurrentUser(null);
                setActiveTab('INFO');
              }}
              title="Keluar / Ganti Akun Google"
              className="p-1.5 rounded-lg text-emerald-300 hover:text-red-400 hover:bg-emerald-800/60 transition-colors cursor-pointer shrink-0"
            >
              <Icons.LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* MOBILE DRAWER SIDEBAR - hidden during print */}
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden no-print">
            {/* Overlay backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileSidebarOpen(false)}
              className="absolute inset-0 bg-emerald-950/60 backdrop-blur-xs"
            ></motion.div>

            {/* Sidebar content container */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute top-0 bottom-0 left-0 w-72 bg-emerald-900 text-white flex flex-col shadow-2xl z-10"
            >
              {/* Header with Close */}
              <div className="p-5 border-b border-emerald-800/60 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 bg-amber-400 text-emerald-950 rounded-lg">
                    <Icons.Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">Cendekia Corner</h3>
                    <p className="text-[10px] text-emerald-300 uppercase tracking-wider font-mono">Syariah Cooperative</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsMobileSidebarOpen(false)}
                  className="p-1 text-emerald-200 hover:text-white bg-emerald-950/50 rounded-lg cursor-pointer"
                >
                  <Icons.X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Items */}
              <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
                {menuItems.map((item) => {
                  const isActive = activeTab === item.id;
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        if (item.id !== 'DOC') {
                          setSelectedAppId(null);
                        }
                        setIsMobileSidebarOpen(false);
                      }}
                      className={`w-full flex items-center justify-between p-3 rounded-xl transition-all font-sans text-sm text-left hover:bg-emerald-800/40 relative group ${
                        isActive
                          ? 'bg-emerald-850 text-amber-300 font-bold border-l-4 border-amber-450 pl-2'
                          : 'text-emerald-100'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`w-4 h-4 shrink-0 px-0.5 ${isActive ? 'text-amber-455' : 'text-emerald-300'}`} />
                        <div className="flex flex-col">
                          <span className="font-semibold block leading-tight">{item.label}</span>
                          <span className="text-[10px] text-emerald-400 block leading-tight mt-0.5 font-normal">{item.desc}</span>
                        </div>
                      </div>
                      {item.badge !== undefined && (
                        <span className="bg-amber-400 text-emerald-950 font-mono text-[9px] px-2 py-0.5 rounded-full font-bold">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  )
                })}

                {selectedAppId && (
                  <div className="pt-4 mt-4 border-t border-emerald-800/40">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-300/60 px-3 block mb-2 font-bold">Dokumen Terpilih</span>
                    <button
                      onClick={() => {
                        setActiveTab('DOC');
                        setIsMobileSidebarOpen(false);
                      }}
                      className={`w-full flex items-center justify-between p-3 rounded-xl transition-all font-sans text-sm text-left hover:bg-emerald-800/40 relative group ${
                        activeTab === 'DOC'
                          ? 'bg-emerald-850 text-amber-300 font-bold border-l-4 border-amber-450 pl-2'
                          : 'text-emerald-100/70 border border-emerald-800/40 bg-emerald-950/20'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icons.FileSignature className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${activeTab === 'DOC' ? 'text-amber-455' : 'text-emerald-400'}`} />
                        <div className="flex flex-col">
                          <span className="font-semibold block leading-tight text-xs truncate max-w-[130px]">{selectedApplication?.goods.itemName || 'Pratinjau Akad'}</span>
                          <span className="text-[9px] font-mono text-emerald-400 block mt-0.5">{selectedAppId}</span>
                        </div>
                      </div>
                      <Icons.CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    </button>
                  </div>
                )}
              </nav>

              {/* Dynamic Profile Widget */}
              <div className="p-4 bg-emerald-950/80 border-t border-emerald-800/60 w-full shrink-0">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-emerald-850 border border-emerald-800 text-amber-300 flex items-center justify-center font-bold text-xs uppercase shrink-0">
                      {activeProfile.initials}
                    </div>
                    <div className="min-w-0 font-sans">
                      <p className="text-xs font-bold text-slate-100 truncate">{activeProfile.name}</p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 animate-pulse"></span>
                        <p className="text-[10px] text-emerald-300 truncate font-mono leading-none">{activeProfile.roleName}</p>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => {
                      setCurrentUser(null);
                      setActiveTab('INFO');
                      setIsMobileSidebarOpen(false);
                    }}
                    className="p-1.5 rounded-lg text-emerald-300 hover:text-red-400 hover:bg-emerald-900 transition-colors cursor-pointer shrink-0 flex items-center gap-1 text-[10px] font-bold"
                  >
                    <Icons.LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MAIN CONTAINER */}
      <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
        {/* PREMIUM TOP HEADER - hidden during print */}
        <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0 no-print">
          <div className="flex items-center gap-3">
            {/* Hamburger button on mobile */}
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg shrink-0 cursor-pointer"
            >
              <Icons.Menu className="w-5 h-5" />
            </button>
            <div className="flex flex-col">
              <h2 className="text-sm sm:text-base font-bold text-slate-800 tracking-tight leading-tight">
                {activeTab === 'INFO' && 'SOP & Simulasi Pembiayaan'}
                {activeTab === 'ADD' && 'Formulir Permohonan Pembiayaan'}
                {activeTab === 'LIST' && 'Monitoring Verifikasi & Akad'}
                {activeTab === 'DOC' && 'Studio Pratinjau Akad & Dokumen'}
                {activeTab === 'SETTINGS' && 'Atur Profil & Google Account'}
              </h2>
              <span className="text-[10px] text-slate-400 block mt-0.5 font-medium hidden sm:inline-block">
                Sistem Pembiayaan Syariah Pegawai Sekolah Cendekia BAZNAS (SCB)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 shrink-0 font-sans">
            {/* Date time widget dynamically rendered on desktop */}
            <div className="hidden md:flex items-center gap-1.5 text-slate-400 text-xs font-medium bg-slate-50 border border-slate-100 px-3 py-1 rounded-full">
              <Icons.CircleUser className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
              <span className="truncate max-w-[120px]">{activeProfile.name}</span>
            </div>
            
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-100 rounded-full p-1 self-center">
              <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded-full text-[10px] font-bold tracking-wide">
                ONLINE
              </span>
              <button
                onClick={() => {
                  setCurrentUser(null);
                  setActiveTab('INFO');
                }}
                className="flex items-center gap-1 hover:text-red-600 hover:bg-red-50 text-slate-500 rounded-full py-1 px-2.5 transition-colors cursor-pointer text-[11px] font-bold"
              >
                <Icons.LogOut className="w-3.5 h-3.5 text-slate-400 hover:text-red-500 shrink-0" />
                <span>Keluar</span>
              </button>
            </div>
          </div>
        </header>

        {/* CORE WORKSPACE SECTION */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-full overflow-y-auto w-full">
          {/* Notification Alert Bar - if any */}
          {pendingCount > 0 && activeTab !== 'DOC' && (
            <div className="mb-6 bg-amber-400/95 text-emerald-950 px-4 py-3 rounded-2xl text-xs font-semibold flex items-start sm:items-center justify-between gap-3 shadow-xs border border-amber-300 no-print animate-pulse">
              <div className="flex items-center gap-2.5">
                <Icons.BellRing className="w-4 h-4 shrink-0 text-emerald-950" />
                <span className="leading-tight">
                  {currentRole === 'EMPLOYEE'
                    ? `💡 Perhatian Pegawai: Anda memiliki ${pendingCount} berkas pembiayaan yang disetujui & siap ditandatangani akad.`
                    : currentRole === 'MANAGEMENT'
                    ? `📋 Perhatian Manajemen: Ada ${pendingCount} pengajuan yang membutuhkan Surat Rekomendasi/Verifikasi Anda.`
                    : `🌿 Perhatian Ketua Koperasi: Ada ${pendingCount} berkas berrekomendasi menunggu persetujuan akhir.`}
                </span>
              </div>
              <button
                onClick={() => {
                  setSelectedAppId(null);
                  setActiveTab('LIST');
                }}
                className="shrink-0 bg-emerald-950 text-white font-bold px-3 py-1.5 rounded-xl text-[10px] hover:bg-emerald-900 transition-colors cursor-pointer"
              >
                Tinjau Berkas
              </button>
            </div>
          )}



          {/* ACTIVE SCREEN CONTENT */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab + (selectedAppId || '')}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="w-full"
            >
              {activeTab === 'INFO' && (
                <ProgramInfo onApplyWithSimulation={handleApplyWithSimulation} />
              )}

              {activeTab === 'ADD' && (
                <NewApplicationForm
                  initialSimulationParams={simulatedParams}
                  onSubmit={handleCreateApplication}
                  userEmail={currentUser?.email || 'litbang.scb@gmail.com'}
                />
              )}

              {activeTab === 'LIST' && (
                <ApplicationList
                  applications={applications}
                  currentRole={currentRole}
                  onUpdateApplication={handleUpdateApplication}
                  onSelectDocument={(appId) => {
                    setSelectedAppId(appId);
                    setActiveTab('DOC');
                  }}
                  currentUser={currentUser}
                />
              )}

              {activeTab === 'DOC' && selectedApplication && (
                <DocViewer
                  application={selectedApplication}
                  currentRole={currentRole}
                  onUpdateApplication={handleUpdateApplication}
                  onBack={() => {
                    setSelectedAppId(null);
                    setActiveTab('LIST');
                  }}
                />
              )}

              {activeTab === 'SETTINGS' && (
                <SettingsPanel
                  currentUser={currentUser}
                  usersList={usersList}
                  onUpdateCurrentUser={setCurrentUser}
                  onUpdateUsersList={setUsersList}
                  onLogout={() => {
                    setCurrentUser(null);
                    setActiveTab('INFO');
                  }}
                  onResetApplications={() => {
                    localStorage.removeItem('SCB_COOP_APPLICATIONS');
                    setApplications(INITIAL_APPLICATIONS);
                    setSelectedAppId(null);
                    setActiveTab('INFO');
                  }}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* FOOTER SECTION - hidden during print */}
        <footer className="bg-white border-t border-slate-200 py-4 px-6 text-[11px] text-slate-400 font-medium no-print shrink-0">
          <div className="flex flex-col md:flex-row justify-between items-center gap-2">
            <p className="text-center md:text-left leading-relaxed">
              Koperasi Cendekia Corner Syariah BAZNAS © 2026 • Membangun Kesejahteraan Bebas Riba.
            </p>
            <p className="font-mono text-[10px]">
              Sistem Operasional Digital • Berlisensi Resmi SCB-SYR • Ketua Fuad Habibi Siregar.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
