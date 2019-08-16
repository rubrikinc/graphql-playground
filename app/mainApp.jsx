import './app.css';
import 'graphiql/graphiql.css';

import React from 'react';
import ReactDOM from 'react-dom';

import App from './components/App';

const app = ReactDOM.render(<App />, document.getElementById('react-root'));

const ipcRenderer = window.require('electron').ipcRenderer;

ipcRenderer.on('handleElectronMenuOption', function(event, option) {
  app.handleElectronMenuOption(option);
});
