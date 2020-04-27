const electron = require("electron");
const { autoUpdater } = require("electron-updater");
const app = electron.app;
app.commandLine.appendSwitch("ignore-certificate-errors", "true");

const BrowserWindow = electron.BrowserWindow;

const path = require("path");
const isDev = require("electron-is-dev");
var Menu = electron.Menu;

let mainWindow;

function sendStatusToWindow(text) {
  log.info(text);
  win.webContents.send("message", text);
}

function createWindow() {
  mainWindow = new BrowserWindow({
    show: false,
    webPreferences: {
      webSecurity: false,
    },
  });
  mainWindow.maximize();
  mainWindow.show();
  mainWindow.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );
  require("update-electron-app")();

  if (isDev) {
    // Open the DevTools.
    //BrowserWindow.addDevToolsExtension('<location to your react chrome extension>');
    mainWindow.webContents.openDevTools();
  }

  if (process.platform === "darwin") {
    template = [
      {
        label: "Rubrik GraphQL Playground",
        submenu: [
          {
            label: "About Rubrik GraphQL Playground",
            selector: "orderFrontStandardAboutPanel:",
          },
          {
            type: "separator",
          },
          {
            label: "Quit",
            accelerator: "Command+Q",
            click: function () {
              app.quit();
            },
          },
        ],
      },
      {
        label: "File",
        submenu: [
          {
            label: "Logout",
            accelerator: "Command+L",
            click: function () {
              if (mainWindow.restart) {
                mainWindow.restart();
              } else if (mainWindow.reload) {
                mainWindow.reload();
              }
            },
          },
          {
            label: "Quit",
            accelerator: "Command+Q",
            click() {
              app.quit();
            },
          },
        ],
      },
      {
        label: "Edit",
        submenu: [
          {
            label: "Undo",
            accelerator: "Command+Z",
            selector: "undo:",
          },
          {
            label: "Redo",
            accelerator: "Shift+Command+Z",
            selector: "redo:",
          },
          {
            type: "separator",
          },
          {
            label: "Cut",
            accelerator: "Command+X",
            selector: "cut:",
          },
          {
            label: "Copy",
            accelerator: "Command+C",
            selector: "copy:",
          },
          {
            label: "Paste",
            accelerator: "Command+V",
            selector: "paste:",
          },
          {
            label: "Select All",
            accelerator: "Command+A",
            selector: "selectAll:",
          },
        ],
      },
      {
        label: "View",
        submenu: [
          {
            label: "Toggle Full Screen",
            accelerator: "Ctrl+Command+F",
            click: function () {
              mainWindow.setFullScreen(!mainWindow.isFullScreen());
            },
          },
          {
            label: "Toggle Developer Tools",
            accelerator: "Alt+Command+I",
            click: function () {
              mainWindow.toggleDevTools();
            },
          },
          {
            role: "resetzoom",
          },
          {
            role: "zoomin",
          },
          {
            role: "zoomout",
          },
        ],
      },
      {
        label: "Window",
        submenu: [
          {
            label: "Minimize",
            accelerator: "Command+M",
            selector: "performMiniaturize:",
          },
          {
            type: "separator",
          },
          {
            label: "Bring All to Front",
            selector: "arrangeInFront:",
          },
        ],
      },
    ];

    menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
  } else {
    template = [
      {
        label: "&File",
        submenu: [
          {
            label: "Logout",
            accelerator: "Command+L",
            click: function () {
              if (mainWindow.restart) {
                mainWindow.restart();
              } else if (mainWindow.reload) {
                mainWindow.reload();
              }
            },
          },
          {
            label: "Quit",
            accelerator: "Command+Q",
            click() {
              app.quit();
            },
          },
        ],
      },
      {
        label: "&View",
        submenu: [
          {
            label: "Toggle &Full Screen",
            accelerator: "F11",
            click: function () {
              mainWindow.setFullScreen(!mainWindow.isFullScreen());
            },
          },
          {
            label: "Toggle &Developer Tools",
            accelerator: "Alt+Ctrl+I",
            click: function () {
              mainWindow.toggleDevTools();
            },
          },
        ],
      },
    ];
    menu = Menu.buildFromTemplate(template);
    mainWindow.setMenu(menu);
  }

  mainWindow.on("closed", () => (mainWindow = null));
}

autoUpdater.on("checking-for-update", () => {
  sendStatusToWindow("Checking for update...");
});
autoUpdater.on("update-available", (info) => {
  sendStatusToWindow("Update available.");
});
autoUpdater.on("update-not-available", (info) => {
  sendStatusToWindow("Update not available.");
});
autoUpdater.on("error", (err) => {
  sendStatusToWindow("Error in auto-updater. " + err);
});
autoUpdater.on("download-progress", (progressObj) => {
  let log_message = "Download speed: " + progressObj.bytesPerSecond;
  log_message = log_message + " - Downloaded " + progressObj.percent + "%";
  log_message =
    log_message +
    " (" +
    progressObj.transferred +
    "/" +
    progressObj.total +
    ")";
  sendStatusToWindow(log_message);
});
autoUpdater.on("update-downloaded", (info) => {
  sendStatusToWindow("Update downloaded - please restart latest version");
  //autoUpdater.quitAndInstall();
});

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    require("update-electron-app")();

    createWindow();
  }
});

// app quits.
//-------------------------------------------------------------------
app.on("ready", function () {
  autoUpdater.checkForUpdatesAndNotify();
});
