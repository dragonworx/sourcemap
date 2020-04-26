import * as React from 'react';
import { useStore } from '../store';
import Button from './button';

export default function Test1() {
   const { redo } = useStore();

   return (
      <div>
         <Button text={'Redo'} onClick={redo}></Button>
      </div>
   )
}
