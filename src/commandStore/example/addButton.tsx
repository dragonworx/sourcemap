import * as React from 'react';
import { useStore, State, Item as ItemModel } from './store';
import { Command, CommandCache, Mutator } from '../src';
import { randomBorder } from './util';

export default function AddButton() {
   const { dispatch } = useStore([]);

   const onAddClick = () => dispatch(AddItemCmd());

   return (
      <button style={randomBorder()} onClick={onAddClick}>Add</button>
   );
}

export const AddItemCmd = () => Command(
   'SetTitle',
   (mutator: Mutator, { items }: State) => {
      mutator.add(items, {
         title: 'New Item' + items.length + 1,
         count: 0,
      } as ItemModel);
      return ['items'];
   }
);