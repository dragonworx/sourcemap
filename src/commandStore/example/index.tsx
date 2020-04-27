import * as React from 'react';
import { useStore, State, Item as ItemModel } from './store';
import { Command, CommandCache } from '../src';
import Title from './title';
import Item from './item';
import Inspector from './inspector';
import Undo from './undo';
import Redo from './redo';
import './example.less';

export default function Example() {
   const { state, dispatch } = useStore();

   const onAddClick = () => dispatch(AddItemCmd());

   return (
      <div id="example">
         <h1>Command Store Example</h1>
         <section>
            <Undo />
            <Redo />
         </section>
         <div id="main">
            <section id="list">
               <section id="title">
                  <Title />
                  <button onClick={onAddClick}>Add</button>
               </section>
               <ol>{state.items.map((item, i) => <Item key={i} item={item} />)}</ol>
            </section>
            <Inspector />
         </div>
      </div>
   );
}

export const AddItemCmd = () => Command(
   'SetTitle',
   (cache: CommandCache, { items }: State) => {
      cache.add(items, {
         title: 'New Item' + items.length + 1,
         count: 0,
      } as ItemModel);
   }
);