import * as React from 'react';
import { useStore } from '../store';
import Button from './button';

export default function Test1() {
   const { undo } = useStore();

   return (
      <div>
         <Button text={'Undo'} onClick={undo}></Button>
      </div>
   )
}
