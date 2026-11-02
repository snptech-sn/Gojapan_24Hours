import React, { useState, useEffect, useMemo } from 'react';
import { ShoppingBag, Globe, Menu, X, ShieldCheck, ChevronUp, ChevronDown } from 'lucide-react';
import { Language, SiteSettings } from '../types';
import { translations } from '../utils/translations';

interface NavbarProps {
  currentTab: 'home' | 'order' | 'tracking' | 'admin';
  onSelectTab: (tab: 'home' | 'order' | 'tracking' | 'admin') => void;
  language: Language;
  onToggleLanguage: () => void;
  cartCount: number;
  onOpenCart: () => void;
  isAdminLoggedIn: boolean;
  onOpenAppsScriptCode: () => void;
  siteSettings?: SiteSettings;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  language,
  onToggleLanguage,
  cartCount,
  onOpenCart,
  isAdminLoggedIn,
  onOpenAppsScriptCode,
  siteSettings,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentNewsIndex, setCurrentNewsIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState<'up' | 'down'>('up');
  const [isPaused, setIsPaused] = useState(false);
  const t = translations[language];

  // Curated bilingual news items incorporating admin site settings
  const newsItems = useMemo(() => [
    {
      km: siteSettings?.announcementKm || '⚡ ប្រូម៉ូសិនពិសេស! បញ្ចុះតម្លៃ 10% លើកញ្ចប់ Pocket Wi-Fi 5G & eSIM សម្រាប់ការកម្មង់មុនដំណាច់ខែនេះ',
      en: siteSettings?.announcementEn || '⚡ Limited Time Offer: 10% discount on 5G Pocket Wi-Fi & eSIM packages booked this month!',
      tagKm: 'ពិសេស',
      tagEn: 'PROMO'
    },
    {
      km: '🚀 សេវាដឹកជញ្ជូនរហ័សទូទាំងប្រទេសជប៉ុន & ទទួលផ្ទាល់នៅព្រលានយន្តហោះ Narita, Haneda, Kansai',
      en: '🚀 Fast delivery across Japan & Airport pick-up at Narita, Haneda, Kansai',
      tagKm: 'ដឹកជញ្ជូន',
      tagEn: 'DELIVERY'
    },
    {
      km: '📶 អ៊ីនធឺណិតល្បឿនលឿន 5G & 4G LTE គ្មានដែនកំណត់ លើបណ្តាញ Docomo & SoftBank ធានាគុណភាព ១០០%',
      en: '📶 Unlimited High-Speed 5G & 4G LTE on Docomo & SoftBank networks - 100% Guaranteed',
      tagKm: 'ល្បឿនលឿន',
      tagEn: '5G LTE'
    },
    {
      km: `📞 បម្រើសេវាកម្ម ២៤ ម៉ោងជាភាសាខ្មែរ និងជប៉ុន ${siteSettings?.hotline ? `(Hotline: ${siteSettings.hotline})` : ''} - Telegram: @gojapan24h`,
      en: `📞 24/7 Customer Care in Khmer & Japanese ${siteSettings?.hotline ? `(Hotline: ${siteSettings.hotline})` : ''} - Telegram: @gojapan24h`,
      tagKm: '២៤ ម៉ោង',
      tagEn: '24/7'
    }
  ], [siteSettings?.announcementKm, siteSettings?.announcementEn, siteSettings?.hotline]);

