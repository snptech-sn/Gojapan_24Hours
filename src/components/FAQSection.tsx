import React, { useState, useMemo } from 'react';
import { ChevronDown, HelpCircle, MessageSquare, PhoneCall, CheckCircle2, Send, Sparkles } from 'lucide-react';
import { FAQCategory, FAQItem, Language, SiteSettings } from '../types';

interface FAQSectionProps {
  siteSettings?: SiteSettings;
  language: Language;
  onGoToOrder?: () => void;
}

export const FAQSection: React.FC<FAQSectionProps> = ({
  siteSettings,
  language,
  onGoToOrder,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<FAQCategory | 'all'>('all');
  const [openFaqId, setOpenFaqId] = useState<string | null>(null);

  const faqs: FAQItem[] = useMemo(() => {
    const list = siteSettings?.faqs || [];
    return list.filter((f) => f.isActive !== false).sort((a, b) => a.order - b.order);
  }, [siteSettings?.faqs]);

  // Categories with bilingual labels and icons
  const categories: { id: FAQCategory | 'all'; km: string; en: string }[] = [
    { id: 'all', km: 'ទាំងអស់', en: 'All Topics' },
    { id: 'sim_esim', km: 'ស៊ីមកាត & eSIM', en: 'SIM & eSIM' },
    { id: 'pocket_wifi', km: 'Pocket Wi-Fi', en: 'Pocket Wi-Fi' },
    { id: 'delivery_return', km: 'ដឹកជញ្ជូន & ប្រគល់វិញ', en: 'Delivery & Returns' },
    { id: 'payment_support', km: 'ជំនួយ ២៤/៧', en: '24/7 Support' },
  ];

  const filteredFaqs = useMemo(() => {
    if (selectedCategory === 'all') return faqs;
    return faqs.filter((f) => f.category === selectedCategory);
  }, [faqs, selectedCategory]);

  const toggleAccordion = (id: string) => {
    setOpenFaqId((prev) => (prev === id ? null : id));
  };

  const getCategoryLabel = (cat: FAQCategory) => {
    switch (cat) {
      case 'sim_esim':
        return language === 'km' ? 'ស៊ីមកាត & eSIM' : 'SIM & eSIM';
      case 'pocket_wifi':
        return language === 'km' ? 'Pocket Wi-Fi' : 'Pocket Wi-Fi';
      case 'delivery_return':
        return language === 'km' ? 'ការដឹកជញ្ជូន & ប្រគល់ត្រឡប់' : 'Delivery & Return';
      case 'payment_support':
        return language === 'km' ? 'ការទូទាត់ & ជំនួយបច្ចេកទេស' : 'Support & Assistance';
      default:
        return language === 'km' ? 'ព័ត៌មានទូទៅ' : 'General Info';
    }
  };

  return (
    <section className="bg-white border-b border-slate-200 py-16 sm:py-20 transition-colors">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gojapan-600 bg-gojapan-50 px-3 py-1 rounded-full">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{language === 'km' ? 'សំណួរដែលសួរញឹកញាប់' : 'Knowledge Base & FAQ'}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {language === 'km'
              ? 'ចម្ងល់ទូទៅអំពីសេវាកម្ម GoJapan 24hours'
              : 'Frequently Asked Questions'}
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {language === 'km'
              ? 'ព័ត៌មានលម្អិតអំពីការបើកដំណើរការស៊ីមកាត ការស្កេន eSIM និងរបៀបប្រគល់ Pocket Wi-Fi ត្រឡប់មកវិញដោយងាយស្រួល'
              : 'Clear, step-by-step guidance on travel SIM APN setup, eSIM instant installation, and pocket Wi-Fi mailbox returns.'}
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 p-1 bg-slate-100/80 rounded-xl border border-slate-200 max-w-2xl mx-auto">
          {categories.map((cat) => {
            const count = cat.id === 'all' ? faqs.length : faqs.filter((f) => f.category === cat.id).length;
            const isActive = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-gojapan-500 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <span>{language === 'km' ? cat.km : cat.en}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isActive ? 'bg-white/25 text-white' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Accordion Questions List */}
        <div className="space-y-3">
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-300 space-y-2">
              <p className="text-xs font-semibold text-slate-600">
                {language === 'km' ? 'មិនមានសំណួរក្នុងប្រធានបទនេះនៅឡើយទេ' : 'No questions found in this category.'}
              </p>
            </div>
          ) : (
            filteredFaqs.map((faq, idx) => {
              const isOpen = openFaqId === faq.id;
              const question = language === 'km' ? faq.questionKm : faq.questionEn;
              const answer = language === 'km' ? faq.answerKm : faq.answerEn;

              return (
                <div
                  key={faq.id}
                  className={`rounded-xl border transition-all duration-200 overflow-hidden ${
                    isOpen
                      ? 'border-gojapan-300 bg-white shadow-sm ring-1 ring-gojapan-100'
                      : 'border-slate-200 bg-slate-50/60 hover:bg-white hover:border-slate-300'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleAccordion(faq.id)}
                    aria-expanded={isOpen}
                    className="w-full py-4 px-5 flex items-center justify-between gap-4 text-left cursor-pointer group"
                  >
                    <div className="space-y-1 pr-2">
                      <div className="flex items-center gap-2 text-[11px] font-semibold text-gojapan-600">
                        <span>{getCategoryLabel(faq.category)}</span>
                        <span aria-hidden="true" className="text-slate-300">·</span>
                        <span className="text-slate-500 font-normal">#{idx + 1}</span>
                      </div>
                      <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-gojapan-600 transition-colors leading-snug">
                        {question}
                      </h3>
                    </div>

                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-transform duration-200 ${
                        isOpen
                          ? 'bg-gojapan-50 text-gojapan-600 rotate-180'
                          : 'bg-white border border-slate-200 text-slate-400 group-hover:text-slate-600'
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  {/* Expanded Answer Content */}
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100/80 animate-in fade-in slide-in-from-top-1 duration-150">
                      <div className="p-4 rounded-lg bg-slate-50/90 border border-slate-100 space-y-3">
                        <p className="whitespace-pre-line">{answer}</p>
                        
                        {/* Interactive tips based on category */}
                        {faq.category === 'pocket_wifi' && (
                          <div className="pt-2 flex items-center gap-2 text-xs font-semibold text-emerald-700">
                            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                            <span>
                              {language === 'km'
                                ? 'ស្រោមសំបុត្រមានក្នុងកញ្ចប់រួចជាស្រេច មិនចាំបាច់បង់ប្រាក់ថ្លៃផ្ញើឡើយ!'
                                : 'Prepaid envelope included in package. Zero postage fees required!'}
                            </span>
                          </div>
                        )}

                        {faq.category === 'sim_esim' && (
                          <div className="pt-2 flex items-center gap-2 text-xs font-semibold text-blue-700">
                            <CheckCircle2 className="w-4 h-4 shrink-0 text-blue-600" />
                            <span>
                              {language === 'km'
                                ? 'បើកដំណើរការភ្លាមៗពេលចុះចត មិនបាច់ចុះឈ្មោះលិខិតឆ្លងដែនស្មុគស្មាញឡើយ'
                                : 'Instant connectivity on arrival with no complex local identity verification.'}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Contact Help Banner at bottom of FAQ */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-800 text-white flex flex-col sm:flex-row items-center justify-between gap-5 shadow-lg">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-sm sm:text-base font-bold flex items-center justify-center sm:justify-start gap-2">
              <MessageSquare className="w-4 h-4 text-gojapan-400" />
              <span>
                {language === 'km'
                  ? 'នៅមានចម្ងល់ ឬត្រូវការជំនួយបន្ថែម?'
                  : 'Still have questions or need assistance?'}
              </span>
            </h4>
            <p className="text-xs text-slate-300">
              {language === 'km'
                ? 'ក្រុមការងារបច្ចេកទេស GoJapan ប្រចាំការ ២៤ ម៉ោង ឆ្លើយតបរហ័សជាភាសាខ្មែរ និងជប៉ុន'
                : 'Our 24/7 technical team is ready to assist you in Khmer and Japanese via Telegram or Hotline.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
            {siteSettings?.telegramUsername && (
              <a
                href={`https://t.me/${siteSettings.telegramUsername.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-all shadow-sm shadow-blue-600/30 active:scale-95 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Telegram: {siteSettings.telegramUsername}</span>
              </a>
            )}

            {siteSettings?.hotline && (
              <a
                href={`tel:${siteSettings.hotline.split('/')[0].trim()}`}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-200 hover:text-white bg-white/10 hover:bg-white/20 border border-white/15 rounded-lg transition-all active:scale-95 cursor-pointer"
              >
                <PhoneCall className="w-3.5 h-3.5 text-gojapan-400" />
                <span>{siteSettings.hotline.split('/')[0].trim()}</span>
              </a>
            )}
          </div>
        </div>

      </div>
    </section>
  );
};
