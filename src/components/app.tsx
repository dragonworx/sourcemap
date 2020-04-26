import * as React from 'react';
import { useStore } from '../store';
import Test from './test';
import Test1 from './test1';
import Undo from './undo';
import Redo from './redo';
import './app.less';

export function App() {
   const { state: { title }, dispatch } = useStore();

   return (
      <div>
         <p>{title}</p>
         <Test />
         <Test1 />
         <Undo />
         <Redo />
         <p>{title}</p>
      </div>
   )
}
