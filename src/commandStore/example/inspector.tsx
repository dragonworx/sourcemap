import * as React from 'react';
import { useStore } from './store';

export default function Inspector() {
   const { state } = useStore();

   return (
      <section id="summary">
         <h2>State</h2>
         <pre>
            {JSON.stringify(state, null, 4)}
         </pre>
      </section>
   );
}