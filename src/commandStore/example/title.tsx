import * as React from 'react';
import { useRef } from 'react';
import { useStore } from './store';
import { randomBorder } from './util';

export default function Title() {
   const { state } = useStore('title');
   const el = useRef<HTMLInputElement>(null);

   const onChange = () => state.title = el.current!.value;

   return (
      <div id="title" style={randomBorder()}>
         <label>Title:</label>
         <input ref={el} onChange={onChange} value={state.title} />
      </div>
   );
}