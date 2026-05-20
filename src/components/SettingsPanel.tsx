import { useState, FormEvent } from 'react';
import * as Icons from 'lucide-react';
import { AppUser, UserRole } from '../types';

interface SettingsPanelProps {
  currentUser: AppUser | null;
  usersList: AppUser[];
  onUpdateCurrentUser: (user: AppUser) => void;
  onUpdateUsersList: (list: AppUser[]) => void;
  onLogout: () => void;
  onResetApplications: () => void;
}

export default function SettingsPanel({
  currentUser,
  usersList,
  onUpdateCurrentUser,
  onUpdateUsersList,
  onLogout,
  onResetApplications
}: SettingsPanelProps) {
  // Local states for editing the CURRENT LOGGED-IN user
  const [userName, setUserName] = useState(currentUser?.name || '');
  const [userEmail, setUserEmail] = useState(currentUser?.email || '');
  const [userNik, setUserNik] = useState(currentUser?.nik || '');
  const [userPosition, setUserPosition] = useState(currentUser?.position || '');
  const [userDepartment, setUserDepartment] = useState(currentUser?.department || '');
  const [userRole, setUserRole] = useState<UserRole>(currentUser?.role || 'COOPERATIVE');

  // Local states for adding or editing SOME OTHER user in the directory
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [dirName, setDirName] = useState('');
  const [dirEmail, setDirEmail] = useState('');
  const [dirRole, setDirRole] = useState<UserRole>('EMPLOYEE');
  const [dirPosition, setDirPosition] = useState('');
  const [dirDepartment, setDirDepartment] = useState('');
  const [dirNik, setDirNik] = useState('');

  const [activeTab, setActiveTab] = useState<'PROFILE' | 'DIRECTORY' | 'RESET'>('PROFILE');
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const showNotification = (msg: string, isError = false) => {
    if (isError) {
      setErrorMsg(msg);
      setSuccessMsg('');
    } else {
      setSuccessMsg(msg);
      setErrorMsg('');
    }
    setTimeout(() => {
      setSuccessMsg('');
      setErrorMsg('');
    }, 4000);
  };

  // Submit current profile edits
  const handleSaveProfile = (e: FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    if (!userName.trim() || !userEmail.trim()) {
      showNotification('Nama Lengkap dan Email Google tidak boleh kosong!', true);
      return;
    }

    const updatedUser: AppUser = {
      ...currentUser,
      name: userName.trim(),
      email: userEmail.trim().toLowerCase(),
      nik: userNik.trim(),
      position: userPosition.trim(),
      department: userDepartment.trim(),
      role: userRole
    };

    onUpdateCurrentUser(updatedUser);

    // Also update this profile in the directory list
    const updatedList = usersList.map((u) => u.id === currentUser.id ? updatedUser : u);
    onUpdateUsersList(updatedList);

    showNotification('Alhamdulillah! Profil Google Anda berhasil diperbarui.');
  };

  // Directory: Save a directory user (either edit or new creation)
  const handleSaveDirectoryUser = (e: FormEvent) => {
    e.preventDefault();
    if (!dirName.trim() || !dirEmail.trim()) {
      showNotification('Nama dan Email wajib diisi!', true);
      return;
    }

    if (!dirEmail.includes('@')) {
      showNotification('Format email Google tidak valid!', true);
      return;
    }

    if (editingUserId) {
      // Edit mode
      const updatedList = usersList.map((u) => {
        if (u.id === editingUserId) {
          const updated: AppUser = {
            id: editingUserId,
            name: dirName.trim(),
            email: dirEmail.trim().toLowerCase(),
            role: dirRole,
            nik: dirNik.trim() || `SCB-2026-${Math.floor(Math.random() * 800) + 100}`,
            position: dirPosition.trim() || 'Pegawai',
            department: dirDepartment.trim() || 'Sekolah Cendekia BAZNAS'
          };

          // If standard user was the current logged-in user, live sync it!
          if (currentUser && currentUser.id === editingUserId) {
            onUpdateCurrentUser(updated);
          }
          return updated;
        }
        return u;
      });

      onUpdateUsersList(updatedList);
      showNotification('User berhasil diperbarui dalam database.');
      resetDirectoryForm();
    } else {
      // Create mode
      const newUser: AppUser = {
        id: `USR-${Date.now()}`,
        name: dirName.trim(),
        email: dirEmail.trim().toLowerCase(),
        role: dirRole,
        nik: dirNik.trim() || `SCB-2026-${Math.floor(Math.random() * 800) + 100}`,
        position: dirPosition.trim() || 'Pegawai',
        department: dirDepartment.trim() || 'Sekolah Cendekia BAZNAS'
      };

      onUpdateUsersList([...usersList, newUser]);
      showNotification('User Google baru berhasil ditambahkan.');
      resetDirectoryForm();
    }
  };

  // Set form values to edit an existing directory user
  const startEditUser = (user: AppUser) => {
    setEditingUserId(user.id);
    setDirName(user.name);
    setDirEmail(user.email);
    setDirRole(user.role);
    setDirNik(user.nik);
    setDirPosition(user.position);
    setDirDepartment(user.department);
  };

  const deleteUserFromDirectory = (userId: string) => {
    if (currentUser?.id === userId) {
      showNotification('Anda tidak dapat menghapus akun Anda sendiri yang sedang aktif!', true);
      return;
    }

    if (confirm('Apakah Anda yakin ingin menghapus akun Google user ini dari sistem?')) {
      const updatedList = usersList.filter((u) => u.id !== userId);
      onUpdateUsersList(updatedList);
      showNotification('User berhasil dihapus.');
      
      if (editingUserId === userId) {
        resetDirectoryForm();
      }
    }
  };

  const resetDirectoryForm = () => {
    setEditingUserId(null);
    setDirName('');
    setDirEmail('');
    setDirRole('EMPLOYEE');
    setDirNik('');
    setDirPosition('');
    setDirDepartment('');
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden font-sans">
      <div className="bg-emerald-900 px-6 py-5 text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-emerald-850">
        <div>
          <h2 className="text-xl font-bold font-sans flex items-center gap-2">
            <Icons.Settings className="w-5 h-5 text-amber-300" /> Pengaturan Sistem SCB
          </h2>
          <p className="text-xs text-emerald-200 mt-0.5">
            Kelola profil Google Akun Anda, konfigurasi user directory, dan hapus/edit peran.
          </p>
        </div>
        <button
          onClick={onLogout}
          className="bg-emerald-850 hover:bg-emerald-800 border border-emerald-700/60 font-medium px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer text-amber-300 font-mono"
        >
          <Icons.LogOut className="w-3.5 h-3.5" /> Log Out Google Account
        </button>
      </div>

      {/* Tabs navigation */}
      <div className="flex border-b border-slate-100 bg-slate-50/50 p-2 gap-2">
        <button
          onClick={() => setActiveTab('PROFILE')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'PROFILE'
              ? 'bg-white text-emerald-900 shadow-xs border border-slate-200'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Icons.UserCog className="w-3.5 h-3.5" /> Setting Active User
        </button>
        <button
          onClick={() => setActiveTab('DIRECTORY')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'DIRECTORY'
              ? 'bg-white text-emerald-900 shadow-xs border border-slate-200'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Icons.Users className="w-3.5 h-3.5" /> Direktori Dashboard User
        </button>
        <button
          onClick={() => setActiveTab('RESET')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'RESET'
              ? 'bg-white text-emerald-900 shadow-xs border border-slate-200'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Icons.Database className="w-3.5 h-3.5" /> Reset Database Aplikasi
        </button>
      </div>

      <div className="p-6">
        {successMsg && (
          <div className="mb-4 bg-emerald-50 border border-emerald-200 text-emerald-950 px-4 py-3 rounded-xl text-xs font-semibold flex items-center gap-2">
            <Icons.CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-700" />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-950 px-4 py-3 rounded-xl text-xs font-semibold flex items-center gap-2">
            <Icons.AlertTriangle className="w-4 h-4 shrink-0 text-red-700" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Tab 1: Profile current user editing */}
        {activeTab === 'PROFILE' && currentUser && (
          <form onSubmit={handleSaveProfile} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-800 pb-2 border-b border-slate-100 flex items-center gap-1.5">
                  <Icons.UserCheck className="w-4 h-4 text-emerald-700" /> Informasi Identitas Google
                </h3>
                
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Nama Lengkap Pemohon</label>
                  <input
                    type="text"
                    required
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                    placeholder="Fuad Habibi Siregar"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Email Google Akun</label>
                  <input
                    type="email"
                    required
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:ring-1 focus:ring-emerald-500 focus:outline-none bg-slate-50/50"
                    placeholder="fuad.habibi@gmail.com"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Nomor Induk Kepegawaian (NIK)</label>
                  <input
                    type="text"
                    value={userNik}
                    onChange={(e) => setUserNik(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                    placeholder="SCB-2018-001"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-800 pb-2 border-b border-slate-100 flex items-center gap-1.5">
                  <Icons.ShieldCheck className="w-4 h-4 text-emerald-700" /> Otoritas Jabatan di Koperasi SCB
                </h3>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Peran Utama (Active Role Scope)</label>
                  <select
                    value={userRole}
                    onChange={(e) => setUserRole(e.target.value as UserRole)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="EMPLOYEE">Pegawai Pemohon (EMPLOYEE)</option>
                    <option value="MANAGEMENT">Manajemen Sekolah (MANAGEMENT)</option>
                    <option value="COOPERATIVE">Ketua Koperasi (COOPERATIVE)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Jabatan Formal</label>
                  <input
                    type="text"
                    value={userPosition}
                    onChange={(e) => setUserPosition(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                    placeholder="Kepala Divisi Koperasi"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Divisi / Departemen</label>
                  <input
                    type="text"
                    value={userDepartment}
                    onChange={(e) => setUserDepartment(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                    placeholder="Departemen Operasional"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-150 flex justify-end">
              <button
                type="submit"
                className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2.5 px-6 rounded-xl text-xs font-sans shadow-md hover:shadow-lg hover:shadow-emerald-200 flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
              >
                <Icons.Save className="w-4 h-4" /> Simpan Profil Google User
              </button>
            </div>
          </form>
        )}

        {/* Tab 2: Directory CRUD Management */}
        {activeTab === 'DIRECTORY' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Directory list of user profiles */}
              <div className="lg:col-span-7 space-y-4">
                <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest">
                  DAFTAR DIREKTORI GOOGLE USERS SYSTEM ({usersList.length})
                </h3>

                <div className="space-y-2.5">
                  {usersList.map((user) => {
                    const isSelected = currentUser?.id === user.id;
                    return (
                      <div
                        key={user.id}
                        className={`p-4 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all bg-white relative overflow-hidden ${
                          isSelected
                            ? 'border-emerald-500 bg-emerald-50/10 shadow-xs'
                            : 'border-slate-100/90 shadow-2xs hover:border-slate-300'
                        }`}
                      >
                        {isSelected && (
                          <div className="absolute top-0 right-0 bg-emerald-600 text-white text-[8px] font-bold px-2.5 py-0.5 rounded-bl-xl font-mono">
                            SEGAR / AKTIF
                          </div>
                        )}

                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center font-bold text-slate-700 uppercase shrink-0">
                            {user.name.substring(0, 2)}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <h4 className="text-xs font-bold text-slate-800 truncate">{user.name}</h4>
                              <span className="text-[9px] bg-emerald-50 text-emerald-800 border border-emerald-100 font-bold px-1.5 py-0.2 rounded font-mono uppercase">
                                {user.role}
                              </span>
                            </div>
                            <p className="text-[10px] text-slate-500 font-mono mt-0.5 truncate">{user.email}</p>
                            <p className="text-[9px] text-slate-400 mt-0.5 font-medium truncate">
                              NIK: {user.nik} • {user.position} ({user.department})
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                          <button
                            onClick={() => startEditUser(user)}
                            className="p-2 text-slate-500 hover:text-emerald-700 bg-slate-50 hover:bg-emerald-50 border border-slate-100 rounded-lg transition-colors cursor-pointer"
                            title="Edit User Profile"
                          >
                            <Icons.Edit3 className="w-3.5 h-3.5" />
                          </button>
                          
                          <button
                            onClick={() => deleteUserFromDirectory(user.id)}
                            disabled={isSelected}
                            className={`p-2 rounded-lg transition-colors cursor-pointer ${
                              isSelected
                                ? 'text-slate-200 bg-slate-50 cursor-not-allowed border-transparent'
                                : 'text-slate-500 hover:text-red-650 bg-slate-50 hover:bg-red-50 border border-slate-100'
                            }`}
                            title={isSelected ? "Tidak bisa hapus user yang sedang login" : "Hapus User"}
                          >
                            <Icons.Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Add / Edit Form for Directory */}
              <div className="lg:col-span-5 bg-slate-50 rounded-2xl border border-slate-200/60 p-5">
                <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-1.5">
                  {editingUserId ? (
                    <>
                      <Icons.Edit3 className="w-4 h-4 text-emerald-700" /> Edit Detail User
                    </>
                  ) : (
                    <>
                      <Icons.UserPlus className="w-4 h-4 text-emerald-700" /> Tambah Akun Google Baru
                    </>
                  )}
                </h3>

                <form onSubmit={handleSaveDirectoryUser} className="space-y-3.5">
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Nama Lengkap</label>
                    <input
                      type="text"
                      required
                      value={dirName}
                      onChange={(e) => setDirName(e.target.value)}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-xl text-xs font-medium focus:ring-1 focus:ring-emerald-500 bg-white"
                      placeholder="Contoh: Fuad Habibi Siregar"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Email Google Akun</label>
                    <input
                      type="email"
                      required
                      value={dirEmail}
                      onChange={(e) => setDirEmail(e.target.value)}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-xl text-xs font-medium focus:ring-1 focus:ring-emerald-500 bg-white"
                      placeholder="nama.lengkap@gmail.com"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Nomor Induk Pegawai (NIK)</label>
                    <input
                      type="text"
                      value={dirNik}
                      onChange={(e) => setDirNik(e.target.value)}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-xl text-xs font-medium focus:ring-1 focus:ring-emerald-500 bg-white"
                      placeholder="SCB-2026-092"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Otoritas Peran</label>
                    <select
                      value={dirRole}
                      onChange={(e) => setDirRole(e.target.value as UserRole)}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-xl text-xs font-medium focus:ring-1 focus:ring-emerald-500 bg-white"
                    >
                      <option value="EMPLOYEE">Pegawai Pemohon (EMPLOYEE)</option>
                      <option value="MANAGEMENT">Manajemen Sekolah (MANAGEMENT)</option>
                      <option value="COOPERATIVE">Ketua Koperasi (COOPERATIVE)</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Jabatan</label>
                      <input
                        type="text"
                        value={dirPosition}
                        onChange={(e) => setDirPosition(e.target.value)}
                        className="w-full px-3 py-1.5 border border-slate-200 rounded-xl text-xs font-medium focus:ring-1 focus:ring-emerald-500 bg-white"
                        placeholder="Guru / Staf"
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Divisi</label>
                      <input
                        type="text"
                        value={dirDepartment}
                        onChange={(e) => setDirDepartment(e.target.value)}
                        className="w-full px-3 py-1.5 border border-slate-200 rounded-xl text-xs font-medium focus:ring-1 focus:ring-emerald-500 bg-white"
                        placeholder="Kurikulum / Finansial"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="submit"
                      className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2 rounded-xl text-xs transition-colors cursor-pointer"
                    >
                      {editingUserId ? 'Simpan Edit' : 'Tambah User'}
                    </button>
                    {editingUserId && (
                      <button
                        type="button"
                        onClick={resetDirectoryForm}
                        className="p-2 text-slate-500 hover:text-slate-800 bg-slate-200 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                      >
                        Batal
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: System reset parameters */}
        {activeTab === 'RESET' && (
          <div className="space-y-4 max-w-xl">
            <h3 className="text-sm font-bold text-slate-800 pb-2 border-b border-slate-100 flex items-center gap-1.5 text-red-700">
              <Icons.ShieldAlert className="w-4 h-4" /> Area Kontrol Sensitif
            </h3>
            
            <p className="text-xs text-slate-500 leading-relaxed">
              Jika Anda ingin membersihkan riwayat pengujian permohonan pembiayaan yang telah tersimpan di dalam memori komputer lokal (`localStorage`), silakan klik tombol reset di bawah ini. Tindakan ini akan mengosongkan seluruh database permohonan secara permanen.
            </p>

            <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl">
              <p className="text-xs text-amber-800 font-medium font-sans">
                Status setelah Reset:
                <br />• Database Permohonan: Kosong (0 Berkas)
                <br />• Monitoring Berkas: Kosong (Silakan tambah permohonan baru untuk memulai)
              </p>
            </div>

            <button
              onClick={() => {
                if (confirm('Apakah Anda yakin ingin menyetel ulang database permohonan ke bawaan awal? Semua permohonan baru yang baru Anda tambahkan akan ditiadakan.')) {
                  onResetApplications();
                  showNotification('Database permohonan berhasil dikembalikan ke bawaan pabrik.');
                }
              }}
              className="bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 font-bold py-2.5 px-5 rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Icons.RefreshCcw className="w-3.5 h-3.5" /> Kembalikan ke Setelan Awal Pabrik
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
