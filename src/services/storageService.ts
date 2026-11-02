import { INITIAL_PRODUCTS } from '../data/initialProducts';
import { AppsScriptConfig, CustomerRecord, Order, OrderStatus, Product, SiteSettings } from '../types';

const STORAGE_KEYS = {
  PRODUCTS: 'gojapan_products_v1',
  ORDERS: 'gojapan_orders_v1',
  APPS_SCRIPT: 'gojapan_apps_script_v1',
  ADMIN_AUTH: 'gojapan_admin_session_v1',
  ADMIN_AUTH_EXPIRES: 'gojapan_admin_session_expires_v1',
  SITE_SETTINGS: 'gojapan_site_settings_v1',
  CUSTOMERS_OVERRIDE: 'gojapan_customers_v1',
};

export const ADMIN_SESSION_TIMEOUT_MS = 60 * 1000; // 1 minute security limit

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  siteName: 'GoJapan 24hours',
  taglineKm: 'សេវាកម្មអ៊ីនធឺណិត និងទូរគមនាគមន៍ជប៉ុន 24 ម៉ោង',
  taglineEn: '24/7 Japan Telecom & ISP Solutions for Travelers & Expats',
  announcementKm: '⚡ ប្រូម៉ូសិនពិសេស! បញ្ចុះតម្លៃ 10% លើកញ្ចប់ Pocket Wi-Fi 5G & eSIM សម្រាប់ការកម្មង់មុនដំណាច់ខែនេះ',
  announcementEn: '⚡ Limited Time Offer: 10% discount on 5G Pocket Wi-Fi & eSIM packages booked this month!',
  showAnnouncement: true,
  hotline: '+855 12 889 977 / +81 80 1234 5678',
  telegramUsername: '@gojapan24h',
  facebookUrl: 'https://facebook.com/gojapan24hours',
  youtubeUrl: 'https://youtube.com/@gojapan24hours',
  lineUrl: 'https://line.me/R/ti/p/@gojapan24h',
  heroHeadlineKm: 'សេវាអ៊ីនធឺណិត និងទូរគមនាគមន៍ជប៉ុន 24 ម៉ោង',
  heroHeadlineEn: 'Japan 24/7 High-Speed Internet & Connectivity',
  heroSubheadlineKm: 'ផ្គត់ផ្គង់ Pocket Wi-Fi 5G, ស៊ីមកាត, eSIM និង Fiber Broadband ល្បឿនលឿនទូទាំងប្រទេសជប៉ុន។ តម្លៃគិតជាប្រាក់យ៉េន (JPY) សុទ្ធសាធ ងាយស្រួលកម្មង់ទូទាំងប្រទេសកម្ពុជា។',
  heroSubheadlineEn: 'Pocket Wi-Fi 5G, Travel SIMs, eSIM, and Fiber Broadband on Docomo & SoftBank networks. Pure Japan YEN (JPY) pricing with automated Google Sheets sync.',
  defaultShippingJPY: 500,
  companyEmail: 'support@gojapan24h.com',
  officeAddressKm: 'អគារពាណិជ្ជកម្ម Vattanac Capital, មហាវិថីព្រះមុនីវង្ស, រាជធានីភ្នំពេញ / Tokyo Office: Shinjuku-ku, Tokyo, Japan',
  officeAddressEn: 'Vattanac Capital Tower, Preah Monivong Blvd, Phnom Penh / Tokyo Office: Shinjuku-ku, Tokyo, Japan',
};

