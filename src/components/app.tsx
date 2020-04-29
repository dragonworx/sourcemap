import * as React from 'react';
import Example from '../commandStore/example';
import './app.less';

export function App() {
   return (
      <Example />
   )
}

import {proxy} from '../commandStore/src/proxy';
(window as any).test = proxy;