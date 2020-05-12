import { SpacialCommand } from '~/commands/spacialCommand';
import { Node } from '~core';

export class DistributeCommand extends SpacialCommand {
   constructor (readonly selectedNodes: Node[]) {
      super();
   }

   get propKey(): string {
      throw new Error();
   }

   execute() {
      const { propKey, selectedNodes } = this;
      const nodes = [...selectedNodes].sort((a: any, b: any) => a[propKey] < b[propKey] ? -1 : a[propKey] > b[propKey] ? 1 : 0);
      const ubound = selectedNodes.length - 1;
      const min = (selectedNodes[0] as any).rect[propKey];
      const max = (selectedNodes as any)[ubound].rect[propKey];
      const width = max - min;
      nodes.forEach((node: Node, i: number) => {
         const t = i / (ubound);
         const rect = node.rect as any;
         this.cacheUndo(rect, propKey, rect[propKey]);
         const value = min + (width * t);
         rect[propKey] = value;
         this.cacheRedo(rect, propKey, value);
      });
   }
}

export class DistributeHorizontallyCommand extends DistributeCommand {
   get propKey(): string {
      return 'left';
   }
}

export class DistributeVerticallyCommand extends DistributeCommand {
   get propKey(): string {
      return 'top';
   }
}