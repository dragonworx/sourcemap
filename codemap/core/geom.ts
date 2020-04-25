
export interface Tuple {
   x: number;
   y: number;
}

import { View, Serialisable } from '~core';

export class Point implements Serialisable {
   x: number;
   y: number;

   constructor(x: number = 0, y: number = 0) {
      this.x = x;
      this.y = y;
   }

   toJSON() {
      const { x, y } = this;
      return {
         x,
         y,
      };
   }

   equals(point: Point) {
      return this.x === point.x && this.y === point.y;
   }

   init(x: number, y: number) {
      this.x = x;
      this.y = y;
   }
}

export class Rect implements Serialisable {
   readonly location: Point;
   width: number;
   height: number;

   constructor(x: number = 0, y: number = 0, width: number = 0, height: number = 0) {
      this.location = new Point(x, y);
      this.width = width;
      this.height = height;
   }

   toJSON() {
      const { x, y } = this.location;
      const { width, height } = this;
      return {
         x,
         y,
         width,
         height,
      };
   }

   init(x: number, y: number, width: number, height: number) {
      this.location.init(x, y);
      this.width = width;
      this.height = height;
   }

   containsRect(rect: Rect, view: View) {
      const { left, top, right, bottom } = view.transformRect(this);
      const { left: rectLeft, top: rectTop, right: rectRight, bottom: rectBottom } = rect;
      return !(rectLeft > right || 
         rectRight < left || 
         rectTop > bottom ||
         rectBottom < top);
   }

   containsPoint(point: Point, view: View) {
      const { x, y } = point;
      const { left, top, right, bottom } = view.transformRect(this);
      return (x >= left && x <= right) && (y >= top && y <= bottom);
   }

   get left() {
      return this.location.x;
   }

   set left(value: number) {
      this.location.x = value;
   }

   get top() {
      return this.location.y;
   }

   set top(value: number) {
      this.location.y = value;
   }

   get right() {
      return this.left + this.width;
   }

   set right(value: number) {
      this.left = value - this.width;
   }

   get bottom() {
      return this.top + this.height;
   }

   set bottom(value: number) {
      this.top = value - this.height;
   }

   get centerX() {
      return this.left + (this.width / 2);
   }

   set centerX(value: number) {
      this.left = value - (this.width / 2);
   }

   get centerY() {
      return this.top + (this.height / 2);
   }

   set centerY(value: number) {
      this.top = value - (this.height / 2);
   }
}

export const degToRad = (deg: number) => deg * (Math.PI / 180);

export const radToDeg = (rad: number) => rad * (180 / Math.PI);

export const length = (x1: number, y1: number, x2: number, y2: number) => {
   var x = Math.abs(x2 - x1);
   var y = Math.abs(y2 - y1);
   return Math.sqrt((y * y) + (x * x));
};

export const angle = (x1: number, y1: number, x2: number, y2: number) => {
   var deg = radToDeg(Math.atan2(y2 - y1, x2 - x1));
   if (deg < 0) deg = 180 + (180 - Math.abs(deg));
   return deg;
};

export const polarPoint = (deg: number, length: number) => {
   const rad = degToRad(deg);
   var x = length * Math.cos(rad);
   var y = length * Math.sin(rad);
   return new Point(x, y);
};