import React, { useState, useEffect } from 'react';
import {
  Lock,
  LogOut,
  LayoutDashboard,
  Package,
  ShoppingCart,
  FileSpreadsheet,
  Users,
  Search,
  Download,
  Plus,
  Edit2,
  Trash2,
  Eye,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Clock,
  Truck,
  XCircle,
  Code2,
  ExternalLink,
  ShieldAlert,
  Settings,
  Globe,
  Save,
  Copy,
  Check,
  UserPlus,
} from 'lucide-react';
import { storageService } from '../services/storageService';
import { AppsScriptConfig, CustomerRecord, Language, NewsTickerItem, Order, OrderStatus, Product, ProductCategory, SiteSettings } from '../types';
import { translations } from '../utils/translations';

interface AdminDashboardProps {
  products: Product[];
  onProductsUpdated: (products: Product[]) => void;
  orders: Order[];
  onOrdersUpdated: (orders: Order[]) => void;
  language: Language;
  onOpenAppsScriptCode: () => void;
  siteSettings?: SiteSettings;
  onSiteSettingsUpdated?: (settings: SiteSettings) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  products,
  onProductsUpdated,
  orders,
  onOrdersUpdated,
  language,
  onOpenAppsScriptCode,
  siteSettings,
  onSiteSettingsUpdated,
}) => {
  const t = translations[language];

  // Auth state
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => storageService.isAdminLoggedIn());
  const [username, setUsername] = useState<string>('admin');
  const [password, setPassword] = useState<string>('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [sessionTimeoutAlert, setSessionTimeoutAlert] = useState<string | null>(null);
  const [remainingSeconds, setRemainingSeconds] = useState<number>(() =>
    storageService.getAdminSessionRemainingSeconds()
  );

  // 1-minute inactivity countdown effect
  useEffect(() => {
    if (!isLoggedIn) return;

    const interval = setInterval(() => {
      const sec = storageService.getAdminSessionRemainingSeconds();
      setRemainingSeconds(sec);

      if (sec <= 0) {
        storageService.logoutAdmin();
        setIsLoggedIn(false);
        setSessionTimeoutAlert(
          language === 'km'
            ? 'លោកអ្នកត្រូវបានចាកចេញពីប្រព័ន្ធដោយស្វ័យប្រវត្ត ដោយសារមិនមានសកម្មភាពលើសពី ១នាទី (Inactivity auto-logout)។ ប្រសិនបើមានសកម្មភាព វានឹងរក្សាការ Login ជានិច្ច។'
            : 'You have been automatically logged out due to 1 minute of inactivity. Any user activity keeps you logged in.'
        );
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isLoggedIn, language]);

  // Touch session manually or programmatically
  const handleTouchSession = () => {
    storageService.touchAdminSession();
    setRemainingSeconds(60);
  };

  // User activity tracker: resets the 1-minute inactivity timer whenever the admin performs ANY action
  useEffect(() => {
    if (!isLoggedIn) return;

    let lastActivityTimestamp = Date.now();

    const handleUserActivity = () => {
      const now = Date.now();
      // Throttle writes to storageService to once every 800ms to avoid unnecessary sessionStorage overhead
      if (now - lastActivityTimestamp >= 800) {
        lastActivityTimestamp = now;
        storageService.touchAdminSession();
        setRemainingSeconds(60);
      }
    };

    // Listen to all user interaction events across the entire window
    const activityEvents: (keyof WindowEventMap)[] = [
      'mousemove',
      'mousedown',
      'keydown',
      'keyup',
      'input',
      'change',
      'focus',
      'scroll',
      'wheel',
      'touchstart',
      'touchmove',
      'click',
    ];

    activityEvents.forEach((evt) => {
      window.addEventListener(evt, handleUserActivity, { passive: true, capture: true });
    });

    return () => {
      activityEvents.forEach((evt) => {
        window.removeEventListener(evt, handleUserActivity, { capture: true });
      });
    };
  }, [isLoggedIn]);

  // Active navigation tab within admin
  const [adminTab, setAdminTab] = useState<'overview' | 'orders' | 'products' | 'customers' | 'sheets' | 'settings'>('overview');

  // Order Filters
  const [orderSearchQuery, setOrderSearchQuery] = useState<string>('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [orderTypeFilter, setOrderTypeFilter] = useState<string>('all');
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<Order | null>(null);

  // Order Modal (Add / Edit) - Full Admin Permission
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState<boolean>(false);
  const [isNewOrder, setIsNewOrder] = useState<boolean>(false);
  const [selectedProductToAdd, setSelectedProductToAdd] = useState<string>('');
  const [customStatusNote, setCustomStatusNote] = useState<string>('');

  // Product Modal (Add / Edit)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState<boolean>(false);

  // Customer Modal (Add / Edit) - Full Admin Permission
  const [editingCustomer, setEditingCustomer] = useState<CustomerRecord | null>(null);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState<boolean>(false);
  const [isNewCustomer, setIsNewCustomer] = useState<boolean>(false);

  // Web App Site Settings state - Full Admin Permission
  const [currentSiteSettings, setCurrentSiteSettings] = useState<SiteSettings>(() => siteSettings || storageService.getSiteSettings());
  const [isSettingsDirty, setIsSettingsDirty] = useState<boolean>(false);
  const [settingsSavedToast, setSettingsSavedToast] = useState<string | null>(null);

  useEffect(() => {
    if (siteSettings && !isSettingsDirty) {
      setCurrentSiteSettings(siteSettings);
    }
  }, [siteSettings, isSettingsDirty]);

  // Apps Script Settings state
  const [appsScriptConfig, setAppsScriptConfig] = useState<AppsScriptConfig>(() => storageService.getAppsScriptConfig());
  const [inputUrl, setInputUrl] = useState<string>(appsScriptConfig.webAppUrl || '');
  const [isTestingConnection, setIsTestingConnection] = useState<boolean>(false);
  const [isSyncingOrders, setIsSyncingOrders] = useState<boolean>(false);
  const [connectionResult, setConnectionResult] = useState<{ success: boolean; message: string } | null>(null);

  // Customers
  const [customers, setCustomers] = useState<CustomerRecord[]>(() => storageService.getCustomers());

  // Polling & manual refresh state
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isAutoPolling, setIsAutoPolling] = useState<boolean>(true);
  const [lastRefreshedAt, setLastRefreshedAt] = useState<Date>(() => new Date());

  // Manual re-fetch of orders and products from storageService
  const handleRefreshData = () => {
    setIsRefreshing(true);
    const freshOrders = storageService.getOrders();
    const freshProducts = storageService.getProducts();
    const freshCustomers = storageService.getCustomers();
    const freshConfig = storageService.getAppsScriptConfig();

    onOrdersUpdated(freshOrders);
    onProductsUpdated(freshProducts);
    setCustomers(freshCustomers);
    setAppsScriptConfig(freshConfig);
    setLastRefreshedAt(new Date());

    setTimeout(() => {
      setIsRefreshing(false);
    }, 450);
  };

  // Background polling to automatically keep orders & products view up-to-date without page reload
  useEffect(() => {
    if (!isLoggedIn || !isAutoPolling) return;
    const interval = setInterval(() => {
      const freshOrders = storageService.getOrders();
      const freshProducts = storageService.getProducts();
      const freshCustomers = storageService.getCustomers();
      onOrdersUpdated(freshOrders);
      onProductsUpdated(freshProducts);
      setCustomers(freshCustomers);
      setLastRefreshedAt(new Date());
    }, 12000); // 12-second polling interval

    return () => clearInterval(interval);
  }, [isLoggedIn, isAutoPolling, onOrdersUpdated, onProductsUpdated]);

  // LOGIN HANDLER
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    const ok = storageService.loginAdmin(username, password);
    if (ok) {
      setIsLoggedIn(true);
      setPassword('');
      setSessionTimeoutAlert(null);
      setRemainingSeconds(60);
      setCustomers(storageService.getCustomers());
    } else {
      setLoginError(
        language === 'km'
          ? 'ឈ្មោះគណនី ឬពាក្យសម្ងាត់មិនត្រឹមត្រូវ (Default: admin / gojapan2026)'
          : 'Invalid credentials. Use admin / gojapan2026'
      );
    }
  };

  const handleLogout = () => {
    storageService.logoutAdmin();
    setIsLoggedIn(false);
    setSessionTimeoutAlert(null);
  };

  // ORDER ACTIONS - FULL ADMIN PERMISSIONS
  const handleUpdateStatus = async (orderId: string, newStatus: OrderStatus) => {
    await storageService.updateOrderStatus(orderId, newStatus);
    const updated = storageService.getOrders();
    onOrdersUpdated(updated);
    if (selectedOrderDetails && selectedOrderDetails.id === orderId) {
      setSelectedOrderDetails({ ...selectedOrderDetails, status: newStatus });
    }
  };

  const handleDeleteOrder = (orderId: string) => {
    if (window.confirm(language === 'km' ? 'តើអ្នកប្រាកដជាចង់លុបការកម្មង់នេះមែនទេ?' : 'Delete this order?')) {
      storageService.deleteOrder(orderId);
      const updated = storageService.getOrders();
      onOrdersUpdated(updated);
      setSelectedOrderDetails(null);
    }
  };

  const handleOpenCreateOrder = () => {
    setIsNewOrder(true);
    setCustomStatusNote('');
    const defaultProduct = products[0];
    const initialItem = defaultProduct ? [{
      productId: defaultProduct.id,
      sku: defaultProduct.sku,
      productName: language === 'km' ? defaultProduct.nameKm : defaultProduct.nameEn,
      category: defaultProduct.category,
      unitPriceJPY: defaultProduct.priceJPY,
      quantity: 1,
      subtotalJPY: defaultProduct.priceJPY,
    }] : [];

    setEditingOrder({
      id: `GJ-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString(),
      customerType: 'customer',
      customerName: '',
      phoneNumber: '',
      telegram: '',
      provinceCity: 'រាជធានីភ្នំពេញ (Phnom Penh)',
      districtKhan: '',
      communeSangkat: '',
      village: '',
      streetAddress: '',
      items: initialItem,
      subtotalJPY: defaultProduct ? defaultProduct.priceJPY : 0,
      shippingJPY: 500,
      totalJPY: (defaultProduct ? defaultProduct.priceJPY : 0) + 500,
      status: 'new',
      remarks: '',
      syncedToGoogleSheets: false,
    });
    setIsOrderModalOpen(true);
  };

  const handleOpenEditOrder = (order: Order) => {
    setIsNewOrder(false);
    setCustomStatusNote('');
    setEditingOrder(JSON.parse(JSON.stringify(order)));
    setIsOrderModalOpen(true);
  };

  const handleSaveOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOrder) return;

    let orderToSave = { ...editingOrder };
    if (customStatusNote.trim()) {
      const historyItem = {
        status: orderToSave.status,
        timestamp: new Date().toISOString(),
        noteKm: customStatusNote.trim(),
        noteEn: customStatusNote.trim(),
      };
      orderToSave.statusHistory = [...(orderToSave.statusHistory || []), historyItem];
    }

    handleTouchSession();
    const saved = isNewOrder
      ? storageService.createOrder(orderToSave)
      : storageService.updateOrder(orderToSave);

    const freshOrders = storageService.getOrders();
    onOrdersUpdated(freshOrders);
    setCustomers(storageService.getCustomers());
    setIsOrderModalOpen(false);
    setEditingOrder(null);
    if (selectedOrderDetails && selectedOrderDetails.id === saved.id) {
      setSelectedOrderDetails(saved);
    }
    setSettingsSavedToast(
      language === 'km'
        ? `✅ បានរក្សាទុកការកម្មង់លេខ «${saved.id}» ដោយជោគជ័យ!`
        : `✅ Order ${saved.id} saved successfully!`
    );
    setTimeout(() => setSettingsSavedToast(null), 3500);
  };

  const handleAddItemToEditingOrder = (productId: string) => {
    if (!editingOrder) return;
    const prod = products.find((p) => p.id === productId);
    if (!prod) return;

    const existingIdx = editingOrder.items.findIndex((it) => it.productId === productId);
    let updatedItems = [...editingOrder.items];

    if (existingIdx >= 0) {
      updatedItems[existingIdx] = {
        ...updatedItems[existingIdx],
        quantity: updatedItems[existingIdx].quantity + 1,
        subtotalJPY: (updatedItems[existingIdx].quantity + 1) * updatedItems[existingIdx].unitPriceJPY,
      };
    } else {
      updatedItems.push({
        productId: prod.id,
        sku: prod.sku,
        productName: language === 'km' ? prod.nameKm : prod.nameEn,
        category: prod.category,
        unitPriceJPY: prod.priceJPY,
        quantity: 1,
        subtotalJPY: prod.priceJPY,
      });
    }

    const subtotal = updatedItems.reduce((sum, it) => sum + it.subtotalJPY, 0);
    setEditingOrder({
      ...editingOrder,
      items: updatedItems,
      subtotalJPY: subtotal,
      totalJPY: subtotal + (editingOrder.shippingJPY || 0),
    });
    setSelectedProductToAdd('');
  };

  const handleRemoveItemFromEditingOrder = (index: number) => {
    if (!editingOrder) return;
    const updatedItems = editingOrder.items.filter((_, i) => i !== index);
    const subtotal = updatedItems.reduce((sum, it) => sum + it.subtotalJPY, 0);
    setEditingOrder({
      ...editingOrder,
      items: updatedItems,
      subtotalJPY: subtotal,
      totalJPY: subtotal + (editingOrder.shippingJPY || 0),
    });
  };

  const handleUpdateItemQuantityInEditingOrder = (index: number, quantity: number) => {
    if (!editingOrder) return;
    if (quantity <= 0) {
      handleRemoveItemFromEditingOrder(index);
      return;
    }
    const updatedItems = [...editingOrder.items];
    updatedItems[index] = {
      ...updatedItems[index],
      quantity,
      subtotalJPY: quantity * updatedItems[index].unitPriceJPY,
    };
    const subtotal = updatedItems.reduce((sum, it) => sum + it.subtotalJPY, 0);
    setEditingOrder({
      ...editingOrder,
      items: updatedItems,
      subtotalJPY: subtotal,
      totalJPY: subtotal + (editingOrder.shippingJPY || 0),
    });
  };

  // CUSTOMER ACTIONS - FULL ADMIN PERMISSIONS
  const handleOpenCreateCustomer = () => {
    setIsNewCustomer(true);
    setEditingCustomer({
      phoneNumber: '',
      customerName: '',
      customerType: 'customer',
      telegram: '',
      provinceCity: 'រាជធានីភ្នំពេញ (Phnom Penh)',
      totalOrders: 1,
      totalSpentJPY: 0,
      lastOrderDate: new Date().toISOString(),
    });
    setIsCustomerModalOpen(true);
  };

  const handleOpenEditCustomer = (customer: CustomerRecord) => {
    setIsNewCustomer(false);
    setEditingCustomer({ ...customer });
    setIsCustomerModalOpen(true);
  };

  const handleSaveCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCustomer || !editingCustomer.phoneNumber.trim()) return;
    handleTouchSession();
    storageService.saveCustomer(editingCustomer);
    setCustomers(storageService.getCustomers());
    setIsCustomerModalOpen(false);
    setEditingCustomer(null);
    setSettingsSavedToast(
      language === 'km'
        ? `✅ បានរក្សាទុកព័ត៌មានអតិថិជន «${editingCustomer.customerName}» ដោយជោគជ័យ!`
        : `✅ Customer ${editingCustomer.customerName} saved successfully!`
    );
    setTimeout(() => setSettingsSavedToast(null), 3500);
  };

  const handleDeleteCustomer = (phone: string) => {
    if (window.confirm(language === 'km' ? 'តើអ្នកប្រាកដជាចង់លុបទិន្នន័យអតិថិជននេះមែនទេ?' : 'Delete this customer record?')) {
      storageService.deleteCustomer(phone);
      setCustomers(storageService.getCustomers());
    }
  };

  // WEB APP SETTINGS ACTIONS - FULL ADMIN PERMISSION
  const handleSaveSiteSettings = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    handleTouchSession();
    const saved = storageService.saveSiteSettings(currentSiteSettings);
    setCurrentSiteSettings(saved);
    setIsSettingsDirty(false);
    if (onSiteSettingsUpdated) {
      onSiteSettingsUpdated(saved);
    }
    setSettingsSavedToast(
      language === 'km'
        ? '✅ បានរក្សាទុកព័ត៌មានគេហទំព័រដោយជោគជ័យ! (ព័ត៌មានត្រូវបានកែប្រែភ្លាមៗ)'
        : '✅ Web application settings updated & saved successfully!'
    );
    setTimeout(() => setSettingsSavedToast(null), 4000);
  };

  const handleAddNewsItem = () => {
    handleTouchSession();
    const newItem: NewsTickerItem = {
      id: `news-${Date.now()}`,
      km: 'ព័ត៌មានថ្មី...',
      en: 'New announcement...',
      tagKm: 'ពិសេស',
      tagEn: 'NEW',
    };
    const updatedList = [...(currentSiteSettings.announcementsList || []), newItem];
    const updated = {
      ...currentSiteSettings,
      announcementsList: updatedList,
      announcementKm: updatedList[0]?.km || currentSiteSettings.announcementKm,
      announcementEn: updatedList[0]?.en || currentSiteSettings.announcementEn,
    };
    setCurrentSiteSettings(updated);
    setIsSettingsDirty(true);
  };

  const handleUpdateNewsItem = (index: number, field: keyof NewsTickerItem, value: string) => {
    handleTouchSession();
    const list = [...(currentSiteSettings.announcementsList || [])];
    if (!list[index]) return;
    list[index] = { ...list[index], [field]: value };
    const updated = {
      ...currentSiteSettings,
      announcementsList: list,
      announcementKm: list[0]?.km || currentSiteSettings.announcementKm,
      announcementEn: list[0]?.en || currentSiteSettings.announcementEn,
    };
    setCurrentSiteSettings(updated);
    setIsSettingsDirty(true);
  };

  const handleDeleteNewsItem = (index: number) => {
    handleTouchSession();
    const list = (currentSiteSettings.announcementsList || []).filter((_, i) => i !== index);
    const updated = {
      ...currentSiteSettings,
      announcementsList: list,
      announcementKm: list[0]?.km || '',
      announcementEn: list[0]?.en || '',
    };
    setCurrentSiteSettings(updated);
    setIsSettingsDirty(true);
  };

  const handleResetSiteSettings = () => {
    if (window.confirm(language === 'km' ? 'កំណត់ព័ត៌មានគេហទំព័រទៅលំនាំដើម?' : 'Reset website settings to defaults?')) {
      const res = storageService.resetSiteSettings();
      setCurrentSiteSettings(res);
      setIsSettingsDirty(false);
      if (onSiteSettingsUpdated) {
        onSiteSettingsUpdated(res);
      }
      setSettingsSavedToast(
        language === 'km' ? 'បានកំណត់ទៅលំនាំដើមរួចរាល់!' : 'Reset to default settings!'
      );
      setTimeout(() => setSettingsSavedToast(null), 3000);
    }
  };

  // PRODUCT ACTIONS
  const handleOpenAddProduct = () => {
    setEditingProduct({
      id: `prod-${Date.now().toString().slice(-4)}`,
      sku: 'GJ-NEW-ITEM',
      nameKm: '',
      nameEn: '',
      category: 'pocket_wifi',
      priceJPY: 3000,
      speed: '5G High Speed',
      dataQuota: 'Unlimited Data',
      carrier: 'Docomo',
      descriptionKm: '',
      descriptionEn: '',
      isActive: true,
      isRental: false,
    });
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    handleTouchSession();
    storageService.saveProduct(editingProduct);
    const updated = storageService.getProducts();
    onProductsUpdated(updated);
    setIsProductModalOpen(false);
    setSettingsSavedToast(
      language === 'km'
        ? `✅ បានរក្សាទុកផលិតផល «${editingProduct.nameKm || editingProduct.sku}» ដោយជោគជ័យ!`
        : `✅ Product ${editingProduct.sku} saved successfully!`
    );
    setTimeout(() => setSettingsSavedToast(null), 3500);
    setEditingProduct(null);
  };

  const handleDeleteProduct = (id: string) => {
    if (window.confirm(language === 'km' ? 'តើអ្នកចង់លុបផលិតផលនេះមែនទេ?' : 'Delete this product?')) {
      storageService.deleteProduct(id);
      onProductsUpdated(storageService.getProducts());
    }
  };

  const handleToggleProductActive = (prod: Product) => {
    const updated = { ...prod, isActive: !prod.isActive };
    storageService.saveProduct(updated);
    onProductsUpdated(storageService.getProducts());
  };

  const handleDuplicateProduct = (prod: Product) => {
    const clone: Product = {
      ...prod,
      id: `prod-${Date.now().toString().slice(-4)}`,
      sku: `${prod.sku}-COPY`,
      nameKm: `${prod.nameKm} (ចម្លង)`,
      nameEn: `${prod.nameEn} (Copy)`,
    };
    storageService.saveProduct(clone);
    onProductsUpdated(storageService.getProducts());
  };

  // GOOGLE APPS SCRIPT ACTIONS
  const handleSaveAppsScriptUrl = () => {
    const updated: AppsScriptConfig = {
      ...appsScriptConfig,
      webAppUrl: inputUrl.trim(),
    };
    storageService.saveAppsScriptConfig(updated);
    setAppsScriptConfig(updated);
    setConnectionResult({
      success: true,
      message: language === 'km' ? 'បានរក្សាទុក URL រួចរាល់' : 'URL saved successfully',
    });
  };

  const handleTestConnection = async () => {
    setIsTestingConnection(true);
    setConnectionResult(null);
    const result = await storageService.testAppsScriptConnection(inputUrl.trim());
    setIsTestingConnection(false);
    setConnectionResult(result);
    if (result.success) {
      const updated: AppsScriptConfig = {
        webAppUrl: inputUrl.trim(),
        isConnected: true,
        lastSyncedAt: new Date().toISOString(),
        lastStatus: 'Connected',
      };
      storageService.saveAppsScriptConfig(updated);
      setAppsScriptConfig(updated);
    }
  };

  const handleSyncPendingOrders = async () => {
    setIsSyncingOrders(true);
    const res = await storageService.syncPendingOrdersToGoogleSheets();
    setIsSyncingOrders(false);
    setConnectionResult({
      success: res.failedCount === 0,
      message: res.message,
    });
    onOrdersUpdated(storageService.getOrders());
    setAppsScriptConfig(storageService.getAppsScriptConfig());
  };

  // FILTERED ORDERS
  const filteredOrders = orders.filter((o) => {
    const q = orderSearchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      o.id.toLowerCase().includes(q) ||
      o.customerName.toLowerCase().includes(q) ||
      o.phoneNumber.includes(q);

    const matchesStatus = orderStatusFilter === 'all' || o.status === orderStatusFilter;
    const matchesType = orderTypeFilter === 'all' || o.customerType === orderTypeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  // KPI STATS
  const totalOrdersCount = orders.length;
  const newOrdersCount = orders.filter((o) => o.status === 'new').length;
  const processingOrdersCount = orders.filter((o) => o.status === 'processing').length;
  const completedOrdersCount = orders.filter((o) => o.status === 'completed').length;
  const totalRevenueJPY = orders.reduce((sum, o) => (o.status !== 'cancelled' ? sum + o.totalJPY : sum), 0);
  const customerCount = customers.filter((c) => c.customerType === 'customer').length;
  const agentCount = customers.filter((c) => c.customerType === 'agent').length;

  // LOGIN SCREEN
  if (!isLoggedIn) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 shadow-xl p-8 space-y-6">
          <div className="text-center space-y-2">
            <img src="./gojapan-logo.jpg" alt="GoJapan Logo" className="w-16 h-16 rounded-2xl mx-auto shadow-md ring-2 ring-gojapan-200 object-cover" />
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              {t.adminLoginTitle}
            </h2>
            <p className="text-xs text-slate-500">
              {language === 'km'
                ? 'ចូលកាន់ផ្ទាំងគ្រប់គ្រងការកម្មង់ និង Google Sheets'
                : 'Manage products, orders, and Google Sheets sync'}
            </p>
          </div>

          {sessionTimeoutAlert && (
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5 animate-in fade-in">
              <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold">
                  {language === 'km' ? 'វគ្គប្រើប្រាស់ផុតកំណត់ (Session Timeout)' : 'Session Expired'}
                </strong>
                <span className="mt-0.5 block leading-relaxed">{sessionTimeoutAlert}</span>
              </div>
            </div>
          )}

          {loginError && (
            <div className="p-3 rounded-lg bg-gojapan-50 border border-gojapan-200 text-xs text-gojapan-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t.adminUsername}
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-gojapan-500/20 focus:border-gojapan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t.adminPassword}
              </label>
              <input
                type="password"
                required
                value={password}
                placeholder="gojapan2026"
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-gojapan-500/20 focus:border-gojapan-500"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Default Credentials: <strong>admin</strong> / <strong>gojapan2026</strong>
              </span>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 text-xs font-bold text-white bg-gojapan-500 hover:bg-gojapan-600 shadow-sm shadow-gojapan-500/20 rounded-lg shadow transition-colors cursor-pointer"
            >
              {t.loginBtn}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // LOGGED IN DASHBOARD
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Admin Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2"><img src="./gojapan-logo.jpg" alt="GoJapan" className="w-5 h-5 rounded-md object-cover ring-1 ring-gojapan-200" /><span className="text-xs font-bold uppercase tracking-wider text-gojapan-600">Admin Console</span></div>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span className="text-xs text-slate-500">GoJapan 24hours Production System</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {language === 'km' ? 'ផ្ទាំងគ្រប់គ្រងប្រព័ន្ធ (Admin Dashboard)' : 'Operations Dashboard'}
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Manual Re-fetch Refresh Button & Polling Indicator */}
          <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg p-1 text-xs shadow-2xs">
            <button
              type="button"
              onClick={handleRefreshData}
              disabled={isRefreshing}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:text-gojapan-700 hover:bg-gojapan-50 rounded-md transition-colors cursor-pointer disabled:opacity-50"
              title={
                language === 'km'
                  ? 'ផ្ទុកទិន្នន័យការកម្មង់ និងផលិតផលឡើងវិញពី storageService'
                  : 'Re-fetch orders and products from storageService without reloading page'
              }
            >
              <RefreshCw className={`w-3.5 h-3.5 text-gojapan-600 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>{language === 'km' ? 'ផ្ទុកទិន្នន័យ' : 'Refresh'}</span>
            </button>
            <span className="h-3.5 w-px bg-slate-200" aria-hidden="true"></span>
            <button
              type="button"
              onClick={() => setIsAutoPolling(prev => !prev)}
              className={`inline-flex items-center gap-1 px-2 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                isAutoPolling ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
              }`}
              title={
                isAutoPolling
                  ? (language === 'km' ? 'កំពុងបើកដំណើរការ Auto Polling រៀងរាល់ ១២ វិនាទី (ចុចដើម្បីផ្អាក)' : 'Auto-polling active (12s interval). Click to pause.')
                  : (language === 'km' ? 'បានផ្អាក Auto Polling (ចុចដើម្បីបើក)' : 'Auto-polling paused. Click to resume.')
              }
            >
              <span className={`w-1.5 h-1.5 rounded-full ${isAutoPolling ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
              <span>{isAutoPolling ? 'Auto: 12s' : 'Paused'}</span>
            </button>
            <span className="hidden md:inline text-[10px] text-slate-400 px-1 font-mono">
              {lastRefreshedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </span>
          </div>

          {/* 1-Minute Inactivity Auto-Timeout Countdown */}
          <div
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg border text-xs font-mono font-bold transition-colors ${
              remainingSeconds <= 15
                ? 'bg-rose-50 text-rose-700 border-rose-300 animate-pulse'
                : remainingSeconds <= 30
                ? 'bg-amber-50 text-amber-700 border-amber-300'
                : 'bg-emerald-50 text-emerald-700 border-emerald-300'
            }`}
            title={
              language === 'km'
                ? 'ប្រព័ន្ធនឹងចាកចេញដោយស្វ័យប្រវត្តិ ប្រសិនបើគ្មានសកម្មភាពលើសពី ១នាទី (រាប់ឡើងវិញពេលមានសកម្មភាព)'
                : 'Auto-logout occurs after 1 minute of inactivity. Any click, keypress, or mouse action resets the timer.'
            }
          >
            <Clock className="w-3.5 h-3.5 shrink-0" />
            <span>
              {language === 'km' ? 'ពេលអសកម្ម:' : 'Idle:'}{' '}
              {String(Math.floor(remainingSeconds / 60)).padStart(2, '0')}:
              {String(remainingSeconds % 60).padStart(2, '0')}
            </span>
          </div>

          {/* Quick Reset / Extend Inactivity Timer */}
          <button
            type="button"
            onClick={handleTouchSession}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors cursor-pointer"
            title={language === 'km' ? 'រាប់ឡើងវិញ ១នាទី (+1 min)' : 'Reset inactivity timer (+1 min)'}
          >
            <RefreshCw className="w-3 h-3 text-slate-500" />
            <span className="hidden sm:inline">{language === 'km' ? '+១នាទី' : '+1 min'}</span>
          </button>

          {/* Quick Google Sheets status */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-xs">
            <div className={`w-2 h-2 rounded-full ${appsScriptConfig.isConnected ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
            <span className="text-slate-700 font-medium">
              {appsScriptConfig.isConnected ? 'Google Sheets Active' : 'Sheets Unlinked'}
            </span>
          </div>

          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-gojapan-700 bg-white hover:bg-gojapan-50 border border-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{t.logoutBtn}</span>
          </button>
        </div>
      </div>

      {/* Internal Navigation Tabs with mobile horizontal scroll */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 -mx-4 px-4 sm:mx-0 sm:px-0">
        <button
          onClick={() => setAdminTab('overview')}
          className={`flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
            adminTab === 'overview'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>{language === 'km' ? 'ទិដ្ឋភាពទូទៅ' : 'Overview KPIs'}</span>
        </button>

        <button
          onClick={() => setAdminTab('orders')}
          className={`flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
            adminTab === 'orders'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <ShoppingCart className="w-4 h-4" />
          <span>
            {language === 'km' ? 'គ្រប់គ្រងការកម្មង់' : 'Order Management'} ({orders.length})
          </span>
        </button>

        <button
          onClick={() => setAdminTab('products')}
          className={`flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
            adminTab === 'products'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>
            {language === 'km' ? 'គ្រប់គ្រងផលិតផល' : 'Product Catalog'} ({products.length})
          </span>
        </button>

        <button
          onClick={() => setAdminTab('customers')}
          className={`flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
            adminTab === 'customers'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>{language === 'km' ? 'អតិថិជន & ភ្នាក់ងារ' : 'Customers & Agents'}</span>
        </button>

        <button
          onClick={() => setAdminTab('sheets')}
          className={`flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
            adminTab === 'sheets'
              ? 'bg-gojapan-500 text-white shadow-xs'
              : 'text-gojapan-700 bg-gojapan-50 hover:bg-gojapan-100'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Google Sheets Sync</span>
        </button>

        <button
          onClick={() => setAdminTab('settings')}
          className={`flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
            adminTab === 'settings'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>{language === 'km' ? 'ព័ត៌មានគេហទំព័រ (Settings)' : 'Site & Web App'}</span>
        </button>
      </div>

      {/* TAB 1: OVERVIEW KPIS */}
      {adminTab === 'overview' && (
        <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
          {/* Top KPI Cards - fully responsive */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-xs space-y-1">
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Revenue</span>
              <p className="text-xl sm:text-2xl font-black text-slate-900 tabular-nums font-mono">
                ¥{totalRevenueJPY.toLocaleString()} <span className="text-xs font-normal text-slate-400">JPY</span>
              </p>
              <span className="text-[11px] text-emerald-600 font-semibold">Active Orders Revenue</span>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-1">
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Orders</span>
              <p className="text-2xl font-black text-slate-900 tabular-nums font-mono">{totalOrdersCount}</p>
              <div className="flex items-center gap-2 text-[11px] text-slate-500">
                <span className="text-amber-600 font-bold">{newOrdersCount} New</span>
                <span>·</span>
                <span className="text-emerald-600 font-bold">{completedOrdersCount} Done</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-1">
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Products & Plans</span>
              <p className="text-2xl font-black text-slate-900 tabular-nums font-mono">{products.length}</p>
              <span className="text-[11px] text-slate-500">
                {products.filter((p) => p.isActive).length} Active in catalog
              </span>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-1">
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Customers & Agents</span>
              <p className="text-2xl font-black text-slate-900 tabular-nums font-mono">
                {customerCount + agentCount}
              </p>
              <div className="flex items-center gap-2 text-[11px] text-slate-500">
                <span>{customerCount} Customers</span>
                <span>·</span>
                <span className="text-gojapan-600 font-bold">{agentCount} Agents</span>
              </div>
            </div>
          </div>

          {/* Status Breakdown Grid */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              {language === 'km' ? 'ស្ថិតិស្ថានភាពការកម្មង់' : 'Order Status Breakdown'}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {[
                { label: t.statusNew, count: newOrdersCount, color: 'text-amber-600 bg-amber-50 border-amber-200' },
                { label: t.statusConfirmed, count: orders.filter((o) => o.status === 'confirmed').length, color: 'text-blue-600 bg-blue-50 border-blue-200' },
                { label: t.statusProcessing, count: processingOrdersCount, color: 'text-indigo-600 bg-indigo-50 border-indigo-200' },
                { label: t.statusShipping, count: orders.filter((o) => o.status === 'shipping').length, color: 'text-purple-600 bg-purple-50 border-purple-200' },
                { label: t.statusCompleted, count: completedOrdersCount, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
                { label: t.statusCancelled, count: orders.filter((o) => o.status === 'cancelled').length, color: 'text-rose-600 bg-rose-50 border-rose-200' },
              ].map((s, i) => (
                <div key={i} className={`p-3 rounded-lg border ${s.color}`}>
                  <span className="text-[11px] font-bold block truncate">{s.label}</span>
                  <span className="text-xl font-extrabold font-mono tabular-nums">{s.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => storageService.exportOrdersToCSV()}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Export All Orders (CSV)</span>
            </button>

            <button
              onClick={() => setAdminTab('sheets')}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-gojapan-700 bg-gojapan-50 hover:bg-gojapan-100 border border-gojapan-200 rounded-lg transition-colors cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Configure Google Sheets API</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: ORDER MANAGEMENT */}
      {adminTab === 'orders' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Controls: Search, Filters, CSV */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            <div className="flex-1 flex flex-wrap items-center gap-2">
              {/* Search */}
              <div className="relative flex-1 min-w-[200px]">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={orderSearchQuery}
                  onChange={(e) => setOrderSearchQuery(e.target.value)}
                  placeholder="Search Order ID, Name, Phone..."
                  className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
                />
              </div>

              {/* Status Filter */}
              <select
                value={orderStatusFilter}
                onChange={(e) => setOrderStatusFilter(e.target.value)}
                className="px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
              >
                <option value="all">All Statuses</option>
                <option value="new">New</option>
                <option value="confirmed">Confirmed</option>
                <option value="processing">Processing</option>
                <option value="shipping">Shipping</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>

              {/* Type Filter */}
              <select
                value={orderTypeFilter}
                onChange={(e) => setOrderTypeFilter(e.target.value)}
                className="px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
              >
                <option value="all">All Customer Types</option>
                <option value="customer">Customer Only</option>
                <option value="agent">Agent Only</option>
              </select>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleOpenCreateOrder}
                className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-gojapan-500 hover:bg-gojapan-600 shadow-sm shadow-gojapan-500/20 rounded-lg transition-colors cursor-pointer"
                title={language === 'km' ? 'បង្កើតការកម្មង់ថ្មីដោយផ្ទាល់' : 'Create new order'}
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{language === 'km' ? '+ បង្កើតការកម្មង់' : '+ Create Order'}</span>
              </button>

              <button
                type="button"
                onClick={handleRefreshData}
                disabled={isRefreshing}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                title={language === 'km' ? 'ផ្ទុកទិន្នន័យការកម្មង់ឡើងវិញ' : 'Refresh order data'}
              >
                <RefreshCw className={`w-3.5 h-3.5 text-gojapan-600 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span>{language === 'km' ? 'ផ្ទុកទិន្នន័យ' : 'Refresh'}</span>
              </button>

              <button
                onClick={() => storageService.exportOrdersToCSV()}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg transition-colors cursor-pointer shrink-0"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV / Excel</span>
              </button>
            </div>
          </div>

          {/* Orders Data Table */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                    <th className="py-3 px-4">Order ID</th>
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Phone</th>
                    <th className="py-3 px-4">Destination</th>
                    <th className="py-3 px-4">Items</th>
                    <th className="py-3 px-4 text-right">Total (JPY)</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-center">Sheets Sync</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-12 text-center text-slate-500">
                        No orders match your filter criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((o) => (
                      <tr key={o.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-gojapan-600">
                          {o.id}
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-semibold text-slate-900">{o.customerName}</div>
                          {o.customerType === 'agent' && (
                            <span className="text-[10px] text-gojapan-600 font-bold">
                              Agent: {o.agentId || 'Verified'}
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-600">{o.phoneNumber}</td>
                        <td className="py-3 px-4 text-slate-700 max-w-[160px] truncate" title={o.provinceCity}>
                          {o.provinceCity}
                        </td>
                        <td className="py-3 px-4 text-slate-600">
                          {o.items.length} item{o.items.length > 1 ? 's' : ''}
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-slate-900 text-right tabular-nums">
                          ¥{o.totalJPY.toLocaleString()}
                        </td>
                        <td className="py-3 px-4">
                          <select
                            value={o.status}
                            onChange={(e) => handleUpdateStatus(o.id, e.target.value as OrderStatus)}
                            className="text-xs px-2 py-1 rounded border border-slate-300 bg-white font-medium focus:ring-1 focus:ring-gojapan-500"
                          >
                            <option value="new">New</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="processing">Processing</option>
                            <option value="shipping">Shipping</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td className="py-3 px-4 text-center">
                          {o.syncedToGoogleSheets ? (
                            <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              Synced
                            </span>
                          ) : (
                            <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                              Local Buffer
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right space-x-2">
                          <button
                            onClick={() => handleOpenEditOrder(o)}
                            className="p-1 text-slate-600 hover:text-gojapan-600 cursor-pointer"
                            title={language === 'km' ? 'កែប្រែទិន្នន័យការកម្មង់' : 'Edit Order Data'}
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setSelectedOrderDetails(o)}
                            className="p-1 text-slate-500 hover:text-slate-900 cursor-pointer"
                            title="Inspect Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteOrder(o.id)}
                            className="p-1 text-slate-400 hover:text-gojapan-600 cursor-pointer"
                            title="Delete Order"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PRODUCT MANAGEMENT */}
      {adminTab === 'products' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Japanese ISP Catalog & Inventory
              </h2>
              <p className="text-xs text-slate-500">
                Add, modify specifications, set pricing in JPY, and toggle product status.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleRefreshData}
                disabled={isRefreshing}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                title={language === 'km' ? 'ផ្ទុកកាតាឡុកផលិតផលឡើងវិញ' : 'Refresh product catalog'}
              >
                <RefreshCw className={`w-3.5 h-3.5 text-gojapan-600 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span>{language === 'km' ? 'ផ្ទុកឡើងវិញ' : 'Refresh'}</span>
              </button>

              <button
                onClick={() => {
                  if (window.confirm('Reset catalog to default products?')) {
                    onProductsUpdated(storageService.resetProductsToDefault());
                  }
                }}
                className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 border border-slate-300 rounded-lg cursor-pointer"
              >
                Reset Default
              </button>

              <button
                onClick={handleOpenAddProduct}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-gojapan-500 hover:bg-gojapan-600 shadow-sm shadow-gojapan-500/20 rounded-lg shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Product</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((prod) => (
              <div
                key={prod.id}
                className={`p-4 rounded-xl border bg-white shadow-xs space-y-3 flex flex-col justify-between ${
                  prod.isActive ? 'border-slate-200' : 'border-slate-200 opacity-60'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono text-slate-500">{prod.sku}</span>
                    <button
                      onClick={() => handleToggleProductActive(prod)}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer ${
                        prod.isActive
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {prod.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 leading-snug">
                    {language === 'km' ? prod.nameKm : prod.nameEn}
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-2">
                    {language === 'km' ? prod.descriptionKm : prod.descriptionEn}
                  </p>

                  <div className="p-2 rounded bg-slate-50 text-[11px] space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Speed:</span>
                      <strong className="text-slate-800">{prod.speed}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Carrier:</span>
                      <strong className="text-slate-800">{prod.carrier}</strong>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-base font-extrabold text-slate-900 font-mono tabular-nums">
                      ¥{prod.priceJPY.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-slate-500 ml-1">JPY</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleDuplicateProduct(prod)}
                      className="p-1.5 text-slate-500 hover:text-slate-900 rounded hover:bg-slate-100 cursor-pointer"
                      title={language === 'km' ? 'ចម្លងបង្កើតផលិតផលថ្មី (Duplicate)' : 'Duplicate Product'}
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        setEditingProduct(prod);
                        setIsProductModalOpen(true);
                      }}
                      className="p-1.5 text-slate-500 hover:text-slate-900 rounded hover:bg-slate-100 cursor-pointer"
                      title="Edit"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(prod.id)}
                      className="p-1.5 text-slate-400 hover:text-gojapan-600 rounded hover:bg-gojapan-50 cursor-pointer"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: CUSTOMERS & AGENTS */}
      {adminTab === 'customers' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                {language === 'km' ? 'បញ្ជីអតិថិជន និងភ្នាក់ងារលក់ (Customer & Agent Directory)' : 'Customer & Sales Agent Directory'}
              </h2>
              <p className="text-xs text-slate-500">
                {language === 'km'
                  ? 'គ្រប់គ្រង និងកែប្រែព័ត៌មានអតិថិជន ទូរស័ព្ទ Telegram និងចំនួនការកម្មង់សរុប'
                  : 'Manage and edit customer profiles, phone numbers, Telegram handles, and lifetime spend.'}
              </p>
            </div>

            <button
              onClick={handleOpenCreateCustomer}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-gojapan-500 hover:bg-gojapan-600 rounded-lg shadow-sm shadow-gojapan-500/20 cursor-pointer self-start sm:self-auto shrink-0"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>{language === 'km' ? '+ បន្ថែមអតិថិជន/ភ្នាក់ងារ' : '+ Add Customer / Agent'}</span>
            </button>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                <tr>
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Phone Number</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Telegram</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4 text-center">Orders Count</th>
                  <th className="py-3 px-4 text-right">Total Spent (JPY)</th>
                  <th className="py-3 px-4">Last Order</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {customers.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-8 text-center text-slate-400">
                      No customer records yet. Click "+ Add Customer / Agent" above.
                    </td>
                  </tr>
                ) : (
                  customers.map((c, i) => (
                    <tr key={i} className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-bold text-slate-900">{c.customerName}</td>
                      <td className="py-3 px-4 font-mono text-slate-600">{c.phoneNumber}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            c.customerType === 'agent'
                              ? 'bg-gojapan-50 text-gojapan-700 border border-gojapan-200'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {c.customerType === 'agent' ? 'Sales Agent' : 'Customer'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-blue-600">{c.telegram || '—'}</td>
                      <td className="py-3 px-4 text-slate-600">{c.provinceCity}</td>
                      <td className="py-3 px-4 text-center font-bold tabular-nums">{c.totalOrders}</td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 tabular-nums">
                        ¥{c.totalSpentJPY.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-slate-400">
                        {new Date(c.lastOrderDate).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-right space-x-1 shrink-0">
                        <button
                          onClick={() => handleOpenEditCustomer(c)}
                          className="p-1 text-slate-600 hover:text-gojapan-600 rounded hover:bg-slate-100 cursor-pointer"
                          title="Edit Customer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteCustomer(c.phoneNumber)}
                          className="p-1 text-slate-400 hover:text-gojapan-600 rounded hover:bg-gojapan-50 cursor-pointer"
                          title="Delete Customer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: GOOGLE SHEETS LIVE SYNC CONSOLE */}
      {adminTab === 'sheets' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-gojapan-50 text-gojapan-600">
                  <FileSpreadsheet className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Google Apps Script Web App Connection
                  </h3>
                  <p className="text-xs text-slate-500">
                    Automated 2-way sync across 4 Sheets: Orders, Order_Items, Products, Customers
                  </p>
                </div>
              </div>

              <button
                onClick={onOpenAppsScriptCode}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-sm"
              >
                <Code2 className="w-4 h-4" />
                <span>View / Copy Code.gs Script</span>
              </button>
            </div>

            {/* URL Input Box */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                Google Apps Script Web App URL:
              </label>
              <div className="flex flex-col sm:flex-row items-stretch gap-2">
                <input
                  type="url"
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                  placeholder="https://script.google.com/macros/s/AKfycbx.../exec"
                  className="flex-1 px-3 py-2 text-xs rounded-lg border border-slate-300 font-mono focus:outline-none focus:ring-2 focus:ring-gojapan-500/20 focus:border-gojapan-500"
                />
                <button
                  onClick={handleSaveAppsScriptUrl}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer"
                >
                  Save URL
                </button>
                <button
                  onClick={handleTestConnection}
                  disabled={isTestingConnection || !inputUrl}
                  className="inline-flex items-center justify-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-gojapan-500 hover:bg-gojapan-600 shadow-sm shadow-gojapan-500/20 rounded-lg shadow-sm disabled:opacity-50 cursor-pointer"
                >
                  {isTestingConnection ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Testing...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Test Connection</span>
                    </>
                  )}
                </button>
              </div>
              <span className="text-[11px] text-slate-500">
                Must end with <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">/exec</code>.
              </span>
            </div>

            {/* Connection Test Feedback Box */}
            {connectionResult && (
              <div
                className={`p-4 rounded-xl text-xs flex items-start gap-2.5 ${
                  connectionResult.success
                    ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                    : 'bg-amber-50 text-amber-900 border border-amber-200'
                }`}
              >
                {connectionResult.success ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                )}
                <div className="space-y-1">
                  <strong>{connectionResult.success ? 'Success' : 'Notice'}: </strong>
                  <span>{connectionResult.message}</span>
                </div>
              </div>
            )}

            {/* Synchronize Pending Orders Button */}
            <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="text-xs font-bold text-slate-800">Pending Orders Sync Buffer</h4>
                <p className="text-xs text-slate-500">
                  {orders.filter((o) => !o.syncedToGoogleSheets).length} orders currently queued for sync.
                </p>
              </div>

              <button
                onClick={handleSyncPendingOrders}
                disabled={isSyncingOrders || !inputUrl}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-900 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-lg shadow-xs cursor-pointer disabled:opacity-50"
              >
                {isSyncingOrders ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-600" />
                    <span>Syncing...</span>
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Sync Pending to Google Sheets Now</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* 4 Sheets Layout Reference */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-2">
              <span className="text-[11px] font-bold text-gojapan-600 uppercase">Sheet 1: Orders</span>
              <p className="text-xs text-slate-600">
                General order records, customer contacts, Cambodia location hierarchy, JPY totals, fulfillment status.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-2">
              <span className="text-[11px] font-bold text-blue-600 uppercase">Sheet 2: Order_Items</span>
              <p className="text-xs text-slate-600">
                Itemized breakdown for each product in an order, SKU, quantity, unit price in JPY, and line subtotal.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-2">
              <span className="text-[11px] font-bold text-emerald-600 uppercase">Sheet 3: Products</span>
              <p className="text-xs text-slate-600">
                Full catalog of Japanese ISP packages, Pocket Wi-Fi, eSIMs, Fiber internet, speeds, quotas, and pricing.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-2">
              <span className="text-[11px] font-bold text-purple-600 uppercase">Sheet 4: Customers</span>
              <p className="text-xs text-slate-600">
                Customer & Agent registry, tracking lifetime orders volume, aggregate spent in JPY, and contact history.
              </p>
            </div>
          </div>

        </div>
      )}

      {/* TAB 6: SITE & WEB APP SETTINGS */}
      {adminTab === 'settings' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Sticky / Floating Top Action Bar for Settings */}
          <div className="sticky top-16 z-20 bg-white/95 backdrop-blur-md p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  {language === 'km' ? 'គ្រប់គ្រងព័ត៌មានទូទៅនៃគេហទំព័រ (Site Settings)' : 'Web App Content & Business Settings'}
                </h2>
                {isSettingsDirty ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300 animate-pulse">
                    ⚠️ {language === 'km' ? 'មិនទាន់រក្សាទុក' : 'Unsaved changes'}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                    <Check className="w-3 h-3" />
                    <span>{language === 'km' ? 'បានរក្សាទុក' : 'Saved'}</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {language === 'km'
                  ? 'Admin អាចកែប្រែព័ត៌មានគេហទំព័រ បដាស្លាយឡើងចុះ (Announcement), Hotline, Telegram និង Social Links'
                  : 'Customize site branding, sliding news announcements, hotline, telegram, and social URLs.'}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleResetSiteSettings}
                className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 border border-slate-300 rounded-lg cursor-pointer bg-white hover:bg-slate-50 transition"
              >
                {language === 'km' ? 'កំណត់លំនាំដើម' : 'Reset Defaults'}
              </button>

              <button
                type="button"
                onClick={() => handleSaveSiteSettings()}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-gojapan-500 hover:bg-gojapan-600 shadow-sm shadow-gojapan-500/30 rounded-lg cursor-pointer transition active:scale-95"
              >
                <Save className="w-4 h-4" />
                <span>{language === 'km' ? '💾 រក្សាទុកព័ត៌មាន (Save)' : '💾 Save Settings'}</span>
              </button>
            </div>
          </div>

          {settingsSavedToast && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-xs text-emerald-900 flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-bold">{settingsSavedToast}</span>
            </div>
          )}

          <form onSubmit={handleSaveSiteSettings} className="space-y-6">
            {/* Group 1: General & Branding */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 text-gojapan-600">
                <Globe className="w-4 h-4" />
                <span>Branding & General Information</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Company / Site Name</label>
                  <input
                    type="text"
                    required
                    value={currentSiteSettings.siteName}
                    onChange={(e) => {
                      handleTouchSession();
                      setCurrentSiteSettings({ ...currentSiteSettings, siteName: e.target.value });
                      setIsSettingsDirty(true);
                    }}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-gojapan-500 font-bold"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Default Shipping Fee (¥ JPY)</label>
                  <input
                    type="number"
                    min="0"
                    value={currentSiteSettings.defaultShippingJPY}
                    onChange={(e) => {
                      handleTouchSession();
                      setCurrentSiteSettings({ ...currentSiteSettings, defaultShippingJPY: parseInt(e.target.value) || 0 });
                      setIsSettingsDirty(true);
                    }}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tagline (Khmer)</label>
                  <input
                    type="text"
                    value={currentSiteSettings.taglineKm}
                    onChange={(e) => {
                      handleTouchSession();
                      setCurrentSiteSettings({ ...currentSiteSettings, taglineKm: e.target.value });
                      setIsSettingsDirty(true);
                    }}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tagline (English)</label>
                  <input
                    type="text"
                    value={currentSiteSettings.taglineEn}
                    onChange={(e) => {
                      handleTouchSession();
                      setCurrentSiteSettings({ ...currentSiteSettings, taglineEn: e.target.value });
                      setIsSettingsDirty(true);
                    }}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>
              </div>
            </div>

            {/* Group 2: Announcement Bar & Sliding News Ticker (ព័ត៌មានស្លាយឡើងចុះ) */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider text-gojapan-600 flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    <span>{language === 'km' ? 'ព័ត៌មាន និងបដាស្លាយឡើងចុះ (Top News Ticker)' : 'Top Announcement & Sliding News Ticker'}</span>
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {language === 'km'
                      ? 'ព័ត៌មានទាំងអស់ខាងក្រោម នឹងបង្ហាញជាចលនាស្លាយឡើងចុះនៅលើកំពូល Website របស់អ្នក'
                      : 'All items below slide vertically in the top announcement bar of the website.'}
                  </p>
                </div>

                <div className="flex items-center gap-2.5 shrink-0">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                    <input
                      type="checkbox"
                      checked={currentSiteSettings.showAnnouncement}
                      onChange={(e) => {
                        handleTouchSession();
                        setCurrentSiteSettings({ ...currentSiteSettings, showAnnouncement: e.target.checked });
                        setIsSettingsDirty(true);
                      }}
                      className="rounded border-slate-300 text-gojapan-600 focus:ring-gojapan-500"
                    />
                    <span>{language === 'km' ? 'បង្ហាញលើ Web' : 'Show on Web'}</span>
                  </label>

                  <button
                    type="button"
                    onClick={() => handleSaveSiteSettings()}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-gojapan-500 hover:bg-gojapan-600 rounded-lg cursor-pointer transition shadow-xs"
                    title={language === 'km' ? 'រក្សាទុកព័ត៌មានស្លាយភ្លាមៗ' : 'Save news items immediately'}
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{language === 'km' ? 'រក្សាទុកព័ត៌មាន' : 'Save News'}</span>
                  </button>
                </div>
              </div>

              {/* Interactive Sliding News Items List */}
              <div className="space-y-3 pt-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">
                    {language === 'km'
                      ? `បញ្ជីព័ត៌មានស្លាយឡើងចុះ (${currentSiteSettings.announcementsList?.length || 0})`
                      : `Sliding News Items (${currentSiteSettings.announcementsList?.length || 0})`}
                  </span>
                  <button
                    type="button"
                    onClick={handleAddNewsItem}
                    className="inline-flex items-center gap-1 px-3 py-1 text-xs font-bold text-gojapan-600 bg-gojapan-50 hover:bg-gojapan-100 rounded-lg border border-gojapan-200 cursor-pointer transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{language === 'km' ? '+ បន្ថែមព័ត៌មានស្លាយ' : '+ Add News Item'}</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {(currentSiteSettings.announcementsList || []).map((item, idx) => (
                    <div key={item.id || idx} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-50 transition space-y-2.5">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-gojapan-500 text-white font-mono text-[11px] font-bold flex items-center justify-center shrink-0">
                            {idx + 1}
                          </span>
                          <span className="text-xs font-bold text-slate-800">
                            {language === 'km' ? `ព័ត៌មានទី #${idx + 1}` : `News Item #${idx + 1}`}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-slate-500 font-medium">Tag:</span>
                          <input
                            type="text"
                            placeholder="Tag (e.g. ពិសេស, PROMO)"
                            value={item.tagKm || ''}
                            onChange={(e) => handleUpdateNewsItem(idx, 'tagKm', e.target.value)}
                            className="w-24 px-2 py-1 text-xs rounded border border-slate-300 bg-white font-bold text-gojapan-600"
                          />
                          <button
                            type="button"
                            onClick={() => handleDeleteNewsItem(idx)}
                            disabled={(currentSiteSettings.announcementsList?.length || 0) <= 1}
                            className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                            title={language === 'km' ? 'លុបព័ត៌មាននេះ' : 'Delete this item'}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                            {language === 'km' ? 'ខ្លឹមសារជាភាសាខ្មែរ (Khmer News)' : 'Khmer News Text'}
                          </label>
                          <textarea
                            rows={2}
                            value={item.km || ''}
                            onChange={(e) => handleUpdateNewsItem(idx, 'km', e.target.value)}
                            placeholder="បញ្ចូលខ្លឹមសារព័ត៌មានជាភាសាខ្មែរ..."
                            className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-xs focus:ring-1 focus:ring-gojapan-500 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                            {language === 'km' ? 'ខ្លឹមសារជាភាសាអង់គ្លេស (English News)' : 'English News Text'}
                          </label>
                          <textarea
                            rows={2}
                            value={item.en || ''}
                            onChange={(e) => handleUpdateNewsItem(idx, 'en', e.target.value)}
                            placeholder="Enter announcement text in English..."
                            className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-xs focus:ring-1 focus:ring-gojapan-500 focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Group 3: Contact & Support */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider text-gojapan-600">
                Contact Hotline, Telegram & Address
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Support Hotline Phone</label>
                  <input
                    type="text"
                    value={currentSiteSettings.hotline}
                    onChange={(e) => {
                      handleTouchSession();
                      setCurrentSiteSettings({ ...currentSiteSettings, hotline: e.target.value });
                      setIsSettingsDirty(true);
                    }}
                    placeholder="+855 12 889 977 / +81 80 1234 5678"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Telegram Support Handle</label>
                  <input
                    type="text"
                    value={currentSiteSettings.telegramUsername}
                    onChange={(e) => {
                      handleTouchSession();
                      setCurrentSiteSettings({ ...currentSiteSettings, telegramUsername: e.target.value });
                      setIsSettingsDirty(true);
                    }}
                    placeholder="@gojapan24h"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono text-blue-600"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Support Email</label>
                  <input
                    type="email"
                    value={currentSiteSettings.companyEmail}
                    onChange={(e) => {
                      handleTouchSession();
                      setCurrentSiteSettings({ ...currentSiteSettings, companyEmail: e.target.value });
                      setIsSettingsDirty(true);
                    }}
                    placeholder="support@gojapan24h.com"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>

                <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Office Address (Khmer)</label>
                    <input
                      type="text"
                      value={currentSiteSettings.officeAddressKm}
                      onChange={(e) => {
                        handleTouchSession();
                        setCurrentSiteSettings({ ...currentSiteSettings, officeAddressKm: e.target.value });
                        setIsSettingsDirty(true);
                      }}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Office Address (English)</label>
                    <input
                      type="text"
                      value={currentSiteSettings.officeAddressEn}
                      onChange={(e) => {
                        handleTouchSession();
                        setCurrentSiteSettings({ ...currentSiteSettings, officeAddressEn: e.target.value });
                        setIsSettingsDirty(true);
                      }}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Group 4: Social Media Channels */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider text-gojapan-600">
                Official Social Media Channels
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Facebook Page URL</label>
                  <input
                    type="url"
                    value={currentSiteSettings.facebookUrl}
                    onChange={(e) => {
                      handleTouchSession();
                      setCurrentSiteSettings({ ...currentSiteSettings, facebookUrl: e.target.value });
                      setIsSettingsDirty(true);
                    }}
                    placeholder="https://facebook.com/gojapan24hours"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono text-blue-700"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">YouTube Channel URL</label>
                  <input
                    type="url"
                    value={currentSiteSettings.youtubeUrl}
                    onChange={(e) => {
                      handleTouchSession();
                      setCurrentSiteSettings({ ...currentSiteSettings, youtubeUrl: e.target.value });
                      setIsSettingsDirty(true);
                    }}
                    placeholder="https://youtube.com/@gojapan24hours"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono text-rose-700"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">LINE Official Account URL</label>
                  <input
                    type="url"
                    value={currentSiteSettings.lineUrl}
                    onChange={(e) => {
                      handleTouchSession();
                      setCurrentSiteSettings({ ...currentSiteSettings, lineUrl: e.target.value });
                      setIsSettingsDirty(true);
                    }}
                    placeholder="https://line.me/R/ti/p/@gojapan24h"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono text-emerald-700"
                  />
                </div>
              </div>
            </div>

            {/* Group 5: Hero Copy */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider text-gojapan-600">
                Homepage Hero Headline & Copy
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Hero Headline (Khmer)</label>
                  <input
                    type="text"
                    value={currentSiteSettings.heroHeadlineKm}
                    onChange={(e) => {
                      handleTouchSession();
                      setCurrentSiteSettings({ ...currentSiteSettings, heroHeadlineKm: e.target.value });
                      setIsSettingsDirty(true);
                    }}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-bold"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Hero Headline (English)</label>
                  <input
                    type="text"
                    value={currentSiteSettings.heroHeadlineEn}
                    onChange={(e) => {
                      handleTouchSession();
                      setCurrentSiteSettings({ ...currentSiteSettings, heroHeadlineEn: e.target.value });
                      setIsSettingsDirty(true);
                    }}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-bold"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Hero Subtitle (Khmer)</label>
                  <textarea
                    rows={2}
                    value={currentSiteSettings.heroSubheadlineKm}
                    onChange={(e) => {
                      handleTouchSession();
                      setCurrentSiteSettings({ ...currentSiteSettings, heroSubheadlineKm: e.target.value });
                      setIsSettingsDirty(true);
                    }}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Hero Subtitle (English)</label>
                  <textarea
                    rows={2}
                    value={currentSiteSettings.heroSubheadlineEn}
                    onChange={(e) => {
                      handleTouchSession();
                      setCurrentSiteSettings({ ...currentSiteSettings, heroSubheadlineEn: e.target.value });
                      setIsSettingsDirty(true);
                    }}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>
              </div>
            </div>

            {/* Submit Bar */}
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-gojapan-500 hover:bg-gojapan-600 shadow-sm shadow-gojapan-500/25 rounded-lg cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{language === 'km' ? 'រក្សាទុកព័ត៌មានគេហទំព័រ' : 'Save Web App Settings'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* INSPECT ORDER DETAILS MODAL */}
      {selectedOrderDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <span className="text-xs font-mono font-bold text-gojapan-600">{selectedOrderDetails.id}</span>
                <h3 className="text-base font-bold text-slate-900">Order Information</h3>
              </div>
              <button
                onClick={() => setSelectedOrderDetails(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                ✕
              </button>
            </div>

            <div className="text-xs space-y-2 text-slate-700">
              <p><strong>Customer:</strong> {selectedOrderDetails.customerName} ({selectedOrderDetails.phoneNumber})</p>
              <p><strong>Type:</strong> {selectedOrderDetails.customerType} {selectedOrderDetails.agentId ? `(${selectedOrderDetails.agentId})` : ''}</p>
              <p><strong>Destination:</strong> {selectedOrderDetails.provinceCity}, {selectedOrderDetails.districtKhan}, {selectedOrderDetails.communeSangkat}, {selectedOrderDetails.streetAddress}</p>
              {selectedOrderDetails.telegram && <p><strong>Telegram:</strong> {selectedOrderDetails.telegram}</p>}
              {selectedOrderDetails.remarks && <p><strong>Remarks:</strong> {selectedOrderDetails.remarks}</p>}
              
              <div className="pt-2 border-t border-slate-200">
                <strong>Items ({selectedOrderDetails.items.length}):</strong>
                <div className="mt-1 space-y-1">
                  {selectedOrderDetails.items.map((it, idx) => (
                    <div key={idx} className="flex justify-between bg-slate-50 p-2 rounded">
                      <span>{it.quantity}x {it.productName} ({it.sku})</span>
                      <span className="font-mono font-bold">¥{it.subtotalJPY.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status History Trail */}
              {selectedOrderDetails.statusHistory && selectedOrderDetails.statusHistory.length > 0 && (
                <div className="pt-2 border-t border-slate-200">
                  <strong className="block text-[11px] uppercase tracking-wider text-slate-500 mb-1">
                    Status History Trail ({selectedOrderDetails.statusHistory.length}):
                  </strong>
                  <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                    {selectedOrderDetails.statusHistory.map((h, hIdx) => (
                      <div key={hIdx} className="p-1.5 rounded bg-slate-50 border border-slate-200 text-[11px]">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-800 uppercase text-[10px]">{h.status}</span>
                          <span className="text-slate-400 font-mono text-[10px]">
                            {new Date(h.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-slate-600 text-[10px] mt-0.5">
                          {language === 'km' ? (h.noteKm || h.noteEn) : (h.noteEn || h.noteKm)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-sm">
                <span>Total Amount:</span>
                <span className="text-gojapan-600 font-mono">¥{selectedOrderDetails.totalJPY.toLocaleString()} JPY</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
              <button
                onClick={() => setSelectedOrderDetails(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => {
                  const o = selectedOrderDetails;
                  setSelectedOrderDetails(null);
                  handleOpenEditOrder(o);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-gojapan-500 hover:bg-gojapan-600 rounded-lg shadow-sm shadow-gojapan-500/20 cursor-pointer"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>{language === 'km' ? 'កែប្រែការកម្មង់' : 'Edit Order'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD/EDIT PRODUCT MODAL */}
      {isProductModalOpen && editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-900">
                {editingProduct.id.includes('new') ? 'Add New Product' : 'Edit Product'}
              </h3>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">SKU Code</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.sku}
                    onChange={(e) => setEditingProduct({ ...editingProduct, sku: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded border border-slate-300 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={editingProduct.category}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        category: e.target.value as ProductCategory,
                      })
                    }
                    className="w-full px-2.5 py-1.5 rounded border border-slate-300 bg-white"
                  >
                    <option value="pocket_wifi">Pocket Wi-Fi</option>
                    <option value="sim_esim">SIM & eSIM</option>
                    <option value="fiber_broadband">Fiber Broadband</option>
                    <option value="hardware">Hardware / Routers</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Name (Khmer)</label>
                <input
                  type="text"
                  required
                  value={editingProduct.nameKm}
                  onChange={(e) => setEditingProduct({ ...editingProduct, nameKm: e.target.value })}
                  placeholder="e.g., Pocket Wi-Fi 5G ចល័ត..."
                  className="w-full px-2.5 py-1.5 rounded border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Name (English)</label>
                <input
                  type="text"
                  required
                  value={editingProduct.nameEn}
                  onChange={(e) => setEditingProduct({ ...editingProduct, nameEn: e.target.value })}
                  placeholder="e.g., GoJapan 5G Mobile Hotspot..."
                  className="w-full px-2.5 py-1.5 rounded border border-slate-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Price (¥ JPY)</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={editingProduct.priceJPY}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, priceJPY: parseInt(e.target.value) || 0 })
                    }
                    className="w-full px-2.5 py-1.5 rounded border border-slate-300 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Carrier Network</label>
                  <select
                    value={editingProduct.carrier}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        carrier: e.target.value as any,
                      })
                    }
                    className="w-full px-2.5 py-1.5 rounded border border-slate-300 bg-white"
                  >
                    <option value="Docomo">Docomo</option>
                    <option value="SoftBank">SoftBank</option>
                    <option value="KDDI au">KDDI au</option>
                    <option value="Multi-Carrier">Multi-Carrier</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Speed Specs</label>
                  <input
                    type="text"
                    value={editingProduct.speed}
                    onChange={(e) => setEditingProduct({ ...editingProduct, speed: e.target.value })}
                    placeholder="e.g. Max 3.9 Gbps"
                    className="w-full px-2.5 py-1.5 rounded border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Data Allowance</label>
                  <input
                    type="text"
                    value={editingProduct.dataQuota}
                    onChange={(e) => setEditingProduct({ ...editingProduct, dataQuota: e.target.value })}
                    placeholder="e.g. Unlimited Data"
                    className="w-full px-2.5 py-1.5 rounded border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description (Khmer)</label>
                <textarea
                  rows={2}
                  value={editingProduct.descriptionKm}
                  onChange={(e) => setEditingProduct({ ...editingProduct, descriptionKm: e.target.value })}
                  className="w-full px-2.5 py-1.5 rounded border border-slate-300"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-gojapan-500 hover:bg-gojapan-600 shadow-sm shadow-gojapan-500/20 rounded-lg shadow-sm cursor-pointer"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ORDER EDIT / CREATE MODAL - FULL ADMIN PERMISSION */}
      {isOrderModalOpen && editingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <span className="text-xs font-mono font-bold text-gojapan-600">
                  {isNewOrder ? 'NEW ORDER CREATION' : `EDIT: ${editingOrder.id}`}
                </span>
                <h3 className="text-base font-bold text-slate-900">
                  {isNewOrder
                    ? (language === 'km' ? 'បង្កើតការកម្មង់ថ្មី' : 'Create New Order')
                    : (language === 'km' ? 'កែប្រែទិន្នន័យការកម្មង់' : 'Edit Order Data')}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsOrderModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveOrder} className="space-y-4 text-xs">
              {/* Customer Information */}
              <div className="p-3 bg-slate-50 rounded-xl space-y-3 border border-slate-200">
                <span className="font-bold text-slate-800 uppercase tracking-wide block">
                  Customer & Agent Profile
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Customer Type</label>
                    <select
                      value={editingOrder.customerType}
                      onChange={(e) => setEditingOrder({ ...editingOrder, customerType: e.target.value as any })}
                      className="w-full px-2.5 py-1.5 rounded border border-slate-300 bg-white"
                    >
                      <option value="customer">Customer (អតិថិជន)</option>
                      <option value="agent">Sales Agent (ភ្នាក់ងារ)</option>
                    </select>
                  </div>

                  {editingOrder.customerType === 'agent' && (
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Agent ID</label>
                      <input
                        type="text"
                        value={editingOrder.agentId || ''}
                        onChange={(e) => setEditingOrder({ ...editingOrder, agentId: e.target.value })}
                        placeholder="e.g. AGENT-PP-01"
                        className="w-full px-2.5 py-1.5 rounded border border-slate-300 font-mono"
                      />
                    </div>
                  )}

                  <div className={editingOrder.customerType === 'agent' ? '' : 'sm:col-span-2'}>
                    <label className="block font-semibold text-slate-700 mb-1">Customer Name *</label>
                    <input
                      type="text"
                      required
                      value={editingOrder.customerName}
                      onChange={(e) => setEditingOrder({ ...editingOrder, customerName: e.target.value })}
                      placeholder="e.g. Sokha Chan"
                      className="w-full px-2.5 py-1.5 rounded border border-slate-300 font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={editingOrder.phoneNumber}
                      onChange={(e) => setEditingOrder({ ...editingOrder, phoneNumber: e.target.value })}
                      placeholder="e.g. 012889977"
                      className="w-full px-2.5 py-1.5 rounded border border-slate-300 font-mono"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-semibold text-slate-700 mb-1">Telegram Contact (Optional)</label>
                    <input
                      type="text"
                      value={editingOrder.telegram || ''}
                      onChange={(e) => setEditingOrder({ ...editingOrder, telegram: e.target.value })}
                      placeholder="e.g. @username or +855..."
                      className="w-full px-2.5 py-1.5 rounded border border-slate-300 text-blue-600"
                    />
                  </div>
                </div>
              </div>

              {/* Delivery Address */}
              <div className="p-3 bg-slate-50 rounded-xl space-y-3 border border-slate-200">
                <span className="font-bold text-slate-800 uppercase tracking-wide block">
                  Delivery Destination
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Province / City *</label>
                    <input
                      type="text"
                      required
                      value={editingOrder.provinceCity}
                      onChange={(e) => setEditingOrder({ ...editingOrder, provinceCity: e.target.value })}
                      className="w-full px-2.5 py-1.5 rounded border border-slate-300"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">District / Khan</label>
                    <input
                      type="text"
                      value={editingOrder.districtKhan}
                      onChange={(e) => setEditingOrder({ ...editingOrder, districtKhan: e.target.value })}
                      className="w-full px-2.5 py-1.5 rounded border border-slate-300"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Commune / Sangkat</label>
                    <input
                      type="text"
                      value={editingOrder.communeSangkat}
                      onChange={(e) => setEditingOrder({ ...editingOrder, communeSangkat: e.target.value })}
                      className="w-full px-2.5 py-1.5 rounded border border-slate-300"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Village (ភូមិ)</label>
                    <input
                      type="text"
                      value={editingOrder.village}
                      onChange={(e) => setEditingOrder({ ...editingOrder, village: e.target.value })}
                      className="w-full px-2.5 py-1.5 rounded border border-slate-300"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-semibold text-slate-700 mb-1">Street Address</label>
                    <input
                      type="text"
                      value={editingOrder.streetAddress}
                      onChange={(e) => setEditingOrder({ ...editingOrder, streetAddress: e.target.value })}
                      placeholder="House / Street / Landmark"
                      className="w-full px-2.5 py-1.5 rounded border border-slate-300"
                    />
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="p-3 bg-slate-50 rounded-xl space-y-3 border border-slate-200">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 uppercase tracking-wide">
                    Ordered Products ({editingOrder.items.length})
                  </span>
                </div>

                <div className="space-y-2">
                  {editingOrder.items.map((it, idx) => (
                    <div key={idx} className="flex items-center justify-between gap-2 p-2 bg-white rounded-lg border border-slate-200">
                      <div className="flex-1 min-w-0">
                        <span className="font-bold text-slate-900 block truncate">{it.productName}</span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {it.sku} · ¥{it.unitPriceJPY.toLocaleString()} each
                        </span>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <div className="flex items-center border border-slate-300 rounded">
                          <button
                            type="button"
                            onClick={() => handleUpdateItemQuantityInEditingOrder(idx, it.quantity - 1)}
                            className="px-2 py-0.5 text-slate-600 hover:bg-slate-100 cursor-pointer"
                          >
                            -
                          </button>
                          <span className="px-2 font-mono font-bold">{it.quantity}</span>
                          <button
                            type="button"
                            onClick={() => handleUpdateItemQuantityInEditingOrder(idx, it.quantity + 1)}
                            className="px-2 py-0.5 text-slate-600 hover:bg-slate-100 cursor-pointer"
                          >
                            +
                          </button>
                        </div>

                        <span className="font-mono font-bold text-slate-800 w-20 text-right">
                          ¥{it.subtotalJPY.toLocaleString()}
                        </span>

                        <button
                          type="button"
                          onClick={() => handleRemoveItemFromEditingOrder(idx)}
                          className="p-1 text-slate-400 hover:text-gojapan-600 cursor-pointer"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add product from catalog to this order */}
                <div className="flex items-center gap-2 pt-2 border-t border-slate-200">
                  <select
                    value={selectedProductToAdd}
                    onChange={(e) => setSelectedProductToAdd(e.target.value)}
                    className="flex-1 px-2.5 py-1.5 rounded border border-slate-300 bg-white"
                  >
                    <option value="">-- Add another product from catalog --</option>
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {language === 'km' ? p.nameKm : p.nameEn} (¥{p.priceJPY.toLocaleString()})
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    disabled={!selectedProductToAdd}
                    onClick={() => handleAddItemToEditingOrder(selectedProductToAdd)}
                    className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded cursor-pointer disabled:opacity-40"
                  >
                    + Add Item
                  </button>
                </div>
              </div>

              {/* Status & Financials */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 rounded-xl space-y-2 border border-slate-200">
                  <label className="block font-bold text-slate-800">Order Status</label>
                  <select
                    value={editingOrder.status}
                    onChange={(e) => setEditingOrder({ ...editingOrder, status: e.target.value as any })}
                    className="w-full px-2.5 py-1.5 rounded border border-slate-300 bg-white font-bold"
                  >
                    <option value="new">New (ថ្មី)</option>
                    <option value="confirmed">Confirmed (បានបញ្ជាក់)</option>
                    <option value="processing">Processing (កំពុងរៀបចំ)</option>
                    <option value="shipping">Shipping (កំពុងដឹកជញ្ជូន)</option>
                    <option value="completed">Completed (បានបញ្ចប់)</option>
                    <option value="cancelled">Cancelled (បានបោះបង់)</option>
                  </select>

                  <label className="block font-semibold text-slate-700 mt-2">Add Status History Note (Optional)</label>
                  <input
                    type="text"
                    value={customStatusNote}
                    onChange={(e) => setCustomStatusNote(e.target.value)}
                    placeholder="e.g., SIM activated on Docomo, tracking #1234"
                    className="w-full px-2.5 py-1.5 rounded border border-slate-300"
                  />
                </div>

                <div className="p-3 bg-slate-50 rounded-xl space-y-2 border border-slate-200">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Subtotal:</span>
                    <span className="font-mono font-bold">¥{editingOrder.subtotalJPY.toLocaleString()} JPY</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="text-slate-600 font-semibold">Shipping Fee (¥):</label>
                    <input
                      type="number"
                      min="0"
                      value={editingOrder.shippingJPY}
                      onChange={(e) => {
                        const fee = parseInt(e.target.value) || 0;
                        setEditingOrder({
                          ...editingOrder,
                          shippingJPY: fee,
                          totalJPY: editingOrder.subtotalJPY + fee,
                        });
                      }}
                      className="w-24 px-2 py-1 text-right rounded border border-slate-300 font-mono font-bold"
                    />
                  </div>

                  <div className="pt-2 border-t border-slate-200 flex justify-between font-extrabold text-sm text-slate-900">
                    <span>Total Amount:</span>
                    <span className="text-gojapan-600 font-mono">¥{editingOrder.totalJPY.toLocaleString()} JPY</span>
                  </div>
                </div>
              </div>

              {/* Remarks */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Remarks / Special Notes</label>
                <textarea
                  rows={2}
                  value={editingOrder.remarks || ''}
                  onChange={(e) => setEditingOrder({ ...editingOrder, remarks: e.target.value })}
                  placeholder="Notes from customer or agent..."
                  className="w-full px-2.5 py-1.5 rounded border border-slate-300"
                />
              </div>

              {/* Modal Actions */}
              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsOrderModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-gojapan-500 hover:bg-gojapan-600 shadow-sm shadow-gojapan-500/20 rounded-lg cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isNewOrder ? 'Create Order' : 'Save Order Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CUSTOMER EDIT / ADD MODAL - FULL ADMIN PERMISSION */}
      {isCustomerModalOpen && editingCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-900">
                {isNewCustomer ? '+ Add Customer / Agent' : 'Edit Customer Profile'}
              </h3>
              <button
                type="button"
                onClick={() => setIsCustomerModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveCustomer} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Customer / Agent Name *</label>
                <input
                  type="text"
                  required
                  value={editingCustomer.customerName}
                  onChange={(e) => setEditingCustomer({ ...editingCustomer, customerName: e.target.value })}
                  className="w-full px-2.5 py-1.5 rounded border border-slate-300 font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={editingCustomer.phoneNumber}
                  onChange={(e) => setEditingCustomer({ ...editingCustomer, phoneNumber: e.target.value })}
                  placeholder="012889977"
                  className="w-full px-2.5 py-1.5 rounded border border-slate-300 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Account Type</label>
                <select
                  value={editingCustomer.customerType}
                  onChange={(e) => setEditingCustomer({ ...editingCustomer, customerType: e.target.value as any })}
                  className="w-full px-2.5 py-1.5 rounded border border-slate-300 bg-white"
                >
                  <option value="customer">Customer (អតិថិជន)</option>
                  <option value="agent">Sales Agent (ភ្នាក់ងារលក់)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Telegram Contact</label>
                <input
                  type="text"
                  value={editingCustomer.telegram || ''}
                  onChange={(e) => setEditingCustomer({ ...editingCustomer, telegram: e.target.value })}
                  placeholder="@telegram_handle"
                  className="w-full px-2.5 py-1.5 rounded border border-slate-300 text-blue-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Province / City</label>
                <input
                  type="text"
                  value={editingCustomer.provinceCity}
                  onChange={(e) => setEditingCustomer({ ...editingCustomer, provinceCity: e.target.value })}
                  placeholder="រាជធានីភ្នំពេញ (Phnom Penh)"
                  className="w-full px-2.5 py-1.5 rounded border border-slate-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Orders Count</label>
                  <input
                    type="number"
                    min="0"
                    value={editingCustomer.totalOrders}
                    onChange={(e) => setEditingCustomer({ ...editingCustomer, totalOrders: parseInt(e.target.value) || 0 })}
                    className="w-full px-2.5 py-1.5 rounded border border-slate-300 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Total Spent (¥ JPY)</label>
                  <input
                    type="number"
                    min="0"
                    value={editingCustomer.totalSpentJPY}
                    onChange={(e) => setEditingCustomer({ ...editingCustomer, totalSpentJPY: parseInt(e.target.value) || 0 })}
                    className="w-full px-2.5 py-1.5 rounded border border-slate-300 font-mono font-bold"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCustomerModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-gojapan-500 hover:bg-gojapan-600 shadow-sm shadow-gojapan-500/20 rounded-lg cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Customer</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
