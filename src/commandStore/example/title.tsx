import * as React from 'react';
import { useRef } from 'react';
import { useStore } from './store';
import { Command, CommandCache } from '../src';
import { randomBorder } from './util';


export default function Title() {
   const { state, dispatch } = useStore();
   const el = useRef<HTMLInputElement>(null);

   const onChange = () => dispatch(SetTitleCmd(el.current!.value));

   return (
      <>
         <label style={randomBorder()}>Title:</label>
         <input ref={el} onChange={onChange} value={state.title} />
      </>
   );
}

export const SetTitleCmd = (newTitle: string) => Command(
   'SetTitle',
   (cache: CommandCache, state) => {
      cache.modify(state, 'title', newTitle);
   }
);