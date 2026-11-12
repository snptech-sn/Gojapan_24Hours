export type Language = 'km' | 'en';

export type ProductCategory = 'pocket_wifi' | 'sim_esim' | 'fiber_broadband' | 'hardware';

export interface Product {
  id: string;
  sku: string;
  nameKm: string;
  nameEn: string;
  category: ProductCategory;
  priceJPY: number;
  speed: string;
  dataQuota: string;
  carrier: 'Docomo' | 'SoftBank' | 'KDDI au' | 'Multi-Carrier';
  descriptionKm: string;
  descriptionEn: string;
  imageUrl?: string;
  badge?: string;
  isActive: boolean;
  isRental?: boolean;
}

export interface OrderItem {
  productId: string;
  sku: string;
  productName: string;
  category: string;
  unitPriceJPY: number;
  quantity: number;
  subtotalJPY: number;
}

export type OrderStatus = 'new' | 'confirmed' | 'processing' | 'shipping' | 'completed' | 'cancelled';

export type CustomerType = 'customer' | 'agent';

export interface OrderStatusHistoryItem {
  status: OrderStatus;
  timestamp: string;
  noteKm?: string;
  noteEn?: string;
  location?: string;
}

export interface Order {
  id: string;
  createdAt: string;
  customerType: CustomerType;
  agentId?: string;
  customerName: string;
  phoneNumber: string;
  telegram?: string;
  provinceCity: string;
  districtKhan: string;
  communeSangkat: string;
  village: string;
  streetAddress: string;
  items: OrderItem[];
  subtotalJPY: number;
  shippingJPY: number;
  totalJPY: number;
  status: OrderStatus;
  statusHistory?: OrderStatusHistoryItem[];
  remarks?: string;
  syncedToGoogleSheets: boolean;
  syncError?: string;
}

export interface CustomerRecord {
  phoneNumber: string;
  customerName: string;
  customerType: CustomerType;
  telegram?: string;
  provinceCity: string;
  totalOrders: number;
  totalSpentJPY: number;
  lastOrderDate: string;
}

export interface AppsScriptConfig {
  webAppUrl: string;
  lastSyncedAt?: string;
  isConnected: boolean;
  lastStatus?: string;
}

export type ReportPeriod = 'weekly' | 'monthly' | 'yearly';

export interface TelegramDetectedChat {
  chatId: string;
  title: string;
  type: 'group' | 'supergroup' | 'channel' | 'private';
  username?: string;
}

export interface TelegramConfig {
  botToken: string;
  chatId: string;
  chatTitle?: string;
  chatType?: 'group' | 'supergroup' | 'channel' | 'private';
  enabled: boolean;
  notifyOnNewOrder: boolean;
  notifyOnStatusUpdate: boolean;
  lastNotifiedAt?: string;
  lastReportSentAt?: string;
  lastStatus?: string;
}

export interface SalesReportSummary {
  period: ReportPeriod;
  periodLabelKm: string;
  periodLabelEn: string;
  dateRangeLabel: string;
  orders: Order[];
  totalOrders: number;
  activeRevenueJPY: number;
  totalShippingJPY: number;
  customerOrdersCount: number;
  agentOrdersCount: number;
  statusCounts: Record<OrderStatus, number>;
  topProducts: {
    sku: string;
    name: string;
    quantity: number;
    revenueJPY: number;
  }[];
}

export interface NewsTickerItem {
  id: string;
  km: string;
  en: string;
  tagKm: string;
  tagEn: string;
}

export type FAQCategory = 'general' | 'sim_esim' | 'pocket_wifi' | 'delivery_return' | 'payment_support';

export interface FAQItem {
  id: string;
  category: FAQCategory;
  questionKm: string;
  questionEn: string;
  answerKm: string;
  answerEn: string;
  order: number;
  isActive: boolean;
}

export interface SiteSettings {
  siteName: string;
  taglineKm: string;
  taglineEn: string;
  announcementKm: string;
  announcementEn: string;
  showAnnouncement: boolean;
  announcementsList?: NewsTickerItem[];
  faqs?: FAQItem[];
  hotline: string;
  telegramUsername: string;
  facebookUrl: string;
  youtubeUrl: string;
  lineUrl: string;
  heroHeadlineKm: string;
  heroHeadlineEn: string;
  heroSubheadlineKm: string;
  heroSubheadlineEn: string;
  defaultShippingJPY: number;
  companyEmail: string;
  officeAddressKm: string;
  officeAddressEn: string;
}


