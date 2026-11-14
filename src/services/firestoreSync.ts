import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  Timestamp,
  Unsubscribe,
  updateDoc,
  where,
  writeBatch,
} from 'firebase/firestore';
import {
  auth,
  db,
  handleFirestoreError,
  isBootstrappedAdminUser,
  OperationType,
} from '../firebase';
import {
  AppsScriptConfig,
  CustomerRecord,
  Order,
  Product,
  SiteSettings,
  TelegramConfig,
} from '../types';

const clampStr = (val: unknown, max: number): string => {
  const s = String(val ?? '');
  return s.length > max ? s.slice(0, max) : s;
};

export const toSafeDocId = (raw: string): string => {
  const cleaned = String(raw || '')
    .trim()
    .replace(/[^a-zA-Z0-9_-]/g, '_');
  if (!cleaned) return `doc_${Date.now()}`;
  return cleaned.slice(0, 128);
};

const timestampToIso = (val: unknown): string => {
  if (!val) return new Date().toISOString();
  if (typeof val === 'string') return val;
  if (val instanceof Timestamp) return val.toDate().toISOString();
  if (typeof (val as { toDate?: () => Date }).toDate === 'function') {
    return (val as { toDate: () => Date }).toDate().toISOString();
  }
  return new Date().toISOString();
};

const sanitizeProductPayload = (product: Product) => {
  const safeId = toSafeDocId(product.id);
  const payload: Record<string, unknown> = {
    id: safeId.slice(0, 64),
    sku: clampStr(product.sku || 'GJ-SKU', 64),
    nameKm: clampStr(product.nameKm || product.nameEn || 'GoJapan Product', 200),
    nameEn: clampStr(product.nameEn || product.nameKm || 'GoJapan Product', 200),
    category: product.category,
    priceJPY: Math.max(0, Math.min(10000000, Number(product.priceJPY || 0))),
    speed: clampStr(product.speed || '', 100),
    dataQuota: clampStr(product.dataQuota || '', 100),
    carrier: product.carrier || 'Docomo',
    descriptionKm: clampStr(product.descriptionKm || '', 2000),
    descriptionEn: clampStr(product.descriptionEn || '', 2000),
    isActive: Boolean(product.isActive),
    updatedAt: serverTimestamp(),
  };
  if (product.imageUrl !== undefined && product.imageUrl !== '') {
    payload.imageUrl = clampStr(product.imageUrl, 1000);
  }
  if (product.badge !== undefined && product.badge !== '') {
    payload.badge = clampStr(product.badge, 64);
  }
  if (product.isRental !== undefined) {
    payload.isRental = Boolean(product.isRental);
  }
  return payload;
};

