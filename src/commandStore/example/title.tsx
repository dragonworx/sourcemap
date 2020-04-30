import * as React from 'react';
import { useRef } from 'react';
import { useStore, State } from './store';
import { Command, Mutator } from '../src';
import { randomBorder } from './util';

export default function Title() {
   const { state, dispatch } = useStore('title');
   const el = useRef<HTMLInputElement>(null);

   const onChange = () => dispatch(SetTitleCmd(el.current!.value));

   return (
      <div id="title" style={randomBorder()}>
         <label>Title:</label>
         <input ref={el} onChange={onChange} value={state.title} />
      </div>
   );
}

export const SetTitleCmd = (newTitle: string) => Command(
   'SetTitle',
   (mutator: Mutator, state) => {
      mutator.modify(state, 'title', newTitle);
      return ['title'];
   }
);

export function SetTitleCmd2(state: State, title: string) {
   state.title = title;
}