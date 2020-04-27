import * as React from 'react';
import { useRef } from 'react';
import { useStore } from './store';
import { Command, CommandCache } from '../src';



export default function Title() {
   const { state: { title }, dispatch } = useStore();
   const el = useRef<HTMLInputElement>(null);

   const onChange = () => dispatch(SetTitleCmd(el.current!.value));

   return (
      <>
         <label>Title:</label>
         <input ref={el} onChange={onChange} value={title} />
      </>
   );
}

export const SetTitleCmd = (newTitle: string) => Command(
   'SetTitle',
   (cache: CommandCache, state) => {
      cache.modify(state, 'title', newTitle);
   }
);