const sanitizeOrderPayload = (order: Order, includeCreatedAt: boolean) => {
  const safeId = toSafeDocId(order.id).slice(0, 64);
  const safeItems = (order.items && order.items.length > 0 ? order.items : [
    {
      productId: 'default',
      sku: 'GJ-ITEM',
      productName: 'GoJapan Service',
      category: 'sim_esim',
      unitPriceJPY: Number(order.totalJPY || 0),
      quantity: 1,
      subtotalJPY: Number(order.totalJPY || 0),
    },
  ]).slice(0, 50);

  const safeHistory = (order.statusHistory && order.statusHistory.length > 0
    ? order.statusHistory
    : [
        {
          status: order.status || 'new',
          timestamp: order.createdAt || new Date().toISOString(),
          noteKm: 'ការកម្មង់ត្រូវបានបង្កើត',
          noteEn: 'Order created',
        },
      ]).slice(0, 30);

  const payload: Record<string, unknown> = {
    customerType: order.customerType === 'agent' ? 'agent' : 'customer',
    customerName: clampStr(order.customerName || 'Customer', 120),
    phoneNumber: clampStr((order.phoneNumber || '00000').trim(), 40),
    provinceCity: clampStr(order.provinceCity || 'Tokyo', 160),
    districtKhan: clampStr(order.districtKhan || '', 160),
    communeSangkat: clampStr(order.communeSangkat || '', 100),
    village: clampStr(order.village || '', 160),
    streetAddress: clampStr(order.streetAddress || '', 300),
    items: safeItems,
    subtotalJPY: Math.max(0, Math.min(50000000, Number(order.subtotalJPY || 0))),
    shippingJPY: Math.max(0, Math.min(1000000, Number(order.shippingJPY || 0))),
    totalJPY: Math.max(0, Math.min(51000000, Number(order.totalJPY || 0))),
    status: order.status || 'new',
    statusHistory: safeHistory,
    syncedToGoogleSheets: Boolean(order.syncedToGoogleSheets),
    updatedAt: serverTimestamp(),
  };

  if (includeCreatedAt) {
    payload.id = safeId;
    payload.createdAt = serverTimestamp();
  }
  if (order.agentId !== undefined && order.agentId !== '') {
    payload.agentId = clampStr(order.agentId, 64);
  }
  if (order.telegram !== undefined && order.telegram !== '') {
    payload.telegram = clampStr(order.telegram, 80);
  }
  if (order.remarks !== undefined && order.remarks !== '') {
    payload.remarks = clampStr(order.remarks, 1000);
  }
  if (order.syncError !== undefined && order.syncError !== '') {
    payload.syncError = clampStr(order.syncError, 500);
  }

  return payload;
};

const sanitizeTrackingPayload = (order: Order, includeCreatedAt: boolean) => {
  const safeId = toSafeDocId(order.id).slice(0, 64);
  const safeItems = (order.items && order.items.length > 0 ? order.items : [
    {
      productId: 'default',
      sku: 'GJ-ITEM',
      productName: 'GoJapan Service',
      category: 'sim_esim',
      unitPriceJPY: Number(order.totalJPY || 0),
      quantity: 1,
      subtotalJPY: Number(order.totalJPY || 0),
    },
  ]).slice(0, 50);

  const safeHistory = (order.statusHistory && order.statusHistory.length > 0
    ? order.statusHistory
    : [
        {
          status: order.status || 'new',
          timestamp: order.createdAt || new Date().toISOString(),
          noteKm: 'ការកម្មង់ត្រូវបានបង្កើត',
          noteEn: 'Order created',
        },
      ]).slice(0, 30);

  const payload: Record<string, unknown> = {
    provinceCity: clampStr(order.provinceCity || 'Tokyo', 160),
    districtKhan: clampStr(order.districtKhan || '', 160),
    items: safeItems,
    subtotalJPY: Math.max(0, Math.min(50000000, Number(order.subtotalJPY || 0))),
    shippingJPY: Math.max(0, Math.min(1000000, Number(order.shippingJPY || 0))),
    totalJPY: Math.max(0, Math.min(51000000, Number(order.totalJPY || 0))),
    status: order.status || 'new',
    statusHistory: safeHistory,
    syncedToGoogleSheets: Boolean(order.syncedToGoogleSheets),
    updatedAt: serverTimestamp(),
  };

  if (includeCreatedAt) {
    payload.id = safeId;
    payload.createdAt = serverTimestamp();
  }
  return payload;
};

