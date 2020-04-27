import * as React from 'react';
import { useStore } from './store';

export default function Undo() {
   const { undo } = useStore();

   return <button onClick={undo}>Undo</button>;
}
