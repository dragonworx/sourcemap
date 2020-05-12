import * as React from 'react';
import {AffineView} from './affineview';
import './app.less';

export function App() {
   return (
      <AffineView width={500} height={500}>
         <div className="rect"></div>
      </AffineView>
   )
}