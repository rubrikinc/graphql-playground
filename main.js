var electron = require('electron');
var app = electron.app;
var BrowserWindow = electron.BrowserWindow;
var Menu = electron.Menu;
var crashReporter = electron.crashReporter;
const shell = electron.shell;
var menu, template;
const {autoUpdater} = require('electron-updater');


crashReporter.start({
  productName: 'Rubrik GraphQL Playground',
  companyName: 'Rubrik, Inc',
  submitURL: 'https://github.com/rubrikinc/graphql-playground/issues',
  autoSubmit: true
});

var mainWindow = null;

app.on('window-all-closed', function() {
  if (process.platform !== 'darwin') app.quit();
});


app.on('ready', function() {

  autoUpdater.checkForUpdatesAndNotify();

  mainWindow = new BrowserWindow({ width: 1024, height: 728 });

  electron.session.defaultSession.webRequest.onBeforeSendHeaders((details, callback) => {
    details.requestHeaders['Origin'] = 'electron://rubrik-graphql-playground';
    callback({ cancel: false, requestHeaders: details.requestHeaders });
  });

  if (process.env.HOT) {
    mainWindow.loadURL('file://' + __dirname + '/app/hot-dev-app.html');
  } else {
    mainWindow.loadURL('file://' + __dirname + '/app/app.html');
  }

  mainWindow.on('closed', function() {
    mainWindow = null;
  });

  if (process.env.NODE_ENV === 'development') {
    mainWindow.openDevTools();
  }

  if (process.platform === 'darwin') {
    template = [{
      label: 'Rubrik GraphQL Playground',
      submenu: [{
        label: 'About Rubrik GraphQL Playground',
        selector: 'orderFrontStandardAboutPanel:'
      }, {
        type: 'separator'
      }, {
        label: 'Quit',
        accelerator: 'Command+Q',
        click: function() {
          app.quit();
        }
      }]
    }, {
      label: 'File',
      submenu: [{
        label: 'Quit',
        accelerator: 'Command+Q',
        click() { app.quit(); }
      }]
    }, {
      label: 'Edit',
      submenu: [{
        label: 'Undo',
        accelerator: 'Command+Z',
        selector: 'undo:'
      }, {
        label: 'Redo',
        accelerator: 'Shift+Command+Z',
        selector: 'redo:'
      }, {
        type: 'separator'
      }, {
        label: 'Cut',
        accelerator: 'Command+X',
        selector: 'cut:'
      }, {
        label: 'Copy',
        accelerator: 'Command+C',
        selector: 'copy:'
      }, {
        label: 'Paste',
        accelerator: 'Command+V',
        selector: 'paste:'
      }, {
        label: 'Select All',
        accelerator: 'Command+A',
        selector: 'selectAll:'
      }]
    }, {
      label: 'View',
      submenu: [{
        label: 'Reload',
        accelerator: 'Command+R',
        click: function() {
          if (mainWindow.restart) {
            mainWindow.restart();
          }
          else if (mainWindow.reload) {
            mainWindow.reload();
          }
        }
      }, {
        label: 'Toggle Full Screen',
        accelerator: 'Ctrl+Command+F',
        click: function() {
          mainWindow.setFullScreen(!mainWindow.isFullScreen());
        }
      }, {
        label: 'Toggle Developer Tools',
        accelerator: 'Alt+Command+I',
        click: function() {
          mainWindow.toggleDevTools();
        }
      }, {
        role: 'resetzoom'
      }, {
        role: 'zoomin'
      }, {
        role: 'zoomout'
      }]
    }, {
      label: 'Window',
      submenu: [{
        label: 'Minimize',
        accelerator: 'Command+M',
        selector: 'performMiniaturize:'
      }, {
        type: 'separator'
      }, {
        label: 'Bring All to Front',
        selector: 'arrangeInFront:'
      }]
    }, {
      label: 'Help',
      submenu: [{
        label: 'Learn GraphQL',
        click: function() {
          shell.openExternal('http://graphql.org/learn/');
        }
      }, {
        label: 'Documentation',
        click: function() {
          shell.openExternal('https://github.com/graphql/graphiql#graphiql');
        }
      }, {
        label: 'Community Resources',
        click: function() {
          shell.openExternal('http://graphql.org/community/');
        }
      }, {
        label: 'Search GraphiQL Issues',
        click: function() {
          shell.openExternal('https://github.com/graphql/graphiql/issues');
        }
      }]
    }];

    menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
  } else {
    template = [{
      label: '&File',
      submenu: [{
        label: 'Quit',
        accelerator: 'Command+Q',
        click() { app.quit(); }
      }]
    }, {
      label: '&View',
      submenu: [{
        label: '&Reload',
        accelerator: 'Ctrl+R',
        click: function() {
          if (mainWindow.restart) {
            mainWindow.restart();
          }
          else if (mainWindow.reload) {
            mainWindow.reload();
          }
        }
      }, {
        label: 'Toggle &Full Screen',
        accelerator: 'F11',
        click: function() {
          mainWindow.setFullScreen(!mainWindow.isFullScreen());
        }
      }, {
        label: 'Toggle &Developer Tools',
        accelerator: 'Alt+Ctrl+I',
        click: function() {
          mainWindow.toggleDevTools();
        }
      }]
    }, {
      label: 'Help',
      submenu: [{
        label: 'Learn More',
        click: function() {
          shell.openExternal('http://electron.atom.io');
        }
      }, {
        label: 'Documentation',
        click: function() {
          shell.openExternal('https://github.com/atom/electron/tree/master/docs#readme');
        }
      }, {
        label: 'Community Discussions',
        click: function() {
          shell.openExternal('https://discuss.atom.io/c/electron');
        }
      }]
    }];
    menu = Menu.buildFromTemplate(template);
    mainWindow.setMenu(menu);
  }
});
