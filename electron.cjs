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
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      sandbox: false
    },
    backgroundColor: '#020617',
    title: 'Smart Cashier Desktop',
    show: false
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
      sandbox: false
    },
    backgroundColor: '#0f172a',
    title: 'Customer Display',
    show: false
  });

  customerWin.setMenuBarVisibility(false);

  if (isDev) {
    const devUrl = 'http://localhost:5173';
    cashierWin.loadURL(devUrl);
    customerWin.loadURL(`${devUrl}#customer-view`);
    cashierWin.webContents.openDevTools();
  } else {
    const indexPath = path.join(__dirname, 'dist/index.html');
    cashierWin.loadFile(indexPath);
    customerWin.loadFile(indexPath, { hash: 'customer-view' });
  }

  // Show windows when they are ready to prevent flickering
  cashierWin.once('ready-to-show', () => {
    cashierWin.show();
  });

  // Only show customer window if it's supposed to be on (could add more logic here if needed)
  customerWin.once('ready-to-show', () => {
    customerWin.show();
  });

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
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
