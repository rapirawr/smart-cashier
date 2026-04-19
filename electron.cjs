const { app, BrowserWindow, screen } = require('electron');
const path = require('path');
const { autoUpdater } = require('electron-updater');
const { ipcMain } = require('electron');
const isDev = process.env.IS_DEV === 'true';

let cashierWin;
let customerWin;
let kitchenWin;

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
    width: 1200,
    height: 800,
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

  // 3. Kitchen Display Window
  kitchenWin = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      sandbox: false
    },
    backgroundColor: '#020617',
    title: 'Kitchen Display',
    show: false
  });

  kitchenWin.setMenuBarVisibility(false);

  if (isDev) {
    const devUrl = 'http://localhost:5173';
    cashierWin.loadURL(devUrl);
    customerWin.loadURL(`${devUrl}#customer-view`);
    kitchenWin.loadURL(`${devUrl}#kitchen-view`);
    cashierWin.webContents.openDevTools();
  } else {
    const indexPath = path.join(__dirname, 'dist/index.html');
    cashierWin.loadFile(indexPath);
    customerWin.loadFile(indexPath, { hash: 'customer-view' });
    kitchenWin.loadFile(indexPath, { hash: 'kitchen-view' });
  }

  cashierWin.once('ready-to-show', () => {
    cashierWin.show();
  });

  customerWin.once('ready-to-show', () => {
    customerWin.show();
  });

  kitchenWin.once('ready-to-show', () => {
    kitchenWin.show();
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
  autoUpdater.logger = console;
  autoUpdater.autoDownload = false;
  
  autoUpdater.on('update-available', (info) => {
    if (cashierWin) cashierWin.webContents.send('update_available', info);
  });

  autoUpdater.on('update-not-available', () => {
    if (cashierWin) cashierWin.webContents.send('update_not_available');
  });

  autoUpdater.on('update-downloaded', (info) => {
    if (cashierWin) cashierWin.webContents.send('update_downloaded', info);
  });

  autoUpdater.on('error', (err) => {
    console.error('Update error:', err);
    if (cashierWin) cashierWin.webContents.send('update_error', err.message || 'Unknown error');
  });

  setInterval(() => {
    autoUpdater.checkForUpdatesAndNotify();
  }, 10 * 60 * 1000);

  autoUpdater.checkForUpdatesAndNotify();
}

ipcMain.on('manual_check', () => {
  console.log('Manual update check requested');
  if (isDev) {
    setTimeout(() => {
      if (cashierWin) cashierWin.webContents.send('update_not_available');
    }, 1500);
  } else {
    autoUpdater.checkForUpdates().then(result => {
      console.log('Check for updates result:', result);
    }).catch(err => {
      console.error('Check for updates error:', err);
      if (cashierWin) cashierWin.webContents.send('update_error', err.message);
    });
  }
});

ipcMain.handle('get-app-version', () => {
  return app.getVersion();
});

ipcMain.on('start_download', () => {
  autoUpdater.downloadUpdate();
});

ipcMain.on('restart_app', () => {
  autoUpdater.quitAndInstall();
});

ipcMain.on('open-customer-view', () => {
  if (customerWin) {
    if (customerWin.isMinimized()) customerWin.restore();
    customerWin.show();
    customerWin.focus();
  } else {
    // Re-create if closed
    const displays = screen.getAllDisplays();
    const externalDisplay = displays.find(d => d.bounds.x !== 0 || d.bounds.y !== 0);
    customerWin = new BrowserWindow({
      width: 1200, height: 800,
      x: externalDisplay ? externalDisplay.bounds.x : 100,
      y: externalDisplay ? externalDisplay.bounds.y : 100,
      fullscreen: !!externalDisplay,
      webPreferences: { nodeIntegration: true, contextIsolation: false },
      backgroundColor: '#0f172a',
      title: 'Customer Display'
    });
    customerWin.setMenuBarVisibility(false);
    const indexPath = path.join(__dirname, isDev ? '' : 'dist', 'index.html');
    if (isDev) customerWin.loadURL('http://localhost:5173#customer-view');
    else customerWin.loadFile(indexPath, { hash: 'customer-view' });
  }
});

ipcMain.on('open-kitchen-view', () => {
  if (kitchenWin) {
    if (kitchenWin.isMinimized()) kitchenWin.restore();
    kitchenWin.show();
    kitchenWin.focus();
  } else {
    kitchenWin = new BrowserWindow({
      width: 1200, height: 800,
      webPreferences: { nodeIntegration: true, contextIsolation: false },
      backgroundColor: '#020617',
      title: 'Kitchen Display'
    });
    kitchenWin.setMenuBarVisibility(false);
    const indexPath = path.join(__dirname, isDev ? '' : 'dist', 'index.html');
    if (isDev) kitchenWin.loadURL('http://localhost:5173#kitchen-view');
    else kitchenWin.loadFile(indexPath, { hash: 'kitchen-view' });
  }
});

ipcMain.on('quit-app', () => {
  app.quit();
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
