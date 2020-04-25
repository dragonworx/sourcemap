import * as React from 'react';
import {
   useState,
   useRef,
   MouseEvent,
   KeyboardEvent,
   WheelEvent,
} from 'react';
import { Point } from '../lib/point';
import { Drag } from '../lib/drag';
import './affineview.less';

export const MAX_ZOOM = 2;
export const MIN_ZOOM = 0.2;
export const DEFAULT_ZOOM = 1;

export interface AffineViewProps {
   children: React.ReactNode | React.ReactNode[];
   zoom?: number;
   pan?: Point;
   width: number;
   height: number;
   onPan?: (panX: number, panY: number) => void;
   onZoom?: (zoom: number) => void;
}

export function AffineView(props: AffineViewProps) {
   const transformedDiv: React.Ref<HTMLDivElement> = useRef(null);
   const { zoom: defaultZoom = DEFAULT_ZOOM, pan: defaultPan = { x: 0, y: 0 }, width, height, children, onPan, onZoom } = props;
   const [ zoom, setZoom ] = useState(defaultZoom);
   const [ panX, setPanX ] = useState(defaultPan.x);
   const [ panY, setPanY ] = useState(defaultPan.y);
   const [ isMouseDown, setIsMouseDown ] = useState(false);
   const [ isPanHover, setIsPanHover ] = useState(false);
   const [ info, setInfo ] = useState({zoom, panX, panY});
   const [ drag ] = useState(new Drag());

   const transformedBounds = () => transformedDiv.current!.getBoundingClientRect();

   const mouseToLocalPoint = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const rect = transformedBounds();
      const localX = clientX - rect.left;
      const localY = clientY - rect.top;
      const x = localX / zoom;
      const y = localY / zoom;
      return { x, y } as Point;
   };

   const localToGlobal = (localX: number, localY: number) => {
      const rect = transformedBounds();
      const globalX = (localX * zoom) + rect.left;
      const globalY = (localY * zoom) + rect. top;
      return { x: globalX, y: globalY } as Point;
   };

   const onMouseDown = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      setIsMouseDown(true);
      const p = mouseToLocalPoint(e);
      drag.start(p, { x: panX, y: panY });
      const gp = localToGlobal(p.x, p.y);

      writeInfo({
         localX: num(p.x), 
         localY: num(p.y), 
         globalX: num(gp.x), 
         globalY: num(gp.y),
         transformedX: clientX === gp.x,
         transformedY: clientY === gp.y,
      })
   }

   const onMouseMove = (e: MouseEvent) => {
      if (isMouseDown && isPanHover) {
         const point = mouseToLocalPoint(e);
         const { x: newPanX, y: newPanY } = drag.value(point);
         setPanX(newPanX);
         setPanY(newPanY);
         onPan && onPan(newPanX, newPanY);

         writeInfo({panX: num(newPanX), panY: num(newPanY) });
      }
   };

   const onMouseUp = () => setIsMouseDown(false);

   const onKeyDown = (e: KeyboardEvent) => {
      if (e.keyCode === 32) {
         setIsPanHover(true);
         e.preventDefault();
      }
   };

   const onKeyUp = (e: KeyboardEvent) => {
      if (e.keyCode === 32) {
         setIsPanHover(false);
      }
   };

   const onWheel = (e: WheelEvent<HTMLDivElement>) => {
      const { deltaY } = e;
      zoomBy(deltaY > 0 ? 0.1 : -0.1);
   };

   const zoomBy = (delta: number) => {
      const newZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, zoom - delta));
      setZoom(newZoom);
      onZoom && onZoom(newZoom);

      writeInfo({zoom: num(newZoom)});
   };

   const num = (v: number) => parseFloat(`${v}`).toFixed(2);

   const writeInfo = (obj: any) => {
      setInfo({
         ...info,
         ...obj,
      });
   }

   const transformedStyle = {
      transform: `translate(${panX}px, ${panY}px) scale(${zoom}, ${zoom})`,
      width,
      height,
   };

   const infoStr = JSON.stringify(info, null, 4);

   return (
      <div
         tabIndex={0}
         className={`affineTransform ${isPanHover ? isMouseDown ? 'panDrag' : 'panHover' : ''}`}
         onMouseDown={onMouseDown}
         onMouseMove={onMouseMove}
         onMouseUp={onMouseUp}
         onKeyDown={onKeyDown}
         onKeyUp={onKeyUp}
         onWheel={onWheel}
      >
         <div ref={transformedDiv} className='transformed' style={transformedStyle}>
            {children}
         </div>
      <pre className="info">{infoStr}</pre>
      </div>
   );
}