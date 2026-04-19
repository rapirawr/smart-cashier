import Dexie from 'dexie';

export const db = new Dexie('SmartCashierDB');

db.version(5).stores({
  products: '++id, name, category, price, stock, variants, image',
  transactions: '++id, timestamp, total, paymentMethod, customerName, memberId',
  members: '++id, name, phone',
  settings: 'key, value'
});

db.version(7).stores({
  products: '++id, name, category, price, stock, variants, image, barcode, cost',
  transactions: '++id, timestamp, total, paymentMethod, customerName, memberId, notes, discount, status, cashierName, captainName',
  members: '++id, name, phone, email, points, joinDate',
  settings: 'key, value',
  heldOrders: '++id, timestamp, customerName, items, total, notes, captainName'
}).upgrade(tx => {
  tx.table('transactions').toCollection().modify(trx => {
    if (!trx.cashierName) trx.cashierName = 'Admin';
    if (!trx.captainName) trx.captainName = 'Self';
  });
});

db.version(8).stores({
  products: '++id, name, category, price, stock, variants, image, barcode, cost',
  transactions: '++id, timestamp, total, paymentMethod, customerName, memberId, notes, discount, status, cashierName, captainName',
  members: '++id, name, phone, email, points, joinDate',
  settings: 'key, value',
  heldOrders: '++id, timestamp, customerName, items, total, notes, captainName',
  shifts: '++id, startTime, endTime, cashierName, startingCash, expectedCash, actualCash, totalCash, totalQRIS, totalDebit'
});
