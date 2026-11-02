import React, { useState } from 'react';
import { X, Copy, Check, ExternalLink, Code2, BookOpen, AlertTriangle } from 'lucide-react';
import { Language } from '../types';
import { GOOGLE_APPS_SCRIPT_CODE } from '../utils/appsScriptCode';

interface AppsScriptModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export const AppsScriptModal: React.FC<AppsScriptModalProps> = ({
  isOpen,
  onClose,
  language,
}) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'instructions' | 'code'>('instructions');

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(GOOGLE_APPS_SCRIPT_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-3xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Google Sheets Apps Script API Connector
              </h3>
              <p className="text-xs text-slate-500">
                GoJapan 24hours Automated 4-Sheet Sync Engine
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 pt-4 pb-2 shrink-0">
          <button
            onClick={() => setActiveTab('instructions')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'instructions'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>{language === 'km' ? 'ការណែនាំដំឡើង (Step-by-Step)' : 'Setup Instructions'}</span>
          </button>

          <button
            onClick={() => setActiveTab('code')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'code'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>{language === 'km' ? 'កូដ Google Apps Script (Code.gs)' : 'Source Code (Code.gs)'}</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto py-3 space-y-4 text-xs text-slate-700">
          {activeTab === 'instructions' ? (
            <div className="space-y-4 leading-relaxed">
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-2.5 text-amber-900">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-bold">
                    {language === 'km' ? 'ចំណុចសំខាន់បំផុតពេល Deploy:' : 'Critical Deployment Requirement:'}
                  </strong>
                  <span>
                    {language === 'km'
                      ? 'ត្រូវប្រាកដថាបានជ្រើសរើស "Who has access: Anyone" (អ្នកណាក៏ដោយ) ដើម្បីឱ្យ Web App អាចទទួល Order ពីអតិថិជន និងភ្នាក់ងារបានដោយរលូន។'
                      : 'You MUST select "Who has access: Anyone" so the storefront can stream orders seamlessly into your Google Sheet.'}
                  </span>
                </div>
              </div>

              <ol className="list-decimal list-inside space-y-3 pl-1 font-medium text-slate-800">
                <li className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                  <strong>{language === 'km' ? 'ជំហានទី ១: បង្កើត Google Sheet' : 'Step 1: Create Google Sheet'}</strong>
                  <p className="text-slate-600 font-normal mt-0.5 ml-4">
                    {language === 'km'
                      ? 'ចូលទៅកាន់ sheets.google.com បង្កើតសន្លឹកកិច្ចការថ្មី (ឧទាហរណ៍ដាក់ឈ្មោះ: GoJapan 24hours Database)។ មិនបាច់បង្កើត Sheets ទាំង ៤ ដោយដៃទេ កូដនឹងបង្កើត Orders, Order_Items, Products, Customers ដោយស្វ័យប្រវត្តិ!'
                      : 'Go to sheets.google.com and create a blank sheet (Name: GoJapan 24hours Database). The script automatically auto-initializes all 4 sheets and colored headers!'}
                  </p>
                </li>

                <li className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                  <strong>{language === 'km' ? 'ជំហានទី ២: បើក Apps Script Editor' : 'Step 2: Open Apps Script'}</strong>
                  <p className="text-slate-600 font-normal mt-0.5 ml-4">
                    {language === 'km'
                      ? 'នៅលើ Menu ខាងលើរបស់ Google Sheet ចុច Extensions -> Apps Script។'
                      : 'Click Extensions > Apps Script in your spreadsheet top menu.'}
                  </p>
                </li>

                <li className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                  <strong>{language === 'km' ? 'ជំហានទី ៣: បិទភ្ជាប់កូដ Code.gs' : 'Step 3: Paste Code.gs'}</strong>
                  <p className="text-slate-600 font-normal mt-0.5 ml-4">
                    {language === 'km'
                      ? 'លុបអក្សរចាស់ចោលទាំងអស់ រួច Copy កូដពីផ្ទាំង «កូដ Google Apps Script» យកមកបិទភ្ជាប់ ហើយចុច Save (រូបថតថាស)។'
                      : 'Replace existing template code with the code from the "Source Code" tab, then click Save.'}
                  </p>
                </li>

                <li className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                  <strong>{language === 'km' ? 'ជំហានទី ៤: Deploy ជា Web App' : 'Step 4: Deploy as Web App'}</strong>
                  <p className="text-slate-600 font-normal mt-0.5 ml-4">
                    {language === 'km'
                      ? 'ចុច Deploy (ពណ៌ខៀវ) -> New deployment -> ជ្រើសរើស Web app -> Execute as: Me -> Who has access: Anyone -> ចុច Deploy -> អនុញ្ញាត Permissions -> Copy "Web app URL" (បញ្ចប់ដោយ /exec)។'
                      : 'Click Deploy > New deployment > Select type "Web app" > Execute as: Me > Who has access: Anyone > Deploy > Review permissions > Copy the Web app URL.'}
                  </p>
                </li>

                <li className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                  <strong>{language === 'km' ? 'ជំហានទី ៥: បិទភ្ជាប់ក្នុង Admin Dashboard' : 'Step 5: Paste in Admin Dashboard'}</strong>
                  <p className="text-slate-600 font-normal mt-0.5 ml-4">
                    {language === 'km'
                      ? 'ចូលទៅកាន់ GoJapan 24hours Admin Dashboard -> ជ្រើសរើសផ្ទាំង «Google Sheets Sync» -> បិទភ្ជាប់ URL -> ចុច «Test Connection» និង «Sync Now» ជាការស្រេច!'
                      : 'Paste your Web App URL into GoJapan 24hours Admin Dashboard > Google Sheets Sync > click "Test Connection" & "Sync Now".'}
                  </p>
                </li>
              </ol>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">Code.gs Source:</span>
                <button
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? (language === 'km' ? 'បាន Copy រួចរាល់!' : 'Copied!') : (language === 'km' ? 'Copy កូដ' : 'Copy Code')}</span>
                </button>
              </div>

              <pre className="p-4 rounded-xl bg-slate-900 text-slate-100 font-mono text-[11px] leading-relaxed overflow-x-auto max-h-[350px] border border-slate-800">
                {GOOGLE_APPS_SCRIPT_CODE}
              </pre>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-200 flex items-center justify-between shrink-0">
          <a
            href="https://sheets.new"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-gojapan-600"
          >
            <span>{language === 'km' ? 'បើក Google Sheets ថ្មី (sheets.new)' : 'Create New Google Sheet'}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            {language === 'km' ? 'យល់ព្រម (Close)' : 'Done'}
          </button>
        </div>

      </div>
    </div>
  );
};
