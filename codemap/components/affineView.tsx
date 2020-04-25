import {
   React,
   useState,
   useRef,
   makeStyles,
   MouseEvent,
   KeyboardEvent,
   WheelEvent,
} from '~lib';
import {
   Keys,
   useCurrentWindow,
} from '~hooks';
import { Tuple } from '~core/geom';
import { Drag } from '~core/drag';
import { useEffect } from 'react';

export const MAX_ZOOM = 200;
export const MIN_ZOOM = 20;
export const DEFAULT_ZOOM = 100;

export interface AffineViewProps {
   children: React.ReactNode | React.ReactNode[];
   zoom?: number;
   pan?: Tuple;
   rotation?: number;
   width: number;
   height: number;
   onPan?: (panX: number, panY: number) => void;
   onZoom?: (zoom: number) => void;
}

const useStyles = (panX: number, panY: number, zoom: number, rotation: number, width: number, height: number) => {
   const scale = zoom / 100;
   return makeStyles(theme => ({
      affineTransform: {
         // position: 'absolute',
         // top: 0,
         // left: 0,
         width,
         height,
         // outline: 'none',
         overflow: 'hidden',
         userSelect: 'none',
         display: 'flex',
         alignItems: 'center',
      },
      transformed: {
         border: '1px solid red',
         // position: 'absolute',
         // left: '-50%',
         // top: '-50%',
         flexGrow: 1,
         flexWrap: "nowrap",
         width,
         height,
         backgroundColor: 'rgba(0,0,0,0.3)',
         transform: `translate(${panX}px, ${panY}px) rotateZ(${rotation}deg) scale(${scale}, ${scale})`,
         // transformOrigin: 'left top',
      },
      debug: {
         position: 'absolute',
         top: 0,
         right: 5,
         fontSize: 'smaller',
         transform: 'none!important'
      },
      panHover: {
         cursor: 'grab',
      },
      panDrag: {
         cursor: 'grabbing',
      },
   }));
};

export function AffineView(props: AffineViewProps) {
   const divElement: React.Ref<HTMLDivElement> = useRef(null);
   const { zoom: defaultZoom = DEFAULT_ZOOM, pan: defaultPan = { x: 0, y: 0 }, rotation: defaultRotation = 0, width = 500, height = 500, children, onPan, onZoom } = props;
   const [ zoom, setZoom ] = useState(defaultZoom);
   const [ panX, setPanX ] = useState(defaultPan.x);
   const [ panY, setPanY ] = useState(defaultPan.y);
   const [ rotation, setRotation ] = useState(defaultRotation);
   const [ isMouseDown, setIsMouseDown ] = useState(false);
   const [ isPanHover, setIsPanHover ] = useState(false);
   const [ drag ] = useState(new Drag());
   const classes = useStyles(panX, panY, zoom, rotation, width, height)();

   const divRect = () => divElement.current!.getBoundingClientRect();

   const mouseToLocalPoint = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const rect = divRect();
      const x = (clientX - rect.left);
      const y = (clientY - rect.top);
      return { x, y } as Tuple;
   };

   const onMouseDown = (e: MouseEvent) => {
      setIsMouseDown(true);
      const point = mouseToLocalPoint(e); 

      const transformMatrix = new DOMMatrix();
      const scale = zoom / 100;
      transformMatrix.translateSelf(panX, panY);
      transformMatrix.rotateSelf(0, 0, rotation);
      transformMatrix.scaleSelf(scale, scale);
      transformMatrix.invertSelf();
      const tmp = transformMatrix.multiply((new DOMMatrix).translate(point.x, point.y, 0)); 
      const transformedPoint = { x: tmp.m41, y: tmp.m42 };
      console.clear();
      console.log({x: point.x, y: point.y});
      console.log({tx: transformedPoint.x, ty: transformedPoint.y});

      drag.start(point, { x: panX, y: panY });
   }

   const onMouseMove = (e: MouseEvent) => {
      if (isMouseDown && isPanHover) {
         const point = mouseToLocalPoint(e);
         const { x: newPanX, y: newPanY } = drag.value(point);
         setPanX(newPanX);
         setPanY(newPanY);
         onPan && onPan(newPanX, newPanY);
      }
   };

   const onMouseUp = () => setIsMouseDown(false);

   const onKeyDown = (e: KeyboardEvent) => {
      if (e.keyCode === Keys.SPACE) {
         setIsPanHover(true);
      }
   };

   const onKeyUp = (e: KeyboardEvent) => {
      if (e.keyCode === Keys.SPACE) {
         setIsPanHover(false);
      }
   };

   const onWheel = (e: WheelEvent<HTMLDivElement>) => {
      const { deltaY, altKey } = e;
      const delta = deltaY > 0 ? 10 : -10;
      if (altKey) {
         const newRotation = rotation + delta;
         setRotation(newRotation); 
      } else {
         const newZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, zoom - delta));
         setZoom(newZoom);
         onZoom && onZoom(newZoom);
      }
   };

   return (
      <div
         ref={divElement}
         tabIndex={0}
         className={`${classes.affineTransform} ${isPanHover ? isMouseDown ? classes.panDrag : classes.panHover : ''}`}
         onMouseDown={onMouseDown}
         onMouseMove={onMouseMove}
         onMouseUp={onMouseUp}
         onKeyDown={onKeyDown}
         onKeyUp={onKeyUp}
         onWheel={onWheel}
      >
         <div className={classes.transformed}>
            {children}
         </div>
         <div className={classes.debug}>zoom: {zoom} pan: {panX}, {panY}</div>
      </div>
   );
}