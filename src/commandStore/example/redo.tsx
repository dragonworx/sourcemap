import * as React from 'react';
import { useStore } from './store';
import { randomBorder } from './util';

export default function Redo() {
   const { redo } = useStore();

   return <button onClick={redo} style={randomBorder()}>Redo</button>;
}
