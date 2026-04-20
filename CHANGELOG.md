# Changelog - Kaze POS

All notable changes to this project will be documented in this file.

## [2.1.0] - 2026-04-20
### 🚀 Rebranding
- **Branding**: Rebranded application from "Luma POS" to **Kaze POS**.
- **Metadata**: Updated `package.json`, `appId`, and build configurations to reflect the new identity.


## [2.0.0] - 2026-04-18
### 🚀 Major Rebranding & Core Refactor
- **Branding**: Rebranded application from "Smart Cashier" to **Luma POS**.
- **Iconography**: Complete migration from legacy emojis to **Lucide-React** icons for a modern, enterprise-grade aesthetic.
- **Architecture**: Refactored monolithic state management into modular components (`Dashboard`, `Settings`, `CashCalculator`).

### 📊 New Analytics Dashboard
- **Real-time Stats**: Track Today's Revenue, Transaction Count, Low Stock Alerts, and Average Transaction Value.
- **Interactive Charts**:
  - Revenue Trends (Daily/Weekly/Monthly) using Area Charts.
  - Payment Method breakdown (Pie Chart).
  - Top Selling Products and Revenue per Product (Bar Charts).
- **Growth Indicators**: Visual percentage indicators for daily and weekly performance.

### 💳 Enhanced POS Workflow
- **Order Parking (Held Orders)**: Ability to "pause" a current cart and resume it later, allowing multiple customers to be served simultaneously.
- **Cash Calculator**: New interactive modal for cash transactions featuring:
  - Numeric keypad and Backspace support.
  - Quick-amount buttons for common currency denominations.
  - Real-time "Change Due" (Kembalian) calculation.
- **Transaction Metadata**: Added support for **Transaction Notes** and automated **Member Discounts** tracking.

### ⌨️ Advanced Keyboard Shortcuts
- **Navigation**: `Ctrl + 1-5` to switch between main tabs (Dashboard, POS, Stock, Members, History).
- **Productivity**:
  - `Ctrl + K`: Quick focus on product search.
  - `Ctrl + H`: Hold current order.
  - `Ctrl + P`: Print receipt from the modal.
  - `Enter`: Process checkout or confirm payments.
  - `Esc`: Close any active modal.

### 🛠️ Technical Improvements & Fixes
- **Data Persistence**: Upgraded data layer with **Dexie.js** for reliable IndexedDB transactions.
- **Customer Display**: Enhanced `BroadcastChannel` synchronization for real-time customer-facing updates.
- **UI/UX Polish**: Improved dark mode contrast, added glassmorphism effects, and refined button interactions.
- **Auto-Update**: Stabilized Electron update mechanism and metadata alignment.

---
*Kaze POS - Empowering your business with modern, efficient sales technology.*
