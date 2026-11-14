import { INITIAL_PRODUCTS } from '../data/initialProducts';
import { AppsScriptConfig, CustomerRecord, FAQCategory, FAQItem, NewsTickerItem, Order, OrderStatus, Product, ReportPeriod, SalesReportSummary, SiteSettings, TelegramConfig, TelegramDetectedChat } from '../types';
import { firestoreSync } from './firestoreSync';

const STORAGE_KEYS = {
  PRODUCTS: 'gojapan_products_v1',
  ORDERS: 'gojapan_orders_v1',
  APPS_SCRIPT: 'gojapan_apps_script_v1',
  TELEGRAM_CONFIG: 'gojapan_telegram_config_v1',
  ADMIN_AUTH: 'gojapan_admin_session_v1',
  ADMIN_AUTH_EXPIRES: 'gojapan_admin_session_expires_v1',
  SITE_SETTINGS: 'gojapan_site_settings_v1',
  CUSTOMERS_OVERRIDE: 'gojapan_customers_v1',
};

export const ADMIN_SESSION_TIMEOUT_MS = 60 * 1000; // 1 minute security limit

export const DEFAULT_NEWS_ITEMS: NewsTickerItem[] = [
  {
    id: 'news-1',
    km: '⚡ ប្រូម៉ូសិនពិសេស! បញ្ចុះតម្លៃ 10% លើកញ្ចប់ Pocket Wi-Fi 5G & eSIM សម្រាប់ការកម្មង់មុនដំណាច់ខែនេះ',
    en: '⚡ Limited Time Offer: 10% discount on 5G Pocket Wi-Fi & eSIM packages booked this month!',
    tagKm: 'ពិសេស',
    tagEn: 'PROMO'
  },
  {
    id: 'news-2',
    km: '🚀 សេវាដឹកជញ្ជូនរហ័សទូទាំងប្រទេសជប៉ុន & ទទួលផ្ទាល់នៅព្រលានយន្តហោះ Narita, Haneda, Kansai',
    en: '🚀 Fast delivery across Japan & Airport pick-up at Narita, Haneda, Kansai',
    tagKm: 'ដឹកជញ្ជូន',
    tagEn: 'DELIVERY'
  },
  {
    id: 'news-3',
    km: '📶 អ៊ីនធឺណិតល្បឿនលឿន 5G & 4G LTE គ្មានដែនកំណត់ លើបណ្តាញ Docomo & SoftBank ធានាគុណភាព ១០០%',
    en: '📶 Unlimited High-Speed 5G & 4G LTE on Docomo & SoftBank networks - 100% Guaranteed',
    tagKm: 'ល្បឿនលឿន',
    tagEn: '5G LTE'
  },
  {
    id: 'news-4',
    km: '📞 បម្រើសេវាកម្ម ២៤ ម៉ោងជាភាសាខ្មែរ និងជប៉ុន - Hotline / Telegram ឆ្លើយតបរហ័ស',
    en: '📞 24/7 Customer Care in Khmer & Japanese - Quick Response via Hotline & Telegram',
    tagKm: '២៤ ម៉ោង',
    tagEn: '24/7'
  }
];

