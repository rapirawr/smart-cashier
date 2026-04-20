# 🚀 Kaze POS

A modern, high-performance Point of Sale (POS) application built with React and Electron. Designed for speed, reliability, and a premium user experience.


## ✨ Key Features

-   **💎 Premium POS Interface**: Clean, minimalist, and highly responsive UI designed for maximum productivity.
-   **🖥️ Dual Screen / Customer Display**: Automatically syncs current cart and total to a second screen using `BroadcastChannel`.
-   **👥 Member Management**: Integrated database for customers with automatic discount application based on phone number.
-   **📦 Stock Management**: Real-time stock tracking with visual alerts for low-inventory items.
-   **💸 Manual QRIS Support**: Integrated support for static QRIS images (no transaction fees!).
-   **📊 Reports & Export**: Track transaction history and export everything to professional Excel (.xlsx) files.
-   **🎨 Theme Personalization**: Real-time RGB theme customization and high-contrast Dark Mode support.
-   **💾 Local Database**: Powered by **Dexie.js (IndexedDB)** — your data stays safe and fast on your device.

## 🛠️ Tech Stack

-   **Frontend**: [React 19](https://reactjs.org/)
-   **Build Tool**: [Vite 8](https://vitejs.dev/)
-   **Desktop Wrapper**: [Electron](https://www.electronjs.org/)
-   **Database**: [Dexie.js](https://dexie.org/)
-   **Data Export**: [SheetJS (XLSX)](https://sheetjs.com/)
-   **Styling**: Vanilla CSS (Premium Glassmorphism & Modern Layouts)

## 🚀 Getting Started

### Prerequisites

-   [Node.js](https://nodejs.org/) (Latest LTS)
-   npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/rapirawr/smart-cashier.git
   cd kasir
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Running the App

-   **Web Version (Development)**:
    ```bash
    npm run dev
    ```
-   **Desktop Version (Electron)**:
    ```bash
    npm run desktop
    ```

## ⚙️ Configuration

### Manual QRIS Setup
1. Open the app and go to the **Settings (Pengaturan)** tab.
2. Upload your static QRIS image to a hosting service (e.g., [PostImages](https://postimages.org/)).
3. Paste the direct image link into the **"URL GAMBAR QRIS (MANUAL)"** field.
4. Now, every time a customer chooses QRIS, your QR code will be displayed on the screen.

## 📦 Building for Production

To create a Windows installer (`.exe`):
```bash
npm run dist
```
The installer will be available in the `dist_electron` directory.

## 📜 License

Copyright © 2026 Rafi Abdillah Fairuz. All rights reserved. 
Unauthorized use, reproduction, or distribution of this software is strictly prohibited.

---

Built with ❤️ for better retail experience.