// Initial realistic sample orders for demonstration
const SAMPLE_ORDERS: Order[] = [
  {
    id: 'GJ-2026-8801',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    customerType: 'customer',
    customerName: 'Sokha Chan',
    phoneNumber: '012889977',
    telegram: '@sokhachan_jp',
    provinceCity: 'រាជធានីភ្នំពេញ (Phnom Penh)',
    districtKhan: 'ខណ្ឌទួលគោក (Toul Kork)',
    communeSangkat: 'បឹងកក់២ (Boeung Kak 2)',
    village: 'ភូមិ៤ (Phum 4)',
    streetAddress: 'ផ្ទះលេខ 28E, ផ្លូវ 315',
    items: [
      {
        productId: 'prod-001',
        sku: 'GJ-WIFI-5G-MAX',
        productName: 'GoJapan 5G Pocket Wi-Fi Unlimited (Docomo Network)',
        category: 'pocket_wifi',
        unitPriceJPY: 6800,
        quantity: 1,
        subtotalJPY: 6800,
      },
      {
        productId: 'prod-009',
        sku: 'GJ-ACC-GAN65W',
        productName: 'Japan Travel Universal Power Adapter & 65W GaN Kit',
        category: 'hardware',
        unitPriceJPY: 3200,
        quantity: 1,
        subtotalJPY: 3200,
      },
    ],
    subtotalJPY: 10000,
    shippingJPY: 500,
    totalJPY: 10500,
    status: 'processing',
    statusHistory: [
      {
        status: 'new',
        timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
        noteKm: 'ការកម្មង់ត្រូវបានបង្កើត និងកត់ត្រាចូលក្នុងប្រព័ន្ធដោយជោគជ័យ',
        noteEn: 'Order placed online and registered in system',
      },
      {
        status: 'confirmed',
        timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
        noteKm: 'បានផ្ទៀងផ្ទាត់ព័ត៌មានអតិថិជន និងបម្រុងទុកឧបករណ៍ Pocket Wi-Fi 5G រួចរាល់',
        noteEn: 'Order verified & 5G Pocket Wi-Fi device allocated',
      },
      {
        status: 'processing',
        timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
        noteKm: 'កំពុងតេស្តឧបករណ៍ តភ្ជាប់ស៊ីមកាត Docomo និងវេចខ្ចប់ត្រៀមដឹកជញ្ជូន',
        noteEn: 'Device tested, Docomo SIM installed, packaging for courier',
      },
    ],
    remarks: 'សូមដឹកជញ្ជូនមុនម៉ោង ៥ល្ងាច។ ហោះហើរទៅតូក្យូថ្ងៃស្អែក។',
    syncedToGoogleSheets: true,
  },
  {
    id: 'GJ-2026-8802',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    customerType: 'agent',
    agentId: 'AGENT-PP-09',
    customerName: 'Dara Travel & Visa Services',
    phoneNumber: '098334455',
    telegram: '@daratravel_agency',
    provinceCity: 'ខេត្តសៀមរាប (Siem Reap)',
    districtKhan: 'ក្រុងសៀមរាប (Siem Reap Municipality)',
    communeSangkat: 'ស្វាយដង្គំ (Svay Dangkum)',
    village: 'មណ្ឌល១ (Mondol 1)',
    streetAddress: 'អគារ Dara Tower, ជាន់ទី 2',
    items: [
      {
        productId: 'prod-003',
        sku: 'GJ-ESIM-30D-50G',
        productName: 'Japan 5G Travel eSIM 30-Day (50GB Data Pass)',
        category: 'sim_esim',
        unitPriceJPY: 3900,
        quantity: 3,
        subtotalJPY: 11700,
      },
    ],
    subtotalJPY: 11700,
    shippingJPY: 0,
    totalJPY: 11700,
    status: 'completed',
    statusHistory: [
      {
        status: 'new',
        timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
        noteKm: 'ភ្នាក់ងារ Dara Travel បានបញ្ជូនការកម្មង់កញ្ចប់ eSIM ចំនួន ៣',
        noteEn: 'Agent order submitted for 3x Japan Travel eSIM passes',
      },
      {
        status: 'confirmed',
        timestamp: new Date(Date.now() - 3600000 * 23).toISOString(),
        noteKm: 'បានផ្ទៀងផ្ទាត់ Agent ID និងអនុវត្តកម្រៃជើងសារជោគជ័យ',
        noteEn: 'Agent commission verified and approved',
      },
      {
        status: 'processing',
        timestamp: new Date(Date.now() - 3600000 * 20).toISOString(),
        noteKm: 'បានបង្កើតកូដ eSIM Profiles ពីប្រព័ន្ធ Docomo/SoftBank',
        noteEn: 'Generated 3x Japan 5G eSIM activation QR profiles',
      },
      {
        status: 'shipping',
        timestamp: new Date(Date.now() - 3600000 * 18).toISOString(),
        noteKm: 'បានបញ្ជូន QR Code eSIM តាម Telegram ទៅកាន់ភ្នាក់ងាររួចរាល់',
        noteEn: 'Dispatched QR codes to agent via Telegram',
      },
      {
        status: 'completed',
        timestamp: new Date(Date.now() - 3600000 * 16).toISOString(),
        noteKm: 'អតិថិជនបានដំណើរការ eSIM ជោគជ័យនៅប្រទេសជប៉ុន',
        noteEn: 'All eSIMs successfully activated and confirmed active',
      },
    ],
    remarks: 'កញ្ចប់ eSIM សម្រាប់ក្រុមទេសចរណ៍ ៣នាក់។ បានផ្ញើ QR Code រួចរាល់។',
    syncedToGoogleSheets: true,
  },
  {
    id: 'GJ-2026-8803',
    createdAt: new Date(Date.now() - 3600000 * 1).toISOString(),
    customerType: 'customer',
    customerName: 'Bunna Seng',
    phoneNumber: '077221199',
    telegram: '@bunna_tokyo',
    provinceCity: 'ដឹកជញ្ជូនទៅប្រទេសជប៉ុន (Pickup / Delivery in Japan)',
    districtKhan: 'អាកាសយានដ្ឋាន Narita (NRT Tokyo)',
    communeSangkat: 'Terminal 1 International Arrival',
    village: 'Counter Q',
    streetAddress: 'Flight NH818, Arrival 15:30',
    items: [
      {
        productId: 'prod-004',
        sku: 'GJ-ESIM-07D-UNL',
        productName: 'Japan 5G Travel eSIM 7-Day Unlimited Data',
        category: 'sim_esim',
        unitPriceJPY: 2200,
        quantity: 1,
        subtotalJPY: 2200,
      },
    ],
    subtotalJPY: 2200,
    shippingJPY: 0,
    totalJPY: 2200,
    status: 'new',
    statusHistory: [
      {
        status: 'new',
        timestamp: new Date(Date.now() - 3600000 * 1).toISOString(),
        noteKm: 'ការកម្មង់ថ្មីត្រូវបានបង្កើត រង់ចាំក្រុមការងារផ្ទៀងផ្ទាត់',
        noteEn: 'New order submitted, awaiting operations review',
      },
    ],
    remarks: 'ជួយផ្ញើ QR Code តាម Telegram បន្ទាប់ពី Submit។',
    syncedToGoogleSheets: false,
  },
];

