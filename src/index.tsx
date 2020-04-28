import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { App } from './components/app';

console.log('App started: ' + Date.now());

ReactDOM.render((
   <App />
), document.getElementById('app'));