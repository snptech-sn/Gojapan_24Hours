import React from 'react';
import { Wifi, Zap, PhoneCall, ShieldCheck, ChevronRight, Activity } from 'lucide-react';
import { Language, SiteSettings } from '../types';
import { translations } from '../utils/translations';

interface HeroProps {
  language: Language;
  onGoToOrder: () => void;
  onGoToTracking: () => void;
  siteSettings?: SiteSettings;
}

export const Hero: React.FC<HeroProps> = ({ language, onGoToOrder, onGoToTracking, siteSettings }) => {
  const t = translations[language];

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-900 text-white pt-12 pb-16 lg:py-20">
      {/* Decorative background grid pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]"></div>
      
      {/* GoJapan magenta ambient glow matching the uploaded logo */}
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-gojapan-500/25 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-gojapan-700/15 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Headline and Actions */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Unboxed Metadata Kicker with GoJapan brand color */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-300">
              <span className="text-gojapan-400 font-extrabold uppercase tracking-wider">
                {siteSettings?.siteName || 'GoJapan 24hours'} ISP
              </span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>24/7 Khmer & Japanese Support</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-emerald-400">NTT & SoftBank Direct</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
              {siteSettings ? (
                language === 'km' ? (
                  siteSettings.heroHeadlineKm
                ) : (
                  siteSettings.heroHeadlineEn
                )
              ) : language === 'km' ? (
                <>
                  សេវាអ៊ីនធឺណិតជប៉ុនល្បឿនលឿន <br className="hidden sm:inline" />
                  <span className="text-gojapan-400 drop-shadow-sm">GoJapan 24hours</span> ទំនុកចិត្តខ្ពស់
                </>
              ) : (
                <>
                  Ultra High-Speed Japan Internet <br className="hidden sm:inline" />
                  <span className="text-gojapan-400 drop-shadow-sm">GoJapan 24hours</span> Nationwide
                </>
              )}
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base lg:text-lg text-slate-300 max-w-2xl leading-relaxed">
              {siteSettings
                ? language === 'km'
                  ? siteSettings.heroSubheadlineKm
                  : siteSettings.heroSubheadlineEn
                : t.heroSubtitle}
            </p>

            {/* CTAs with GoJapan brand theme */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <button
                onClick={onGoToOrder}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-bold text-white bg-gojapan-500 hover:bg-gojapan-600 rounded-lg shadow-lg shadow-gojapan-500/25 transition-all cursor-pointer whitespace-nowrap"
              >
                <span>{t.orderNow}</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                onClick={onGoToTracking}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
              >
                <span>{t.trackOrder}</span>
              </button>
            </div>

            {/* Trust Markers and Highlights */}
            <div className="pt-6 border-t border-slate-800 grid grid-cols-3 gap-2 sm:gap-4 text-left">
              <div>
                <p className="text-lg sm:text-2xl font-black text-white tabular-nums">3.9 <span className="text-xs sm:text-sm font-normal text-slate-400">Gbps</span></p>
                <p className="text-[10px] sm:text-xs text-slate-400 mt-0.5">5G Max Speed</p>
              </div>
              <div>
                <p className="text-lg sm:text-2xl font-black text-gojapan-400 tabular-nums">24/7</p>
                <p className="text-[10px] sm:text-xs text-slate-400 mt-0.5">ជំនួយ Support</p>
              </div>
              <div>
                <p className="text-lg sm:text-2xl font-black text-emerald-400 tabular-nums">100%</p>
                <p className="text-[10px] sm:text-xs text-slate-400 mt-0.5">Sheets Sync</p>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Japanese Telecom Showcase Box */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 sm:p-7 shadow-2xl backdrop-blur-md relative overflow-hidden">
              <div className="flex items-center justify-between pb-5 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <img
                    src="/gojapan-logo.jpg"
                    alt="GoJapan Network"
                    className="w-10 h-10 rounded-xl object-cover ring-2 ring-gojapan-400/40 shrink-0"
                  />
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                      <span>GoJapan Network</span>
                      <span className="text-[10px] bg-gojapan-500/20 text-gojapan-300 px-1.5 py-0.5 rounded font-mono">ISP</span>
                    </h3>
                    <p className="text-xs text-slate-400">Tokyo · Osaka · Fukuoka · Global</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                  <Activity className="w-3.5 h-3.5" />
                  <span>100% Live</span>
                </div>
              </div>

              {/* Network Feature Items */}
              <div className="mt-5 space-y-4">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-950/70 border border-slate-800/80">
                  <div className="p-2 rounded-lg bg-gojapan-500/20 text-gojapan-400 mt-0.5 shrink-0">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Pocket Wi-Fi 5G & eSIM Instant QR</h4>
                    <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                      {language === 'km'
                        ? 'ដោតស៊ីមភ្លាមប្រើបានភ្លាម ឬស្កេន QR Code eSIM ក្នុងរយៈពេល ៥ នាទី។'
                        : 'Plug-and-play travel Wi-Fi or scan QR eSIM within 5 minutes.'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-950/70 border border-slate-800/80">
                  <div className="p-2 rounded-lg bg-blue-600/20 text-blue-400 mt-0.5 shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">NTT Flets & SoftBank Official Line</h4>
                    <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                      {language === 'km'
                        ? 'តភ្ជាប់ខ្សែ Fiber អុបទិកផ្ទាល់ពីក្រុមហ៊ុនធំបំផុតនៅជប៉ុន ស្ថេរភាពខ្ពស់។'
                        : 'Direct Tier-1 fiber broadband infrastructure for maximum uptime.'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-950/70 border border-slate-800/80">
                  <div className="p-2 rounded-lg bg-emerald-600/20 text-emerald-400 mt-0.5 shrink-0">
                    <PhoneCall className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Customer & Agent Portal</h4>
                    <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                      {language === 'km'
                        ? 'គាំទ្រការកម្មង់សម្រាប់អតិថិជនទូទៅ និងភ្នាក់ងារលក់ជាមួយលេខកូដ Agent ID។'
                        : 'Tailored for both individual subscribers and sales partner agents.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Supported Carriers */}
              <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span className="font-medium text-slate-400">Tier-1 Carriers:</span>
                <div className="flex items-center gap-2.5 font-bold text-slate-300">
                  <span className="text-slate-200">NTT Docomo</span>
                  <span className="text-slate-600">·</span>
                  <span className="text-slate-200">SoftBank</span>
                  <span className="text-slate-600">·</span>
                  <span className="text-slate-200">au KDDI</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