export const DEFAULT_FAQS: FAQItem[] = [
  {
    id: 'faq-1',
    category: 'sim_esim',
    order: 1,
    isActive: true,
    questionKm: 'តើខ្ញុំត្រូវដំឡើង និងបើកដំណើរការស៊ីមកាតជប៉ុន (Travel SIM) យ៉ាងដូចម្តេច?',
    questionEn: 'How do I activate and set up APN for my Japan Travel SIM?',
    answerKm: 'នៅពេលលោកអ្នកចុះចតនៅប្រទេសជប៉ុន សូមដាក់ស៊ីមកាតចូលក្នុងទូរស័ព្ទ បើកមុខងារ Mobile Data និង Data Roaming។ សម្រាប់ iPhone ភាគច្រើនដំណើរការស្វ័យប្រវត្តិ។ ប្រសិនបើត្រូវការកំណត់ APN សូមចូលទៅ Settings > Cellular > Cellular Data Network ហើយបញ្ចូល APN Name: "vmobile.jp" (User: vmobile@g, Pass: 4001)។ ក្រុមការងារ GoJapan មានសៀវភៅណែនាំជាភាសាខ្មែរភ្ជាប់ជូនក្នុងកញ្ចប់ស្រាប់។',
    answerEn: 'Upon landing in Japan, insert the SIM card and turn on Mobile Data and Data Roaming. Most iPhones configure automatically. If manual APN setup is required, go to Settings > Cellular > Mobile Data Network and enter APN: "vmobile.jp" (Username: vmobile@g, Password: 4001). A step-by-step setup guide is included in your package.'
  },
  {
    id: 'faq-2',
    category: 'sim_esim',
    order: 2,
    isActive: true,
    questionKm: 'តើខ្ញុំអាចស្កេនដំឡើង eSIM មុនពេលចេញដំណើរពីកម្ពុជាបានទេ?',
    questionEn: 'Can I install and scan the eSIM QR code before departing from Cambodia?',
    answerKm: 'បាទ/ចាស! លោកអ្នកអាចស្កេន QR Code ដំឡើង eSIM ក្នុងទូរស័ព្ទមុនពេលចេញដំណើរ ១-២ ថ្ងៃនៅកម្ពុជាដោយភ្ជាប់ Wi-Fi។ កញ្ចប់ទិន្នន័យ (Validity Period) នឹងចាប់ផ្តើមគិតថ្ងៃតែនៅពេលដែលលោកអ្នកចុះចតដល់ប្រទេសជប៉ុន និងភ្ជាប់ជាមួយបណ្តាញ NTT Docomo ឬ SoftBank ប៉ុណ្ណោះ។',
    answerEn: 'Yes! You can scan the QR code to install the eSIM profile 1-2 days before departure using Wi-Fi at home. The validity period will only start counting once you land in Japan and your device registers on the NTT Docomo or SoftBank mobile network.'
  },
  {
    id: 'faq-3',
    category: 'pocket_wifi',
    order: 3,
    isActive: true,
    questionKm: 'តើខ្ញុំត្រូវប្រគល់ឧបករណ៍ Pocket Wi-Fi ត្រឡប់មកវិញដោយរបៀបណា មុនពេលចាកចេញពីជប៉ុន?',
    questionEn: 'How do I return the Pocket Wi-Fi router before leaving Japan?',
    answerKm: 'ងាយស្រួលបំផុត! ក្នុងកញ្ចប់ឧបករណ៍មានស្រោមសំបុត្រប្រៃសណីយ៍ជប៉ុន (Japan Post Letter Pack) បង់ថ្លៃរួចជាស្រេច។ នៅថ្ងៃចុងក្រោយ សូមដាក់ Router និងខ្សែសាកចូលក្នុងស្រោមសំបុត្រ បិទជិត ហើយទម្លាក់ចូលក្នុងប្រអប់សំបុត្រពណ៌ក្រហម (Red Postbox) ណាមួយក៏បានតាមដងផ្លូវ សណ្ឋាគារ ឬនៅព្រលានយន្តហោះ (Narita, Haneda, Kansai) មុនពេលឡើងយន្តហោះ ដោយមិនគិតថ្លៃអ្វីបន្ថែមឡើយ។',
    answerEn: 'Super simple! Your rental package includes a prepaid Japan Post return envelope. On your final day, pack the router and cable into the envelope, seal it, and drop it into any red street postbox, convenience store mailbox, or airport terminal postbox (Narita, Haneda, Kansai) before boarding. No return fees required!'
  },
  {
    id: 'faq-4',
    category: 'delivery_return',
    order: 4,
    isActive: true,
    questionKm: 'តើខ្ញុំអាចទទួលឧបករណ៍នៅព្រលានយន្តហោះជប៉ុន ឬដឹកជញ្ជូនដល់សណ្ឋាគារបានទេ?',
    questionEn: 'Can I pick up the package at Japan airports or have it delivered to my hotel?',
    answerKm: 'បាន! GoJapan 24hours គាំទ្រសេវាទទួលនៅការិយាល័យប្រៃសណីយ៍ព្រលានយន្តហោះធំៗ (Narita Airport Terminal 1 & 2, Haneda Airport, Kansai Airport) និងដឹកជញ្ជូនរហ័សទូទាំងប្រទេសជប៉ុនដល់សណ្ឋាគារ ឬ Airbnb ក្នុងរយៈពេល ១-២ ថ្ងៃ។ លើសពីនេះ យើងក៏មានសេវាផ្ញើស៊ីមកាតជូនដល់ផ្ទះនៅកម្ពុជាមុនពេលហោះហើរផងដែរ។',
    answerEn: 'Yes! We support airport post office pickup at Narita (Terminal 1 & 2), Haneda, and Kansai airports, as well as fast 1-2 day nationwide shipping directly to any hotel or Airbnb across Japan. We also offer pre-departure delivery in Cambodia for physical SIM cards.'
  },
  {
    id: 'faq-5',
    category: 'general',
    order: 5,
    isActive: true,
    questionKm: 'តើកញ្ចប់អ៊ីនធឺណិតមានដែនកំណត់ទិន្នន័យ (FUP) ឬកាត់បន្ថយល្បឿនដែរឬទេ?',
    questionEn: 'Is the data truly unlimited, or will speeds be throttled under Fair Usage Policy?',
    answerKm: 'កញ្ចប់ Pocket Wi-Fi 5G និងស៊ីមកាតរបស់ GoJapan ដំណើរការលើបណ្តាញផ្ទាល់ NTT Docomo និង SoftBank ល្បឿនខ្ពស់រហូតដល់ 3.9Gbps គ្មានដែនកំណត់ទិន្នន័យសម្រាប់ប្រើប្រាស់ធម្មតាប្រចាំថ្ងៃ ដូចជាមើល YouTube, TikTok, Live Stream, Google Maps និងការងារ។ មិនមានការកាត់បន្ថយល្បឿនឡើយ។',
    answerEn: 'GoJapan devices and SIMs run directly on official NTT Docomo and SoftBank networks with speeds up to 3.9Gbps. They provide unlimited high-speed data for routine daily travel use including streaming, navigation, social media, and work with zero throttling.'
  },
  {
    id: 'faq-6',
    category: 'payment_support',
    order: 6,
    isActive: true,
    questionKm: 'ប្រសិនបើជួបបញ្ហាតភ្ជាប់នៅប្រទេសជប៉ុន តើខ្ញុំអាចទាក់ទងជំនួយបច្ចេកទេសបានយ៉ាងដូចម្តេច?',
    questionEn: 'If I encounter connectivity issues in Japan, how can I reach support?',
    answerKm: 'ក្រុមការងារជំនួយបច្ចេកទេសរបស់ GoJapan ប្រចាំការ ២៤ ម៉ោង ៧ ថ្ងៃក្នុងមួយសប្តាហ៍ ទាំងជាភាសាខ្មែរ និងជប៉ុន។ លោកអ្នកអាចទាក់ទងមកកាន់ Telegram Support: @gojapan24h ឬទូរស័ព្ទ Hotline: +855 12 889 977 / +81 80 1234 5678។ យើងឆ្លើយតបភ្លាមៗក្នុងរយៈពេលក្រោម ៥ នាទី។',
    answerEn: 'Our technical care team is on duty 24 hours a day, 7 days a week in both Khmer and Japanese. You can contact us instantly via Telegram (@gojapan24h) or Hotline (+855 12 889 977 / +81 80 1234 5678) with an average response time of under 5 minutes.'
  }
];

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  siteName: 'GoJapan 24hours',
  taglineKm: 'សេវាកម្មអ៊ីនធឺណិត និងទូរគមនាគមន៍ជប៉ុន 24 ម៉ោង',
  taglineEn: '24/7 Japan Telecom & ISP Solutions for Travelers & Expats',
  announcementKm: '⚡ ប្រូម៉ូសិនពិសេស! បញ្ចុះតម្លៃ 10% លើកញ្ចប់ Pocket Wi-Fi 5G & eSIM សម្រាប់ការកម្មង់មុនដំណាច់ខែនេះ',
  announcementEn: '⚡ Limited Time Offer: 10% discount on 5G Pocket Wi-Fi & eSIM packages booked this month!',
  showAnnouncement: true,
  announcementsList: DEFAULT_NEWS_ITEMS,
  faqs: DEFAULT_FAQS,
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
    provinceCity: 'តូក្យូ (Tokyo - 東京都)',
    districtKhan: 'ស៊ិនជូគុ (Shinjuku-ku / 新宿区)',
    communeSangkat: '〒 160-0022',
    village: 'Shinjuku 3-14-1',
    streetAddress: 'Sakura Residence Room 502',
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
    provinceCity: 'អូសាកា (Osaka - 大阪府)',
    districtKhan: 'ឈូអូ / ណាមបា (Chuo-ku / 中央区)',
    communeSangkat: '〒 542-0076',
    village: 'Namba 2-5-12',
    streetAddress: 'Dara Travel Office 2F',
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
    provinceCity: 'ទទួលនៅអាកាសយានដ្ឋានជប៉ុន (Japan Airport Pickup)',
    districtKhan: 'អាកាសយានដ្ឋាន Narita (NRT Tokyo)',
    communeSangkat: '〒 282-0004',
    village: 'Terminal 1 International Arrival',
    streetAddress: 'Counter Q · Flight NH818, Arrival 15:30',
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

  setProductsCache(products: Product[]): void {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
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
    firestoreSync.saveProductAdmin(product).catch(() => {});
    return product;
  },

  deleteProduct(id: string): void {
    const products = this.getProducts().filter((p) => p.id !== id);
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    firestoreSync.deleteProductAdmin(id).catch(() => {});
  },

  resetProductsToDefault(): Product[] {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
    INITIAL_PRODUCTS.forEach((p) => firestoreSync.saveProductAdmin(p).catch(() => {}));
    return INITIAL_PRODUCTS;
  },

  setOrdersCache(orders: Order[]): void {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
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

  async fetchOrderByIdCloud(id: string): Promise<Order | undefined> {
    const local = this.getOrderById(id);
    if (local) return local;
    try {
      const cloudOrder = await firestoreSync.fetchOrderTrackingById(id);
      if (cloudOrder) return cloudOrder;
    } catch {
      // silent fallback
    }
    return undefined;
  },

  async saveOrder(order: Order): Promise<{
    order: Order;
    synced: boolean;
    error?: string;
    telegramNotified: boolean;
    telegramError?: string;
  }> {
    const orders = this.getOrders();
    const existingIndex = orders.findIndex((o) => o.id === order.id);
    const isNewOrder = existingIndex < 0;
    let finalOrder = { ...order };

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

    // 1. Save immediately to localStorage + Cloud Firestore atomically so order is never lost across devices
    if (existingIndex >= 0) {
      orders[existingIndex] = finalOrder;
    } else {
      orders.unshift(finalOrder);
    }
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));

    try {
      await firestoreSync.createOrderAtomic(finalOrder);
    } catch {
      // Offline / fallback still preserves order in localStorage
    }

    // 2. Automatically notify Telegram Group directly (when Admin Bot Token is active on this browser)
    let telegramNotified = false;
    let telegramError: string | undefined;
    const tgConfig = this.getTelegramConfig();
    const appsCfgSnapshot = this.getAppsScriptConfig();

    if (tgConfig.enabled && tgConfig.notifyOnNewOrder && tgConfig.botToken && tgConfig.chatId) {
      const tgRes = await this.sendOrderTelegramNotification(finalOrder, isNewOrder, tgConfig);
      telegramNotified = tgRes.success;
      if (!tgRes.success) {
        telegramError = tgRes.message;
      }
    }

    // 3. Attempt direct sync to Google Apps Script (synced across all devices via Firestore integration_public)
    const config = this.getAppsScriptConfig();
    let synced = false;
    let syncError: string | undefined;

    if (config.webAppUrl && config.webAppUrl.startsWith('https://script.google.com/macros/s/')) {
      try {
        const payload = {
          action: 'submit_order',
          order: finalOrder,
          alreadySentTelegram: telegramNotified,
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
            if (!telegramNotified && resJson.telegramNotified) {
              telegramNotified = true;
              telegramError = undefined;
            }
            if (firestoreSync.isCloudAdminActive()) {
              this.saveAppsScriptConfig({
                ...config,
                isConnected: true,
                lastSyncedAt: new Date().toISOString(),
                lastStatus: 'Connected and synchronized',
              });
            }
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

    if (!telegramNotified && !telegramError) {
      if (!tgConfig.enabled) {
        telegramError = 'ការជូនដំណឹង Telegram ត្រូវបានបិទនៅក្នុង Admin Dashboard';
      } else if (!tgConfig.notifyOnNewOrder) {
        telegramError = 'មុខងារជូនដំណឹងពេលមានការកម្មង់ថ្មីត្រូវបានបិទ';
      } else if (appsCfgSnapshot.telegramConfigured && !config.webAppUrl) {
        telegramError = 'ការកម្មង់ត្រូវបានរក្សាទុកក្នុង Cloud ហើយ — សូមភ្ជាប់ Google Apps Script URL ម្តងក្នុង Admin ដើម្បីផ្ញើ Telegram ពីគ្រប់ឧបករណ៍អតិថិជនដោយស្វ័យប្រវត្តិ';
      } else if (config.webAppUrl) {
        telegramError = 'បានបញ្ជូនទៅ Google Apps Script រួចរាល់ — សូមពិនិត្យ Google Apps Script (Save Telegram Config) ម្តងក្នុង Admin';
      } else {
        telegramError = 'មិនទាន់បានកំណត់ Telegram Bot Token ឬ Group ID នៅក្នុង Admin Dashboard ទេ';
      }
    }

    finalOrder.syncedToGoogleSheets = synced;
    if (syncError && !synced) {
      finalOrder.syncError = syncError;
    }

    if (firestoreSync.isCloudAdminActive()) {
      firestoreSync.updateOrderSyncStatusAdmin(finalOrder.id, synced, syncError).catch(() => {});
    }

    // Update order with sync flags
    const latestOrders = this.getOrders();
    const idxToUpdate = latestOrders.findIndex((o) => o.id === finalOrder.id);
    if (idxToUpdate >= 0) {
      latestOrders[idxToUpdate] = finalOrder;
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(latestOrders));
    }

    return { order: finalOrder, synced, error: syncError, telegramNotified, telegramError };
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
    firestoreSync.updateOrderAdmin(order).catch(() => {});

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

    // Also notify Telegram if status notification is enabled
    const tgConfig = this.getTelegramConfig();
    if (tgConfig.enabled && tgConfig.notifyOnStatusUpdate && tgConfig.botToken && tgConfig.chatId) {
      this.sendOrderStatusTelegramNotification(order, status, customNoteKm || customNoteEn || defNote.km).catch(() => {});
    }

    return true;
  },

  updateOrder(updated: Order): Order {
    const orders = this.getOrders();
    const idx = orders.findIndex((o) => o.id === updated.id);
    const previousStatus = idx >= 0 ? orders[idx].status : undefined;
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
    firestoreSync.updateOrderAdmin(finalOrder).catch(() => {});

    if (previousStatus && previousStatus !== finalOrder.status) {
      const tgConfig = this.getTelegramConfig();
      if (tgConfig.enabled && tgConfig.notifyOnStatusUpdate && tgConfig.botToken && tgConfig.chatId) {
        const lastNote =
          finalOrder.statusHistory && finalOrder.statusHistory.length > 0
            ? finalOrder.statusHistory[finalOrder.statusHistory.length - 1].noteKm
            : undefined;
        this.sendOrderStatusTelegramNotification(finalOrder, finalOrder.status, lastNote).catch(() => {});
      }
    }

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
    firestoreSync.createOrderAtomic(finalOrder).catch(() => {});

    const tgConfig = this.getTelegramConfig();
    if (tgConfig.enabled && tgConfig.notifyOnNewOrder && tgConfig.botToken && tgConfig.chatId) {
      this.sendOrderTelegramNotification(finalOrder, true).catch(() => {});
    }

    return finalOrder;
  },

  deleteOrder(orderId: string): void {
    const orders = this.getOrders().filter((o) => o.id !== orderId);
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    firestoreSync.deleteOrderAdmin(orderId).catch(() => {});
  },

  // CUSTOMERS DERIVATION & OVERRIDES
  setCustomerOverridesCache(overrides: Record<string, CustomerRecord>): void {
    localStorage.setItem(STORAGE_KEYS.CUSTOMERS_OVERRIDE, JSON.stringify(overrides));
  },

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
    firestoreSync.saveCustomerAdmin(customer).catch(() => {});
    return customer;
  },

  deleteCustomer(phone: string): void {
    const overrides = this.getCustomerOverrides();
    delete overrides[phone];
    localStorage.setItem(STORAGE_KEYS.CUSTOMERS_OVERRIDE, JSON.stringify(overrides));
    firestoreSync.deleteCustomerAdmin(phone).catch(() => {});
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
        const parsed = JSON.parse(data);
        const announcementsList = (parsed.announcementsList && Array.isArray(parsed.announcementsList) && parsed.announcementsList.length > 0)
          ? parsed.announcementsList
          : DEFAULT_SITE_SETTINGS.announcementsList;
        const faqs = (parsed.faqs && Array.isArray(parsed.faqs) && parsed.faqs.length > 0)
          ? parsed.faqs
          : DEFAULT_SITE_SETTINGS.faqs;
        return {
          ...DEFAULT_SITE_SETTINGS,
          ...parsed,
          announcementsList,
          faqs,
        };
      }
    } catch {
      // fallback
    }
    return DEFAULT_SITE_SETTINGS;
  },

  setSiteSettingsCache(settings: SiteSettings): void {
    localStorage.setItem(STORAGE_KEYS.SITE_SETTINGS, JSON.stringify(settings));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('gojapan_site_settings_updated', { detail: settings }));
    }
  },

  saveSiteSettings(settings: SiteSettings): SiteSettings {
    const updatedSettings: SiteSettings = { ...settings };
    if (updatedSettings.announcementsList && updatedSettings.announcementsList.length > 0) {
      if (!updatedSettings.announcementKm) {
        updatedSettings.announcementKm = updatedSettings.announcementsList[0].km;
      }
      if (!updatedSettings.announcementEn) {
        updatedSettings.announcementEn = updatedSettings.announcementsList[0].en;
      }
    }
    localStorage.setItem(STORAGE_KEYS.SITE_SETTINGS, JSON.stringify(updatedSettings));
    firestoreSync.saveSiteSettingsAdmin(updatedSettings).catch(() => {});
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('gojapan_site_settings_updated', { detail: updatedSettings }));
    }
    return updatedSettings;
  },

  resetSiteSettings(): SiteSettings {
    localStorage.setItem(STORAGE_KEYS.SITE_SETTINGS, JSON.stringify(DEFAULT_SITE_SETTINGS));
    firestoreSync.saveSiteSettingsAdmin(DEFAULT_SITE_SETTINGS).catch(() => {});
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('gojapan_site_settings_updated', { detail: DEFAULT_SITE_SETTINGS }));
    }
    return DEFAULT_SITE_SETTINGS;
  },

  // APPS SCRIPT CONFIG
  setAppsScriptConfigCache(config: AppsScriptConfig): void {
    localStorage.setItem(STORAGE_KEYS.APPS_SCRIPT, JSON.stringify(config));
  },

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
    const tg = this.getTelegramConfig();
    const enriched: AppsScriptConfig = {
      ...config,
      telegramConfigured: Boolean(tg.botToken && tg.chatId),
      telegramChatTitle: tg.chatTitle || config.telegramChatTitle,
    };
    localStorage.setItem(STORAGE_KEYS.APPS_SCRIPT, JSON.stringify(enriched));
    firestoreSync.saveAppsScriptConfigAdmin(enriched).catch(() => {});
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
          firestoreSync.updateOrderSyncStatusAdmin(order.id, true).catch(() => {});
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

  // EXPORT CSV (ACCOUNTING & FULFILLMENT)
  exportOrdersToCSV(customOrders?: Order[], filenameSuffix?: string): number {
    const orders = customOrders ?? this.getOrders();
    if (orders.length === 0) return 0;

    const escapeCsv = (val: string | number | undefined | null): string => {
      const str = String(val ?? '').replace(/"/g, '""');
      return `"${str}"`;
    };

    const headers = [
      'Order ID',
      'Created Date',
      'Customer Type',
      'Agent ID',
      'Customer Name',
      'Phone Number',
      'Telegram',
      'Province/City',
      'District/Khan',
      'Commune/Sangkat',
      'Village',
      'Street Address',
      'Items Count',
      'Ordered Items (SKU x Qty - Product)',
      'Subtotal (JPY)',
      'Shipping (JPY)',
      'Total (JPY)',
      'Status',
      'Synced Google Sheets',
      'Remarks',
    ];

    const rows = orders.map((o) => {
      const itemsSummary = (o.items || [])
        .map((it) => `${it.quantity}x ${it.sku} (${it.productName}) @ ¥${it.unitPriceJPY}`)
        .join(' | ');

      return [
        escapeCsv(o.id),
        escapeCsv(new Date(o.createdAt).toLocaleString()),
        escapeCsv(o.customerType),
        escapeCsv(o.agentId || ''),
        escapeCsv(o.customerName),
        escapeCsv(o.phoneNumber),
        escapeCsv(o.telegram || ''),
        escapeCsv(o.provinceCity),
        escapeCsv(o.districtKhan),
        escapeCsv(o.communeSangkat),
        escapeCsv(o.village),
        escapeCsv(o.streetAddress),
        o.items.reduce((sum, it) => sum + it.quantity, 0),
        escapeCsv(itemsSummary),
        o.subtotalJPY,
        o.shippingJPY,
        o.totalJPY,
        escapeCsv(o.status.toUpperCase()),
        escapeCsv(o.syncedToGoogleSheets ? 'YES' : 'NO'),
        escapeCsv(o.remarks || ''),
      ];
    });

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const dateStamp = new Date().toISOString().slice(0, 10);
    const suffix = filenameSuffix ? `_${filenameSuffix}` : '';
    link.setAttribute('href', url);
    link.setAttribute('download', `GoJapan24hours_Orders${suffix}_${dateStamp}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    return orders.length;
  },

  // TELEGRAM BOT NOTIFICATION & PERIODIC REPORTS (WEEKLY / MONTHLY / YEARLY)
  getTelegramConfig(): TelegramConfig {
    const envObj = (typeof import.meta !== 'undefined' && (import.meta as any).env) || {};
    const envBotToken = String(envObj.VITE_TELEGRAM_BOT_TOKEN || '').trim();
    const envChatId = this.normalizeGroupChatId(String(envObj.VITE_TELEGRAM_GROUP_ID || envObj.VITE_TELEGRAM_CHAT_ID || ''));

    const defaultConfig: TelegramConfig = {
      botToken: envBotToken,
      chatId: envChatId,
      enabled: true,
      notifyOnNewOrder: true,
      notifyOnStatusUpdate: true,
      lastStatus: envBotToken && envChatId ? 'Configured via Env' : 'Not configured',
    };
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.TELEGRAM_CONFIG);
      if (raw) {
        const parsed = JSON.parse(raw);
        const merged: TelegramConfig = {
          ...defaultConfig,
          ...parsed,
          botToken: String(parsed.botToken || envBotToken || '').trim(),
          chatId: this.normalizeGroupChatId(String(parsed.chatId || envChatId || '')),
          enabled: parsed.enabled !== false,
          notifyOnNewOrder: parsed.notifyOnNewOrder !== false,
          notifyOnStatusUpdate: parsed.notifyOnStatusUpdate !== false,
        };
        return merged;
      }
    } catch {
      // fallback
    }
    return defaultConfig;
  },

  setTelegramConfigCache(config: TelegramConfig): TelegramConfig {
    const normalized: TelegramConfig = {
      ...config,
      botToken: String(config.botToken || '').trim(),
      chatId: this.normalizeGroupChatId(String(config.chatId || '')),
    };
    localStorage.setItem(STORAGE_KEYS.TELEGRAM_CONFIG, JSON.stringify(normalized));
    return normalized;
  },

  saveTelegramConfig(config: TelegramConfig): TelegramConfig {
    const normalized: TelegramConfig = {
      ...config,
      botToken: String(config.botToken || '').trim(),
      chatId: this.normalizeGroupChatId(String(config.chatId || '')),
    };
    localStorage.setItem(STORAGE_KEYS.TELEGRAM_CONFIG, JSON.stringify(normalized));
    firestoreSync.saveTelegramConfigAdmin(normalized).catch(() => {});
    const appsCfg = this.getAppsScriptConfig();
    firestoreSync
      .saveAppsScriptConfigAdmin(appsCfg, {
        telegramConfigured: Boolean(normalized.botToken && normalized.chatId),
        telegramChatTitle: normalized.chatTitle,
      })
      .catch(() => {});
    return normalized;
  },

  async syncTelegramConfigToAppsScript(config?: TelegramConfig): Promise<boolean> {
    const appsCfg = this.getAppsScriptConfig();
    if (!appsCfg.webAppUrl || !appsCfg.webAppUrl.startsWith('https://script.google.com/macros/s/')) {
      return false;
    }
    const tg = config || this.getTelegramConfig();
    if (!tg.botToken || !tg.chatId) return false;
    try {
      const res = await fetch(appsCfg.webAppUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          action: 'save_telegram_config',
          telegramConfig: {
            botToken: tg.botToken.trim(),
            chatId: this.normalizeGroupChatId(tg.chatId),
            enabled: tg.enabled,
            notifyOnNewOrder: tg.notifyOnNewOrder,
          },
        }),
      });
      return res.ok;
    } catch {
      return false;
    }
  },

  generateTelegramSetupShareUrl(): string {
    const tg = this.getTelegramConfig();
    const appsCfg = this.getAppsScriptConfig();
    const payload = {
      botToken: tg.botToken,
      chatId: tg.chatId,
      chatTitle: tg.chatTitle || '',
      chatType: tg.chatType || 'supergroup',
      enabled: tg.enabled,
      notifyOnNewOrder: tg.notifyOnNewOrder,
      notifyOnStatusUpdate: tg.notifyOnStatusUpdate,
      webAppUrl: appsCfg.webAppUrl || '',
    };
    const jsonStr = JSON.stringify(payload);
    const encoded = btoa(unescape(encodeURIComponent(jsonStr)));
    const baseUrl = `${window.location.origin}${window.location.pathname}`;
    return `${baseUrl}#tg_setup=${encoded}`;
  },

  importTelegramSetupFromUrl(): boolean {
    if (typeof window === 'undefined') return false;
    const hash = window.location.hash || '';
    const match = hash.match(/tg_setup=([^&]+)/);
    if (!match || !match[1]) return false;

    try {
      const decodedJson = decodeURIComponent(escape(atob(match[1])));
      const payload = JSON.parse(decodedJson);
      if (payload.botToken && payload.chatId) {
        const current = this.getTelegramConfig();
        this.saveTelegramConfig({
          ...current,
          botToken: String(payload.botToken).trim(),
          chatId: this.normalizeGroupChatId(String(payload.chatId)),
          chatTitle: payload.chatTitle || current.chatTitle,
          chatType: payload.chatType || 'supergroup',
          enabled: payload.enabled !== false,
          notifyOnNewOrder: payload.notifyOnNewOrder !== false,
          notifyOnStatusUpdate: payload.notifyOnStatusUpdate !== false,
          lastStatus: `Synced Group: ${payload.chatTitle || payload.chatId}`,
        });
      }
      if (payload.webAppUrl && String(payload.webAppUrl).startsWith('https://script.google.com/macros/s/')) {
        const currentApps = this.getAppsScriptConfig();
        this.saveAppsScriptConfig({
          ...currentApps,
          webAppUrl: String(payload.webAppUrl).trim(),
          isConnected: true,
        });
      }
      // Clean sensitive token hash from browser address bar immediately
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
      return true;
    } catch {
      return false;
    }
  },

  escapeHtml(text: string | number | undefined | null): string {
    return String(text ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  },

  async detectTelegramChatId(botToken: string): Promise<{
    success: boolean;
    chatId?: string;
    chatTitle?: string;
    chatType?: 'group' | 'supergroup' | 'channel' | 'private';
    detectedGroups?: TelegramDetectedChat[];
    message: string;
  }> {
    const cleanToken = botToken.trim();
    if (!cleanToken || !cleanToken.includes(':')) {
      return {
        success: false,
        message: 'សូមបញ្ចូល Bot Token ឱ្យបានត្រឹមត្រូវជាមុនសិន (ឧ. 123456789:ABCdef...)',
      };
    }

    try {
      const res = await fetch(
        `https://api.telegram.org/bot${cleanToken}/getUpdates?limit=100`
      );
      const data = await res.json();
      if (!res.ok || !data.ok) {
        return {
          success: false,
          message: data.description || `Telegram API Error (${res.status})`,
        };
      }

      const updates: any[] = data.result || [];
      const groupMap = new Map<string, TelegramDetectedChat>();
      let foundPrivateChat = false;

      for (let i = updates.length - 1; i >= 0; i--) {
        const u = updates[i];

        // If a basic group was migrated to a supergroup, record the new supergroup ID
        const migratedId = u.message?.migrate_to_chat_id;
        const msgChat =
          u.message?.chat ||
          u.edited_message?.chat ||
          u.channel_post?.chat ||
          u.edited_channel_post?.chat ||
          u.my_chat_member?.chat ||
          u.chat_member?.chat;

        if (!msgChat || !msgChat.id) continue;

        const rawId = migratedId ? String(migratedId) : String(msgChat.id);
        const rawType = migratedId ? 'supergroup' : (msgChat.type as string) || 'private';
        const isGroupOrChannel =
          rawType === 'group' ||
          rawType === 'supergroup' ||
          rawType === 'channel' ||
          rawId.startsWith('-');

        if (isGroupOrChannel) {
          if (!groupMap.has(rawId)) {
            groupMap.set(rawId, {
              chatId: rawId,
              title: msgChat.title || msgChat.username || `Telegram Group (${rawId})`,
              type: (rawType === 'channel' ? 'channel' : rawType === 'supergroup' ? 'supergroup' : 'group'),
              username: msgChat.username,
            });
          }
        } else {
          foundPrivateChat = true;
        }
      }

      const detectedGroups = Array.from(groupMap.values());
      if (detectedGroups.length > 0) {
        const primaryGroup = detectedGroups[0];
        return {
          success: true,
          chatId: primaryGroup.chatId,
          chatTitle: primaryGroup.title,
          chatType: primaryGroup.type,
          detectedGroups,
          message: `✅ រកឃើញ Telegram Group ដោយជោគជ័យ៖ «${primaryGroup.title}» (Group ID: ${primaryGroup.chatId})`,
        };
      }

      if (foundPrivateChat) {
        return {
          success: false,
          message:
            '⚠️ រកឃើញតែឆាតផ្ទាល់ខ្លួនជាមួយ Bot ប៉ុណ្ណោះ (មិនទាន់ឃើញ Telegram Group ទេ)! សូម៖ ១) បញ្ចូល Bot ទៅក្នុង Telegram Group របស់អ្នក ២) វាយសារ "/start" នៅក្នុង Group នោះ ៣) ចុចប៊ូតុង «🔍 ទាញយក Group ID» ម្តងទៀត។',
        };
      }

      return {
        success: false,
        message:
          '⚠️ មិនទាន់ឃើញសារពី Telegram Group ទេ! សូមបញ្ចូល Bot ទៅក្នុង Telegram Group របស់អ្នក រួចវាយ "/start" ឬ "/test" នៅក្នុង Group នោះ រួចចុចប៊ូតុងនេះម្តងទៀត។',
      };
    } catch (err: unknown) {
      const errObj = err as Error;
      return {
        success: false,
        message: `មិនអាចភ្ជាប់ទៅ Telegram API បានទេ៖ ${errObj.message}`,
      };
    }
  },

  normalizeGroupChatId(rawChatId: string): string {
    const trimmed = rawChatId.trim();
    if (!trimmed) return '';
    // Keep @group_or_channel_username or already negative group IDs (-100... or -...)
    if (trimmed.startsWith('@') || trimmed.startsWith('-')) {
      return trimmed;
    }
    // If user copied a supergroup ID from Telegram Web without the minus sign (e.g. 1001234567890)
    if (/^100\d{9,}$/.test(trimmed)) {
      return `-${trimmed}`;
    }
    return trimmed;
  },

  async sendTelegramMessage(
    htmlText: string,
    overrideConfig?: Partial<TelegramConfig>
  ): Promise<{ success: boolean; message: string }> {
    const saved = this.getTelegramConfig();
    const botToken = (overrideConfig?.botToken ?? saved.botToken).trim();
    let chatId = this.normalizeGroupChatId(overrideConfig?.chatId ?? saved.chatId);

    if (!botToken || !chatId) {
      return {
        success: false,
        message: 'សូមបញ្ចូល Telegram Bot Token និង Group Chat ID (ផ្តើមដោយ "-") ជាមុនសិន!',
      };
    }

    try {
      const sendRequest = async (targetChatId: string) => {
        const res = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            chat_id: targetChatId,
            text: htmlText,
            parse_mode: 'HTML',
            disable_web_page_preview: true,
          }),
        });
        const data = await res.json().catch(() => ({}));
        return { res, data };
      };

      let { res, data } = await sendRequest(chatId);

      // Automatically handle Telegram Group -> Supergroup upgrade migration
      if (!data.ok && data.parameters?.migrate_to_chat_id) {
        chatId = String(data.parameters.migrate_to_chat_id);
        ({ res, data } = await sendRequest(chatId));
      }

      if (res.ok && data.ok) {
        const now = new Date().toISOString();
        const returnedChat = data.result?.chat;
        const chatTitle =
          returnedChat?.title ||
          returnedChat?.username ||
          saved.chatTitle ||
          chatId;
        const chatType = returnedChat?.type || saved.chatType || (chatId.startsWith('-') ? 'supergroup' : 'private');

        this.saveTelegramConfig({
          ...saved,
          botToken,
          chatId,
          chatTitle,
          chatType,
          lastNotifiedAt: now,
          lastStatus: `Connected to Group: ${chatTitle} (${chatId})`,
        });
        return {
          success: true,
          message: `✅ បានផ្ញើសារទៅកាន់ Telegram Group «${chatTitle}» (${chatId}) ដោយជោគជ័យ!`,
        };
      } else {
        const errMsg = data.description || `HTTP ${res.status}`;
        this.saveTelegramConfig({
          ...saved,
          lastStatus: `Error: ${errMsg}`,
        });
        return {
          success: false,
          message: `Telegram បដិសេធ៖ ${errMsg}`,
        };
      }
    } catch (err: unknown) {
      const errObj = err as Error;
      return {
        success: false,
        message: `បរាជ័យក្នុងការភ្ជាប់ទៅ Telegram៖ ${errObj.message}`,
      };
    }
  },

  async testTelegramConnection(
    botToken: string,
    chatId: string
  ): Promise<{ success: boolean; message: string }> {
    const normalizedId = this.normalizeGroupChatId(chatId);
    const msg = [
      `🔔 <b>GoJapan 24hours — ប្រព័ន្ធជូនដំណឹងចូល Telegram Group ដំណើរការជោគជ័យ!</b>`,
      `━━━━━━━━━━━━━━━━━━━━`,
      `👥 <b>គោលដៅ (Target Group ID):</b> <code>${this.escapeHtml(normalizedId)}</code>`,
      `✅ <b>ស្ថានភាព (Status):</b> បានភ្ជាប់ចូល Group រួចរាល់ (Group Connected)`,
      `🛒 <b>មុខងារទី១:</b> ជូនដំណឹងចូល Group ភ្លាមៗរាល់ពេលមានការកម្មង់ថ្មី`,
      `📊 <b>មុខងារទី២:</b> ផ្ញើរបាយការណ៍លក់ប្រចាំសប្តាហ៍ ខែ និងប្រចាំឆ្នាំចូល Group`,
      `⏰ <b>ម៉ោងតេស្ត:</b> ${this.escapeHtml(new Date().toLocaleString())}`,
    ].join('\n');

    return this.sendTelegramMessage(msg, { botToken, chatId: normalizedId });
  },

  async sendOrderTelegramNotification(
    order: Order,
    isNewOrder: boolean = true,
    overrideConfig?: Partial<TelegramConfig>
  ): Promise<{ success: boolean; message: string }> {
    const itemsList = Array.isArray(order.items) ? order.items : [];
    const itemsLines = itemsList
      .map(
        (it, idx) =>
          `  ${idx + 1}. <b>${this.escapeHtml(it.productName)}</b> (${this.escapeHtml(it.sku)})\n     ចំនួន: <code>${Number(it.quantity || 1)}</code> × ¥${Number(it.unitPriceJPY || 0).toLocaleString()} = <b>¥${Number(it.subtotalJPY || 0).toLocaleString()}</b>`
      )
      .join('\n');

    const fullAddress = [
      order.provinceCity,
      order.districtKhan,
      order.communeSangkat,
      order.village,
      order.streetAddress,
    ]
      .filter(Boolean)
      .join(', ');

    const headerTitle = isNewOrder
      ? '🛒 <b>ការកម្មង់ថ្មី! (NEW ORDER RECEIVED)</b>'
      : '📝 <b>ព័ត៌មានការកម្មង់ (ORDER NOTIFICATION)</b>';

    const customerTypeBadge =
      order.customerType === 'agent'
        ? `ភ្នាក់ងារលក់ (Agent: ${this.escapeHtml(order.agentId || 'Verified')})`
        : 'អតិថិជនទូទៅ (Customer)';

    const html = [
      headerTitle,
      `━━━━━━━━━━━━━━━━━━━━`,
      `🆔 <b>លេខកូដកម្មង់ (Order ID):</b> <code>${this.escapeHtml(order.id)}</code>`,
      `📅 <b>កាលបរិច្ឆេទ (Date):</b> ${this.escapeHtml(new Date(order.createdAt || Date.now()).toLocaleString())}`,
      `👤 <b>អតិថិជន (Customer):</b> <b>${this.escapeHtml(order.customerName)}</b>`,
      `🏷 <b>ប្រភេទ (Type):</b> ${customerTypeBadge}`,
      `📞 <b>លេខទូរស័ព្ទ (Phone):</b> <code>${this.escapeHtml(order.phoneNumber)}</code>`,
      order.telegram ? `💬 <b>Telegram:</b> ${this.escapeHtml(order.telegram)}` : null,
      `📍 <b>អាសយដ្ឋានដឹកជញ្ជូន (Address):</b>\n${this.escapeHtml(fullAddress || '—')}`,
      `━━━━━━━━━━━━━━━━━━━━`,
      `📦 <b>មុខទំនិញដែលបានកម្មង់ (${itemsList.length} មុខ):</b>`,
      itemsLines || '  • គ្មានមុខទំនិញ',
      `━━━━━━━━━━━━━━━━━━━━`,
      `💴 <b>សរុបរង (Subtotal):</b> ¥${Number(order.subtotalJPY || 0).toLocaleString()} JPY`,
      `🚚 <b>ថ្លៃដឹកជញ្ជូន (Shipping):</b> ¥${Number(order.shippingJPY || 0).toLocaleString()} JPY`,
      `💰 <b>សរុបរួម (Grand Total): ¥${Number(order.totalJPY || 0).toLocaleString()} JPY</b>`,
      `📌 <b>ស្ថានភាព (Status):</b> <code>${this.escapeHtml((order.status || 'new').toUpperCase())}</code>`,
      order.remarks ? `📝 <b>ចំណាំ (Remarks):</b> ${this.escapeHtml(order.remarks)}` : null,
    ]
      .filter(Boolean)
      .join('\n');

    return this.sendTelegramMessage(html, overrideConfig);
  },

  async sendOrderStatusTelegramNotification(
    order: Order,
    newStatus: OrderStatus,
    note?: string
  ): Promise<{ success: boolean; message: string }> {
    const statusLabelsKm: Record<OrderStatus, string> = {
      new: 'ថ្មី · រង់ចាំ (Pending)',
      confirmed: 'បានបញ្ជាក់ (Confirmed)',
      processing: 'កំពុងរៀបចំ (Processing)',
      shipping: 'កំពុងដឹកជញ្ជូន (Shipping)',
      completed: 'បានបញ្ចប់ (Completed)',
      cancelled: 'បានបោះបង់ (Cancelled)',
    };

    const html = [
      `🔄 <b>បច្ចុប្បន្នភាពស្ថានភាពការកម្មង់ (ORDER STATUS UPDATED)</b>`,
      `━━━━━━━━━━━━━━━━━━━━`,
      `🆔 <b>លេខកូដ (Order ID):</b> <code>${this.escapeHtml(order.id)}</code>`,
      `👤 <b>អតិថិជន (Customer):</b> ${this.escapeHtml(order.customerName)} (<code>${this.escapeHtml(order.phoneNumber)}</code>)`,
      `📌 <b>ស្ថានភាពថ្មី (New Status):</b> <b>${this.escapeHtml(statusLabelsKm[newStatus] || newStatus.toUpperCase())}</b>`,
      `💰 <b>ទឹកប្រាក់សរុប (Total):</b> ¥${order.totalJPY.toLocaleString()} JPY`,
      note ? `📝 <b>កំណត់សម្គាល់ (Note):</b> ${this.escapeHtml(note)}` : null,
      `⏰ <b>ម៉ោងកែប្រែ:</b> ${this.escapeHtml(new Date().toLocaleString())}`,
    ]
      .filter(Boolean)
      .join('\n');

    return this.sendTelegramMessage(html);
  },

  generateSalesReport(period: ReportPeriod, referenceDate: Date = new Date()): SalesReportSummary {
    const allOrders = this.getOrders();
    const ref = new Date(referenceDate);

    let startDate: Date;
    let endDate: Date = new Date(ref);
    endDate.setHours(23, 59, 59, 999);

    let periodLabelKm = '';
    let periodLabelEn = '';
    let dateRangeLabel = '';

    if (period === 'weekly') {
      startDate = new Date(ref);
      startDate.setDate(ref.getDate() - 6);
      startDate.setHours(0, 0, 0, 0);
      periodLabelKm = 'របាយការណ៍ប្រចាំសប្តាហ៍ (៧ ថ្ងៃចុងក្រោយ)';
      periodLabelEn = 'Weekly Sales Report (Last 7 Days)';
      dateRangeLabel = `${startDate.toLocaleDateString()} – ${endDate.toLocaleDateString()}`;
    } else if (period === 'monthly') {
      startDate = new Date(ref.getFullYear(), ref.getMonth(), 1, 0, 0, 0, 0);
      endDate = new Date(ref.getFullYear(), ref.getMonth() + 1, 0, 23, 59, 59, 999);
      const monthName = ref.toLocaleString('en-US', { month: 'long', year: 'numeric' });
      periodLabelKm = `របាយការណ៍ប្រចាំខែ (${monthName})`;
      periodLabelEn = `Monthly Sales Report (${monthName})`;
      dateRangeLabel = `${startDate.toLocaleDateString()} – ${endDate.toLocaleDateString()}`;
    } else {
      startDate = new Date(ref.getFullYear(), 0, 1, 0, 0, 0, 0);
      endDate = new Date(ref.getFullYear(), 11, 31, 23, 59, 59, 999);
      periodLabelKm = `របាយការណ៍ប្រចាំឆ្នាំ (${ref.getFullYear()})`;
      periodLabelEn = `Yearly Sales Report (${ref.getFullYear()})`;
      dateRangeLabel = `01/01/${ref.getFullYear()} – 31/12/${ref.getFullYear()}`;
    }

    const periodOrders = allOrders.filter((o) => {
      const d = new Date(o.createdAt);
      return d >= startDate && d <= endDate;
    });

    const statusCounts: Record<OrderStatus, number> = {
      new: 0,
      confirmed: 0,
      processing: 0,
      shipping: 0,
      completed: 0,
      cancelled: 0,
    };

    let activeRevenueJPY = 0;
    let totalShippingJPY = 0;
    let customerOrdersCount = 0;
    let agentOrdersCount = 0;

    const productMap = new Map<string, { sku: string; name: string; quantity: number; revenueJPY: number }>();

    periodOrders.forEach((o) => {
      statusCounts[o.status] = (statusCounts[o.status] || 0) + 1;
      if (o.customerType === 'agent') {
        agentOrdersCount += 1;
      } else {
        customerOrdersCount += 1;
      }

      if (o.status !== 'cancelled') {
        activeRevenueJPY += o.totalJPY;
        totalShippingJPY += o.shippingJPY || 0;

        (o.items || []).forEach((it) => {
          const existing = productMap.get(it.sku);
          if (existing) {
            existing.quantity += it.quantity;
            existing.revenueJPY += it.subtotalJPY;
          } else {
            productMap.set(it.sku, {
              sku: it.sku,
              name: it.productName,
              quantity: it.quantity,
              revenueJPY: it.subtotalJPY,
            });
          }
        });
      }
    });

    const topProducts = Array.from(productMap.values())
      .sort((a, b) => b.revenueJPY - a.revenueJPY)
      .slice(0, 5);

    return {
      period,
      periodLabelKm,
      periodLabelEn,
      dateRangeLabel,
      orders: periodOrders,
      totalOrders: periodOrders.length,
      activeRevenueJPY,
      totalShippingJPY,
      customerOrdersCount,
      agentOrdersCount,
      statusCounts,
      topProducts,
    };
  },

  formatSalesReportTelegramHTML(report: SalesReportSummary): string {
    const topProductsText =
      report.topProducts.length > 0
        ? report.topProducts
            .map(
              (p, idx) =>
                `  ${idx + 1}. <b>${this.escapeHtml(p.name)}</b> (<code>${this.escapeHtml(p.sku)}</code>)\n     លក់បាន: <b>${p.quantity}</b> គ្រឿង · សរុប: <b>¥${p.revenueJPY.toLocaleString()}</b>`
            )
            .join('\n')
        : '  • មិនទាន់មានទិន្នន័យលក់ក្នុងកំឡុងពេលនេះទេ';

    return [
      `📊 <b>${this.escapeHtml(report.periodLabelKm)}</b>`,
      `🌐 <b>GoJapan 24hours — ${this.escapeHtml(report.periodLabelEn)}</b>`,
      `📅 <b>ចន្លោះកាលបរិច្ឆេទ (Period):</b> <code>${this.escapeHtml(report.dateRangeLabel)}</code>`,
      `━━━━━━━━━━━━━━━━━━━━`,
      `💰 <b>ចំណូលសរុប (Active Revenue):</b> <b>¥${report.activeRevenueJPY.toLocaleString()} JPY</b>`,
      `🚚 <b>ថ្លៃដឹកជញ្ជូនសរុប (Shipping):</b> ¥${report.totalShippingJPY.toLocaleString()} JPY`,
      `📦 <b>ចំនួនការកម្មង់សរុប (Total Orders):</b> <b>${report.totalOrders}</b> ការកម្មង់`,
      `  • អតិថិជនទូទៅ (Customers): ${report.customerOrdersCount}`,
      `  • ភ្នាក់ងារលក់ (Sales Agents): ${report.agentOrdersCount}`,
      `━━━━━━━━━━━━━━━━━━━━`,
      `📌 <b>ស្ថិតិស្ថានភាពការកម្មង់ (Order Statuses):</b>`,
      `  ⏳ ថ្មី · រង់ចាំ (Pending): <b>${report.statusCounts.new}</b>`,
      `  ☑️ បានបញ្ជាក់ (Confirmed): <b>${report.statusCounts.confirmed}</b>`,
      `  ⚙️ កំពុងរៀបចំ (Processing): <b>${report.statusCounts.processing}</b>`,
      `  🚚 កំពុងដឹកជញ្ជូន (Shipping): <b>${report.statusCounts.shipping}</b>`,
      `  ✅ បានបញ្ចប់ (Completed): <b>${report.statusCounts.completed}</b>`,
      `  ❌ បានបោះបង់ (Cancelled): <b>${report.statusCounts.cancelled}</b>`,
      `━━━━━━━━━━━━━━━━━━━━`,
      `🏆 <b>ផលិតផលលក់ដាច់បំផុត (Top Selling Products):</b>`,
      topProductsText,
      `━━━━━━━━━━━━━━━━━━━━`,
      `⏰ <b>បង្កើតរបាយការណ៍នៅ:</b> ${this.escapeHtml(new Date().toLocaleString())}`,
    ].join('\n');
  },

  async sendPeriodicTelegramReport(
    period: ReportPeriod,
    referenceDate: Date = new Date()
  ): Promise<{ success: boolean; message: string; report: SalesReportSummary }> {
    const report = this.generateSalesReport(period, referenceDate);
    const html = this.formatSalesReportTelegramHTML(report);
    const res = await this.sendTelegramMessage(html);
    if (res.success) {
      const cfg = this.getTelegramConfig();
      this.saveTelegramConfig({
        ...cfg,
        lastReportSentAt: new Date().toISOString(),
        lastStatus: `Sent ${period} report (${report.totalOrders} orders)`,
      });
    }
    return {
      ...res,
      report,
    };
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
