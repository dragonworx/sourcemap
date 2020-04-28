import * as React from 'react';
import { useStore } from './store';
import Item from './item';
import { randomBorder } from './util';

export default function Items() {
   const { state } = useStore(['items']);

   return (
      <div id="items" style={randomBorder()}>
         <p>{state.items.length} Items:</p>
         <ol>{state.items.map((item, i) => <Item key={i} item={item} />)}</ol>
      </div>
   );
}