import Dexie from 'dexie';

export const db = new Dexie('SmartCashierDB');

db.version(3).stores({
  products: '++id, name, category, price, stock',
  transactions: '++id, timestamp, total, paymentMethod, customerName, memberId',
  members: '++id, name, phone',
  settings: 'key, value'
});

// Initial data seeder (offline first)
export const seedDatabase = async () => {
  const count = await db.products.count();
  if (count === 0) {
    await db.products.bulkAdd([
      { name: 'Espresso Roast', price: 45000, category: 'Coffee', stock: 12 },
      { name: 'Matcha Latte', price: 38000, category: 'Tea', stock: 8 },
      { name: 'Croissant Butter', price: 25000, category: 'Bakery', stock: 15 },
      { name: 'Caramel Macchiato', price: 48000, category: 'Coffee', stock: 5 },
      { name: 'Pain au Chocolat', price: 28000, category: 'Bakery', stock: 10 },
      { name: 'Iced Lemon Tea', price: 22000, category: 'Tea', stock: 20 },
    ]);
  }


  // Seed default settings
  const settingsCount = await db.settings.count();
  if (settingsCount === 0) {
    await db.settings.bulkAdd([
      { key: 'storeName', value: 'SMART CASHIER POS' },
      { key: 'storeAddress', value: 'Jakarta, Indonesia' },
      { key: 'taxRate', value: 11 },
      { key: 'memberDiscount', value: 5 }
    ]);
  }
};