const sanitizeSiteSettingsPayload = (settings: SiteSettings) => {
  const payload: Record<string, unknown> = {
    siteName: clampStr(settings.siteName || 'GoJapan 24hours', 100),
    taglineKm: clampStr(settings.taglineKm || '', 300),
    taglineEn: clampStr(settings.taglineEn || '', 300),
    announcementKm: clampStr(settings.announcementKm || '', 500),
    announcementEn: clampStr(settings.announcementEn || '', 500),
    showAnnouncement: Boolean(settings.showAnnouncement),
    hotline: clampStr(settings.hotline || '', 120),
    telegramUsername: clampStr(settings.telegramUsername || '', 80),
    facebookUrl: clampStr(settings.facebookUrl || '', 300),
    youtubeUrl: clampStr(settings.youtubeUrl || '', 300),
    lineUrl: clampStr(settings.lineUrl || '', 300),
    heroHeadlineKm: clampStr(settings.heroHeadlineKm || '', 240),
    heroHeadlineEn: clampStr(settings.heroHeadlineEn || '', 240),
    heroSubheadlineKm: clampStr(settings.heroSubheadlineKm || '', 600),
    heroSubheadlineEn: clampStr(settings.heroSubheadlineEn || '', 600),
    defaultShippingJPY: Math.max(0, Math.min(100000, Number(settings.defaultShippingJPY ?? 500))),
    companyEmail: clampStr(settings.companyEmail || '', 160),
    officeAddressKm: clampStr(settings.officeAddressKm || '', 300),
    officeAddressEn: clampStr(settings.officeAddressEn || '', 300),
    updatedAt: serverTimestamp(),
  };
  if (Array.isArray(settings.announcementsList)) {
    payload.announcementsList = settings.announcementsList.slice(0, 20);
  }
  if (Array.isArray(settings.faqs)) {
    payload.faqs = settings.faqs.slice(0, 50);
  }
  return payload;
};

const sanitizeTelegramConfigPayload = (cfg: TelegramConfig) => {
  const payload: Record<string, unknown> = {
    botToken: clampStr(cfg.botToken || '', 200),
    chatId: clampStr(cfg.chatId || '', 80),
    enabled: cfg.enabled !== false,
    notifyOnNewOrder: cfg.notifyOnNewOrder !== false,
    notifyOnStatusUpdate: cfg.notifyOnStatusUpdate !== false,
    updatedAt: serverTimestamp(),
  };
  if (cfg.chatTitle) payload.chatTitle = clampStr(cfg.chatTitle, 160);
  if (cfg.chatType) payload.chatType = cfg.chatType;
  if (cfg.lastNotifiedAt) payload.lastNotifiedAt = clampStr(cfg.lastNotifiedAt, 64);
  if (cfg.lastReportSentAt) payload.lastReportSentAt = clampStr(cfg.lastReportSentAt, 64);
  if (cfg.lastStatus) payload.lastStatus = clampStr(cfg.lastStatus, 240);
  return payload;
};

const sanitizeAppsScriptPayload = (
  cfg: AppsScriptConfig,
  extra?: { telegramConfigured?: boolean; telegramChatTitle?: string }
) => {
  const rawUrl = clampStr((cfg.webAppUrl || '').trim(), 500);
  const validUrl =
    rawUrl === '' || rawUrl.startsWith('https://script.google.com/macros/s/')
      ? rawUrl
      : '';
  const payload: Record<string, unknown> = {
    webAppUrl: validUrl,
    isConnected: Boolean(cfg.isConnected && validUrl),
    updatedAt: serverTimestamp(),
  };
  if (cfg.lastSyncedAt) payload.lastSyncedAt = clampStr(cfg.lastSyncedAt, 64);
  if (cfg.lastStatus) payload.lastStatus = clampStr(cfg.lastStatus, 240);
  if (extra?.telegramConfigured !== undefined) {
    payload.telegramConfigured = extra.telegramConfigured;
  } else if (cfg.telegramConfigured !== undefined) {
    payload.telegramConfigured = cfg.telegramConfigured;
  }
  if (extra?.telegramChatTitle) {
    payload.telegramChatTitle = clampStr(extra.telegramChatTitle, 160);
  } else if (cfg.telegramChatTitle) {
    payload.telegramChatTitle = clampStr(cfg.telegramChatTitle, 160);
  }
  return payload;
};

