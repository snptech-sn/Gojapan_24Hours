import React, { useState, useEffect } from 'react';
import {
  Search,
  Package,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  FileText,
  ArrowRight,
  History,
  CheckCircle2,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { storageService } from '../services/storageService';
import { Language, Order, OrderStatus, OrderStatusHistoryItem } from '../types';
import { translations } from '../utils/translations';

interface OrderTrackingProps {
  initialOrderId?: string;
  language: Language;
  onGoToOrder: () => void;
}

const STATUS_STEPS: { key: OrderStatus; labelKm: string; labelEn: string; icon: any; descKm: string; descEn: string }[] = [
  {
    key: 'new',
    labelKm: 'ការកម្មង់ថ្មី',
    labelEn: 'Order Placed',
    icon: Clock,
    descKm: 'ការកម្មង់ត្រូវបានបញ្ជូនចូលក្នុងប្រព័ន្ធ GoJapan 24hours',
    descEn: 'Order submitted into GoJapan system',
  },
  {
    key: 'confirmed',
    labelKm: 'បានបញ្ជាក់',
    labelEn: 'Confirmed',
    icon: CheckCircle,
    descKm: 'បានផ្ទៀងផ្ទាត់ព័ត៌មាន និងបម្រុងទុកឧបករណ៍/កញ្ចប់សេវា',
    descEn: 'Details verified and equipment allocated',
  },
  {
    key: 'processing',
    labelKm: 'កំពុងរៀបចំ',
    labelEn: 'Processing',
    icon: Package,
    descKm: 'កំពុងតេស្តឧបករណ៍ ភ្ជាប់ស៊ីមកាត ឬបង្កើតកូដ eSIM Profile',
    descEn: 'Testing device, inserting SIM, or generating eSIM QR code',
  },
  {
    key: 'shipping',
    labelKm: 'កំពុងដឹកជញ្ជូន',
    labelEn: 'Shipping',
    icon: Truck,
    descKm: 'កញ្ចប់ទំនិញត្រូវបានប្រគល់ជូនអ្នកដឹក ឬផ្ញើ QR Code តាម Telegram',
    descEn: 'Handed to express delivery / QR code sent via Telegram',
  },
  {
    key: 'completed',
    labelKm: 'បានបញ្ចប់',
    labelEn: 'Delivered & Completed',
    icon: CheckCircle2,
    descKm: 'អតិថិជនបានទទួលទំនិញ និងដំណើរការសេវាអ៊ីនធឺណិតជោគជ័យ',
    descEn: 'Customer received package and internet service activated',
  },
];

export const OrderTracking: React.FC<OrderTrackingProps> = ({
  initialOrderId,
  language,
  onGoToOrder,
}) => {
  const t = translations[language];
  const [searchQuery, setSearchQuery] = useState<string>(initialOrderId || '');
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const handleSearch = (queryToUse?: string) => {
    const q = (queryToUse !== undefined ? queryToUse : searchQuery).trim();
    if (!q) return;

    setHasSearched(true);
    // Find either direct ID or match phone
    const single = storageService.getOrderById(q);
    if (single) {
      setSelectedOrder(single);
    } else {
      const results = storageService.findOrdersByPhoneOrId(q);
      setSelectedOrder(results.length > 0 ? results[0] : null);
    }
  };

  useEffect(() => {
    if (initialOrderId) {
      setSearchQuery(initialOrderId);
      handleSearch(initialOrderId);
    }
  }, [initialOrderId]);

  const getStatusIndex = (status: OrderStatus) => {
    if (status === 'cancelled') return -1;
    return STATUS_STEPS.findIndex((s) => s.key === status);
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'new':
        return <span className="text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded text-xs font-semibold">{t.statusNew}</span>;
      case 'confirmed':
        return <span className="text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded text-xs font-semibold">{t.statusConfirmed}</span>;
      case 'processing':
        return <span className="text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-1 rounded text-xs font-semibold">{t.statusProcessing}</span>;
      case 'shipping':
        return <span className="text-purple-700 bg-purple-50 border border-purple-200 px-2.5 py-1 rounded text-xs font-semibold">{t.statusShipping}</span>;
      case 'completed':
        return <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded text-xs font-semibold">{t.statusCompleted}</span>;
      case 'cancelled':
        return <span className="text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-1 rounded text-xs font-semibold">{t.statusCancelled}</span>;
    }
  };

  const formatTimestamp = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString(language === 'km' ? 'km-KH' : 'en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  // Helper to ensure a rich status history exists
  const getOrderHistory = (order: Order): OrderStatusHistoryItem[] => {
    if (order.statusHistory && order.statusHistory.length > 0) {
      return order.statusHistory;
    }
    // Fallback constructed from order status
    return [
      {
        status: order.status,
        timestamp: order.createdAt,
        noteKm: 'ការកម្មង់ត្រូវបានកត់ត្រាចូលក្នុងប្រព័ន្ធ',
        noteEn: 'Order placed and logged in system',
      },
    ];
  };

  // Identify remaining future milestones for non-completed/non-cancelled orders
  const getRemainingSteps = (currentStatus: OrderStatus) => {
    if (currentStatus === 'completed' || currentStatus === 'cancelled') return [];
    const currentIdx = getStatusIndex(currentStatus);
    if (currentIdx < 0) return [];
    return STATUS_STEPS.slice(currentIdx + 1);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      
      {/* Title */}
      <div className="text-center space-y-2 mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gojapan-50 text-gojapan-700 text-xs font-semibold">
          <History className="w-3.5 h-3.5" />
          <span>Real-time Status History & Tracking</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {t.trackingTitle}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
          {t.trackingSubtitle}
        </p>
      </div>

      {/* Search Input Box */}
      <div className="max-w-xl mx-auto mb-8 sm:mb-10">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
          className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 bg-white p-2 rounded-xl border border-slate-300 shadow-sm focus-within:ring-2 focus-within:ring-gojapan-500/20 focus-within:border-gojapan-500"
        >
          <div className="flex items-center gap-2 flex-1 pl-2">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="e.g., GJ-2026-8801 or 012889977"
              className="w-full py-2 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 bg-transparent focus:outline-none font-mono"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 text-xs font-semibold text-white bg-gojapan-500 hover:bg-gojapan-600 rounded-lg shadow-sm transition-colors cursor-pointer whitespace-nowrap"
          >
            {t.searchOrderBtn}
          </button>
        </form>
      </div>

      {/* Results View */}
      {selectedOrder ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-8 space-y-6 sm:space-y-8 animate-in fade-in duration-200">
          
          {/* Header row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pb-5 sm:pb-6 border-b border-slate-200">
            <div>
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <span className="text-xs font-semibold text-slate-500">Order ID:</span>
                <span className="text-lg sm:text-xl font-black font-mono text-slate-900">
                  {selectedOrder.id}
                </span>
                {getStatusBadge(selectedOrder.status)}
              </div>
              <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>Placed on {formatTimestamp(selectedOrder.createdAt)}</span>
              </p>
            </div>

            <div className="text-left sm:text-right pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
              <span className="text-xs text-slate-500 font-medium">Total Amount:</span>
              <p className="text-xl sm:text-2xl font-black text-gojapan-600 font-mono tabular-nums">
                ¥{selectedOrder.totalJPY.toLocaleString()} <span className="text-xs font-normal text-slate-500">JPY</span>
              </p>
            </div>
          </div>

          {/* Horizontal Step Flow Indicator with smooth mobile scroll fallback */}
          {selectedOrder.status === 'cancelled' ? (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-3 text-rose-800 text-sm">
              <XCircle className="w-5 h-5 shrink-0" />
              <span>
                {language === 'km'
                  ? 'ការកម្មង់នេះត្រូវបានបោះបង់ (Cancelled)។ សូមទាក់ទងមកក្រុមការងារ GoJapan 24hours សម្រាប់ជំនួយ។'
                  : 'This order was cancelled. Please contact GoJapan 24hours support for assistance.'}
              </span>
            </div>
          ) : (
            <div className="py-2 overflow-x-auto pb-4 -mx-2 px-2 sm:mx-0 sm:px-0">
              <div className="min-w-[420px] sm:min-w-0 grid grid-cols-5 gap-2 relative">
                {/* Connecting background bar */}
                <div className="absolute top-4 left-6 right-6 h-0.5 bg-slate-200 -z-0"></div>

                {STATUS_STEPS.map((step, idx) => {
                  const currentIdx = getStatusIndex(selectedOrder.status);
                  const isDone = idx <= currentIdx;
                  const isCurrent = idx === currentIdx;
                  const StepIcon = step.icon;

                  return (
                    <div key={step.key} className="flex flex-col items-center text-center relative z-10">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                          isDone
                            ? 'bg-gojapan-500 text-white shadow-xs'
                            : 'bg-white border-2 border-slate-300 text-slate-400'
                        } ${isCurrent ? 'ring-4 ring-gojapan-100 scale-110' : ''}`}
                      >
                        <StepIcon className="w-4 h-4" />
                      </div>
                      <span
                        className={`mt-2 text-[10px] sm:text-[11px] font-semibold leading-tight px-1 ${
                          isCurrent
                            ? 'text-gojapan-600 font-bold'
                            : isDone
                            ? 'text-slate-800'
                            : 'text-slate-400'
                        }`}
                      >
                        {language === 'km' ? step.labelKm : step.labelEn}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* HISTORICAL STATUS TIMELINE */}
          <div className="p-4 sm:p-6 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-5 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-gojapan-500 text-white shrink-0">
                  <History className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {language === 'km' ? 'ប្រវត្តិនៃការផ្លាស់ប្តូរស្ថានភាពការកម្មង់' : 'Historical Status Change Timeline'}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-slate-500">
                    {language === 'km'
                      ? 'តាមដានរាល់សកម្មភាព និងការផ្លាស់ប្តូរតាមលំដាប់លំដោយកាលបរិច្ឆេទ'
                      : 'Chronological log of verified order status transitions'}
                  </p>
                </div>
              </div>
              <span className="text-[11px] sm:text-xs font-mono font-semibold text-slate-500">
                {getOrderHistory(selectedOrder).length} Recorded Event{getOrderHistory(selectedOrder).length > 1 ? 's' : ''}
              </span>
            </div>

            {/* Vertical Chronological Timeline */}
            <div className="relative pl-5 sm:pl-8 space-y-6 sm:space-y-8 before:absolute before:left-2 sm:before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-300">
              {getOrderHistory(selectedOrder).map((item, index) => {
                const isLatest = index === getOrderHistory(selectedOrder).length - 1;
                const stepMeta = STATUS_STEPS.find((s) => s.key === item.status);
                const IconComponent = stepMeta ? stepMeta.icon : CheckCircle;

                return (
                  <div key={index} className="relative group">
                    {/* Timeline Node Icon */}
                    <div
                      className={`absolute -left-5 sm:-left-8 top-0 w-5 sm:w-6 h-5 sm:h-6 rounded-full flex items-center justify-center transition-all ${
                        isLatest
                          ? 'bg-gojapan-500 text-white ring-4 ring-gojapan-100 shadow-sm'
                          : 'bg-white border-2 border-slate-400 text-slate-600'
                      }`}
                    >
                      <IconComponent className="w-3 sm:w-3.5 h-3 sm:h-3.5" />
                    </div>

                    {/* Timeline Card */}
                    <div
                      className={`p-3.5 sm:p-4 rounded-xl border transition-all ${
                        isLatest
                          ? 'bg-white border-gojapan-300 shadow-sm ring-1 ring-gojapan-200'
                          : 'bg-white/70 border-slate-200'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-1">
                        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                          <span className="text-xs sm:text-sm font-extrabold text-slate-900">
                            {language === 'km' ? (stepMeta?.labelKm || item.status) : (stepMeta?.labelEn || item.status)}
                          </span>
                          {isLatest && (
                            <span className="inline-flex items-center gap-1 text-[9px] sm:text-[10px] font-bold text-gojapan-700 bg-gojapan-50 border border-gojapan-200 px-1.5 sm:px-2 py-0.5 rounded-full">
                              <Sparkles className="w-2.5 h-2.5" />
                              <span>{language === 'km' ? 'បច្ចុប្បន្នភាពចុងក្រោយ' : 'Current Status'}</span>
                            </span>
                          )}
                        </div>

                        {/* Timestamp */}
                        <span className="text-[11px] sm:text-xs font-mono font-medium text-slate-500 tabular-nums">
                          {formatTimestamp(item.timestamp)}
                        </span>
                      </div>

                      {/* Description Note */}
                      <p className="text-xs text-slate-600 leading-relaxed mt-1">
                        {language === 'km'
                          ? (item.noteKm || stepMeta?.descKm || 'បានកត់ត្រាការផ្លាស់ប្តូរស្ថានភាព')
                          : (item.noteEn || stepMeta?.descEn || 'Status transition logged')}
                      </p>
                    </div>
                  </div>
                );
              })}

              {/* Pending upcoming milestone milestones (Future preview) */}
              {getRemainingSteps(selectedOrder.status).map((futureStep, fIdx) => {
                const FutureIcon = futureStep.icon;
                return (
                  <div key={fIdx} className="relative opacity-60">
                    <div className="absolute -left-5 sm:-left-8 top-0.5 w-5 sm:w-6 h-5 sm:h-6 rounded-full bg-slate-100 border-2 border-dashed border-slate-300 text-slate-400 flex items-center justify-center">
                      <FutureIcon className="w-2.5 sm:w-3 h-2.5 sm:h-3" />
                    </div>
                    <div className="p-3 sm:p-3.5 rounded-xl border border-dashed border-slate-300 bg-white/40">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-500">
                          {language === 'km' ? `ជំហានបន្ទាប់: ${futureStep.labelKm}` : `Upcoming Step: ${futureStep.labelEn}`}
                        </span>
                        <span className="text-[10px] sm:text-[11px] text-slate-400 font-medium">Pending</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {language === 'km' ? futureStep.descKm : futureStep.descEn}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Details Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
            {/* Customer & Delivery */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs">
              <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                {language === 'km' ? 'ព័ត៌មានអ្នកទទួល' : 'Customer & Shipping Info'}
              </h4>
              <p><span className="text-slate-500">Name:</span> <strong className="text-slate-800">{selectedOrder.customerName}</strong></p>
              <p><span className="text-slate-500">Phone:</span> <strong className="text-slate-800 font-mono">{selectedOrder.phoneNumber}</strong></p>
              {selectedOrder.telegram && (
                <p><span className="text-slate-500">Telegram:</span> <strong className="text-blue-600">{selectedOrder.telegram}</strong></p>
              )}
              <p><span className="text-slate-500">Destination:</span> <strong className="text-slate-800">{selectedOrder.provinceCity}, {selectedOrder.districtKhan}</strong></p>
              {selectedOrder.communeSangkat && (
                <p><span className="text-slate-500">Address:</span> <span className="text-slate-700">{selectedOrder.communeSangkat}, {selectedOrder.village}, {selectedOrder.streetAddress}</span></p>
              )}
            </div>

            {/* Google Sheets Sync & Remarks */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs">
              <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                {language === 'km' ? 'ស្ថានភាពប្រព័ន្ធ' : 'System Sync & Notes'}
              </h4>
              <div className="flex items-center gap-2">
                <span className="text-slate-500">Google Sheets:</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  selectedOrder.syncedToGoogleSheets
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-slate-200 text-slate-700'
                }`}>
                  {selectedOrder.syncedToGoogleSheets ? 'SYNCED' : 'LOCAL BUFFER'}
                </span>
              </div>
              {selectedOrder.remarks && (
                <div>
                  <span className="text-slate-500">Remarks:</span>
                  <p className="text-slate-700 italic mt-0.5">{selectedOrder.remarks}</p>
                </div>
              )}
            </div>
          </div>

          {/* Ordered Line Items Table */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              {language === 'km' ? 'បញ្ជីផលិតផលដែលបានកម្មង់' : 'Ordered Line Items'} ({selectedOrder.items.length})
            </h4>
            <div className="rounded-lg border border-slate-200 overflow-hidden divide-y divide-slate-200">
              {selectedOrder.items.map((item, idx) => (
                <div key={idx} className="p-3 bg-white flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] font-mono text-slate-400">{item.sku}</span>
                    <p className="font-bold text-slate-900">{item.productName}</p>
                    <p className="text-slate-500 text-[11px]">
                      {item.quantity} x ¥{item.unitPriceJPY.toLocaleString()} JPY
                    </p>
                  </div>
                  <span className="font-mono font-extrabold text-slate-900 tabular-nums">
                    ¥{item.subtotalJPY.toLocaleString()} JPY
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      ) : hasSearched ? (
        <div className="py-16 text-center space-y-4 bg-white rounded-2xl border border-slate-200 p-8">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <FileText className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">
            {language === 'km' ? 'រកមិនឃើញការកម្មង់ទេ' : 'No Order Found'}
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {language === 'km'
              ? 'សូមពិនិត្យមើលលេខ Order ID (ឧ. GJ-2026-8801) ឬលេខទូរស័ព្ទរបស់អ្នកឡើងវិញ។'
              : 'Please double-check your Order ID or registered phone number.'}
          </p>
          <button
            onClick={onGoToOrder}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-gojapan-500 rounded-lg shadow-sm cursor-pointer"
          >
            <span>{t.orderNow}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : null}

    </div>
  );
};
