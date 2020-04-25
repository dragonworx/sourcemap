import * as React from 'react';
import { useStore } from '../store';

export default function Test1() {
   const { state } = useStore();

   return (
      <p>{state.title}{state.count}</p>
   )
}