const mapFirestoreOrder = (data: Record<string, unknown>, id: string): Order => {
  return {
    id: String(data.id || id),
    createdAt: timestampToIso(data.createdAt),
    customerType: data.customerType === 'agent' ? 'agent' : 'customer',
    agentId: data.agentId ? String(data.agentId) : undefined,
    customerName: String(data.customerName || ''),
    phoneNumber: String(data.phoneNumber || ''),
    telegram: data.telegram ? String(data.telegram) : undefined,
    provinceCity: String(data.provinceCity || ''),
    districtKhan: String(data.districtKhan || ''),
    communeSangkat: String(data.communeSangkat || ''),
    village: String(data.village || ''),
    streetAddress: String(data.streetAddress || ''),
    items: Array.isArray(data.items) ? (data.items as Order['items']) : [],
    subtotalJPY: Number(data.subtotalJPY || 0),
    shippingJPY: Number(data.shippingJPY || 0),
    totalJPY: Number(data.totalJPY || 0),
    status: (data.status as Order['status']) || 'new',
    statusHistory: Array.isArray(data.statusHistory)
      ? (data.statusHistory as Order['statusHistory'])
      : [],
    remarks: data.remarks ? String(data.remarks) : undefined,
    syncedToGoogleSheets: Boolean(data.syncedToGoogleSheets),
    syncError: data.syncError ? String(data.syncError) : undefined,
  };
};

