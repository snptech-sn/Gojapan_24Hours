import React, { useState } from 'react';
import { ShoppingBag, Globe, Menu, X, ShieldCheck } from 'lucide-react';
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
  const t = translations[language];

  const handleNav = (tab: 'home' | 'order' | 'tracking' | 'admin') => {
    onSelectTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      {/* Dynamic Announcement Bar configurable by Admin */}
      {siteSettings?.showAnnouncement && (
        <div className="bg-gojapan-500 text-white text-xs font-semibold py-1.5 px-4 text-center">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-xs">
            <span className="truncate flex-1 text-center sm:text-left">
              {language === 'km' ? siteSettings.announcementKm : siteSettings.announcementEn}
            </span>
            {siteSettings.hotline && (
              <span className="hidden sm:inline-block shrink-0 text-white/90 font-mono text-[11px] bg-white/15 px-2 py-0.5 rounded">
                Hotline: {siteSettings.hotline}
              </span>
            )}
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
            {/* Apps Script Guide Trigger */}
            <button
              onClick={onOpenAppsScriptCode}
              title="Google Apps Script Setup"
              className="hidden lg:inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 px-2.5 py-1.5 rounded-md hover:bg-slate-100 transition-colors border border-slate-200 cursor-pointer"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Google Sheets API</span>
            </button>

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

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={onOpenAppsScriptCode}
              className="text-xs text-slate-600 hover:text-slate-900 font-medium"
            >
              Google Apps Script API Guide
            </button>
            <button
              onClick={() => handleNav('order')}
              className="px-3 py-1.5 text-xs font-bold text-white bg-gojapan-500 rounded-lg"
            >
              {t.orderNow}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
