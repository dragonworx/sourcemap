import { Node } from '~core';
import { SpacialCommand } from '~commands/spacialCommand';

export enum Alignment {
   Near,
   Center,
   Far,
};

export class AlignCommand extends SpacialCommand {
   constructor (readonly selectedNodes: Node[]) {
      super();
   }
   
   get alignment(): Alignment {
      return Alignment.Center;
   }

   get propKey(): string {
      throw new Error('unimplemented')
   }
   execute() {
      const { alignment, propKey, selectedNodes } = this;

      let value: number;

      if (alignment === Alignment.Center) {
         const left = this.getMin('left', selectedNodes);
         const top = this.getMin('top', selectedNodes);
         const right = this.getMax('right', selectedNodes);
         const bottom = this.getMax('bottom', selectedNodes);
         const midX = left + ((right - left) / 2);
         const midY = top + (bottom - top) / 2;
         const center = {
            centerX: midX,
            centerY: midY,
         } as any;
         selectedNodes.forEach((node: Node) => {
            const rect = node.rect as any;
            this.cacheUndo(rect, propKey, rect[propKey]);
            rect[propKey] = center[propKey];
            this.cacheRedo(rect, propKey, center[propKey]);
         });
      } else {
         if (alignment === Alignment.Near) {
            value = this.getMin(propKey, selectedNodes);
         } else if (alignment === Alignment.Far) {
            value = this.getMax(propKey, selectedNodes);
         }
         selectedNodes.forEach((node: Node) => {
            const rect = node.rect as any;
            this.cacheUndo(rect, propKey, rect[propKey]);
            rect[propKey] = value;
            this.cacheRedo(rect, propKey, value);
         });
      }
   }
}

export class AlignHCenterCommand extends AlignCommand {
   get alignment() {
      return Alignment.Center;
   }

   get propKey() {
      return 'centerX';
   }
}

export class AlignLeftCommand extends AlignCommand {
   get alignment() {
      return Alignment.Near;
   }

   get propKey() {
      return 'left';
   }
}

export class AlignBottomCommand extends AlignCommand {
   get alignment() {
      return Alignment.Far;
   }

   get propKey() {
      return 'bottom';
   }
}

export class AlignRightCommand extends AlignCommand {
   get alignment() {
      return Alignment.Far;
   }

   get propKey() {
      return 'right';
   }
}

export class AlignTopCommand extends AlignCommand {
   get alignment() {
      return Alignment.Near;
   }

   get propKey() {
      return 'top';
   }
}

export class AlignVCenterCommand extends AlignCommand {
   get alignment() {
      return Alignment.Center;
   }

   get propKey() {
      return 'centerY';
   }
}