export const firestoreSync = {
  isCloudAdminActive(): boolean {
    return isBootstrappedAdminUser(auth.currentUser);
  },

  // PUBLIC SUBSCRIPTIONS (Safe for all visitors across all devices)
  subscribePublicProducts(onUpdate: (products: Product[]) => void): Unsubscribe {
    const path = 'products';
    const q = query(collection(db, path), where('isActive', '==', true));
    return onSnapshot(
      q,
      (snapshot) => {
        if (snapshot.empty) return;
        const list: Product[] = snapshot.docs.map((d) => {
          const data = d.data();
          return {
            id: String(data.id || d.id),
            sku: String(data.sku || ''),
            nameKm: String(data.nameKm || ''),
            nameEn: String(data.nameEn || ''),
            category: data.category,
            priceJPY: Number(data.priceJPY || 0),
            speed: String(data.speed || ''),
            dataQuota: String(data.dataQuota || ''),
            carrier: data.carrier,
            descriptionKm: String(data.descriptionKm || ''),
            descriptionEn: String(data.descriptionEn || ''),
            imageUrl: data.imageUrl ? String(data.imageUrl) : undefined,
            badge: data.badge ? String(data.badge) : undefined,
            isActive: Boolean(data.isActive),
            isRental: data.isRental !== undefined ? Boolean(data.isRental) : undefined,
          };
        });
        onUpdate(list);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, path);
      }
    );
  },

  subscribeSiteSettings(onUpdate: (settings: SiteSettings) => void): Unsubscribe {
    const path = 'site_settings/default';
    return onSnapshot(
      doc(db, 'site_settings', 'default'),
      (snap) => {
        if (!snap.exists()) return;
        const data = snap.data();
        onUpdate({
          siteName: String(data.siteName || 'GoJapan 24hours'),
          taglineKm: String(data.taglineKm || ''),
          taglineEn: String(data.taglineEn || ''),
          announcementKm: String(data.announcementKm || ''),
          announcementEn: String(data.announcementEn || ''),
          showAnnouncement: Boolean(data.showAnnouncement),
          announcementsList: Array.isArray(data.announcementsList) ? data.announcementsList : undefined,
          faqs: Array.isArray(data.faqs) ? data.faqs : undefined,
          hotline: String(data.hotline || ''),
          telegramUsername: String(data.telegramUsername || ''),
          facebookUrl: String(data.facebookUrl || ''),
          youtubeUrl: String(data.youtubeUrl || ''),
          lineUrl: String(data.lineUrl || ''),
          heroHeadlineKm: String(data.heroHeadlineKm || ''),
          heroHeadlineEn: String(data.heroHeadlineEn || ''),
          heroSubheadlineKm: String(data.heroSubheadlineKm || ''),
          heroSubheadlineEn: String(data.heroSubheadlineEn || ''),
          defaultShippingJPY: Number(data.defaultShippingJPY ?? 500),
          companyEmail: String(data.companyEmail || ''),
          officeAddressKm: String(data.officeAddressKm || ''),
          officeAddressEn: String(data.officeAddressEn || ''),
        });
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, path);
      }
    );
  },

  subscribePublicAppsScriptConfig(onUpdate: (cfg: AppsScriptConfig) => void): Unsubscribe {
    const path = 'integration_public/apps_script';
    return onSnapshot(
      doc(db, 'integration_public', 'apps_script'),
      (snap) => {
        if (!snap.exists()) return;
        const data = snap.data();
        onUpdate({
          webAppUrl: String(data.webAppUrl || ''),
          isConnected: Boolean(data.isConnected),
          lastSyncedAt: data.lastSyncedAt ? String(data.lastSyncedAt) : undefined,
          lastStatus: data.lastStatus ? String(data.lastStatus) : undefined,
          telegramConfigured:
            data.telegramConfigured !== undefined ? Boolean(data.telegramConfigured) : undefined,
          telegramChatTitle: data.telegramChatTitle ? String(data.telegramChatTitle) : undefined,
        });
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, path);
      }
    );
  },

  async fetchOrderTrackingById(orderId: string): Promise<Order | null> {
    const safeId = toSafeDocId(orderId.trim().toUpperCase());
    const prefixedId = safeId.startsWith('GJ-') ? safeId : `GJ-${safeId}`;
    const candidates = safeId === prefixedId ? [safeId] : [safeId, prefixedId];

    for (const candidate of candidates) {
      const path = `order_tracking/${candidate}`;
      try {
        const snap = await getDoc(doc(db, 'order_tracking', candidate));
        if (snap.exists()) {
          const data = snap.data();
          return {
            id: String(data.id || candidate),
            createdAt: timestampToIso(data.createdAt),
            customerType: 'customer',
            customerName: 'GoJapan Customer',
            phoneNumber: 'Protected',
            provinceCity: String(data.provinceCity || ''),
            districtKhan: String(data.districtKhan || ''),
            communeSangkat: '',
            village: '',
            streetAddress: '',
            items: Array.isArray(data.items) ? (data.items as Order['items']) : [],
            subtotalJPY: Number(data.subtotalJPY || 0),
            shippingJPY: Number(data.shippingJPY || 0),
            totalJPY: Number(data.totalJPY || 0),
            status: (data.status as Order['status']) || 'new',
            statusHistory: Array.isArray(data.statusHistory)
              ? (data.statusHistory as Order['statusHistory'])
              : [],
            syncedToGoogleSheets: Boolean(data.syncedToGoogleSheets),
          };
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, path);
      }
    }
    return null;
  },

  // ADMIN REAL-TIME SUBSCRIPTIONS (Must only be attached when isBootstrappedAdminUser is true)
  subscribeAdminProducts(onUpdate: (products: Product[]) => void): Unsubscribe {
    const path = 'products';
    return onSnapshot(
      collection(db, path),
      (snapshot) => {
        if (snapshot.empty) return;
        const list: Product[] = snapshot.docs.map((d) => {
          const data = d.data();
          return {
            id: String(data.id || d.id),
            sku: String(data.sku || ''),
            nameKm: String(data.nameKm || ''),
            nameEn: String(data.nameEn || ''),
            category: data.category,
            priceJPY: Number(data.priceJPY || 0),
            speed: String(data.speed || ''),
            dataQuota: String(data.dataQuota || ''),
            carrier: data.carrier,
            descriptionKm: String(data.descriptionKm || ''),
            descriptionEn: String(data.descriptionEn || ''),
            imageUrl: data.imageUrl ? String(data.imageUrl) : undefined,
            badge: data.badge ? String(data.badge) : undefined,
            isActive: Boolean(data.isActive),
            isRental: data.isRental !== undefined ? Boolean(data.isRental) : undefined,
          };
        });
        onUpdate(list);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, path);
      }
    );
  },

  subscribeAdminOrders(onUpdate: (orders: Order[]) => void): Unsubscribe {
    const path = 'orders';
    const q = query(collection(db, path), orderBy('createdAt', 'desc'));
    return onSnapshot(
      q,
      (snapshot) => {
        const list: Order[] = snapshot.docs.map((d) => mapFirestoreOrder(d.data(), d.id));
        onUpdate(list);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, path);
      }
    );
  },

  subscribeAdminCustomers(onUpdate: (customers: Record<string, CustomerRecord>) => void): Unsubscribe {
    const path = 'customers';
    return onSnapshot(
      collection(db, path),
      (snapshot) => {
        const map: Record<string, CustomerRecord> = {};
        snapshot.docs.forEach((d) => {
          const data = d.data();
          const phone = String(data.phoneNumber || d.id);
          map[phone] = {
            phoneNumber: phone,
            customerName: String(data.customerName || ''),
            customerType: data.customerType === 'agent' ? 'agent' : 'customer',
            telegram: data.telegram ? String(data.telegram) : undefined,
            provinceCity: String(data.provinceCity || ''),
            totalOrders: Number(data.totalOrders || 0),
            totalSpentJPY: Number(data.totalSpentJPY || 0),
            lastOrderDate: String(data.lastOrderDate || new Date().toISOString()),
          };
        });
        onUpdate(map);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, path);
      }
    );
  },

  subscribeAdminTelegramConfig(onUpdate: (cfg: TelegramConfig) => void): Unsubscribe {
    const path = 'admin_configs/telegram';
    return onSnapshot(
      doc(db, 'admin_configs', 'telegram'),
      (snap) => {
        if (!snap.exists()) return;
        const data = snap.data();
        onUpdate({
          botToken: String(data.botToken || ''),
          chatId: String(data.chatId || ''),
          chatTitle: data.chatTitle ? String(data.chatTitle) : undefined,
          chatType: data.chatType ? (data.chatType as TelegramConfig['chatType']) : undefined,
          enabled: data.enabled !== false,
          notifyOnNewOrder: data.notifyOnNewOrder !== false,
          notifyOnStatusUpdate: data.notifyOnStatusUpdate !== false,
          lastNotifiedAt: data.lastNotifiedAt ? String(data.lastNotifiedAt) : undefined,
          lastReportSentAt: data.lastReportSentAt ? String(data.lastReportSentAt) : undefined,
          lastStatus: data.lastStatus ? String(data.lastStatus) : undefined,
        });
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, path);
      }
    );
  },

  // WRITE OPERATIONS
  async createOrderAtomic(order: Order): Promise<void> {
    const safeId = toSafeDocId(order.id).slice(0, 64);
    const batch = writeBatch(db);
    const orderForCreate: Order = {
      ...order,
      id: safeId,
      status: this.isCloudAdminActive() ? order.status : 'new',
      syncedToGoogleSheets: this.isCloudAdminActive() ? order.syncedToGoogleSheets : false,
    };
    batch.set(doc(db, 'orders', safeId), sanitizeOrderPayload(orderForCreate, true));
    batch.set(doc(db, 'order_tracking', safeId), sanitizeTrackingPayload(orderForCreate, true));
    try {
      await batch.commit();
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `orders/${safeId}`);
    }
  },

  async updateOrderAdmin(order: Order): Promise<void> {
    if (!this.isCloudAdminActive()) return;
    const safeId = toSafeDocId(order.id).slice(0, 64);
    const batch = writeBatch(db);
    const orderRef = doc(db, 'orders', safeId);
    const trackRef = doc(db, 'order_tracking', safeId);
    const orderSnap = await getDoc(orderRef);

    if (!orderSnap.exists()) {
      batch.set(orderRef, sanitizeOrderPayload(order, true));
      batch.set(trackRef, sanitizeTrackingPayload(order, true));
    } else {
      const { customerType: _ct, ...editableOrderFields } = sanitizeOrderPayload(order, false);
      batch.update(orderRef, editableOrderFields);

      const trackSnap = await getDoc(trackRef);
      if (!trackSnap.exists()) {
        batch.set(trackRef, sanitizeTrackingPayload(order, true));
      } else {
        batch.update(trackRef, sanitizeTrackingPayload(order, false));
      }
    }

    try {
      await batch.commit();
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `orders/${safeId}`);
    }
  },

  async updateOrderSyncStatusAdmin(
    orderId: string,
    syncedToGoogleSheets: boolean,
    syncError?: string
  ): Promise<void> {
    if (!this.isCloudAdminActive()) return;
    const safeId = toSafeDocId(orderId).slice(0, 64);
    try {
      const orderRef = doc(db, 'orders', safeId);
      const snap = await getDoc(orderRef);
      if (!snap.exists()) return;
      const updatePayload: Record<string, unknown> = {
        syncedToGoogleSheets,
        updatedAt: serverTimestamp(),
      };
      if (syncError) {
        updatePayload.syncError = clampStr(syncError, 500);
      }
      await updateDoc(orderRef, updatePayload);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `orders/${safeId}`);
    }
  },

  async deleteOrderAdmin(orderId: string): Promise<void> {
    if (!this.isCloudAdminActive()) return;
    const safeId = toSafeDocId(orderId).slice(0, 64);
    try {
      const batch = writeBatch(db);
      batch.delete(doc(db, 'orders', safeId));
      batch.delete(doc(db, 'order_tracking', safeId));
      await batch.commit();
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `orders/${safeId}`);
    }
  },

  async saveProductAdmin(product: Product): Promise<void> {
    if (!this.isCloudAdminActive()) return;
    const safeId = toSafeDocId(product.id).slice(0, 64);
    const ref = doc(db, 'products', safeId);
    try {
      const snap = await getDoc(ref);
      const payload = sanitizeProductPayload({ ...product, id: safeId });
      if (!snap.exists()) {
        await setDoc(ref, payload);
      } else {
        const { id: _id, ...updateFields } = payload;
        await updateDoc(ref, updateFields);
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `products/${safeId}`);
    }
  },

  async deleteProductAdmin(id: string): Promise<void> {
    if (!this.isCloudAdminActive()) return;
    const safeId = toSafeDocId(id).slice(0, 64);
    try {
      await deleteDoc(doc(db, 'products', safeId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `products/${safeId}`);
    }
  },

  async saveCustomerAdmin(customer: CustomerRecord): Promise<void> {
    if (!this.isCloudAdminActive()) return;
    const safeId = toSafeDocId(customer.phoneNumber);
    const ref = doc(db, 'customers', safeId);
    const payload: Record<string, unknown> = {
      phoneNumber: clampStr(customer.phoneNumber, 40),
      customerName: clampStr(customer.customerName || 'Customer', 120),
      customerType: customer.customerType === 'agent' ? 'agent' : 'customer',
      provinceCity: clampStr(customer.provinceCity || 'Tokyo', 160),
      totalOrders: Math.max(0, Math.min(100000, Number(customer.totalOrders || 0))),
      totalSpentJPY: Math.max(0, Math.min(1000000000, Number(customer.totalSpentJPY || 0))),
      lastOrderDate: clampStr(customer.lastOrderDate || new Date().toISOString(), 64),
      updatedAt: serverTimestamp(),
    };
    if (customer.telegram) {
      payload.telegram = clampStr(customer.telegram, 80);
    }
    try {
      const snap = await getDoc(ref);
      if (!snap.exists()) {
        await setDoc(ref, payload);
      } else {
        const { phoneNumber: _pn, ...updateFields } = payload;
        await updateDoc(ref, updateFields);
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `customers/${safeId}`);
    }
  },

  async deleteCustomerAdmin(phone: string): Promise<void> {
    if (!this.isCloudAdminActive()) return;
    const safeId = toSafeDocId(phone);
    try {
      await deleteDoc(doc(db, 'customers', safeId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `customers/${safeId}`);
    }
  },

  async saveSiteSettingsAdmin(settings: SiteSettings): Promise<void> {
    if (!this.isCloudAdminActive()) return;
    const ref = doc(db, 'site_settings', 'default');
    try {
      await setDoc(ref, sanitizeSiteSettingsPayload(settings));
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'site_settings/default');
    }
  },

  async saveTelegramConfigAdmin(cfg: TelegramConfig): Promise<void> {
    if (!this.isCloudAdminActive()) return;
    const ref = doc(db, 'admin_configs', 'telegram');
    try {
      await setDoc(ref, sanitizeTelegramConfigPayload(cfg));
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'admin_configs/telegram');
    }
  },

  async saveAppsScriptConfigAdmin(
    cfg: AppsScriptConfig,
    extra?: { telegramConfigured?: boolean; telegramChatTitle?: string }
  ): Promise<void> {
    if (!this.isCloudAdminActive()) return;
    const ref = doc(db, 'integration_public', 'apps_script');
    try {
      await setDoc(ref, sanitizeAppsScriptPayload(cfg, extra));
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'integration_public/apps_script');
    }
  },

  // Initial Cloud Migration / Seed when Admin connects for the first time
  async bootstrapCloudFromLocalIfEmpty(localState: {
    products: Product[];
    orders: Order[];
    siteSettings: SiteSettings;
    telegramConfig: TelegramConfig;
    appsScriptConfig: AppsScriptConfig;
  }): Promise<void> {
    if (!this.isCloudAdminActive()) return;

    try {
      // 1. Seed products if Firestore /products is empty
      const prodSnap = await getDocs(collection(db, 'products'));
      if (prodSnap.empty && localState.products.length > 0) {
        const batch = writeBatch(db);
        localState.products.forEach((p) => {
          const safeId = toSafeDocId(p.id).slice(0, 64);
          batch.set(doc(db, 'products', safeId), sanitizeProductPayload({ ...p, id: safeId }));
        });
        await batch.commit();
      }

      // 2. Seed site_settings/default if missing
      const settingsSnap = await getDoc(doc(db, 'site_settings', 'default'));
      if (!settingsSnap.exists()) {
        await setDoc(
          doc(db, 'site_settings', 'default'),
          sanitizeSiteSettingsPayload(localState.siteSettings)
        );
      }

      // 3. Seed admin_configs/telegram if missing in cloud AND present locally
      const tgRef = doc(db, 'admin_configs', 'telegram');
      const tgSnap = await getDoc(tgRef);
      if (!tgSnap.exists() && (localState.telegramConfig.botToken || localState.telegramConfig.chatId)) {
        await setDoc(tgRef, sanitizeTelegramConfigPayload(localState.telegramConfig));
      }

      // 4. Seed integration_public/apps_script if missing in cloud AND present locally
      const appsRef = doc(db, 'integration_public', 'apps_script');
      const appsSnap = await getDoc(appsRef);
      if (!appsSnap.exists() && localState.appsScriptConfig.webAppUrl) {
        await setDoc(
          appsRef,
          sanitizeAppsScriptPayload(localState.appsScriptConfig, {
            telegramConfigured: Boolean(
              localState.telegramConfig.botToken && localState.telegramConfig.chatId
            ),
            telegramChatTitle: localState.telegramConfig.chatTitle,
          })
        );
      }

      // 5. Seed initial orders if Firestore /orders is empty
      const ordersSnap = await getDocs(collection(db, 'orders'));
      if (ordersSnap.empty && localState.orders.length > 0) {
        const batch = writeBatch(db);
        localState.orders.slice(0, 20).forEach((o) => {
          const safeId = toSafeDocId(o.id).slice(0, 64);
          batch.set(doc(db, 'orders', safeId), sanitizeOrderPayload({ ...o, id: safeId }, true));
          batch.set(
            doc(db, 'order_tracking', safeId),
            sanitizeTrackingPayload({ ...o, id: safeId }, true)
          );
        });
        await batch.commit();
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'bootstrap');
    }
  },
};
