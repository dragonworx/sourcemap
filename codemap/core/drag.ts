import { Tuple } from '~core/geom';

export class Drag {
   startMousePoint?: Tuple;
   startValue?: Tuple

   start(point: Tuple, value: Tuple) {
      this.startMousePoint = point;
      this.startValue = value;
   }

   value(currentMousePoint: Tuple) {
      const x = this.startValue!.x + (currentMousePoint.x - this.startMousePoint!.x);
      const y = this.startValue!.y + (currentMousePoint.y - this.startMousePoint!.y);
      return { x, y };
   }
}