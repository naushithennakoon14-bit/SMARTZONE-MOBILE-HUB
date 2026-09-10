const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    title: "SmartZone Mobile Hub POS System",
    backgroundColor: "#0B0F14",
    fullscreen: false,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:3000');
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// ESC/POS Thermal Printing IPC Simulation
ipcMain.handle('print-receipt', async (event, receiptData) => {
  console.log('ELECTRON IPC: Printing receipt via ESC/POS...', receiptData);
  // Simulated hardware print execution
  return { success: true, timestamp: new Date().toISOString() };
});
