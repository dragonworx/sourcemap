import * as React from 'react';
import { useStore } from './store';
import { randomBorder } from './util';

export default function Inspector() {
   const { state, undoCount, redoCount } = useStore(['*']);

   return (
      <section id="summary" style={randomBorder()}>
         <h2>Undo: <i>{undoCount}</i> Redo: <i>{redoCount}</i> State:</h2>
         <pre>
            {JSON.stringify(state, null, 4)}
         </pre>
      </section>
   );
}