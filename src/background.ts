'use strict'

import { app, protocol, BrowserWindow, globalShortcut } from 'electron'
import {
  createProtocol,
  installVueDevtools
} from 'vue-cli-plugin-electron-builder/lib'

const { autoUpdater } = require("electron-updater")

const isDevelopment = process.env.NODE_ENV !== 'production'

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win: BrowserWindow | null

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([{scheme: 'app', privileges: { secure: true, standard: true } }])

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({ width: 1000, minWidth: 1000, height: 700, frame: true, webPreferences: {
    nodeIntegration: true
  } })

  if(!isDevelopment){
    win.removeMenu()
  }

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL as string)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
  }

  win.on('closed', () => {
    win = null
  })
/*
  win.webContents.on('new-window', (event, url, frameName, disposition, options) => {
    event.preventDefault()
    const win = new BrowserWindow({
      webContents: options.webContents, // use existing webContents if provided
      show: false,
      frame: true
    })
    win.once('ready-to-show', () => win.show())
    if (!options.webContents) {
      win.loadURL(url) // existing webContents will be navigated automatically
    }
    event.newGuest = win
  })
  */
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installVueDevtools()
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }
  autoUpdater.checkForUpdatesAndNotify()
  createWindow()

  globalShortcut.register('CommandOrControl+F', () => {
  if(win.isFullScreen()){
    win.setFullScreen(false)
  }else{
    win.setFullScreen(true)
  }
})
})



// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', data => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}
