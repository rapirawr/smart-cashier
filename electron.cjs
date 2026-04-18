const { app, BrowserWindow, screen } = require('electron');
const path = require('path');
const isDev = process.env.IS_DEV === 'true';

let cashierWin;
let customerWin;

function createWindow() {
  const displays = screen.getAllDisplays();
  const externalDisplay = displays.find((display) => {
    return display.bounds.x !== 0 || display.bounds.y !== 0;
  });

  // 1. Cashier Window
  cashierWin = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 1024,
    minHeight: 720,
    resizable: true,
    maximizable: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    backgroundColor: '#020617',
    title: 'Kasir Premium Desktop'
  });

  cashierWin.maximize();
  cashierWin.setMenuBarVisibility(false);

  // 2. Customer Display Window
  customerWin = new BrowserWindow({
    width: 800,
    height: 600,
    x: externalDisplay ? externalDisplay.bounds.x : 100,
    y: externalDisplay ? externalDisplay.bounds.y : 100,
    fullscreen: !!externalDisplay,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    backgroundColor: '#0f172a',
    title: 'Customer Display'
  });

  customerWin.setMenuBarVisibility(false);

  const baseUrl = isDev
    ? 'http://localhost:5173'
    : `file://${path.join(__dirname, 'dist/index.html')}`;

  cashierWin.loadURL(baseUrl);
  customerWin.loadURL(`${baseUrl}#customer-view`);

  // Handle Zoom shortcuts manually for Cashier
  cashierWin.webContents.on('before-input-event', (event, input) => {
    if (input.control && input.key === '=') {
      cashierWin.webContents.setZoomLevel(cashierWin.webContents.getZoomLevel() + 0.5);
      event.preventDefault();
    }
    if (input.control && input.key === '-') {
      cashierWin.webContents.setZoomLevel(cashierWin.webContents.getZoomLevel() - 0.5);
      event.preventDefault();
    }
    if (input.control && input.key === '0') {
      cashierWin.webContents.setZoomLevel(0);
      event.preventDefault();
    }
  });

  if (isDev) {
    cashierWin.webContents.openDevTools();
  }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
