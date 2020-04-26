import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { App } from './components/app';
import { Provider } from './store';

console.log('App started: ' + Date.now());

ReactDOM.render((
   <Provider>
      <App />
   </Provider>
), document.getElementById('app'));