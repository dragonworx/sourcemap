import * as React from 'react';
import { useRef } from 'react';
import { useStore, Item, State } from './store';
import { Command, CommandCache } from '../src';
import { randomBorder } from './util';

export interface Props {
   item: Item;
}

export default function Item({ item }: Props) {
   const { dispatch } = useStore();
   const titleEl = useRef<HTMLInputElement>(null);
   const countEl = useRef<HTMLInputElement>(null);

   const onTitleChange = () => dispatch(SetItemTitleCmd(item, titleEl.current!.value));
   const onCountChange = () => dispatch(SetItemCountCmd(item, countEl.current!.value));
   const onDeleteClick = () => dispatch(DeleteItemCmd(item));

   return (
      <li>
         <div className="item" style={randomBorder()}>
            <input ref={titleEl} onChange={onTitleChange} value={item.title} />
            <input ref={countEl} type="number" onChange={onCountChange} value={item.count} />
            <button className="delete" onClick={onDeleteClick}>X</button>
         </div>
      </li>
   )
}

export const SetItemTitleCmd = (item: Item, title: string) => Command(
   'SetItemTitle',
   (cache: CommandCache) => {
      cache.modify(item, 'title', title);
   }
);

export const SetItemCountCmd = (item: Item, count: string) => Command(
   'SetItemCount',
   (cache: CommandCache) => {
      cache.modify(item, 'count', count);
   }
);

export const DeleteItemCmd = (item: Item) => Command(
   'DeleteItem',
   (cache: CommandCache, { items }: State) => {
      cache.delete(items, item);
   }
);