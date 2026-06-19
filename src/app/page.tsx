import * as db from '@/lib/db';
import Navbar from '@/components/Navbar';
import ProjectGrid from '@/components/ProjectGrid';
import PackageGrid from '@/components/PackageGrid';
import { Home as HomeIcon, Hammer, Sparkles, Phone, MapPin } from 'lucide-react';


export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Page() {
  // Fetch data server-side
  const siteContent = await db.getSiteContent();
  const projects = await db.getProjects();
  const pricingPackages = await db.getPricingPackages();

  // Settings fallbacks
  const heroTitle = siteContent.hero_title || 'Xəyallarınıza açılan qapı';
  const heroSubtitle = siteContent.hero_subtitle || 'Etibarlı inşaat, keyfiyyətli həyat!';
  const phone1 = siteContent.phone_1 || '051 888 55 99';
  const phone2 = siteContent.phone_2 || '070 500 29 49';
  const address = siteContent.address || 'Tovuz rayonu';
  const instagramUrl = siteContent.instagram || 'https://www.instagram.com/aras.insaat/';

  const cleanPhone1 = phone1.replace(/\s+/g, '');
  const cleanPhone2 = phone2.replace(/\s+/g, '');

  return (
    <div className="flex flex-col min-h-screen">
      {/* Premium Header */}
      <Navbar phone1={phone1} />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden bg-brand-dark">
        {/* Luxury Villa Background Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-all duration-700 brightness-[0.25]"
          style={{ 
            backgroundImage: "url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=80')" 
          }}
        />
        
        {/* Decorative Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:30px_30px]" />

        {/* Blueprint sketch background */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center opacity-[0.05] mix-blend-overlay pointer-events-none" />


        {/* Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center sm:px-6 lg:px-8 space-y-8">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-brand-orange bg-brand-orange/10 border border-brand-orange/20">
            Aras Tikinti & Təmir Şirkəti
          </span>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold font-outfit tracking-tight text-white leading-tight">
            {heroTitle.split(' ').map((word, i) => (
              <span key={i} className={i >= heroTitle.split(' ').length - 2 ? "text-brand-orange block sm:inline" : ""}>
                {word}{' '}
              </span>
            ))}
          </h1>

          <p className="max-w-2xl mx-auto text-lg sm:text-xl text-gray-300 leading-relaxed font-light">
            {heroSubtitle}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <a
              href="#layiheler"
              className="w-full sm:w-auto px-8 py-4 bg-brand-orange hover:bg-brand-orange-hover text-white rounded-full font-bold shadow-lg shadow-brand-orange/20 hover:shadow-brand-orange/40 hover:-translate-y-0.5 transition-all duration-300"
            >
              Layihələrimizə Bax
            </a>
            <a
              href="#paketler"
              className="w-full sm:w-auto px-8 py-4 bg-transparent border border-white/20 hover:border-brand-orange text-white hover:text-brand-orange rounded-full font-bold hover:-translate-y-0.5 transition-all duration-300"
            >
              Təmir Paketləri
            </a>
          </div>
        </div>

        {/* Smooth Curved Bottom Divider (Dark to Cream) */}
        <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-[0]">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-[120%] md:w-full h-[40px] md:h-[80px] fill-brand-cream">
            <path d="M0,0 C300,100 900,0 1200,80 L1200,120 L0,120 Z"></path>
          </svg>
        </div>
      </section>

      {/* Featured Projects (Warm Cream background) */}
      <section id="layiheler" className="bg-brand-cream py-16 md:py-24 text-gray-900 relative overflow-hidden">
        {/* Faint blueprint drawing background */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center opacity-[0.025] mix-blend-multiply pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-brand-orange font-bold text-xs uppercase tracking-widest block">
              Gördüyümüz İşlər
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-outfit tracking-tight text-gray-950">
              Həyata Keçirdiyimiz Layihələr
            </h2>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
              Tovuz, Qazax, Ağstafa və Şəmkir bölgələrində inşa etdiyimiz yüksək keyfiyyətli premium evlər və müasir bağ evləri.
            </p>
          </div>

          {/* Interactive Project List with Region Filter */}
          <ProjectGrid initialProjects={projects} />

          {/* View More on Instagram CTA */}
          <div className="text-center pt-8 relative z-10">
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-transparent hover:bg-brand-orange text-brand-orange hover:text-white px-7 py-3 rounded-full font-bold border border-brand-orange transition-all duration-300 shadow-md shadow-brand-orange/5 hover:shadow-lg hover:shadow-brand-orange/20 hover:-translate-y-0.5 text-sm group"
            >
              <svg className="w-5 h-5 fill-current shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
              </svg>
              <span>Daha Çox Layihə İnstagram-da</span>
              <span className="group-hover:translate-x-1 transition-transform">➔</span>
            </a>
          </div>
        </div>


        {/* Wavy transition (Cream to Dark Gray) */}
        <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-[0]">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-[120%] md:w-full h-[40px] md:h-[80px] fill-brand-dark-light">
            <path d="M0,0 C300,80 900,0 1200,100 L1200,120 L0,120 Z"></path>
          </svg>
        </div>
      </section>

      {/* Services Block (Dark background) */}
      <section id="xidmetler" className="bg-brand-dark-light py-16 md:py-24 text-white relative overflow-hidden">
        {/* Faint construction site / crane sketch overlay */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center opacity-[0.035] mix-blend-overlay pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-brand-orange font-bold text-xs uppercase tracking-widest block">
              Nələr Edirik?
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-outfit tracking-tight text-white">
              Xidmətlərimiz
            </h2>
            <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
              Mükəmməl mühəndislik, premium dizayn və təhlükəsiz tikinti standartları.
            </p>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Service 1 */}
            <div className="group bg-brand-dark-card border border-white/5 p-8 rounded-2xl transition-all duration-300 hover:border-brand-orange/30 hover:shadow-lg hover:shadow-brand-orange/5 hover:-translate-y-1 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-brand-orange/10 border border-brand-orange/20 flex items-center justify-center text-brand-orange mb-6 group-hover:bg-brand-orange group-hover:text-white transition-all duration-500">
                <HomeIcon size={32} />
              </div>
              <h3 className="text-xl font-bold font-outfit mb-3">Yaşayış Evlərinin Tikintisi</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Sıfırdan mükəmməl evlərin tikintisi, bütün normativlərə uyğun mühəndislik işləri, möhkəm bünövrə və təhlükəsiz yaşayış evləri.
              </p>
            </div>

            {/* Service 2 */}
            <div className="group bg-brand-dark-card border border-white/5 p-8 rounded-2xl transition-all duration-300 hover:border-brand-orange/30 hover:shadow-lg hover:shadow-brand-orange/5 hover:-translate-y-1 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-brand-orange/10 border border-brand-orange/20 flex items-center justify-center text-brand-orange mb-6 group-hover:bg-brand-orange group-hover:text-white transition-all duration-500">
                <Hammer size={32} />
              </div>
              <h3 className="text-xl font-bold font-outfit mb-3">Təmir & Yenidənqurma</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Mənzillərin, ofislərin və bağ evlərinin premium səviyyədə daxili təmir-bərpa, santexnika, elektrik və kosmetik işlərinin həyata keçirilməsi.
              </p>
            </div>

            {/* Service 3 */}
            <div className="group bg-brand-dark-card border border-white/5 p-8 rounded-2xl transition-all duration-300 hover:border-brand-orange/30 hover:shadow-lg hover:shadow-brand-orange/5 hover:-translate-y-1 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-brand-orange/10 border border-brand-orange/20 flex items-center justify-center text-brand-orange mb-6 group-hover:bg-brand-orange group-hover:text-white transition-all duration-500">
                <Sparkles size={32} />
              </div>
              <h3 className="text-xl font-bold font-outfit mb-3">Fasad & Dekorativ İşlər</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Binaların xarici görünüşünün modern dizaynı, kabançik, aqlay örtükləri, fasad izolyasiyası və rənglənmə xidmətləri.
              </p>
            </div>
          </div>
        </div>

        {/* Wavy transition (Dark Gray to Cream) */}
        <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-[0]">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-[120%] md:w-full h-[40px] md:h-[80px] fill-brand-cream">
            <path d="M0,0 C300,100 900,0 1200,80 L1200,120 L0,120 Z"></path>
          </svg>
        </div>
      </section>

      {/* Pricing / Repair Packages (Warm Cream background) */}
      <section id="paketler" className="bg-brand-cream py-16 md:py-24 text-gray-900 relative overflow-hidden">
        {/* Faint technical grid background */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1581094288338-2314dddb7ecc?auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center opacity-[0.025] mix-blend-multiply pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-brand-orange font-bold text-xs uppercase tracking-widest block">
              Qiymət Təkliflərimiz
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-outfit tracking-tight text-gray-950">
              İnteraktiv Təmir Paketləri
            </h2>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
              Büdcənizə və zövqünüzə uyğun olan təmir paketini seçərək birbaşa WhatsApp vasitəsilə sifariş verə bilərsiniz.
            </p>
          </div>

          {/* Pricing Grid */}
          <PackageGrid packages={pricingPackages} />
        </div>

        {/* Wavy transition (Cream to Dark Footer) */}
        <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-[0]">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-[120%] md:w-full h-[40px] md:h-[80px] fill-brand-dark">
            <path d="M0,0 C300,80 900,0 1200,100 L1200,120 L0,120 Z"></path>
          </svg>
        </div>
      </section>

      {/* Footer & Contact Section (Dark background) */}
      <footer id="elaqe" className="bg-brand-dark py-16 md:pt-24 md:pb-12 text-white relative overflow-hidden">
        {/* Faint blueprint sketch background */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517581177682-a085bb7ffb15?auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center opacity-[0.035] mix-blend-overlay pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 relative z-10">
          
          {/* Main Footer Block */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-12 border-b border-white/5 items-center">
            {/* Left Column: Let's Build / Call to Action */}
            <div className="md:col-span-5 space-y-6">
              <div className="space-y-2">
                <span className="text-gray-400 font-outfit text-sm font-semibold tracking-widest uppercase block">
                  Layihəniz var?
                </span>
                <h3 className="text-2xl font-bold font-outfit text-white leading-tight">
                  Gəlin Birlikdə <br />
                  <span className="text-brand-orange text-3xl font-extrabold">Möhtəşəm İşlər Yaradaq!</span>
                </h3>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed max-w-sm font-light">
                Hər hansı bir tikinti və ya təmir planınız varsa, bizimlə bölüşün. Mütəxəssislərimiz sizə optimal həll yollarını təklif edəcək.
              </p>
              <div>
                <a
                  href={`tel:${cleanPhone1}`}
                  className="inline-flex items-center gap-3 bg-brand-orange hover:bg-brand-orange-hover text-white px-7 py-3.5 rounded-full font-bold transition-all duration-300 shadow-lg shadow-brand-orange/20 hover:shadow-brand-orange/40 hover:-translate-y-0.5 text-sm group"
                >
                  <span>Əlaqə Saxlayın</span>
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-white/20 text-white font-bold text-xs group-hover:translate-x-1 transition-transform">
                    ➔
                  </span>
                </a>
              </div>
            </div>

            {/* Center Column: Contact Information */}
            <div className="md:col-span-4 space-y-6 md:border-l md:border-white/10 md:pl-8">
              <h4 className="text-sm font-bold font-outfit text-brand-orange tracking-widest uppercase">
                ƏLAQƏ VƏ ÜNVAN
              </h4>
              <ul className="space-y-4 text-sm text-gray-300">
                <li className="flex items-center gap-3.5">
                  <span className="w-12 h-12 rounded-full bg-brand-orange/10 flex items-center justify-center text-brand-orange border border-brand-orange/20 shrink-0 shadow-sm">
                    <Phone size={18} />
                  </span>
                  <div>
                    <span className="text-xs text-gray-500 uppercase font-semibold block">Zəng üçün</span>
                    <a href={`tel:${cleanPhone1}`} className="hover:text-brand-orange font-bold transition-colors">
                      {phone1}
                    </a>
                  </div>
                </li>
                {phone2 && (
                  <li className="flex items-center gap-3.5">
                    <span className="w-12 h-12 rounded-full bg-brand-orange/10 flex items-center justify-center text-brand-orange border border-brand-orange/20 shrink-0 shadow-sm">
                      <Phone size={18} />
                    </span>
                    <div>
                      <span className="text-xs text-gray-500 uppercase font-semibold block">Alternativ</span>
                      <a href={`tel:${cleanPhone2}`} className="hover:text-brand-orange font-bold transition-colors">
                        {phone2}
                      </a>
                    </div>
                  </li>
                )}
                <li className="flex items-center gap-3.5">
                  <span className="w-12 h-12 rounded-full bg-brand-orange/10 flex items-center justify-center text-brand-orange border border-brand-orange/20 shrink-0 shadow-sm">
                    <MapPin size={18} />
                  </span>
                  <div>
                    <span className="text-xs text-gray-500 uppercase font-semibold block">Ünvanımız</span>
                    <span className="font-semibold text-gray-200">{address}</span>
                  </div>
                </li>
              </ul>
            </div>

            {/* Right Column: Logo & Social Media */}
            <div className="md:col-span-3 space-y-6 md:border-l md:border-white/10 md:pl-8">
              {/* Logo integrated */}
              <div className="flex items-center gap-3">
                <img src="/logo.png" alt="Aras İnşaat Logo" className="h-18 w-18 object-contain bg-white/5 rounded-full p-1 shrink-0 shadow-md" />
                <div className="flex flex-col leading-tight">
                  <span className="text-2xl font-black font-outfit tracking-wide text-white">
                    ARAS
                  </span>
                  <span className="text-xs tracking-widest text-brand-orange font-bold font-outfit uppercase font-extrabold">
                    Tikinti & Təmir
                  </span>
                  <span className="text-[9px] tracking-widest text-gray-500 font-outfit font-semibold uppercase">
                    BUILT TO INSPIRE
                  </span>
                </div>
              </div>

              {/* Social Media Circles */}
              <div className="space-y-2">
                <span className="text-xs text-gray-500 uppercase font-semibold block">Bizə istəklərinizi yazın</span>
                <div className="flex items-center gap-3">
                  <a
                    href={instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-brand-orange hover:border-brand-orange transition-all duration-300 border border-white/10 shadow-md"
                    title="Instagram"
                  >
                    <svg className="w-5.5 h-5.5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                    </svg>
                  </a>
                  <a
                    href={`https://wa.me/994518885599`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-brand-orange hover:border-brand-orange transition-all duration-300 border border-white/10 shadow-md"
                    title="WhatsApp"
                  >
                    <svg className="w-5.5 h-5.5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.625 1.451 5.403.002 9.803-4.394 9.806-9.799.002-2.597-1.006-5.04-2.838-6.874-1.832-1.832-4.272-2.84-6.877-2.842-5.409 0-9.809 4.394-9.812 9.8.001 2.052.541 4.053 1.564 5.823l-.99 3.616 3.71-.973zm10.457-7.112c-.29-.145-1.713-.845-1.979-.942-.266-.097-.459-.145-.653.145-.193.29-.749.942-.918 1.134-.169.193-.338.217-.628.072-1.29-.647-2.133-1.085-2.943-2.502-.213-.372.213-.346.61-.1.356-.22.399-.29.593-.483.193-.193.097-.362-.048-.653-.145-.29-.653-1.573-.894-2.152-.236-.569-.475-.491-.653-.5-.169-.008-.362-.01-.555-.01-.193 0-.507.072-.773.362-.266.29-1.014.99-1.014 2.415 0 1.425 1.038 2.802 1.182 2.995.145.193 2.043 3.12 4.95 4.378.691.299 1.232.478 1.654.612.695.22 1.329.19 1.83.115.559-.085 1.713-.7 1.954-1.377.242-.676.242-1.256.169-1.377-.073-.121-.266-.193-.556-.338z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Mandatory Copyright & Signature */}
          <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
            <p>
              &copy; {new Date().getFullYear()} Aras İnşaat. Bütün hüquqlar qorunur.
            </p>
            <div className="flex items-center gap-4 text-gray-400">
              <a href="#" className="hover:text-brand-orange transition-colors">Gizlilik Siyasəti</a>
              <span>•</span>
              <a href="#" className="hover:text-brand-orange transition-colors">İstifadə Şərtləri</a>
              <span>•</span>
              <p className="flex items-center gap-1">
                Sayt
                <a 
                  href="https://www.instagram.com/pixel_digital_services?igsh=MTB1b25kZWQ4YWFrZQ%3D%3D" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-brand-orange hover:underline font-bold transition-colors"
                >
                  "Pixel Digital Services"
                </a>
                tərəfindən hazırlanmışdır
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

