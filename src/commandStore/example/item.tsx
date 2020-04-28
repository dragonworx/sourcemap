import * as React from 'react';
import { useRef } from 'react';
import { useStore, Item, State } from './store';
import { Command, Mutator } from '../src';
import { randomBorder } from './util';

export interface Props {
   item: Item;
}

export default function Item({ item }: Props) {
   const { dispatch } = useStore(['items']);
   const titleEl = useRef<HTMLInputElement>(null);
   const countEl = useRef<HTMLInputElement>(null);

   const onTitleChange = () => dispatch(SetItemTitleCmd(item, titleEl.current!.value));
   const onCountChange = () => dispatch(SetItemCountCmd(item, countEl.current!.value));
   const onDeleteClick = () => dispatch(DeleteItemCmd(item));

   return (
      <li>
         <div className="item" style={randomBorder()}>
            <input ref={titleEl} onChange={onTitleChange} value={item.title} style={randomBorder()} />
            <input ref={countEl} type="number" onChange={onCountChange} value={item.count} style={randomBorder()} />
            <button className="delete" onClick={onDeleteClick} style={randomBorder()}>X</button>
         </div>
      </li>
   )
}

export const SetItemTitleCmd = (item: Item, title: string) => Command(
   'SetItemTitle',
   (mutator: Mutator) => {
      mutator.modify(item, 'title', title);
      return ['items'];
   }
);

export const SetItemCountCmd = (item: Item, count: string) => Command(
   'SetItemCount',
   (mutator: Mutator) => {
      mutator.modify(item, 'count', count);
      return ['items'];
   }
);

export const DeleteItemCmd = (item: Item) => Command(
   'DeleteItem',
   (mutator: Mutator, { items }: State) => {
      mutator.delete(items, item);
      return ['items'];
   }
);