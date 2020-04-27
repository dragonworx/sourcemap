import * as React from 'react';
import { useStore } from './store';

export default function Redo() {
   const { redo } = useStore();

   return <button onClick={redo}>Redo</button>;
}
