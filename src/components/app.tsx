import * as React from 'react';
import { Provider } from '../store';
import Test from './test';
import Test1 from './test1';
import Undo from './undo';
import Redo from './redo';
import './app.less';

export function App() {
   return (
      <Provider>
         <Test />
         <Test1 />
         <Undo />
         <Redo />
      </Provider>
   )
}
