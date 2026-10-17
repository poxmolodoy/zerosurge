const { contextBridge } = require('electron');

// Expose safe, isolated desktop platform info
contextBridge.exposeInMainWorld('electronAPI', {
  isDesktop: true,
  platform: process.platform,
});
