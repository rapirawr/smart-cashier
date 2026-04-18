const { app, BrowserWindow, screen } = require('electron');
const path = require('path');
const { autoUpdater } = require('electron-updater');
const { ipcMain } = require('electron');
const isDev = process.env.IS_DEV === 'true';

let cashierWin;
let customerWin;

const isFirstInstance = app.requestSingleInstanceLock();

if (!isFirstInstance) {
  app.quit();
} else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    if (cashierWin) {
      if (cashierWin.isMinimized()) cashierWin.restore();
      cashierWin.focus();
    }
  });

  app.whenReady().then(() => {
    createWindow();
    setupAutoUpdateListeners();
  });
}

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

  cashierWin.once('ready-to-show', () => {
    cashierWin.show();
  });

  customerWin.once('ready-to-show', () => {
    customerWin.show();
  });

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

function setupAutoUpdateListeners() {
  autoUpdater.autoDownload = false;
  
  autoUpdater.on('update-available', () => {
    if (cashierWin) cashierWin.webContents.send('update_available');
  });

  autoUpdater.on('update-not-available', () => {
    if (cashierWin) cashierWin.webContents.send('update_not_available');
  });

  autoUpdater.on('update-downloaded', () => {
    if (cashierWin) cashierWin.webContents.send('update_downloaded');
  });

  autoUpdater.on('error', (err) => {
    console.error('Update error:', err);
    if (cashierWin) cashierWin.webContents.send('update_error', err.message);
  });

  setInterval(() => {
    autoUpdater.checkForUpdatesAndNotify();
  }, 10 * 60 * 1000);

  autoUpdater.checkForUpdatesAndNotify();
}

ipcMain.on('manual_check', () => {
  if (isDev) {
    setTimeout(() => {
      if (cashierWin) cashierWin.webContents.send('update_not_available');
    }, 1500);
  } else {
    autoUpdater.checkForUpdatesAndNotify();
  }
});

ipcMain.on('start_download', () => {
  autoUpdater.downloadUpdate();
});

ipcMain.on('restart_app', () => {
  autoUpdater.quitAndInstall();
});

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
