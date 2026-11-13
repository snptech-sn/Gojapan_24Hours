import React, { useState, useEffect } from 'react';
import {
  Send,
  Plus,
  Trash2,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  FileText,
  Printer,
  ExternalLink,
  Building2,
  User,
  Shield,
} from 'lucide-react';
import { CAMBODIA_PROVINCES } from '../data/cambodiaLocations';
import { storageService } from '../services/storageService';
import { CustomerType, Language, Order, OrderItem, Product } from '../types';
import { translations } from '../utils/translations';

interface OrderFormProps {
  products: Product[];
  initialItems?: OrderItem[];
  language: Language;
  onOrderSubmitted?: (newOrder: Order) => void;
  onGoToTracking?: (orderId: string) => void;
}

// Generate unique Order ID
const generateOrderId = (): string => {
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `GJ-2026-${randomNum}`;
};

export const OrderForm: React.FC<OrderFormProps> = ({
  products,
  initialItems = [],
  language,
  onOrderSubmitted,
  onGoToTracking,
}) => {
  const t = translations[language];

  // Form State
  const [orderId, setOrderId] = useState<string>(generateOrderId());
  const [customerType, setCustomerType] = useState<CustomerType>('customer');
  const [agentId, setAgentId] = useState<string>('');
  const [customerName, setCustomerName] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [telegram, setTelegram] = useState<string>('');

  // Location Hierarchy
  const [provinceCity, setProvinceCity] = useState<string>(CAMBODIA_PROVINCES[0].nameKm);
  const [districtKhan, setDistrictKhan] = useState<string>(CAMBODIA_PROVINCES[0].districts[0].nameKm);
  const [communeSangkat, setCommuneSangkat] = useState<string>('');
  const [village, setVillage] = useState<string>('');
  const [streetAddress, setStreetAddress] = useState<string>('');

  // Multi-item order list
  const [orderItems, setOrderItems] = useState<OrderItem[]>(() => {
    if (initialItems.length > 0) return initialItems;
    // Default to first product if available
    const first = products[0];
    if (first) {
      return [
        {
          productId: first.id,
          sku: first.sku,
          productName: first.nameKm,
          category: first.category,
          unitPriceJPY: first.priceJPY,
          quantity: 1,
          subtotalJPY: first.priceJPY,
        },
      ];
    }
    return [];
  });

  const [shippingJPY, setShippingJPY] = useState<number>(500);
  const [remarks, setRemarks] = useState<string>('');

  // Submission & UI States
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [successOrder, setSuccessOrder] = useState<Order | null>(null);
  const [syncStatusMsg, setSyncStatusMsg] = useState<{ synced: boolean; text: string } | null>(null);
  const [telegramStatusMsg, setTelegramStatusMsg] = useState<{ sent: boolean; text: string } | null>(null);
  const [isRetryingTelegram, setIsRetryingTelegram] = useState<boolean>(false);

  // Sync initial items when cart changes
  useEffect(() => {
    if (initialItems.length > 0) {
      setOrderItems(initialItems);
    }
  }, [initialItems]);

  // Update districts when province changes
  const selectedProvinceData = CAMBODIA_PROVINCES.find((p) => p.nameKm === provinceCity);
  const availableDistricts = selectedProvinceData ? selectedProvinceData.districts : [];

  const handleProvinceChange = (newProv: string) => {
    setProvinceCity(newProv);
    const provObj = CAMBODIA_PROVINCES.find((p) => p.nameKm === newProv);
    if (provObj && provObj.districts.length > 0) {
      setDistrictKhan(provObj.districts[0].nameKm);
    } else {
      setDistrictKhan('');
    }
  };

  // Item management
  const handleAddItem = () => {
    const firstProd = products[0];
    if (!firstProd) return;
    setOrderItems((prev) => [
      ...prev,
      {
        productId: firstProd.id,
        sku: firstProd.sku,
        productName: language === 'km' ? firstProd.nameKm : firstProd.nameEn,
        category: firstProd.category,
        unitPriceJPY: firstProd.priceJPY,
        quantity: 1,
        subtotalJPY: firstProd.priceJPY,
      },
    ]);
  };

  const handleProductChange = (index: number, newProductId: string) => {
    const found = products.find((p) => p.id === newProductId);
    if (!found) return;

    setOrderItems((prev) => {
      const updated = [...prev];
      const curQty = updated[index].quantity || 1;
      updated[index] = {
        productId: found.id,
        sku: found.sku,
        productName: language === 'km' ? found.nameKm : found.nameEn,
        category: found.category,
        unitPriceJPY: found.priceJPY,
        quantity: curQty,
        subtotalJPY: found.priceJPY * curQty,
      };
      return updated;
    });
  };

  const handleQuantityChange = (index: number, newQty: number) => {
    if (newQty < 1) return;
    setOrderItems((prev) => {
      const updated = [...prev];
      updated[index].quantity = newQty;
      updated[index].subtotalJPY = updated[index].unitPriceJPY * newQty;
      return updated;
    });
  };

  const handleRemoveItem = (index: number) => {
    if (orderItems.length <= 1) {
      setValidationError(
        language === 'km'
          ? 'ការកម្មង់ត្រូវតែមានផលិតផលយ៉ាងតិចចំនួន ១មុខ'
          : 'Order must contain at least 1 product'
      );
      return;
    }
    setOrderItems((prev) => prev.filter((_, i) => i !== index));
    setValidationError(null);
  };

  // Calculations in JPY
  const subtotalJPY = orderItems.reduce((acc, it) => acc + it.subtotalJPY, 0);
  const grandTotalJPY = subtotalJPY + Number(shippingJPY || 0);

  // Clear Form
  const handleClearForm = () => {
    setOrderId(generateOrderId());
    setCustomerType('customer');
    setAgentId('');
    setCustomerName('');
    setPhoneNumber('');
    setTelegram('');
    setCommuneSangkat('');
    setVillage('');
    setStreetAddress('');
    setRemarks('');
    setValidationError(null);
    if (products[0]) {
      setOrderItems([
        {
          productId: products[0].id,
          sku: products[0].sku,
          productName: language === 'km' ? products[0].nameKm : products[0].nameEn,
          category: products[0].category,
          unitPriceJPY: products[0].priceJPY,
          quantity: 1,
          subtotalJPY: products[0].priceJPY,
        },
      ]);
    }
  };

  // Submit Order
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    // Validation
    if (!customerName.trim()) {
      setValidationError(
        language === 'km' ? 'សូមបញ្ចូលឈ្មោះអ្នកកម្មង់' : 'Please enter customer name'
      );
      return;
    }
    if (!phoneNumber.trim()) {
      setValidationError(
        language === 'km' ? 'សូមបញ្ចូលលេខទូរស័ព្ទ' : 'Please enter contact phone number'
      );
      return;
    }
    if (orderItems.length === 0) {
      setValidationError(
        language === 'km'
          ? 'សូមជ្រើសរើសផលិតផលយ៉ាងតិច ១មុខ'
          : 'Please select at least 1 product'
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const newOrder: Order = {
        id: orderId,
        createdAt: new Date().toISOString(),
        customerType,
        agentId: customerType === 'agent' ? agentId : undefined,
        customerName: customerName.trim(),
        phoneNumber: phoneNumber.trim(),
        telegram: telegram.trim() || undefined,
        provinceCity,
        districtKhan,
        communeSangkat: communeSangkat.trim(),
        village: village.trim(),
        streetAddress: streetAddress.trim(),
        items: orderItems,
        subtotalJPY,
        shippingJPY: Number(shippingJPY || 0),
        totalJPY: grandTotalJPY,
        status: 'new',
        remarks: remarks.trim() || undefined,
        syncedToGoogleSheets: false,
      };

      const result = await storageService.saveOrder(newOrder);

      setSuccessOrder(result.order);

      if (result.telegramNotified) {
        setTelegramStatusMsg({
          sent: true,
          text:
            language === 'km'
              ? 'បានផ្ញើការជូនដំណឹងចូល Telegram Group ដោយស្វ័យប្រវត្តិរួចរាល់!'
              : 'Order alert sent automatically to Telegram Group!',
        });
      } else {
        setTelegramStatusMsg({
          sent: false,
          text:
            result.telegramError ||
            (language === 'km'
              ? 'មិនទាន់អាចផ្ញើចូល Telegram Group ដោយស្វ័យប្រវត្តិបានទេ (សូមពិនិត្យការកំណត់ Telegram ក្នុង Admin Dashboard)'
              : 'Could not auto-send to Telegram Group. Please check Telegram settings in Admin Dashboard.'),
        });
      }

      if (result.synced) {
        setSyncStatusMsg({
          synced: true,
          text:
            language === 'km'
              ? 'បានបញ្ជូនទិន្នន័យទៅ Google Sheets ដោយស្វ័យប្រវត្តិក្នង Sheets ទាំង ៤ រួចរាល់!'
              : 'Synced in real-time to Google Sheets database!',
        });
      } else {
        setSyncStatusMsg({
          synced: false,
          text:
            language === 'km'
              ? 'បានកត់ត្រាក្នុងប្រព័ន្ធ GoJapan រួចរាល់ (អាចភ្ជាប់ Google Sheets ក្នុង Admin Dashboard)'
              : 'Saved locally in system buffer (Connect Google Sheets URL in Admin anytime).',
        });
      }

      if (onOrderSubmitted) {
        onOrderSubmitted(result.order);
      }
    } catch {
      setValidationError(
        language === 'km'
          ? 'មានបញ្ហាក្នុងការបញ្ជូនការកម្មង់ សូមព្យាយាមម្តងទៀត'
          : 'An error occurred while submitting order. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Generate Telegram sharing text
  const getTelegramUrl = (order: Order) => {
    const text = encodeURIComponent(
      `🇯🇵 *GoJapan 24hours Order Confirmation*\n` +
        `Order ID: ${order.id}\n` +
        `Customer: ${order.customerName} (${order.phoneNumber})\n` +
        `Total: ¥${order.totalJPY.toLocaleString()} JPY\n` +
        `Location: ${order.provinceCity}, ${order.districtKhan}\n` +
        `Status: New Order\n` +
        `Thank you for choosing GoJapan 24hours!`
    );
    return `https://t.me/share/url?url=${encodeURIComponent(window.location.origin)}&text=${text}`;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      
      {/* Header Banner */}
      <div className="mb-8 text-center sm:text-left border-b border-slate-200 pb-6">
        <div className="flex items-center gap-2 text-xs font-bold text-gojapan-600 mb-2">
          <span>GoJapan 24hours Direct Service</span>
          <span aria-hidden="true">·</span>
          <span>Google Sheets Integrated</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {t.orderFormTitle}
        </h1>
        <p className="text-sm text-slate-600 mt-1 max-w-2xl">
          {t.orderFormSubtitle}
        </p>
      </div>

      {/* Validation Message Box */}
      {validationError && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-center gap-3 text-red-700 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{validationError}</span>
        </div>
      )}

      {/* Order Placement Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* SECTION 1: ORDER METADATA & TYPE */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {t.orderIdLabel}
              </label>
              <span className="text-lg font-black font-mono text-gojapan-600 tracking-wider">
                {orderId}
              </span>
            </div>

            {/* Customer vs Agent Selector */}
            <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg">
              <button
                type="button"
                onClick={() => setCustomerType('customer')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                  customerType === 'customer'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>{t.typeCustomer}</span>
              </button>

              <button
                type="button"
                onClick={() => setCustomerType('agent')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                  customerType === 'agent'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Building2 className="w-3.5 h-3.5 text-gojapan-600" />
                <span>{t.typeAgent}</span>
              </button>
            </div>
          </div>

          {/* If Agent selected, show Agent ID */}
          {customerType === 'agent' && (
            <div className="p-3 rounded-lg bg-gojapan-50 border border-gojapan-200/80 flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <Shield className="w-4 h-4 text-gojapan-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <label className="block text-xs font-bold text-gojapan-950">
                  {t.agentCodeLabel} *
                </label>
                <input
                  type="text"
                  placeholder="e.g., AGENT-TK-889"
                  value={agentId}
                  onChange={(e) => setAgentId(e.target.value)}
                  className="mt-1 w-full max-w-xs px-3 py-1.5 text-xs rounded border border-gojapan-300 bg-white focus:outline-none focus:ring-1 focus:ring-gojapan-500"
                />
              </div>
              <span className="text-[11px] text-gojapan-700 font-medium">
                {language === 'km'
                  ? 'គណនាកម្រៃជើងសារ (Commission) ស្វ័យប្រវត្តិក្នង Google Sheets'
                  : 'Commission tracked directly in Sheet'}
              </span>
            </div>
          )}

          {/* Customer Personal Details */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t.customerName} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="e.g., Chan Sokha"
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-gojapan-500/20 focus:border-gojapan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t.customerPhone} <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                required
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="e.g., 012 889 977"
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-gojapan-500/20 focus:border-gojapan-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t.telegramContact}
              </label>
              <input
                type="text"
                value={telegram}
                onChange={(e) => setTelegram(e.target.value)}
                placeholder="@username or 012..."
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-gojapan-500/20 focus:border-gojapan-500"
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: CAMBODIA / JAPAN DELIVERY ADDRESS */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <span>{t.deliveryAddress}</span>
            <span className="text-xs font-normal text-slate-400">
              (ខេត្ត/ក្រុង, ស្រុក/ខណ្ឌ, ឃុំ/សង្កាត់, ភូមិ)
            </span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                {t.provinceCity} <span className="text-red-500">*</span>
              </label>
              <select
                value={provinceCity}
                onChange={(e) => handleProvinceChange(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-gojapan-500/20 focus:border-gojapan-500"
              >
                {CAMBODIA_PROVINCES.map((prov) => (
                  <option key={prov.nameKm} value={prov.nameKm}>
                    {prov.nameKm}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                {t.districtKhan} <span className="text-red-500">*</span>
              </label>
              <select
                value={districtKhan}
                onChange={(e) => setDistrictKhan(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-gojapan-500/20 focus:border-gojapan-500"
              >
                {availableDistricts.map((dist) => (
                  <option key={dist.nameKm} value={dist.nameKm}>
                    {dist.nameKm}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                {t.communeSangkat}
              </label>
              <input
                type="text"
                value={communeSangkat}
                onChange={(e) => setCommuneSangkat(e.target.value)}
                placeholder="e.g., សង្កាត់ទឹកល្អក់១"
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-gojapan-500/20 focus:border-gojapan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                {t.village}
              </label>
              <input
                type="text"
                value={village}
                onChange={(e) => setVillage(e.target.value)}
                placeholder="e.g., ភូមិ៣"
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-gojapan-500/20 focus:border-gojapan-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              {t.streetAddress}
            </label>
            <input
              type="text"
              value={streetAddress}
              onChange={(e) => setStreetAddress(e.target.value)}
              placeholder="e.g., ផ្ទះលេខ 45A, ផ្លូវ 1982 ឬ ព័ត៌មានលម្អិត..."
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-gojapan-500/20 focus:border-gojapan-500"
            />
          </div>
        </div>

        {/* SECTION 3: MULTI-ITEM PRODUCT SELECTION TABLE */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-slate-900">{t.orderItemsTitle}</h2>
              <p className="text-xs text-slate-500">
                {language === 'km'
                  ? 'អាចជ្រើសរើស និងបន្ថែមផលិតផលច្រើនមុខក្នុងការកម្មង់តែមួយ'
                  : 'Add multiple plans or equipment in a single order'}
              </p>
            </div>

            <button
              type="button"
              onClick={handleAddItem}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gojapan-600 bg-gojapan-50 hover:bg-gojapan-100 border border-gojapan-200/80 rounded-lg transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{t.addProduct}</span>
            </button>
          </div>

          {/* Products List Table */}
          <div className="space-y-3">
            {orderItems.map((item, index) => (
              <div
                key={index}
                className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/60 flex flex-col sm:grid sm:grid-cols-12 gap-3 sm:items-center"
              >
                {/* Product Dropdown */}
                <div className="sm:col-span-5">
                  <label className="block text-[11px] font-medium text-slate-500 mb-1 sm:hidden">
                    {t.selectProduct}
                  </label>
                  <select
                    value={item.productId}
                    onChange={(e) => handleProductChange(index, e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs font-medium rounded border border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-gojapan-500"
                  >
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.sku} - {language === 'km' ? p.nameKm : p.nameEn} (¥{p.priceJPY.toLocaleString()})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Mobile Info Bar & Desktop Columns */}
                <div className="flex sm:contents items-center justify-between gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200">
                  {/* Unit Price */}
                  <div className="sm:col-span-2 text-left sm:text-right">
                    <span className="text-[11px] text-slate-400 sm:hidden block">{t.unitPrice}</span>
                    <span className="text-xs font-bold font-mono text-slate-700 tabular-nums">
                      ¥{item.unitPriceJPY.toLocaleString()}
                    </span>
                  </div>

                  {/* Quantity */}
                  <div className="sm:col-span-2">
                    <span className="text-[11px] text-slate-400 sm:hidden block">{t.qty}</span>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        min="1"
                        max="99"
                        value={item.quantity}
                        onChange={(e) => handleQuantityChange(index, parseInt(e.target.value) || 1)}
                        className="w-14 sm:w-16 px-2 py-1 text-xs font-bold text-center rounded border border-slate-300 bg-white font-mono"
                      />
                    </div>
                  </div>

                  {/* Subtotal */}
                  <div className="sm:col-span-2 text-right">
                    <span className="text-[11px] text-slate-400 sm:hidden block">{t.subtotal}</span>
                    <span className="text-xs font-extrabold text-slate-900 font-mono tabular-nums">
                      ¥{item.subtotalJPY.toLocaleString()}
                    </span>
                  </div>

                  {/* Remove button */}
                  <div className="sm:col-span-1 text-right">
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(index)}
                      className="p-1.5 text-slate-400 hover:text-gojapan-600 rounded transition-colors cursor-pointer"
                      title={t.deleteProduct}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pricing Summary (JPY Pure) */}
          <div className="pt-4 border-t border-slate-100 flex flex-col items-end space-y-2">
            <div className="flex items-center justify-between w-full sm:w-72 text-xs">
              <span className="text-slate-500">{t.subtotal}:</span>
              <span className="font-bold text-slate-800 tabular-nums font-mono">
                ¥{subtotalJPY.toLocaleString()} JPY
              </span>
            </div>

            <div className="flex items-center justify-between w-full sm:w-72 text-xs">
              <span className="text-slate-500">{t.shippingFee}:</span>
              <div className="flex items-center gap-1">
                <span>¥</span>
                <input
                  type="number"
                  min="0"
                  step="100"
                  value={shippingJPY}
                  onChange={(e) => setShippingJPY(parseInt(e.target.value) || 0)}
                  className="w-20 px-2 py-0.5 text-xs font-bold text-right border border-slate-300 rounded font-mono"
                />
              </div>
            </div>

            <div className="flex items-center justify-between w-full sm:w-72 text-sm pt-2 border-t border-slate-200">
              <span className="font-extrabold text-slate-900">{t.grandTotal}:</span>
              <span className="text-xl font-black text-gojapan-600 tabular-nums font-mono">
                ¥{grandTotalJPY.toLocaleString()} JPY
              </span>
            </div>
          </div>
        </div>

        {/* SECTION 4: REMARKS */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-xs">
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            {t.remarks}
          </label>
          <textarea
            rows={3}
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder={t.remarksPlaceholder}
            className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-gojapan-500/20 focus:border-gojapan-500"
          ></textarea>
        </div>

        {/* SUBMIT ACTIONS */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <button
            type="button"
            onClick={handleClearForm}
            className="w-full sm:w-auto px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            {t.clearForm}
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 text-sm font-bold text-white bg-gojapan-500 hover:bg-gojapan-600 rounded-lg shadow-md hover:shadow-lg shadow-gojapan-500/25 transition-all disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>{t.submitting}</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>{t.submitOrder}</span>
              </>
            )}
          </button>
        </div>

      </form>

      {/* SUCCESS CONFIRMATION MODAL */}
      {successOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95 duration-200">
            
            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">
                {t.orderSuccessTitle}
              </h3>
              <p className="text-xs text-slate-600 max-w-sm mx-auto">
                {t.orderSuccessDesc}
              </p>
            </div>

            {/* Receipt Summary Card */}
            <div id="printable-receipt" className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-3">
              <div className="flex items-center justify-between pb-2.5 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <img src="./gojapan-logo.jpg" alt="GoJapan" className="w-8 h-8 rounded-lg object-cover shadow-xs" />
                  <div>
                    <p className="font-extrabold text-slate-900 leading-tight">GoJapan 24hours</p>
                    <p className="text-[10px] text-slate-500 font-medium">Japanese ISP & Telecom</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block font-medium">Order ID</span>
                  <span className="font-mono font-extrabold text-gojapan-600 text-sm">
                    {successOrder.id}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-slate-600">
                <div>
                  <span className="text-slate-400">Customer:</span>
                  <p className="font-semibold text-slate-800">{successOrder.customerName}</p>
                </div>
                <div>
                  <span className="text-slate-400">Phone:</span>
                  <p className="font-mono text-slate-800">{successOrder.phoneNumber}</p>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-400">Location:</span>
                  <p className="text-slate-800 truncate">{successOrder.provinceCity}, {successOrder.districtKhan}</p>
                </div>
              </div>

              {/* Items List in Receipt */}
              <div className="pt-2 border-t border-slate-200 space-y-1">
                <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">
                  Ordered Items ({successOrder.items.length})
                </span>
                {successOrder.items.map((it, idx) => (
                  <div key={idx} className="flex justify-between text-[11px] text-slate-700">
                    <span className="truncate max-w-[200px]">
                      {it.quantity}x {it.productName}
                    </span>
                    <span className="font-mono font-semibold tabular-nums">
                      ¥{it.subtotalJPY.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-slate-200 flex justify-between font-extrabold text-slate-900 text-sm">
                <span>Total Amount:</span>
                <span className="text-gojapan-600 font-mono">¥{successOrder.totalJPY.toLocaleString()} JPY</span>
              </div>
            </div>

            {/* Telegram Group Auto-Notification Status */}
            {telegramStatusMsg && (
              <div
                className={`p-3 rounded-lg text-xs flex items-center justify-between gap-2 ${
                  telegramStatusMsg.sent
                    ? 'bg-sky-50 text-sky-900 border border-sky-200'
                    : 'bg-amber-50 text-amber-900 border border-amber-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full shrink-0 ${
                      telegramStatusMsg.sent ? 'bg-sky-500' : 'bg-amber-500'
                    }`}
                  />
                  <span className="font-medium">{telegramStatusMsg.text}</span>
                </div>
                {!telegramStatusMsg.sent && (
                  <button
                    type="button"
                    disabled={isRetryingTelegram}
                    onClick={async () => {
                      if (!successOrder) return;
                      setIsRetryingTelegram(true);
                      const retryRes = await storageService.sendOrderTelegramNotification(successOrder, true);
                      setIsRetryingTelegram(false);
                      setTelegramStatusMsg({
                        sent: retryRes.success,
                        text: retryRes.message,
                      });
                    }}
                    className="px-2.5 py-1 text-[11px] font-bold bg-white hover:bg-amber-100 text-amber-800 border border-amber-300 rounded-md shrink-0 cursor-pointer disabled:opacity-50"
                  >
                    {isRetryingTelegram
                      ? '...'
                      : language === 'km'
                      ? 'ផ្ញើម្តងទៀត'
                      : 'Retry'}
                  </button>
                )}
              </div>
            )}

            {/* Google Sheets Sync Indicator */}
            {syncStatusMsg && (
              <div
                className={`p-3 rounded-lg text-xs flex items-center gap-2 ${
                  syncStatusMsg.synced
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-amber-50 text-amber-800 border border-amber-200'
                }`}
              >
                <div
                  className={`w-2 h-2 rounded-full shrink-0 ${
                    syncStatusMsg.synced ? 'bg-emerald-500' : 'bg-amber-500'
                  }`}
                />
                <span>{syncStatusMsg.text}</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-2">
              <a
                href={getTelegramUrl(successOrder)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>
                  {language === 'km'
                    ? 'ផ្ញើព័ត៌មានទៅកាន់ Telegram ក្រុមការងារ'
                    : 'Confirm via Telegram'}
                </span>
              </a>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>{language === 'km' ? 'បោះពុម្ពវិក្កយបត្រ' : 'Print Receipt'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const id = successOrder.id;
                    setSuccessOrder(null);
                    handleClearForm();
                    if (onGoToTracking) {
                      onGoToTracking(id);
                    }
                  }}
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>{language === 'km' ? 'តាមដានការកម្មង់' : 'Track Status'}</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSuccessOrder(null);
                  handleClearForm();
                }}
                className="w-full text-center text-xs text-slate-500 hover:text-slate-800 py-1"
              >
                {language === 'km' ? 'បិទផ្ទាំងនេះ (Done)' : 'Close'}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
