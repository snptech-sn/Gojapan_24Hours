import React from 'react';
import { Wifi, Smartphone, Globe, Router, Check, Plus } from 'lucide-react';
import { Language, Product } from '../types';
import { translations } from '../utils/translations';

interface ProductCardProps {
  product: Product;
  language: Language;
  onAddToCart: (product: Product) => void;
  onDirectOrder: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  language,
  onAddToCart,
  onDirectOrder,
}) => {
  const t = translations[language];

  // Helper to render authentic category icon
  const renderCategoryIcon = () => {
    switch (product.category) {
      case 'pocket_wifi':
        return <Wifi className="w-8 h-8 text-gojapan-500" />;
      case 'sim_esim':
        return <Smartphone className="w-8 h-8 text-blue-600" />;
      case 'fiber_broadband':
        return <Globe className="w-8 h-8 text-emerald-600" />;
      case 'hardware':
        return <Router className="w-8 h-8 text-amber-600" />;
    }
  };

  const getCategoryLabel = () => {
    switch (product.category) {
      case 'pocket_wifi':
        return t.catPocketWifi;
      case 'sim_esim':
        return t.catSimEsim;
      case 'fiber_broadband':
        return t.catFiber;
      case 'hardware':
        return t.catHardware;
    }
  };

  return (
    <div className="group flex flex-col bg-white rounded-xl border border-slate-200 hover:border-gojapan-200 shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden">
      
      {/* Product Visual Header Container */}
      <div className="relative h-44 bg-gradient-to-br from-slate-50 via-slate-100 to-gojapan-50/40 flex flex-col items-center justify-center p-6 border-b border-slate-100 overflow-hidden">
        
        {/* Visual subtle radial background */}
        <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px] opacity-40"></div>
        
        {/* Icon & Japanese Telecom Badge */}
        <div className="relative z-10 w-16 h-16 rounded-2xl bg-white shadow-sm border border-slate-200/80 flex items-center justify-center group-hover:scale-105 transition-transform duration-200 group-hover:border-gojapan-200">
          {renderCategoryIcon()}
        </div>

        {/* Carrier info unboxed text */}
        <div className="relative z-10 mt-3 flex items-center gap-2 text-xs font-semibold text-slate-700">
          <span>{product.carrier}</span>
          <span aria-hidden="true" className="text-slate-300">·</span>
          <span className="text-slate-500 font-mono text-[11px]">{product.sku}</span>
        </div>

        {/* Optional distinction tag */}
        {product.badge && (
          <div className="absolute top-3 right-3 text-[11px] font-bold text-gojapan-700 bg-gojapan-50 border border-gojapan-200/80 px-2 py-0.5 rounded-md shadow-2xs">
            {product.badge}
          </div>
        )}
      </div>

      {/* Product Body */}
      <div className="flex-1 p-5 flex flex-col justify-between">
        <div className="space-y-3">
          {/* Category kicker */}
          <div className="text-xs font-bold text-gojapan-600 tracking-wide uppercase">
            {getCategoryLabel()}
          </div>

          {/* Product Title */}
          <h3 className="text-base font-bold text-slate-900 group-hover:text-gojapan-600 transition-colors line-clamp-2">
            {language === 'km' ? product.nameKm : product.nameEn}
          </h3>

          {/* Specs: Speed & Data */}
          <div className="py-2.5 px-3 rounded-lg bg-slate-50 border border-slate-100 text-xs space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">{t.speed}:</span>
              <span className="font-semibold text-slate-800">{product.speed}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">{t.quota}:</span>
              <span className="font-semibold text-emerald-700">{product.dataQuota}</span>
            </div>
          </div>

          {/* Description */}
          <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
            {language === 'km' ? product.descriptionKm : product.descriptionEn}
          </p>
        </div>

        {/* Bottom Price & Actions */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col gap-3">
          <div className="flex items-baseline justify-between">
            <span className="text-xs text-slate-500 font-medium">{t.price}</span>
            <div className="text-right">
              <span className="text-xl font-black text-slate-900 tabular-nums">
                ¥{product.priceJPY.toLocaleString()}
              </span>
              <span className="text-xs text-slate-500 font-semibold ml-1">JPY</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onAddToCart(product)}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-slate-600" />
              <span>{t.addToCart}</span>
            </button>

            <button
              onClick={() => onDirectOrder(product)}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold text-white bg-gojapan-500 hover:bg-gojapan-600 rounded-lg shadow-sm hover:shadow transition-colors cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{t.directOrder}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
