import * as React from 'react';
import { useStore } from '../store';
import { SetNode } from '../commands/setNode';
import Button from './button';

export default function Test1() {
   const { state: { title, count, nodes },dispatch } = useStore();

   const onClick = () => {
      dispatch(SetNode());
   };

   return (
      <p>
         title: <b>{title}</b><br/>
         count: <b>{count}</b><br/>
         node.label: {nodes[0].label}<br/>
         <Button text="Modify label" onClick={onClick}></Button>
      </p>
   )
}