export const storageService = {
  // PRODUCTS
  getProducts(): Product[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
        return INITIAL_PRODUCTS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_PRODUCTS;
    }
  },

  saveProduct(product: Product): Product {
    const products = this.getProducts();
    const existingIndex = products.findIndex((p) => p.id === product.id);
    if (existingIndex >= 0) {
      products[existingIndex] = product;
    } else {
      products.unshift(product);
    }
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    return product;
  },

  deleteProduct(id: string): void {
    const products = this.getProducts().filter((p) => p.id !== id);
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  },

  resetProductsToDefault(): Product[] {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
    return INITIAL_PRODUCTS;
  },

  // ORDERS
  getOrders(): Order[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ORDERS);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(SAMPLE_ORDERS));
        return SAMPLE_ORDERS;
      }
      return JSON.parse(data);
    } catch {
      return SAMPLE_ORDERS;
    }
  },

  getOrderById(id: string): Order | undefined {
    const orders = this.getOrders();
    const trimmedId = id.trim().toUpperCase();
    return orders.find(
      (o) => o.id.toUpperCase() === trimmedId || o.id.toUpperCase().replace('GJ-', '') === trimmedId
    );
  },

  findOrdersByPhoneOrId(query: string): Order[] {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return this.getOrders().filter(
      (o) =>
        o.id.toLowerCase().includes(q) ||
        o.phoneNumber.includes(q) ||
        o.customerName.toLowerCase().includes(q)
    );
  },

  async saveOrder(order: Order): Promise<{ order: Order; synced: boolean; error?: string }> {
    const orders = this.getOrders();
    const existingIndex = orders.findIndex((o) => o.id === order.id);
    let finalOrder = { ...order };

    // Attempt direct sync to Google Apps Script if URL configured
    const config = this.getAppsScriptConfig();
    let synced = false;
    let syncError: string | undefined;

    if (config.webAppUrl && config.webAppUrl.startsWith('https://script.google.com/macros/s/')) {
      try {
        const payload = {
          action: 'submit_order',
          order: finalOrder,
        };

        // Note: Using text/plain prevents CORS preflight OPTIONS rejection in Google Apps Script Web App
        const response = await fetch(config.webAppUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'text/plain;charset=utf-8',
          },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          const resJson = await response.json().catch(() => ({ success: true }));
          if (resJson.success !== false) {
            synced = true;
            finalOrder.syncedToGoogleSheets = true;
            this.saveAppsScriptConfig({
              ...config,
              isConnected: true,
              lastSyncedAt: new Date().toISOString(),
              lastStatus: 'Connected and synchronized',
            });
          } else {
            syncError = resJson.error || resJson.message || 'Apps Script returned failure';
          }
        } else {
          syncError = `HTTP Error: ${response.status} ${response.statusText}`;
        }
      } catch (err: unknown) {
        const errObj = err as Error;
        syncError = errObj.message || 'Network / CORS error reaching Apps Script';
      }
    } else {
      syncError = 'Apps Script Web App URL not configured yet';
    }

    finalOrder.syncedToGoogleSheets = synced;
    if (syncError && !synced) {
      finalOrder.syncError = syncError;
    }

    // Ensure status history is present and starts with order creation
    if (!finalOrder.statusHistory || finalOrder.statusHistory.length === 0) {
      finalOrder.statusHistory = [
        {
          status: 'new',
          timestamp: finalOrder.createdAt || new Date().toISOString(),
          noteKm: 'ការកម្មង់ត្រូវបានបង្កើត និងកត់ត្រាចូលក្នុងប្រព័ន្ធដោយជោគជ័យ',
          noteEn: 'Order placed online and registered in GoJapan system',
        },
      ];
    }

    if (existingIndex >= 0) {
      orders[existingIndex] = finalOrder;
    } else {
      orders.unshift(finalOrder);
    }
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));

    return { order: finalOrder, synced, error: syncError };
  },

  async updateOrderStatus(
    orderId: string,
    status: OrderStatus,
    customNoteKm?: string,
    customNoteEn?: string
  ): Promise<boolean> {
    const orders = this.getOrders();
    const orderIndex = orders.findIndex((o) => o.id === orderId);
    if (orderIndex < 0) return false;

    const order = orders[orderIndex];
    order.status = status;

    // Helper to generate default contextual note
    const getDefaultNote = (st: OrderStatus): { km: string; en: string } => {
      switch (st) {
        case 'new':
          return {
            km: 'ការកម្មង់ត្រូវបានបង្កើត និងកត់ត្រាចូលក្នុងប្រព័ន្ធ',
            en: 'Order registered in system',
          };
        case 'confirmed':
          return {
            km: 'ការកម្មង់ត្រូវបានបញ្ជាក់ដោយក្រុមការងារ GoJapan 24hours',
            en: 'Order verified & confirmed by GoJapan operations',
          };
        case 'processing':
          return {
            km: 'កំពុងរៀបចំ និងត្រួតពិនិត្យឧបករណ៍/កញ្ចប់សេវា មុនពេលបញ្ជូន',
            en: 'Preparing equipment, testing network profile & packaging',
          };
        case 'shipping':
          return {
            km: 'កញ្ចប់ទំនិញត្រូវបានប្រគល់ជូនអ្នកដឹកជញ្ជូន / ផ្ញើ QR Code eSIM',
            en: 'Handed over to courier / eSIM QR code dispatched',
          };
        case 'completed':
          return {
            km: 'ការដឹកជញ្ជូនបានបញ្ចប់ដោយជោគជ័យ អតិថិជនបានទទួល និងដំណើរការ',
            en: 'Order fulfilled successfully and confirmed active by recipient',
          };
        case 'cancelled':
          return {
            km: 'ការកម្មង់ត្រូវបានបោះបង់',
            en: 'Order was cancelled',
          };
      }
    };

    const defNote = getDefaultNote(status);

    if (!order.statusHistory) {
      order.statusHistory = [
        {
          status: 'new',
          timestamp: order.createdAt,
          noteKm: 'ការកម្មង់ត្រូវបានបង្កើត និងកត់ត្រាចូលក្នុងប្រព័ន្ធ',
          noteEn: 'Order placed online',
        },
      ];
    }

    // Append new status event to chronological history
    order.statusHistory.push({
      status,
      timestamp: new Date().toISOString(),
      noteKm: customNoteKm || defNote.km,
      noteEn: customNoteEn || defNote.en,
    });

    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));

    // Also update Google Sheets if connected
    const config = this.getAppsScriptConfig();
    if (config.webAppUrl && config.webAppUrl.startsWith('https://script.google.com/macros/s/')) {
      try {
        fetch(config.webAppUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify({
            action: 'update_order_status',
            orderId: orderId,
            status: status,
          }),
        }).catch(() => {});
      } catch {
        // silent fallback
      }
    }

    return true;
  },

  updateOrder(updated: Order): Order {
    const orders = this.getOrders();
    const idx = orders.findIndex((o) => o.id === updated.id);
    const subtotal = updated.items.reduce((sum, it) => sum + (it.unitPriceJPY * it.quantity), 0);
    const finalOrder: Order = {
      ...updated,
      subtotalJPY: subtotal,
      totalJPY: subtotal + (updated.shippingJPY || 0),
    };
    if (idx >= 0) {
      orders[idx] = finalOrder;
    } else {
      orders.unshift(finalOrder);
    }
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    return finalOrder;
  },

  createOrder(newOrder: Order): Order {
    const orders = this.getOrders();
    const subtotal = (newOrder.items || []).reduce((sum, it) => sum + (it.unitPriceJPY * it.quantity), 0);
    const finalOrder: Order = {
      ...newOrder,
      id: newOrder.id || `GJ-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: newOrder.createdAt || new Date().toISOString(),
      items: newOrder.items || [],
      subtotalJPY: subtotal,
      shippingJPY: newOrder.shippingJPY ?? 500,
      totalJPY: subtotal + (newOrder.shippingJPY ?? 500),
      syncedToGoogleSheets: false,
      statusHistory: newOrder.statusHistory && newOrder.statusHistory.length > 0
        ? newOrder.statusHistory
        : [
            {
              status: newOrder.status || 'new',
              timestamp: new Date().toISOString(),
              noteKm: 'ការកម្មង់ត្រូវបានបង្កើតដោយផ្ទាល់ដោយ Admin',
              noteEn: 'Order created manually by Admin',
            },
          ],
    };
    orders.unshift(finalOrder);
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    return finalOrder;
  },

  deleteOrder(orderId: string): void {
    const orders = this.getOrders().filter((o) => o.id !== orderId);
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  },

  // CUSTOMERS DERIVATION & OVERRIDES
  getCustomerOverrides(): Record<string, CustomerRecord> {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CUSTOMERS_OVERRIDE);
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  },

  saveCustomer(customer: CustomerRecord): CustomerRecord {
    const overrides = this.getCustomerOverrides();
    overrides[customer.phoneNumber] = customer;
    localStorage.setItem(STORAGE_KEYS.CUSTOMERS_OVERRIDE, JSON.stringify(overrides));
    return customer;
  },

  deleteCustomer(phone: string): void {
    const overrides = this.getCustomerOverrides();
    delete overrides[phone];
    localStorage.setItem(STORAGE_KEYS.CUSTOMERS_OVERRIDE, JSON.stringify(overrides));
  },

  getCustomers(): CustomerRecord[] {
    const orders = this.getOrders();
    const map = new Map<string, CustomerRecord>();

    // 1. Derive from all orders
    orders.forEach((o) => {
      const phone = o.phoneNumber.trim();
      if (!phone) return;

      const existing = map.get(phone);
      if (existing) {
        existing.totalOrders += 1;
        existing.totalSpentJPY += o.totalJPY;
        if (new Date(o.createdAt) > new Date(existing.lastOrderDate)) {
          existing.lastOrderDate = o.createdAt;
          existing.customerName = o.customerName;
          existing.telegram = o.telegram || existing.telegram;
          existing.provinceCity = o.provinceCity;
        }
      } else {
        map.set(phone, {
          phoneNumber: phone,
          customerName: o.customerName,
          customerType: o.customerType,
          telegram: o.telegram,
          provinceCity: o.provinceCity,
          totalOrders: 1,
          totalSpentJPY: o.totalJPY,
          lastOrderDate: o.createdAt,
        });
      }
    });

    // 2. Merge Admin custom overrides and edits
    const overrides = this.getCustomerOverrides();
    Object.values(overrides).forEach((c) => {
      const existing = map.get(c.phoneNumber);
      if (existing) {
        map.set(c.phoneNumber, {
          ...existing,
          ...c,
        });
      } else {
        map.set(c.phoneNumber, c);
      }
    });

    return Array.from(map.values()).sort((a, b) => b.totalSpentJPY - a.totalSpentJPY);
  },

  // SITE SETTINGS MANAGEMENT (ADMIN CAN EDIT WEB APP SETTINGS)
  getSiteSettings(): SiteSettings {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SITE_SETTINGS);
      if (data) {
        return { ...DEFAULT_SITE_SETTINGS, ...JSON.parse(data) };
      }
    } catch {
      // fallback
    }
    return DEFAULT_SITE_SETTINGS;
  },

  saveSiteSettings(settings: SiteSettings): SiteSettings {
    localStorage.setItem(STORAGE_KEYS.SITE_SETTINGS, JSON.stringify(settings));
    return settings;
  },

  resetSiteSettings(): SiteSettings {
    localStorage.setItem(STORAGE_KEYS.SITE_SETTINGS, JSON.stringify(DEFAULT_SITE_SETTINGS));
    return DEFAULT_SITE_SETTINGS;
  },

  // APPS SCRIPT CONFIG
  getAppsScriptConfig(): AppsScriptConfig {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.APPS_SCRIPT);
      if (data) return JSON.parse(data);
    } catch {
      // fallback
    }
    return {
      webAppUrl: '',
      isConnected: false,
      lastStatus: 'Not configured',
    };
  },

  saveAppsScriptConfig(config: AppsScriptConfig): void {
    localStorage.setItem(STORAGE_KEYS.APPS_SCRIPT, JSON.stringify(config));
  },

  async testAppsScriptConnection(url: string): Promise<{ success: boolean; message: string; details?: any }> {
    if (!url || !url.startsWith('https://script.google.com/macros/s/')) {
      return {
        success: false,
        message: 'Invalid URL. Must begin with https://script.google.com/macros/s/ and end with /exec',
      };
    }

    try {
      const testUrl = `${url}?action=ping&_t=${Date.now()}`;
      const response = await fetch(testUrl, {
        method: 'GET',
      });

      if (!response.ok) {
        return {
          success: false,
          message: `Connection failed with HTTP ${response.status}`,
        };
      }

      const data = await response.json();
      return {
        success: data.success === true,
        message: data.message || 'Connection verified successfully! 4 sheets detected.',
        details: data,
      };
    } catch (err: unknown) {
      const errObj = err as Error;
      return {
        success: false,
        message:
          'Error contacting Apps Script. Please verify "Who has access: Anyone" is selected in your deployment settings.',
        details: errObj.message,
      };
    }
  },

  async syncPendingOrdersToGoogleSheets(): Promise<{ syncedCount: number; failedCount: number; message: string }> {
    const config = this.getAppsScriptConfig();
    if (!config.webAppUrl) {
      return { syncedCount: 0, failedCount: 0, message: 'Google Apps Script URL is not configured yet.' };
    }

    const orders = this.getOrders();
    const pending = orders.filter((o) => !o.syncedToGoogleSheets);

    if (pending.length === 0) {
      return { syncedCount: 0, failedCount: 0, message: 'All orders are already synced to Google Sheets!' };
    }

    let syncedCount = 0;
    let failedCount = 0;

    for (const order of pending) {
      try {
        const res = await fetch(config.webAppUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify({
            action: 'submit_order',
            order,
          }),
        });

        if (res.ok) {
          order.syncedToGoogleSheets = true;
          delete order.syncError;
          syncedCount++;
        } else {
          failedCount++;
        }
      } catch {
        failedCount++;
      }
    }

    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));

    if (syncedCount > 0) {
      this.saveAppsScriptConfig({
        ...config,
        isConnected: true,
        lastSyncedAt: new Date().toISOString(),
        lastStatus: `Synced ${syncedCount} orders successfully`,
      });
    }

    return {
      syncedCount,
      failedCount,
      message: `Sync complete: ${syncedCount} orders uploaded to Google Sheets (${failedCount} failed).`,
    };
  },

  // EXPORT CSV
  exportOrdersToCSV(): void {
    const orders = this.getOrders();
    if (orders.length === 0) return;

    const headers = [
      'Order ID',
      'Created Date',
      'Customer Type',
      'Customer Name',
      'Phone Number',
      'Telegram',
      'Province/City',
      'District/Khan',
      'Commune/Sangkat',
      'Village',
      'Address',
      'Subtotal (JPY)',
      'Shipping (JPY)',
      'Total (JPY)',
      'Status',
      'Items Count',
      'Synced Google Sheets',
      'Remarks',
    ];

    const rows = orders.map((o) => [
      `"${o.id}"`,
      `"${new Date(o.createdAt).toLocaleString()}"`,
      `"${o.customerType}"`,
      `"${(o.customerName || '').replace(/"/g, '""')}"`,
      `"${o.phoneNumber}"`,
      `"${o.telegram || ''}"`,
      `"${(o.provinceCity || '').replace(/"/g, '""')}"`,
      `"${(o.districtKhan || '').replace(/"/g, '""')}"`,
      `"${(o.communeSangkat || '').replace(/"/g, '""')}"`,
      `"${(o.village || '').replace(/"/g, '""')}"`,
      `"${(o.streetAddress || '').replace(/"/g, '""')}"`,
      o.subtotalJPY,
      o.shippingJPY,
      o.totalJPY,
      `"${o.status}"`,
      o.items.length,
      `"${o.syncedToGoogleSheets ? 'YES' : 'NO'}"`,
      `"${(o.remarks || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `GoJapan24hours_Orders_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  // ADMIN AUTH (1-MINUTE SECURITY AUTO-TIMEOUT)
  isAdminLoggedIn(): boolean {
    const isAuth = sessionStorage.getItem(STORAGE_KEYS.ADMIN_AUTH) === 'true';
    if (!isAuth) return false;

    const expiresAt = Number(sessionStorage.getItem(STORAGE_KEYS.ADMIN_AUTH_EXPIRES) || 0);
    if (!expiresAt || Date.now() > expiresAt) {
      // Session expired (> 1 minute)
      this.logoutAdmin();
      return false;
    }
    return true;
  },

  getAdminSessionRemainingSeconds(): number {
    const isAuth = sessionStorage.getItem(STORAGE_KEYS.ADMIN_AUTH) === 'true';
    if (!isAuth) return 0;
    const expiresAt = Number(sessionStorage.getItem(STORAGE_KEYS.ADMIN_AUTH_EXPIRES) || 0);
    const diff = Math.max(0, Math.floor((expiresAt - Date.now()) / 1000));
    if (diff === 0) {
      this.logoutAdmin();
    }
    return diff;
  },

  touchAdminSession(): void {
    if (sessionStorage.getItem(STORAGE_KEYS.ADMIN_AUTH) === 'true') {
      const newExpiry = Date.now() + ADMIN_SESSION_TIMEOUT_MS;
      sessionStorage.setItem(STORAGE_KEYS.ADMIN_AUTH_EXPIRES, newExpiry.toString());
    }
  },

  loginAdmin(user: string, pass: string): boolean {
    if (user.trim() === 'admin' && pass === 'gojapan2026') {
      sessionStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, 'true');
      const expiresAt = Date.now() + ADMIN_SESSION_TIMEOUT_MS;
      sessionStorage.setItem(STORAGE_KEYS.ADMIN_AUTH_EXPIRES, expiresAt.toString());
      return true;
    }
    return false;
  },

  logoutAdmin(): void {
    sessionStorage.removeItem(STORAGE_KEYS.ADMIN_AUTH);
    sessionStorage.removeItem(STORAGE_KEYS.ADMIN_AUTH_EXPIRES);
  },
};
