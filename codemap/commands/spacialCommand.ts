import { Command } from '~commands';
import { Node } from '~core';

export class SpacialCommand extends Command {
   getMin(propKey: string, selectedNodes: Node[]) {
      let value = Number.MAX_SAFE_INTEGER;
      selectedNodes.forEach((node: Node) => value = Math.min((node.rect as any)[propKey], value));
      return value;
   }

   getMax(propKey: string, selectedNodes: Node[]) {
      let value = Number.MAX_SAFE_INTEGER * -1;
      selectedNodes.forEach((node: Node) => value = Math.max((node.rect as any)[propKey], value));
      return value;
   }
}