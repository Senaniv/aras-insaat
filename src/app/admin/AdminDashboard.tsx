'use html';
'use client';

import { useState, useEffect } from 'react';
import { 
  Lock, Settings, Briefcase, Layers, Database, LogOut, 
  Plus, Trash2, Edit2, Upload, Check, AlertCircle, RefreshCw 
} from 'lucide-react';
import { Project, PricingPackage } from '@/lib/db';
import * as actions from '@/app/actions';

interface AdminDashboardProps {
  initialSiteContent: Record<string, string>;
  initialProjects: Project[];
  initialPackages: PricingPackage[];
  databaseType: string;
}

export default function AdminDashboard({
  initialSiteContent,
  initialProjects,
  initialPackages,
  databaseType
}: AdminDashboardProps) {
  // Authentication State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [loginError, setLoginError] = useState('');
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Tab State
  const [activeTab, setActiveTab] = useState<'content' | 'projects' | 'packages'>('content');

  // Dynamic Lists State
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [packages, setPackages] = useState<PricingPackage[]>(initialPackages);

  // General Site Content Form State
  const [heroTitle, setHeroTitle] = useState(initialSiteContent.hero_title || '');
  const [heroSubtitle, setHeroSubtitle] = useState(initialSiteContent.hero_subtitle || '');
  const [phone1, setPhone1] = useState(initialSiteContent.phone_1 || '');
  const [phone2, setPhone2] = useState(initialSiteContent.phone_2 || '');
  const [address, setAddress] = useState(initialSiteContent.address || '');
  const [instagram, setInstagram] = useState(initialSiteContent.instagram || '');
  const [contentSavedMsg, setContentSavedMsg] = useState('');

  // Project Form State
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [projectTitle, setProjectTitle] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [projectImageUrl, setProjectImageUrl] = useState('');
  const [projectRegion, setProjectRegion] = useState<'Tovuz' | 'Qazax' | 'Ağstafa' | 'Şəmkir'>('Tovuz');
  const [projectError, setProjectError] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);

  // Package Form State
  const [editingPackageId, setEditingPackageId] = useState<string | null>(null);
  const [packageName, setPackageName] = useState('');
  const [packagePrice, setPackagePrice] = useState(0);
  const [packageFeaturesText, setPackageFeaturesText] = useState('');
  const [packageWhatsappText, setPackageWhatsappText] = useState('');
  const [packageOrderIndex, setPackageOrderIndex] = useState(0);
  const [packageError, setPackageError] = useState('');

  // Session storage check
  useEffect(() => {
    const authStatus = sessionStorage.getItem('aras_admin_auth');
    if (authStatus === 'true') {
      setIsLoggedIn(true);
    }
    setCheckingAuth(false);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    const isValid = await actions.checkAdminPasscodeAction(passcode);
    if (isValid) {
      sessionStorage.setItem('aras_admin_auth', 'true');
      setIsLoggedIn(true);
    } else {
      setLoginError('Yanlış şifrə. Yenidən cəhd edin.');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('aras_admin_auth');
    setIsLoggedIn(false);
  };

  // Handle General Content Saving
  const handleSaveContent = async (e: React.FormEvent) => {
    e.preventDefault();
    setContentSavedMsg('');
    try {
      await actions.updateSiteContentAction('hero_title', heroTitle);
      await actions.updateSiteContentAction('hero_subtitle', heroSubtitle);
      await actions.updateSiteContentAction('phone_1', phone1);
      await actions.updateSiteContentAction('phone_2', phone2);
      await actions.updateSiteContentAction('address', address);
      await actions.updateSiteContentAction('instagram', instagram);
      setContentSavedMsg('Məlumatlar uğurla yadda saxlanıldı!');
      setTimeout(() => setContentSavedMsg(''), 3000);
    } catch (err) {
      console.error(err);
      setContentSavedMsg('Yadda saxlayarkən xəta baş verdi.');
    }
  };

  // Handle Project Image Upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setProjectError('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (res.ok && data.imageUrl) {
        setProjectImageUrl(data.imageUrl);
      } else {
        setProjectError(data.error || 'Şəkil yüklənməsində xəta yarandı.');
      }
    } catch (err: any) {
      setProjectError('Şəkil yüklənərkən şəbəkə xətası baş verdi.');
    } finally {
      setUploadingImage(false);
    }
  };

  // Handle Project Save
  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setProjectError('');

    if (!projectTitle || !projectImageUrl) {
      setProjectError('Başlıq və Şəkil URL-i məcburidir.');
      return;
    }

    try {
      if (editingProjectId) {
        // Edit existing project
        const updated = await actions.updateProjectAction(
          editingProjectId,
          projectTitle,
          projectDescription,
          projectImageUrl,
          projectRegion
        );
        setProjects(projects.map(p => p.id === editingProjectId ? updated : p));
      } else {
        // Add new project
        const newProject = await actions.addProjectAction(
          projectTitle,
          projectDescription,
          projectImageUrl,
          projectRegion
        );
        setProjects([newProject, ...projects]);
      }

      // Reset Form State
      setEditingProjectId(null);
      setProjectTitle('');
      setProjectDescription('');
      setProjectImageUrl('');
      setProjectRegion('Tovuz');
    } catch (err: any) {
      setProjectError('Layihə yadda saxlanılarkən xəta yarandı: ' + err.message);
    }
  };

  // Edit Project (load into form)
  const handleStartEditProject = (p: Project) => {
    setEditingProjectId(p.id);
    setProjectTitle(p.title);
    setProjectDescription(p.description || '');
    setProjectImageUrl(p.image_url);
    setProjectRegion(p.region);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Delete Project
  const handleDeleteProject = async (id: string) => {
    if (!confirm('Bu layihəni silməyə əminsiniz?')) return;
    try {
      await actions.deleteProjectAction(id);
      setProjects(projects.filter(p => p.id !== id));
    } catch (err: any) {
      alert('Layihə silinərkən xəta: ' + err.message);
    }
  };

  // Handle Package Save
  const handleSavePackage = async (e: React.FormEvent) => {
    e.preventDefault();
    setPackageError('');

    if (!packageName || packagePrice <= 0) {
      setPackageError('Paket adı və qiyməti düzgün daxil edilməlidir.');
      return;
    }

    const featuresList = packageFeaturesText
      .split('\n')
      .map(f => f.trim())
      .filter(f => f.length > 0);

    if (featuresList.length === 0) {
      setPackageError('Ən azı bir xüsusiyyət daxil edilməlidir.');
      return;
    }

    try {
      if (editingPackageId) {
        const updated = await actions.updatePricingPackageAction(
          editingPackageId,
          packageName,
          packagePrice,
          featuresList,
          packageWhatsappText,
          packageOrderIndex
        );
        setPackages(packages.map(pkg => pkg.id === editingPackageId ? updated : pkg));
      } else {
        const newPkg = await actions.addPricingPackageAction(
          packageName,
          packagePrice,
          featuresList,
          packageWhatsappText,
          packageOrderIndex
        );
        const updatedPackages = [...packages, newPkg].sort((a, b) => a.order_index - b.order_index);
        setPackages(updatedPackages);
      }

      // Reset Package Form
      setEditingPackageId(null);
      setPackageName('');
      setPackagePrice(0);
      setPackageFeaturesText('');
      setPackageWhatsappText('');
      setPackageOrderIndex(0);
    } catch (err: any) {
      setPackageError('Paket qeyd edilərkən xəta: ' + err.message);
    }
  };

  // Edit Package (load into form)
  const handleStartEditPackage = (pkg: PricingPackage) => {
    setEditingPackageId(pkg.id);
    setPackageName(pkg.name);
    setPackagePrice(pkg.price);
    setPackageFeaturesText(pkg.features.join('\n'));
    setPackageWhatsappText(pkg.whatsapp_text || '');
    setPackageOrderIndex(pkg.order_index);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Delete Package
  const handleDeletePackage = async (id: string) => {
    if (!confirm('Bu paketi silməyə əminsiniz?')) return;
    try {
      await actions.deletePricingPackageAction(id);
      setPackages(packages.filter(pkg => pkg.id !== id));
    } catch (err: any) {
      alert('Paket silinərkən xəta: ' + err.message);
    }
  };

  // Cancel edit helper
  const handleCancelEdit = () => {
    setEditingProjectId(null);
    setProjectTitle('');
    setProjectDescription('');
    setProjectImageUrl('');
    setProjectRegion('Tovuz');

    setEditingPackageId(null);
    setPackageName('');
    setPackagePrice(0);
    setPackageFeaturesText('');
    setPackageWhatsappText('');
    setPackageOrderIndex(0);
  };

  if (checkingAuth) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <RefreshCw className="w-10 h-10 animate-spin text-brand-orange" />
        <p className="mt-4 text-gray-400">Yüklənir...</p>
      </div>
    );
  }

  // 1. LOGIN GATE
  if (!isLoggedIn) {
    return (
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-md p-8 rounded-3xl bg-gray-900 border border-white/5 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <span className="w-12 h-12 rounded-2xl bg-brand-orange/10 border border-brand-orange/20 flex items-center justify-center text-brand-orange mx-auto">
              <Lock size={24} />
            </span>
            <h1 className="text-2xl font-bold font-outfit tracking-tight text-white">
              ARAS İNŞAAT
            </h1>
            <p className="text-sm text-gray-400">
              Admin Panelə giriş üçün şifrəni daxil edin.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-400 uppercase">
                Şifrə
              </label>
              <input
                type="password"
                required
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-gray-950 border border-gray-800 rounded-xl text-white focus:outline-none focus:border-brand-orange transition"
              />
            </div>

            {loginError && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-red-900/20 border border-red-900/40 text-red-400 text-xs">
                <AlertCircle size={16} />
                <span>{loginError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-brand-orange hover:bg-brand-orange-hover text-white rounded-xl font-bold transition duration-300"
            >
              Giriş Et
            </button>
          </form>
        </div>
      </div>
    );
  }

  // 2. LOGGED IN DASHBOARD
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-white/5">
        <div>
          <span className="text-brand-orange font-bold text-xs uppercase tracking-widest block">
            Nəzarət Paneli
          </span>
          <h1 className="text-3xl font-extrabold font-outfit text-white flex items-center gap-2">
            ARAS İNŞAAT <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-brand-orange/20 text-brand-orange border border-brand-orange/20">Admin</span>
          </h1>
        </div>

        <div className="flex items-center gap-4">
          {/* DB Indicator */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-gray-300">
            <Database size={14} className="text-brand-orange" />
            <span>Məlumat bazası:</span>
            <span className="font-bold text-emerald-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              {databaseType}
            </span>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-900/20 border border-red-900/30 hover:bg-red-900/40 text-red-400 rounded-xl text-sm font-semibold transition"
          >
            <LogOut size={16} />
            <span>Çıxış</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-800 gap-1.5">
        <button
          onClick={() => setActiveTab('content')}
          className={`flex items-center gap-2 px-5 py-3 border-b-2 font-medium text-sm transition ${
            activeTab === 'content'
              ? 'border-brand-orange text-brand-orange'
              : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          <Settings size={16} />
          <span>Sayt Məlumatları</span>
        </button>
        <button
          onClick={() => setActiveTab('projects')}
          className={`flex items-center gap-2 px-5 py-3 border-b-2 font-medium text-sm transition ${
            activeTab === 'projects'
              ? 'border-brand-orange text-brand-orange'
              : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          <Briefcase size={16} />
          <span>Layihələr</span>
        </button>
        <button
          onClick={() => setActiveTab('packages')}
          className={`flex items-center gap-2 px-5 py-3 border-b-2 font-medium text-sm transition ${
            activeTab === 'packages'
              ? 'border-brand-orange text-brand-orange'
              : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          <Layers size={16} />
          <span>Təmir Paketləri</span>
        </button>
      </div>

      {/* TAB CONTENT: GENERAL CONTENT */}
      {activeTab === 'content' && (
        <div className="bg-gray-900 border border-white/5 rounded-2xl p-6 shadow-xl">
          <h2 className="text-xl font-bold font-outfit text-white mb-6">Ümumi Sayt Məlumatlarının Redaktəsi</h2>
          
          <form onSubmit={handleSaveContent} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Hero Title */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-400 uppercase">
                  Hero Başlıq
                </label>
                <input
                  type="text"
                  required
                  value={heroTitle}
                  onChange={(e) => setHeroTitle(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-950 border border-gray-800 rounded-xl text-white focus:outline-none focus:border-brand-orange transition"
                />
              </div>

              {/* Hero Subtitle */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-400 uppercase">
                  Hero Alt Başlıq (Şüar)
                </label>
                <input
                  type="text"
                  required
                  value={heroSubtitle}
                  onChange={(e) => setHeroSubtitle(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-950 border border-gray-800 rounded-xl text-white focus:outline-none focus:border-brand-orange transition"
                />
              </div>

              {/* Phone 1 */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-400 uppercase">
                  Əlaqə Nömrəsi 1 (Komfort Paket WhatsApp zəngi üçün)
                </label>
                <input
                  type="text"
                  required
                  value={phone1}
                  onChange={(e) => setPhone1(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-950 border border-gray-800 rounded-xl text-white focus:outline-none focus:border-brand-orange transition"
                />
              </div>

              {/* Phone 2 */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-400 uppercase">
                  Əlaqə Nömrəsi 2
                </label>
                <input
                  type="text"
                  value={phone2}
                  onChange={(e) => setPhone2(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-950 border border-gray-800 rounded-xl text-white focus:outline-none focus:border-brand-orange transition"
                />
              </div>

              {/* Address */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-400 uppercase">
                  Ünvan (Tovuz rayonu və s.)
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-950 border border-gray-800 rounded-xl text-white focus:outline-none focus:border-brand-orange transition"
                />
              </div>

              {/* Instagram URL */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-400 uppercase">
                  Instagram Linki
                </label>
                <input
                  type="url"
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-950 border border-gray-800 rounded-xl text-white focus:outline-none focus:border-brand-orange transition"
                />
              </div>
            </div>

            {contentSavedMsg && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-950/20 border border-emerald-900/40 text-emerald-400 text-sm">
                <Check size={16} />
                <span>{contentSavedMsg}</span>
              </div>
            )}

            <button
              type="submit"
              className="px-6 py-3 bg-brand-orange hover:bg-brand-orange-hover text-white rounded-xl font-bold transition duration-300"
            >
              Dəyişiklikləri Yadda Saxla
            </button>
          </form>
        </div>
      )}

      {/* TAB CONTENT: PROJECTS */}
      {activeTab === 'projects' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Project Form */}
          <div className="lg:col-span-4 bg-gray-900 border border-white/5 rounded-2xl p-6 shadow-xl h-fit space-y-6">
            <h2 className="text-lg font-bold font-outfit text-white">
              {editingProjectId ? 'Layihəni Redaktə Et' : 'Yeni Layihə Əlavə Et'}
            </h2>

            <form onSubmit={handleSaveProject} className="space-y-4">
              {/* Title */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-400 uppercase">
                  Layihə Başlığı
                </label>
                <input
                  type="text"
                  required
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  placeholder="Məs. Tovuz Modern Villa"
                  className="w-full px-3 py-2.5 bg-gray-950 border border-gray-800 rounded-xl text-white focus:outline-none focus:border-brand-orange transition text-sm"
                />
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-400 uppercase">
                  Təsvir / Açıqlama
                </label>
                <textarea
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                  placeholder="Layihə haqqında qısa məlumat..."
                  rows={3}
                  className="w-full px-3 py-2.5 bg-gray-950 border border-gray-800 rounded-xl text-white focus:outline-none focus:border-brand-orange transition text-sm"
                />
              </div>

              {/* Region */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-400 uppercase">
                  Bölgə
                </label>
                <select
                  value={projectRegion}
                  onChange={(e) => setProjectRegion(e.target.value as any)}
                  className="w-full px-3 py-2.5 bg-gray-950 border border-gray-800 rounded-xl text-white focus:outline-none focus:border-brand-orange transition text-sm"
                >
                  <option value="Tovuz">Tovuz</option>
                  <option value="Qazax">Qazax</option>
                  <option value="Ağstafa">Ağstafa</option>
                  <option value="Şəmkir">Şəmkir</option>
                </select>
              </div>

              {/* Image Uploader */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-400 uppercase block">
                  Layihə Şəkli
                </label>
                
                {/* Local Upload */}
                <div className="flex items-center gap-3">
                  <label className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-950 border border-gray-800 hover:border-brand-orange hover:text-brand-orange rounded-xl text-xs font-bold text-gray-300 cursor-pointer transition w-full">
                    {uploadingImage ? (
                      <RefreshCw size={14} className="animate-spin text-brand-orange" />
                    ) : (
                      <Upload size={14} />
                    )}
                    <span>{uploadingImage ? 'Yüklənir...' : 'Kompüterdən Seç'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploadingImage}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* URL Input fallback */}
                <input
                  type="text"
                  required
                  value={projectImageUrl}
                  onChange={(e) => setProjectImageUrl(e.target.value)}
                  placeholder="Və ya Şəkil URL linkini yazın"
                  className="w-full px-3 py-2.5 bg-gray-950 border border-gray-800 rounded-xl text-white focus:outline-none focus:border-brand-orange transition text-xs"
                />

                {projectImageUrl && (
                  <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-gray-950 border border-gray-800 mt-2">
                    <img
                      src={projectImageUrl}
                      alt="Preview"
                      className="object-cover w-full h-full"
                    />
                  </div>
                )}
              </div>

              {projectError && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-red-900/20 border border-red-900/40 text-red-400 text-xs">
                  <AlertCircle size={14} />
                  <span>{projectError}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={uploadingImage}
                  className="flex-1 py-2.5 bg-brand-orange hover:bg-brand-orange-hover text-white rounded-xl font-bold transition text-sm disabled:opacity-50"
                >
                  {editingProjectId ? 'Yadda Saxla' : 'Əlavə Et'}
                </button>
                {(editingProjectId || projectTitle || projectImageUrl) && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="px-4 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl font-bold transition text-sm"
                  >
                    Ləğv Et
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Project List */}
          <div className="lg:col-span-8 bg-gray-900 border border-white/5 rounded-2xl p-6 shadow-xl space-y-6">
            <h2 className="text-lg font-bold font-outfit text-white">Mövcud Layihələr ({projects.length})</h2>

            {projects.length === 0 ? (
              <p className="text-gray-500 text-center py-12 text-sm">Hələ ki heç bir layihə əlavə edilməyib.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-gray-800 text-gray-400 uppercase text-xs">
                      <th className="py-3 px-4">Şəkil</th>
                      <th className="py-3 px-4">Başlıq</th>
                      <th className="py-3 px-4">Bölgə</th>
                      <th className="py-3 px-4 text-right">Əməliyyatlar</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800/50">
                    {projects.map((p) => (
                      <tr key={p.id} className="hover:bg-white/5 transition-colors">
                        <td className="py-3 px-4">
                          <img
                            src={p.image_url}
                            alt={p.title}
                            className="w-12 h-12 object-cover rounded-lg bg-gray-950 border border-gray-800"
                          />
                        </td>
                        <td className="py-3 px-4 font-semibold text-white">
                          <div>
                            <p>{p.title}</p>
                            <p className="text-xs text-gray-500 line-clamp-1 max-w-[250px] font-normal">{p.description}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-1 rounded bg-brand-orange/10 text-brand-orange border border-brand-orange/10 text-xs font-semibold">
                            {p.region}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleStartEditProject(p)}
                              className="p-2 text-gray-400 hover:text-brand-orange hover:bg-white/5 rounded-lg transition"
                              title="Redaktə Et"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteProject(p.id)}
                              className="p-2 text-gray-400 hover:text-red-400 hover:bg-white/5 rounded-lg transition"
                              title="Sil"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB CONTENT: PACKAGES */}
      {activeTab === 'packages' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Package Form */}
          <div className="lg:col-span-4 bg-gray-900 border border-white/5 rounded-2xl p-6 shadow-xl h-fit space-y-6">
            <h2 className="text-lg font-bold font-outfit text-white">
              {editingPackageId ? 'Paketi Redaktə Et' : 'Yeni Təmir Paketi Əlavə Et'}
            </h2>

            <form onSubmit={handleSavePackage} className="space-y-4">
              {/* Name */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-400 uppercase">
                  Paket Adı
                </label>
                <input
                  type="text"
                  required
                  value={packageName}
                  onChange={(e) => setPackageName(e.target.value)}
                  placeholder="Məs. Komfort Paket, Gold Paket"
                  className="w-full px-3 py-2.5 bg-gray-950 border border-gray-800 rounded-xl text-white focus:outline-none focus:border-brand-orange transition text-sm"
                />
              </div>

              {/* Price */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-400 uppercase">
                  Qiymət (AZN / m²)
                </label>
                <input
                  type="number"
                  required
                  value={packagePrice || ''}
                  onChange={(e) => setPackagePrice(Number(e.target.value))}
                  placeholder="Qiymət"
                  className="w-full px-3 py-2.5 bg-gray-950 border border-gray-800 rounded-xl text-white focus:outline-none focus:border-brand-orange transition text-sm"
                />
              </div>

              {/* Order Index */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-400 uppercase">
                  Sıralama İndeksi (Kiçikdən böyüyə düzülür)
                </label>
                <input
                  type="number"
                  required
                  value={packageOrderIndex}
                  onChange={(e) => setPackageOrderIndex(Number(e.target.value))}
                  className="w-full px-3 py-2.5 bg-gray-950 border border-gray-800 rounded-xl text-white focus:outline-none focus:border-brand-orange transition text-sm"
                />
              </div>

              {/* Features */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-400 uppercase">
                  Xüsusiyyətlər (Hər sətirdə 1 dənə yazın)
                </label>
                <textarea
                  required
                  value={packageFeaturesText}
                  onChange={(e) => setPackageFeaturesText(e.target.value)}
                  placeholder="Daxil olan xidmətlər..."
                  rows={6}
                  className="w-full px-3 py-2.5 bg-gray-950 border border-gray-800 rounded-xl text-white focus:outline-none focus:border-brand-orange transition text-sm font-sans"
                />
              </div>

              {/* WhatsApp Text */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-400 uppercase">
                  WhatsApp Sifariş Mesajı (Hazır şablon)
                </label>
                <textarea
                  value={packageWhatsappText}
                  onChange={(e) => setPackageWhatsappText(e.target.value)}
                  placeholder="Məs. Salam, Komfort Paket təmir paketi haqqında məlumat almaq istəyirəm."
                  rows={2}
                  className="w-full px-3 py-2.5 bg-gray-950 border border-gray-800 rounded-xl text-white focus:outline-none focus:border-brand-orange transition text-sm"
                />
              </div>

              {packageError && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-red-900/20 border border-red-900/40 text-red-400 text-xs">
                  <AlertCircle size={14} />
                  <span>{packageError}</span>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-brand-orange hover:bg-brand-orange-hover text-white rounded-xl font-bold transition text-sm"
                >
                  {editingPackageId ? 'Yadda Saxla' : 'Əlavə Et'}
                </button>
                {(editingPackageId || packageName || packageFeaturesText) && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="px-4 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl font-bold transition text-sm"
                  >
                    Ləğv Et
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Package List */}
          <div className="lg:col-span-8 bg-gray-900 border border-white/5 rounded-2xl p-6 shadow-xl space-y-6">
            <h2 className="text-lg font-bold font-outfit text-white">Mövcud Təmir Paketləri ({packages.length})</h2>

            {packages.length === 0 ? (
              <p className="text-gray-500 text-center py-12 text-sm">Hələ ki heç bir paket əlavə edilməyib.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-gray-800 text-gray-400 uppercase text-xs">
                      <th className="py-3 px-4">Paket Adı</th>
                      <th className="py-3 px-4">Qiymət</th>
                      <th className="py-3 px-4">Xüsusiyyətlər</th>
                      <th className="py-3 px-4">Sıra</th>
                      <th className="py-3 px-4 text-right">Əməliyyatlar</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800/50">
                    {packages.map((pkg) => (
                      <tr key={pkg.id} className="hover:bg-white/5 transition-colors">
                        <td className="py-3 px-4 font-bold text-white">
                          {pkg.name}
                        </td>
                        <td className="py-3 px-4 text-brand-orange font-extrabold font-outfit">
                          {pkg.price} ₼/m²
                        </td>
                        <td className="py-3 px-4 text-xs text-gray-400">
                          <p className="line-clamp-2 max-w-[200px]">{pkg.features.join(', ')}</p>
                        </td>
                        <td className="py-3 px-4 text-gray-400">
                          {pkg.order_index}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleStartEditPackage(pkg)}
                              className="p-2 text-gray-400 hover:text-brand-orange hover:bg-white/5 rounded-lg transition"
                              title="Redaktə Et"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              onClick={() => handleDeletePackage(pkg.id)}
                              className="p-2 text-gray-400 hover:text-red-400 hover:bg-white/5 rounded-lg transition"
                              title="Sil"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
