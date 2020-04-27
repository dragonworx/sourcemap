import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { App } from './components/app';
import { ExampleProvider } from './commandStore/example/store';

console.log('App started: ' + Date.now());

ReactDOM.render((
   <ExampleProvider>
      <App />
   </ExampleProvider>
), document.getElementById('app'));