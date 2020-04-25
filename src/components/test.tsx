import * as React from 'react';
import { useStore } from '../store';
import { SetTitle } from '../commands/setTitle';
import Button from './button';

export default function Test() {
   const { state, dispatch } = useStore();

   const onClick = () => {
      dispatch(SetTitle('foo!'));
   };

   return (
      <div>
         <Button text={state.title} onClick={onClick}></Button>
      </div>
   )
}
