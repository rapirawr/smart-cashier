import Dexie from 'dexie';

export const db = new Dexie('SmartCashierDB');

db.version(4).stores({
  products: '++id, name, category, price, stock, variants',
  transactions: '++id, timestamp, total, paymentMethod, customerName, memberId',
  members: '++id, name, phone',
  settings: 'key, value'
});


