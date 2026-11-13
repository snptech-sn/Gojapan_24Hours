/**
 * Full production-ready Google Apps Script for GoJapan 24hours
 * Handles 4 Sheets: Orders, Order_Items, Products, Customers
 */
export const GOOGLE_APPS_SCRIPT_CODE = `/**
 * ====================================================================
 * GoJapan 24hours - Google Sheets Web App API (Code.gs)
 * ====================================================================
 * 
 * របៀបដំឡើង (Setup Instructions):
 * 1. បង្កើត Google Sheet ថ្មីមួយ (ឈ្មោះ: GoJapan 24hours Database)
 * 2. ចុច Menu: Extensions (ផ្នែកបន្ថែម) -> Apps Script
 * 3. លុបកូដចាស់ចោល រួច Copy & Paste កូដខាងក្រោមនេះទាំងស្រុង
 * 4. ចុច Save (រូបថតថាស)
 * 5. ចុច Deploy (ដាក់ឱ្យដំណើរការ) -> New deployment (ការដាក់ឱ្យដំណើរការថ្មី)
 * 6. ជ្រើសរើសប្រភេទ: Web app
 *    - Description: GoJapan 24hours API v1.0
 *    - Execute as: Me (អាសយដ្ឋានអ៊ីមែលរបស់អ្នក)
 *    - Who has access: Anyone (អ្នកណាក៏ដោយ) *** សំខាន់បំផុត! ***
 * 7. ចុច Deploy -> Review permissions -> ជ្រើសរើស Gmail របស់អ្នក -> Advanced -> Go to ... (unsafe) -> Allow
 * 8. Copy "Web app URL" (បញ្ចប់ដោយ /exec) យកទៅបិទភ្ជាប់ក្នុង GoJapan 24hours Admin Dashboard
 * ====================================================================
 */

const SHEET_NAMES = {
  ORDERS: 'Orders',
  ORDER_ITEMS: 'Order_Items',
  PRODUCTS: 'Products',
  CUSTOMERS: 'Customers'
};

/**
 * Handle HTTP GET Requests (e.g. Ping test, Fetch data)
 */
function doGet(e) {
  const lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    initAllSheets(ss);

    const action = (e && e.parameter && e.parameter.action) ? e.parameter.action : 'ping';

    if (action === 'ping') {
      return jsonResponse({
        success: true,
        message: 'GoJapan 24hours Apps Script API is online and fully connected!',
        spreadsheetName: ss.getName(),
        sheets: Object.values(SHEET_NAMES),
        serverTime: new Date().toISOString()
      });
    }

    if (action === 'get_orders') {
      const ordersSheet = ss.getSheetByName(SHEET_NAMES.ORDERS);
      const data = ordersSheet.getDataRange().getValues();
      const headers = data[0];
      const rows = data.slice(1);
      
      const orders = rows.map(row => {
        const obj = {};
        headers.forEach((h, i) => { obj[h] = row[i]; });
        return obj;
      });

      return jsonResponse({ success: true, count: orders.length, orders: orders });
    }

    if (action === 'get_products') {
      const prodSheet = ss.getSheetByName(SHEET_NAMES.PRODUCTS);
      const data = prodSheet.getDataRange().getValues();
      const headers = data[0];
      const rows = data.slice(1);

      const products = rows.map(row => {
        const obj = {};
        headers.forEach((h, i) => { obj[h] = row[i]; });
        return obj;
      });

      return jsonResponse({ success: true, count: products.length, products: products });
    }

    return jsonResponse({
      success: true,
      message: 'GoJapan 24hours API Ready',
      action: action
    });

  } catch (err) {
    return jsonResponse({ success: false, error: err.toString() });
  } finally {
    lock.releaseLock();
  }
}

/**
 * Handle HTTP POST Requests (Submit Order, Update Status, Sync Products)
 */
function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.tryLock(15000);

  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    initAllSheets(ss);

    let payload = {};
    if (e && e.postData && e.postData.contents) {
      try {
        payload = JSON.parse(e.postData.contents);
      } catch (parseErr) {
        // Fallback for form-encoded payload
        if (e.parameter && e.parameter.data) {
          payload = JSON.parse(e.parameter.data);
        } else {
          payload = e.parameter || {};
        }
      }
    } else if (e && e.parameter) {
      payload = e.parameter;
    }

    const action = payload.action || 'submit_order';

    // 1. Submit New Order
    if (action === 'submit_order') {
      const order = payload.order;
      if (!order || !order.id) {
        throw new Error('Invalid order payload: Missing order object or ID');
      }

      const ordersSheet = ss.getSheetByName(SHEET_NAMES.ORDERS);
      const orderItemsSheet = ss.getSheetByName(SHEET_NAMES.ORDER_ITEMS);
      const customersSheet = ss.getSheetByName(SHEET_NAMES.CUSTOMERS);

      const timestamp = new Date().toLocaleString('en-US', { timeZone: 'Asia/Phnom_Penh' });

      // Append row to Orders Sheet
      // Headers: Order_ID | Created_At | Customer_Type | Customer_Name | Phone_Number | Telegram | Province_City | District_Khan | Commune_Sangkat | Village | Street_Address | Subtotal_JPY | Shipping_JPY | Total_JPY | Status | Remarks
      ordersSheet.appendRow([
        order.id,
        order.createdAt || timestamp,
        order.customerType || 'customer',
        order.customerName || '',
        "'" + (order.phoneNumber || ''), // Prepend apostrophe to preserve leading zero in Google Sheets
        order.telegram || '',
        order.provinceCity || '',
        order.districtKhan || '',
        order.communeSangkat || '',
        order.village || '',
        order.streetAddress || '',
        Number(order.subtotalJPY || 0),
        Number(order.shippingJPY || 0),
        Number(order.totalJPY || 0),
        order.status || 'New',
        order.remarks || ''
      ]);

      // Append items to Order_Items Sheet
      // Headers: Order_ID | Item_Index | Product_ID | SKU | Product_Name | Category | Unit_Price_JPY | Quantity | Subtotal_JPY
      if (order.items && Array.isArray(order.items)) {
        order.items.forEach((item, index) => {
          orderItemsSheet.appendRow([
            order.id,
            index + 1,
            item.productId || '',
            item.sku || '',
            item.productName || '',
            item.category || '',
            Number(item.unitPriceJPY || 0),
            Number(item.quantity || 1),
            Number(item.subtotalJPY || (item.unitPriceJPY * item.quantity))
          ]);
        });
      }

      // Update or Append Customer in Customers Sheet
      updateCustomerRecord(customersSheet, order, timestamp);

      // Automatically send Telegram Group Notification from server if not already sent by browser
      let telegramNotified = Boolean(payload.alreadySentTelegram);
      if (!telegramNotified) {
        telegramNotified = sendTelegramOrderAlert_(order);
      }

      return jsonResponse({
        success: true,
        message: 'Order saved to Google Sheets successfully!',
        orderId: order.id,
        savedAt: timestamp,
        telegramNotified: telegramNotified
      });
    }

    // 1B. Save Telegram Bot & Group Configuration (Server-Side Fallback for All Customers)
    if (action === 'save_telegram_config') {
      const cfg = payload.telegramConfig || {};
      const props = PropertiesService.getScriptProperties();
      if (cfg.botToken) props.setProperty('TG_BOT_TOKEN', String(cfg.botToken).trim());
      if (cfg.chatId) props.setProperty('TG_GROUP_ID', String(cfg.chatId).trim());
      props.setProperty('TG_ENABLED', cfg.enabled === false ? 'false' : 'true');
      return jsonResponse({ success: true, message: 'Telegram Group config saved to Apps Script!' });
    }

    // 2. Update Order Status
    if (action === 'update_order_status') {
      const orderId = payload.orderId;
      const newStatus = payload.status;
      if (!orderId || !newStatus) {
        throw new Error('Missing orderId or status');
      }

      const ordersSheet = ss.getSheetByName(SHEET_NAMES.ORDERS);
      const data = ordersSheet.getDataRange().getValues();
      let updated = false;

      // Find order row by ID (Column 1 is index 0)
      for (let i = 1; i < data.length; i++) {
        if (String(data[i][0]).trim() === String(orderId).trim()) {
          // Column 15 is Status (index 14)
          ordersSheet.getRange(i + 1, 15).setValue(newStatus);
          updated = true;
          break;
        }
      }

      if (!updated) {
        return jsonResponse({ success: false, message: 'Order ID not found in sheet: ' + orderId });
      }

      return jsonResponse({ success: true, message: 'Status updated to: ' + newStatus });
    }

    // 3. Batch Sync Products
    if (action === 'sync_products') {
      const products = payload.products;
      if (Array.isArray(products)) {
        const prodSheet = ss.getSheetByName(SHEET_NAMES.PRODUCTS);
        // Clear old rows except header
        const lastRow = prodSheet.getLastRow();
        if (lastRow > 1) {
          prodSheet.getRange(2, 1, lastRow - 1, prodSheet.getLastColumn()).clearContent();
        }

        // Headers: Product_ID | SKU | Name_KM | Name_EN | Category | Price_JPY | Speed_Quota | Carrier | Description_KM | Is_Active
        products.forEach(p => {
          prodSheet.appendRow([
            p.id,
            p.sku,
            p.nameKm,
            p.nameEn,
            p.category,
            Number(p.priceJPY || 0),
            (p.speed || '') + ' / ' + (p.dataQuota || ''),
            p.carrier || '',
            p.descriptionKm || '',
            p.isActive !== false ? 'Active' : 'Inactive'
          ]);
        });

        return jsonResponse({ success: true, count: products.length, message: 'Products synchronized successfully' });
      }
    }

    return jsonResponse({ success: false, error: 'Unknown action: ' + action });

  } catch (err) {
    return jsonResponse({ success: false, error: err.toString() });
  } finally {
    lock.releaseLock();
  }
}

/**
 * Initialize 4 standard sheets and header rows if not already present
 */
function initAllSheets(ss) {
  // 1. Orders Sheet
  let ordersSheet = ss.getSheetByName(SHEET_NAMES.ORDERS);
  if (!ordersSheet) {
    ordersSheet = ss.insertSheet(SHEET_NAMES.ORDERS);
    ordersSheet.appendRow([
      'Order_ID', 'Created_At', 'Customer_Type', 'Customer_Name', 'Phone_Number',
      'Telegram', 'Province_City', 'District_Khan', 'Commune_Sangkat', 'Village',
      'Street_Address', 'Subtotal_JPY', 'Shipping_JPY', 'Total_JPY', 'Status', 'Remarks'
    ]);
    formatHeaderRow(ordersSheet);
  }

  // 2. Order_Items Sheet
  let itemsSheet = ss.getSheetByName(SHEET_NAMES.ORDER_ITEMS);
  if (!itemsSheet) {
    itemsSheet = ss.insertSheet(SHEET_NAMES.ORDER_ITEMS);
    itemsSheet.appendRow([
      'Order_ID', 'Item_Index', 'Product_ID', 'SKU', 'Product_Name',
      'Category', 'Unit_Price_JPY', 'Quantity', 'Subtotal_JPY'
    ]);
    formatHeaderRow(itemsSheet);
  }

  // 3. Products Sheet
  let prodSheet = ss.getSheetByName(SHEET_NAMES.PRODUCTS);
  if (!prodSheet) {
    prodSheet = ss.insertSheet(SHEET_NAMES.PRODUCTS);
    prodSheet.appendRow([
      'Product_ID', 'SKU', 'Name_KM', 'Name_EN', 'Category',
      'Price_JPY', 'Speed_Quota', 'Carrier', 'Description_KM', 'Is_Active'
    ]);
    formatHeaderRow(prodSheet);
  }

  // 4. Customers Sheet
  let custSheet = ss.getSheetByName(SHEET_NAMES.CUSTOMERS);
  if (!custSheet) {
    custSheet = ss.insertSheet(SHEET_NAMES.CUSTOMERS);
    custSheet.appendRow([
      'Phone_Number', 'Customer_Name', 'Customer_Type', 'Telegram',
      'Province_City', 'Total_Orders', 'Total_Spent_JPY', 'Last_Order_Date'
    ]);
    formatHeaderRow(custSheet);
  }
}

/**
 * Format header row with GoJapan Crimson branding
 */
function formatHeaderRow(sheet) {
  const headerRange = sheet.getRange(1, 1, 1, sheet.getLastColumn());
  headerRange.setBackground('#DC2626');
  headerRange.setFontColor('#FFFFFF');
  headerRange.setFontWeight('bold');
  sheet.setFrozenRows(1);
}

/**
 * Create or increment customer summary record
 */
function updateCustomerRecord(sheet, order, timestamp) {
  const phone = String(order.phoneNumber || '').trim();
  if (!phone) return;

  const data = sheet.getDataRange().getValues();
  let foundRow = -1;

  for (let i = 1; i < data.length; i++) {
    const rowPhone = String(data[i][0]).replace(/^'/, '').trim();
    if (rowPhone === phone) {
      foundRow = i + 1;
      break;
    }
  }

  const orderTotal = Number(order.totalJPY || 0);

  if (foundRow > 0) {
    // Increment existing customer
    const currentOrders = Number(sheet.getRange(foundRow, 6).getValue() || 0);
    const currentSpent = Number(sheet.getRange(foundRow, 7).getValue() || 0);

    sheet.getRange(foundRow, 2).setValue(order.customerName || sheet.getRange(foundRow, 2).getValue());
    sheet.getRange(foundRow, 3).setValue(order.customerType || 'customer');
    if (order.telegram) sheet.getRange(foundRow, 4).setValue(order.telegram);
    if (order.provinceCity) sheet.getRange(foundRow, 5).setValue(order.provinceCity);
    sheet.getRange(foundRow, 6).setValue(currentOrders + 1);
    sheet.getRange(foundRow, 7).setValue(currentSpent + orderTotal);
    sheet.getRange(foundRow, 8).setValue(timestamp);
  } else {
    // Append new customer
    sheet.appendRow([
      "'" + phone,
      order.customerName || '',
      order.customerType || 'customer',
      order.telegram || '',
      order.provinceCity || '',
      1,
      orderTotal,
      timestamp
    ]);
  }
}

/**
 * Send instant Telegram Group alert from Google Apps Script server (works for all customers on all devices)
 */
function sendTelegramOrderAlert_(order) {
  try {
    const props = PropertiesService.getScriptProperties();
    const botToken = props.getProperty('TG_BOT_TOKEN');
    const groupId = props.getProperty('TG_GROUP_ID');
    const enabled = props.getProperty('TG_ENABLED');
    if (!botToken || !groupId || enabled === 'false') return false;

    const escapeHtml = function(str) {
      return String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    };

    const items = Array.isArray(order.items) ? order.items : [];
    const itemsText = items.map(function(it, idx) {
      return '  ' + (idx + 1) + '. <b>' + escapeHtml(it.productName) + '</b> (' + escapeHtml(it.sku) + ')\\n     ចំនួន: <code>' + Number(it.quantity || 1) + '</code> × ¥' + Number(it.unitPriceJPY || 0).toLocaleString() + ' = <b>¥' + Number(it.subtotalJPY || 0).toLocaleString() + '</b>';
    }).join('\\n');

    const fullAddr = [order.provinceCity, order.districtKhan, order.communeSangkat, order.village, order.streetAddress]
      .filter(Boolean).join(', ');

    const text = [
      '🛒 <b>ការកម្មង់ថ្មី! (NEW ORDER RECEIVED)</b>',
      '━━━━━━━━━━━━━━━━━━━━',
      '🆔 <b>លេខកូដកម្មង់:</b> <code>' + escapeHtml(order.id) + '</code>',
      '👤 <b>អតិថិជន:</b> <b>' + escapeHtml(order.customerName) + '</b>',
      '📞 <b>លេខទូរស័ព្ទ:</b> <code>' + escapeHtml(order.phoneNumber) + '</code>',
      order.telegram ? '💬 <b>Telegram:</b> ' + escapeHtml(order.telegram) : null,
      '📍 <b>អាសយដ្ឋាន:</b>\\n' + escapeHtml(fullAddr || '—'),
      '━━━━━━━━━━━━━━━━━━━━',
      '📦 <b>មុខទំនិញ (' + items.length + ' មុខ):</b>',
      itemsText || '  • គ្មានមុខទំនិញ',
      '━━━━━━━━━━━━━━━━━━━━',
      '💰 <b>សរុបរួម: ¥' + Number(order.totalJPY || 0).toLocaleString() + ' JPY</b>',
      order.remarks ? '📝 <b>ចំណាំ:</b> ' + escapeHtml(order.remarks) : null
    ].filter(Boolean).join('\\n');

    const res = UrlFetchApp.fetch('https://api.telegram.org/bot' + botToken + '/sendMessage', {
      method: 'post',
      contentType: 'application/json',
      muteHttpExceptions: true,
      payload: JSON.stringify({
        chat_id: groupId,
        text: text,
        parse_mode: 'HTML',
        disable_web_page_preview: true
      })
    });
    const json = JSON.parse(res.getContentText() || '{}');
    return Boolean(json.ok);
  } catch (e) {
    return false;
  }
}

/**
 * Helper to produce standard JSON output
 */
function jsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
`;
