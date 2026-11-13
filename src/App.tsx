import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ProductCard } from './components/ProductCard';
import { CartDrawer } from './components/CartDrawer';
import { OrderForm } from './components/OrderForm';
import { OrderTracking } from './components/OrderTracking';
import { AdminDashboard } from './components/AdminDashboard';
import { AppsScriptModal } from './components/AppsScriptModal';
import { FAQSection } from './components/FAQSection';
import { storageService } from './services/storageService';
import { Language, Order, OrderItem, Product, ProductCategory, SiteSettings } from './types';
import { translations } from './utils/translations';
import { Search, Wifi, Smartphone, Globe, Router, CheckCircle, ShieldCheck, Facebook, Youtube } from 'lucide-react';

export default function App() {
  const [language, setLanguage] = useState<Language>(() => {
    storageService.importTelegramSetupFromUrl();
    return 'km';
  });
  const [currentTab, setCurrentTab] = useState<'home' | 'order' | 'tracking' | 'admin'>('home');
  const [products, setProducts] = useState<Product[]>(() => storageService.getProducts());
  const [orders, setOrders] = useState<Order[]>(() => storageService.getOrders());
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(() => storageService.getSiteSettings());
  const [cartItems, setCartItems] = useState<OrderItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [trackingOrderId, setTrackingOrderId] = useState<string>('');
  const [isAppsScriptModalOpen, setIsAppsScriptModalOpen] = useState<boolean>(false);

  // Home Storefront Filters
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'all'>('all');

  const t = translations[language];

  // Refresh products & orders & siteSettings from storage
  const handleProductsUpdated = (updated: Product[]) => {
    setProducts(updated);
  };

  const handleOrdersUpdated = (updated: Order[]) => {
    setOrders(updated);
  };

  const handleSiteSettingsUpdated = (updated: SiteSettings) => {
    storageService.saveSiteSettings(updated);
    setSiteSettings(updated);
  };


  // Cart operations
  const handleAddToCart = (product: Product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.productId === product.id);
      if (existing) {
        return prev.map((item) =>
          item.productId === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
                subtotalJPY: (item.quantity + 1) * item.unitPriceJPY,
              }
            : item
        );
      }
      return [
        ...prev,
        {
          productId: product.id,
          sku: product.sku,
          productName: language === 'km' ? product.nameKm : product.nameEn,
          category: product.category,
          unitPriceJPY: product.priceJPY,
          quantity: 1,
          subtotalJPY: product.priceJPY,
        },
      ];
    });
    setIsCartOpen(true);
  };

  const handleDirectOrder = (product: Product) => {
    setCartItems([
      {
        productId: product.id,
        sku: product.sku,
        productName: language === 'km' ? product.nameKm : product.nameEn,
        category: product.category,
        unitPriceJPY: product.priceJPY,
        quantity: 1,
        subtotalJPY: product.priceJPY,
      },
    ]);
    setCurrentTab('order');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdateCartQuantity = (productId: string, newQty: number) => {
    if (newQty < 1) {
      handleRemoveCartItem(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((it) =>
        it.productId === productId
          ? { ...it, quantity: newQty, subtotalJPY: newQty * it.unitPriceJPY }
          : it
      )
    );
  };

  const handleRemoveCartItem = (productId: string) => {
    setCartItems((prev) => prev.filter((it) => it.productId !== productId));
  };

  const handleProceedFromCartToOrder = () => {
    setIsCartOpen(false);
    setCurrentTab('order');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOrderSubmitted = (newOrder: Order) => {
    setOrders(storageService.getOrders());
    setCartItems([]);
  };

  const handleGoToTracking = (orderId: string) => {
    setTrackingOrderId(orderId);
    setCurrentTab('tracking');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Filter storefront catalog
  const filteredProducts = products.filter((p) => {
    if (!p.isActive) return false;
    const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      p.sku.toLowerCase().includes(q) ||
      p.nameKm.toLowerCase().includes(q) ||
      p.nameEn.toLowerCase().includes(q) ||
      p.descriptionKm.toLowerCase().includes(q) ||
      p.carrier.toLowerCase().includes(q);
    return matchesCat && matchesSearch;
  });

  const cartCount = cartItems.reduce((sum, it) => sum + it.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      
      {/* Primary Top Bar Navigation */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        language={language}
        onToggleLanguage={() => setLanguage(language === 'km' ? 'en' : 'km')}
        cartCount={cartCount}
        onOpenCart={() => setIsCartOpen(true)}
        isAdminLoggedIn={storageService.isAdminLoggedIn()}
        onOpenAppsScriptCode={() => setIsAppsScriptModalOpen(true)}
        siteSettings={siteSettings}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentTab === 'home' && (
          <div className="space-y-12">
            {/* Japanese ISP Hero */}
            <Hero
              language={language}
              onGoToOrder={() => {
                setCurrentTab('order');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onGoToTracking={() => {
                setCurrentTab('tracking');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              siteSettings={siteSettings}
            />

            {/* Catalog Showcase Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
              
              {/* Category Filters and Search Controls */}
              <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
                
                {/* Category Segmented Tabs with mobile swipe support */}
                <div className="flex items-center gap-1.5 overflow-x-auto p-1 bg-slate-200/60 rounded-xl -mx-4 px-4 sm:mx-0 sm:px-1">
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                      selectedCategory === 'all'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {t.catAll}
                  </button>
                  <button
                    onClick={() => setSelectedCategory('pocket_wifi')}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                      selectedCategory === 'pocket_wifi'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {t.catPocketWifi}
                  </button>
                  <button
                    onClick={() => setSelectedCategory('sim_esim')}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                      selectedCategory === 'sim_esim'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {t.catSimEsim}
                  </button>
                  <button
                    onClick={() => setSelectedCategory('fiber_broadband')}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                      selectedCategory === 'fiber_broadband'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {t.catFiber}
                  </button>
                  <button
                    onClick={() => setSelectedCategory('hardware')}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                      selectedCategory === 'hardware'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {t.catHardware}
                  </button>
                </div>

                {/* Search Bar */}
                <div className="relative w-full md:w-72">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t.searchPlaceholder}
                    className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-gojapan-500/20 focus:border-gojapan-500"
                  />
                </div>
              </div>

              {/* Product Grid - mobile 1 col, tablet 2 cols, desktop 3 cols */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {filteredProducts.length === 0 ? (
                  <div className="col-span-full py-16 text-center text-slate-500">
                    <p className="text-sm">No products found matching your search.</p>
                  </div>
                ) : (
                  filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      language={language}
                      onAddToCart={handleAddToCart}
                      onDirectOrder={handleDirectOrder}
                    />
                  ))
                )}
              </div>
            </section>

            {/* Why Choose GoJapan 24hours Section */}
            <section className="bg-slate-100/70 border-t border-b border-slate-200 py-16">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
                <div className="text-center max-w-2xl mx-auto space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-gojapan-600">
                    Direct Tier-1 Telecom
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    {language === 'km'
                      ? 'ហេតុអ្វីជ្រើសរើស GoJapan 24hours?'
                      : 'Why Choose GoJapan 24hours?'}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600">
                    {language === 'km'
                      ? 'បទពិសោធន៍ប្រើប្រាស់អ៊ីនធឺណិតជប៉ុនកម្រិតខ្ពស់ ងាយស្រួល និងរហ័សទាន់ចិត្ត'
                      : 'High-speed Japanese telecom services with seamless Khmer & English assistance.'}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-3">
                    <div className="w-10 h-10 rounded-lg bg-gojapan-50 text-gojapan-600 flex items-center justify-center">
                      <Wifi className="w-5 h-5" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-900">
                      {language === 'km' ? 'ល្បឿនលឿន និងទំហំទិន្នន័យពិត' : 'True Unlimited & 5G Speeds'}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {language === 'km'
                        ? 'ប្រើប្រាស់បណ្តាញផ្លូវការ Docomo និង SoftBank ល្បឿនរហូតដល់ 3.9Gbps មិនកាត់បន្ថយល្បឿនឡើយ។'
                        : 'Official NTT Docomo and SoftBank infrastructure with speeds up to 3.9Gbps and zero throttling.'}
                    </p>
                  </div>

                  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-900">
                      {language === 'km' ? 'ជំនួយបច្ចេកទេសជាភាសាខ្មែរ ២៤/៧' : '24/7 Khmer Technical Care'}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {language === 'km'
                        ? 'ក្រុមការងារប្រចាំការ ២៤ម៉ោង ជួយដោះស្រាយបញ្ហាតភ្ជាប់ តាមដានសេវា និងផ្តល់ព័ត៌មានលម្អិត។'
                        : 'Dedicated 24-hour support team in Khmer and Japanese to assist your setup and inquiries.'}
                    </p>
                  </div>

                  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <CheckCircle className="w-5 h-5" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-900">
                      {language === 'km' ? 'ដឹកជញ្ជូនរហ័ស & ធានាគុណភាព ១០០%' : 'Fast Delivery & 100% Quality'}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {language === 'km'
                        ? 'សេវាដឹកជញ្ជូនរហ័សទូទាំងប្រទេសជប៉ុន ឬទទួលផ្ទាល់នៅព្រលានយន្តហោះ ព្រមទាំងការធានាគុណភាព ១០០%។'
                        : 'Nationwide Japan fast shipping or airport pickup with full 100% genuine service quality guarantee.'}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Frequently Asked Questions (FAQ) Section - Configured by Admin */}
            <FAQSection
              siteSettings={siteSettings}
              language={language}
              onGoToOrder={() => {
                setCurrentTab('order');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          </div>
        )}

        {currentTab === 'order' && (
          <OrderForm
            products={products}
            initialItems={cartItems}
            language={language}
            onOrderSubmitted={handleOrderSubmitted}
            onGoToTracking={handleGoToTracking}
          />
        )}

        {currentTab === 'tracking' && (
          <OrderTracking
            initialOrderId={trackingOrderId}
            language={language}
            onGoToOrder={() => {
              setCurrentTab('order');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentTab === 'admin' && (
          <AdminDashboard
            products={products}
            onProductsUpdated={handleProductsUpdated}
            orders={orders}
            onOrdersUpdated={handleOrdersUpdated}
            language={language}
            onOpenAppsScriptCode={() => setIsAppsScriptModalOpen(true)}
            siteSettings={siteSettings}
            onSiteSettingsUpdated={handleSiteSettingsUpdated}
          />
        )}
      </main>

      {/* Slide-over Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onProceedToOrder={handleProceedFromCartToOrder}
        language={language}
      />

      {/* Google Apps Script Modal */}
      <AppsScriptModal
        isOpen={isAppsScriptModalOpen}
        onClose={() => setIsAppsScriptModalOpen(false)}
        language={language}
      />

      {/* Quiet Clean Footer */}
      <footer className="bg-white border-t border-slate-200 py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-5">
          <div className="flex items-center gap-2.5">
            <img src="./gojapan-logo.jpg" alt="GoJapan" className="w-6 h-6 rounded-md object-cover ring-1 ring-gojapan-200" />
            <span className="font-extrabold text-slate-900 text-sm">
              {siteSettings.siteName}
            </span>
          </div>

          {/* Social Media Links: Facebook, YouTube, LINE - configured by Admin */}
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            <a
              href={siteSettings.facebookUrl || 'https://facebook.com'}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-blue-50/50 text-slate-700 hover:text-[#1877F2] hover:border-[#1877F2]/40 transition-all font-semibold shadow-2xs"
            >
              <Facebook className="w-4 h-4 text-[#1877F2]" />
              <span>Facebook</span>
            </a>

            <a
              href={siteSettings.youtubeUrl || 'https://youtube.com'}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-red-50/50 text-slate-700 hover:text-[#FF0000] hover:border-[#FF0000]/40 transition-all font-semibold shadow-2xs"
            >
              <Youtube className="w-4 h-4 text-[#FF0000]" />
              <span>YouTube</span>
            </a>

            <a
              href={siteSettings.lineUrl || 'https://line.me'}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LINE"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-emerald-50/50 text-slate-700 hover:text-[#06C755] hover:border-[#06C755]/40 transition-all font-semibold shadow-2xs"
            >
              <svg className="w-4 h-4 text-[#06C755] fill-current" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.496.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
              </svg>
              <span>LINE</span>
            </a>
          </div>

          <p className="text-center sm:text-right">© 2026 {siteSettings.siteName}. All rights reserved.</p>
        </div>
      </footer>

    </div>
  );
}
