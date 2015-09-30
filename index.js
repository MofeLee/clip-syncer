'use strict';
const app = require('app');
const BrowserWindow = require('browser-window');
const globalShortcut = require('global-shortcut');
const clipboard = require('clipboard');
const ipc = require('ipc');

ipc.on('ipc-message', function(event, arg){
  console.log(arg);
  event.sender.send('ipc-reply', 'pong');
});

// report crashes to the Electron project
require('crash-reporter').start();

// adds debug features like hotkeys for triggering dev tools and reload
require('electron-debug')();

// prevent window being garbage collected
let mainWindow;

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate-with-no-open-windows', () => {
  if (!mainWindow) {
    mainWindow = createMainWindow();
  }
});

app.on('ready', () => {
  mainWindow = createMainWindow();
  mainWindow.openDevTools();
  registerShortcut();
});

function onClosed() {
  // dereference the window
  // for multiple windows store them in an array
  mainWindow = null;
}

function createMainWindow() {
  const win = new BrowserWindow({
    width: 600,
    height: 400
  });

  win.loadUrl(`file://${__dirname}/index.html`);
  win.on('closed', onClosed);

  return win;
}

function registerShortcut(){
  let ret = globalShortcut.register('alt+s', function() {
    console.log(clipboard.readText());
  });

  if (!ret) {
    console.log('registration failed');
    return;
  }

  // Check whether a shortcut is registered.
  console.log(globalShortcut.isRegistered('alt+s'));
  return ret;
}