  // Automated vertical slide timer
  useEffect(() => {
    if (isPaused || newsItems.length <= 1) return;
    const interval = setInterval(() => {
      setSlideDirection('up');
      setCurrentNewsIndex((prev) => (prev + 1) % newsItems.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isPaused, newsItems.length]);

  const handlePrevNews = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSlideDirection('down');
    setCurrentNewsIndex((prev) => (prev - 1 + newsItems.length) % newsItems.length);
  };

  const handleNextNews = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSlideDirection('up');
    setCurrentNewsIndex((prev) => (prev + 1) % newsItems.length);
  };

  const activeNews = newsItems[currentNewsIndex] || newsItems[0];

  const handleNav = (tab: 'home' | 'order' | 'tracking' | 'admin') => {
    onSelectTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      {/* Dynamic Animated Vertical Sliding Announcement Bar */}
      {(siteSettings?.showAnnouncement ?? true) && (
        <div 
          className="bg-gradient-to-r from-gojapan-600 via-gojapan-500 to-gojapan-600 text-white text-xs font-semibold py-1.5 px-3 sm:px-4 text-center border-b border-pink-400/30 select-none overflow-hidden"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          title={language === 'km' ? 'ចុចលើព្រួញឡើង/ចុះ ដើម្បីមើលព័ត៌មានបន្ទាប់' : 'Hover to pause, use arrows to slide news'}
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-3 text-xs">
            {/* Live Indicator Badge */}
            <div className="flex items-center gap-1.5 shrink-0 bg-white/20 backdrop-blur-xs px-2 py-0.5 rounded-full text-[10px] sm:text-xs tracking-wider uppercase">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
              </span>
              <span className="font-bold">
                {language === 'km' ? 'ព័ត៌មាន' : 'NEWS'}
              </span>
            </div>

            {/* Vertical Sliding News Content */}
            <div className="overflow-hidden relative flex-1 h-5 flex items-center justify-center sm:justify-start">
              <div
                key={`${currentNewsIndex}-${slideDirection}`}
                className={`flex items-center gap-2 truncate text-center sm:text-left w-full justify-center sm:justify-start ${
                  slideDirection === 'up' ? 'animate-slide-up' : 'animate-slide-down'
                }`}
              >
                <span className="inline-block bg-white text-gojapan-600 text-[10px] font-black px-1.5 py-0.2 rounded shrink-0 shadow-xs">
                  {language === 'km' ? activeNews.tagKm : activeNews.tagEn}
                </span>
                <span className="truncate text-white font-medium text-[11px] sm:text-xs">
                  {language === 'km' ? activeNews.km : activeNews.en}
                </span>
              </div>
            </div>

            {/* Up / Down Controls & Counter */}
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="text-[10px] text-white/80 font-mono hidden sm:inline-block">
                {currentNewsIndex + 1}/{newsItems.length}
              </span>
              <div className="flex items-center bg-black/15 rounded-md p-0.5 border border-white/10">
                <button
                  type="button"
                  onClick={handlePrevNews}
                  aria-label="Previous announcement"
                  className="p-0.5 hover:bg-white/20 rounded transition text-white/90 hover:text-white cursor-pointer"
                  title={language === 'km' ? 'ព័ត៌មានមុន (ស្លាយចុះ)' : 'Previous (Slide Down)'}
                >
                  <ChevronUp className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={handleNextNews}
                  aria-label="Next announcement"
                  className="p-0.5 hover:bg-white/20 rounded transition text-white/90 hover:text-white cursor-pointer"
                  title={language === 'km' ? 'ព័ត៌មានបន្ទាប់ (ស្លាយឡើង)' : 'Next (Slide Up)'}
                >
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
              </div>

              {siteSettings?.hotline && (
                <span className="hidden md:inline-flex items-center gap-1 shrink-0 text-white font-mono text-[11px] bg-white/20 hover:bg-white/30 transition px-2 py-0.5 rounded-full ml-1">
                  <span className="text-white/80 text-[10px]">Hotline:</span>
                  <span>{siteSettings.hotline}</span>
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-2 sm:gap-6 h-16">
          {/* Zone 1: Brand Wordmark & Official GoJapan Logo */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              onClick={() => handleNav('home')}
              className="flex items-center gap-2.5 sm:gap-3 text-left group cursor-pointer"
            >
              <img
                src="./gojapan-logo.jpg"
                alt="GoJapan 24hours Logo"
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl object-cover shadow-sm ring-1 ring-gojapan-200 transition-transform group-hover:scale-105 shrink-0"
              />
              <div className="flex flex-col min-w-0">
                <span className="text-base sm:text-lg font-extrabold tracking-tight text-slate-900 whitespace-nowrap leading-tight">
                  GoJapan <span className="text-gojapan-500 font-black">24hours</span>
                </span>
                <span className="text-[10px] text-slate-500 font-medium tracking-wide hidden sm:inline-block truncate">
                  {t.brandTag}
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
            <button
              onClick={() => handleNav('home')}
              className={`hover:text-gojapan-600 transition-colors whitespace-nowrap shrink-0 pb-1 border-b-2 cursor-pointer ${
                currentTab === 'home'
                  ? 'border-gojapan-500 text-slate-900 font-bold'
                  : 'border-transparent'
              }`}
            >
              {t.navProducts}
            </button>
            <button
              onClick={() => handleNav('order')}
              className={`hover:text-gojapan-600 transition-colors whitespace-nowrap shrink-0 pb-1 border-b-2 cursor-pointer ${
                currentTab === 'order'
                  ? 'border-gojapan-500 text-slate-900 font-bold'
                  : 'border-transparent'
              }`}
            >
              {t.navOrder}
            </button>
            <button
              onClick={() => handleNav('tracking')}
              className={`hover:text-gojapan-600 transition-colors whitespace-nowrap shrink-0 pb-1 border-b-2 cursor-pointer ${
                currentTab === 'tracking'
                  ? 'border-gojapan-500 text-slate-900 font-bold'
                  : 'border-transparent'
              }`}
            >
              {t.navTracking}
            </button>
            <button
              onClick={() => handleNav('admin')}
              className={`flex items-center gap-1.5 hover:text-gojapan-600 transition-colors whitespace-nowrap shrink-0 pb-1 border-b-2 cursor-pointer ${
                currentTab === 'admin'
                  ? 'border-gojapan-500 text-slate-900 font-bold'
                  : 'border-transparent'
              }`}
            >
              {isAdminLoggedIn && <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />}
              {t.navAdmin}
            </button>
          </nav>

          {/* Zone 3: Primary Action & Controls */}
          <div className="flex items-center gap-3 shrink-0">

            {/* Language Switcher */}
            <button
              onClick={onToggleLanguage}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
              title="Change Language"
            >
              <Globe className="w-3.5 h-3.5 text-slate-500" />
              <span>{language === 'km' ? 'EN' : 'ខ្មែរ'}</span>
            </button>

            {/* Cart Trigger */}
            <button
              onClick={onOpenCart}
              className="relative flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
              title="View Cart"
            >
              <ShoppingBag className="w-4 h-4 text-slate-700" />
              <span className="hidden sm:inline">{t.cart}</span>
              {cartCount > 0 && (
                <span className="bg-gojapan-500 text-white font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Primary Order CTA */}
            <button
              onClick={() => handleNav('order')}
              className="hidden sm:inline-flex items-center justify-center px-4 py-2 text-xs font-bold text-white bg-gojapan-500 hover:bg-gojapan-600 rounded-lg shadow-sm hover:shadow transition-all whitespace-nowrap cursor-pointer"
            >
              {t.orderNow}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:text-slate-900 focus:outline-none cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-2">
          <button
            onClick={() => handleNav('home')}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${
              currentTab === 'home' ? 'bg-gojapan-50 text-gojapan-700 font-bold' : 'text-slate-700'
            }`}
          >
            {t.navProducts}
          </button>
          <button
            onClick={() => handleNav('order')}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${
              currentTab === 'order' ? 'bg-gojapan-50 text-gojapan-700 font-bold' : 'text-slate-700'
            }`}
          >
            {t.navOrder}
          </button>
          <button
            onClick={() => handleNav('tracking')}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${
              currentTab === 'tracking' ? 'bg-gojapan-50 text-gojapan-700 font-bold' : 'text-slate-700'
            }`}
          >
            {t.navTracking}
          </button>
          <button
            onClick={() => handleNav('admin')}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${
              currentTab === 'admin' ? 'bg-gojapan-50 text-gojapan-700 font-bold' : 'text-slate-700'
            }`}
          >
            {t.navAdmin}
          </button>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-end">
            <button
              onClick={() => handleNav('order')}
              className="w-full sm:w-auto px-4 py-2 text-center text-xs font-bold text-white bg-gojapan-500 hover:bg-gojapan-600 rounded-lg cursor-pointer"
            >
              {t.orderNow}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
