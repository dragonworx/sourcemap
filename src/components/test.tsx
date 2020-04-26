import * as React from 'react';
import { useRef } from 'react';
import { useStore } from '../store';
import { SetTitle } from '../commands/setTitle';
import Button from './button';

export default function Test() {
   const input = useRef<HTMLInputElement>(null);
   const { state: { title }, dispatch } = useStore();

   const onClick = () => {
      const el = input.current;
      dispatch(SetTitle('+' + el!.value));
   };

   return (
      <div>
         <input ref={input} defaultValue="foo" /><br/>
         <Button text={`Modify title: "${title}"`} onClick={onClick}></Button>
      </div>
   )
}
