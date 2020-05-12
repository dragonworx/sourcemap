import {
   React,
   useState,
   useEffect,
   useRef,
   WheelEvent,
   DragEvent,
} from '~lib';
import AddIcon from '@material-ui/icons/Add';
import useStore from '~store';
import {
   NodeView,
} from '~components';
import {
   Node,
   Point,
   Rect,
   angle,
} from '~core';
import {
   useCommands,
   MoveNodeCommand,
   CreateNodeCommand,
   DeleteNodesCommand,
   LoadCommand,
} from '~commands';
import {
   findLast,
   replaceArray,
   readFile,
} from '~util';
import {
   useKeyDownEvent,
   Keys,
} from '~hooks';
import '~less/canvas.less';

let preSelectedNodes: Node[] = [];
let dragSelectedNodes: Node[] = [];

export enum CanvasMode {
   Select,
   Pan,
   Zoom
};

export type InteractionMode = 'select' | 'connect' | 'highlight';

export function Canvas() {
   const [ { nodes, selectedNodes, view, cursor, background, mode }, setStore ] = useStore();
   const divElement: React.Ref<HTMLDivElement> = useRef(null);
   const { execute } = useCommands();

   // state
   const [ isMouseDown, setIsMouseDown ] = useState(false);
   const [ isCanvasDrag, setIsCanvasDrag ] = useState(false);
   const [ isDragOver, setIsDragOver ] = useState(false);
   const [ dragStart, setDragStart ] = useState({x: 0, y: 0});
   const [ dragEnd, setDragEnd ] = useState({x: 0, y: 0});
   const [ mouseMode, setMouseMode ] = useState(CanvasMode.Select);
   
   // calculated values
   const isCanvasDragging = isMouseDown && isCanvasDrag;
   const isNodeDragging = isMouseDown && !isCanvasDrag;
   const isPanning = isMouseDown && mouseMode === CanvasMode.Pan;
   const canvasRect = () => divElement.current!.getBoundingClientRect();
   const toLocalCoord = (clientX: number, clientY: number) => {
      const rect = canvasRect();
      const x = (clientX - rect.left);
      const y = (clientY - rect.top);
      return { x, y } as Point;
   };
   const dragLeft = () => Math.max(0, Math.min(dragStart.x, dragEnd.x));
   const dragTop = () => Math.max(0, Math.min(dragStart.y, dragEnd.y));
   const dragWidth = () => Math.min(canvasRect().width, Math.abs(dragEnd.x - dragStart.x));
   const dragHeight = () => Math.min(canvasRect().height, Math.abs(dragEnd.y - dragStart.y));
   const dragRect = () => new Rect(dragLeft(), dragTop(), dragWidth(), dragHeight());
   const startDrag = (point: Point, isCanvasDragging: boolean) => {
      setDragStart(point);
      setDragEnd(point);
      setIsCanvasDrag(isCanvasDragging);
   };

   // handlers
   const onMouseDown = (e: React.MouseEvent) => {
      if (mode !== 'select') {
         return;
      }

      const { target, currentTarget, clientX, clientY } = e;
      const point = toLocalCoord(clientX, clientY);

      setIsMouseDown(true);

      if (e.metaKey && e.altKey) {
         view.startPan();
         setMouseMode(CanvasMode.Pan);
         startDrag(point, false);
      } else if (target === currentTarget) {
         // canvas drag
         dragSelectedNodes = [];
         if (e.shiftKey) {
            preSelectedNodes = [...selectedNodes];
         } else {
            selectedNodes.length = 0
            preSelectedNodes.length = 0;
            setStore({ selectedNodes });
         }
         startDrag(point, true);
      } else if ((target instanceof HTMLElement) && target.getAttribute('data-node')) {
         // node(s) drag
         const selectedNode = findLast(nodes, node => node.rect.containsPoint(point, view));
         if (selectedNode) {
            const index = selectedNodes.indexOf(selectedNode);
            if (e.shiftKey) {
               if (index === -1) {
                  // add to selections
                  selectedNodes.push(selectedNode);
               } else {
                  // substract from collections
                  selectedNodes.splice(index, 1);
               }
               setStore({ selectedNodes });
            } else {
               if (index === -1) {
                  // unselect others for single click on new node
                  replaceArray(selectedNodes, [selectedNode]);
                  setStore({ selectedNodes });
               }
            }
            selectedNode.startDrag();
         }
         selectedNodes.forEach(node => node.startDrag());
         startDrag(point, false);
      }
   };

   const onMouseMove = (e: React.MouseEvent) => {
      if (mode !== 'select') {
         return;
      }

      const { clientX, clientY, shiftKey } = e;
      const point = toLocalCoord(clientX, clientY);
      const deg = angle(dragStart.x, dragStart.y, point.x, point.y);
      const rawDeltaX = point.x - dragStart.x;
      const rawDeltaY = point.y - dragStart.y;
      const isVerticalDrag = (deg >= 45 && deg <= 135) || (deg >= 225 && deg <= 315);
      const isHorizontalDrag = !isVerticalDrag;
      const deltaX = (shiftKey && isVerticalDrag) ? 0 : rawDeltaX;
      const deltaY = (shiftKey && isHorizontalDrag) ? 0 : rawDeltaY;

      if (e.metaKey && e.altKey) {
         setMouseMode(CanvasMode.Pan);
      } else {
         setMouseMode(CanvasMode.Select);
      }

      if (mouseMode === CanvasMode.Pan) {
         if (isPanning) {
            view.panBy(deltaX, deltaY);
            setStore();
         }
      } else if (mouseMode === CanvasMode.Select) {
         if (isCanvasDragging) {
            // drag selection rect over nodes
            setDragEnd(point);
            const rect = dragRect();
            nodes.forEach(node => {
               const preSelectedIndex = preSelectedNodes.indexOf(node);
               const dragSelectedIndex = dragSelectedNodes.indexOf(node);
               if (node.rect.containsRect(rect, view)) {
                  // add to selection
                  if (e.shiftKey && e.altKey) {
                     if (preSelectedIndex > -1) {
                        preSelectedNodes.splice(preSelectedIndex, 1);
                     }
                  } else {
                     dragSelectedIndex === -1 && dragSelectedNodes.push(node);
                  }
               } else {
                  // subtract from selection
                  if (dragSelectedIndex > -1) {
                     dragSelectedNodes.splice(dragSelectedIndex, 1);
                  }
               }
            });
            const dragNodes = [...preSelectedNodes, ...dragSelectedNodes];
            replaceArray(selectedNodes, dragNodes);
            setStore({ selectedNodes });
         } else if (isNodeDragging) {
            // drag nodes
            selectedNodes.forEach(node => {
               node.dragBy(view.inverseZoom(deltaX), view.inverseZoom(deltaY));
            });
            setStore();
         }
      }
   };

   const onMouseUp = (e: React.MouseEvent) => {
      if (mode !== 'select') {
         return;
      }

      const { clientX, clientY, metaKey, altKey } = e;
      const dragAmount = dragWidth() + dragHeight();
      if (dragAmount === 0 && !selectedNodes.length && !(metaKey && altKey)) {
         const point = toLocalCoord(clientX, clientY);
         cursor.x = point.x;
         cursor.y = point.y;
      }
      setIsMouseDown(false);
      setMouseMode(CanvasMode.Select);
      selectedNodes.forEach(node => node.endDrag());
      execute(new MoveNodeCommand(selectedNodes));
   };

   const onWheel = (e: WheelEvent<HTMLDivElement>) => {
      const { deltaY } = e;
      const rect = canvasRect();
      view.zoomBy(deltaY > 0 ? 0.1 : -0.1/*, rect.width, rect.height*/);
      setStore();
   };

   const onDragEnter = (e: DragEvent) => {
      setIsDragOver(true);
   };

   const onDragLeave = (e: DragEvent) => {
      setIsDragOver(false);
   };

   const onDragOver = (e: DragEvent) => {
      const { clientX, clientY } = e;
      const point = toLocalCoord(clientX, clientY);
      cursor.init(point.x, point.y);
      e.stopPropagation();
      e.preventDefault();
      setStore();
   };

   const onDrop = (e: DragEvent) => {
      const { dataTransfer: { items, files } } = e;
      e.preventDefault();
      let file: File | null = null;
      if (items) {
         for (let i = 0; i < items.length; i++) {
           if (items[i].kind === 'file') {
             file = items[i].getAsFile();
             break;
           }
         }
       } else {
         for (let i = 0; i < files.length; i++) {
           file = files[i];
           break;
         }
       }
       if (file) {
          readFile(file)
            .then((src: string) => {
               execute(new CreateNodeCommand(nodes, selectedNodes, cursor, src, file!.name));
            }, () => {
               throw new Error('Could not open file');
            })
       }
   };

   useKeyDownEvent((e: KeyboardEvent) => {
      const { keyCode, metaKey } = e;
      if (keyCode === Keys.ENTER) {
         execute(new CreateNodeCommand(nodes, selectedNodes, cursor));
         e.preventDefault();
      } else if (keyCode === Keys.V && metaKey) {
         execute(new CreateNodeCommand(nodes, selectedNodes, cursor));
      } else if ((keyCode === Keys.BACKSPACE || keyCode == Keys.DELETE) && selectedNodes.length) {
         execute(new DeleteNodesCommand(nodes, selectedNodes));
      }
   }, divElement);

   useEffect(() => {
      execute(new LoadCommand(nodes));
      setStore({ nodes });
   }, []);

   // render
   return (
      <div
         id="canvas"
         tabIndex={0}
         ref={divElement}
         className={`mode_${mouseMode}${isDragOver ? ' drag': ''}`}
         style={{ backgroundColor: background }}
         onMouseDown={onMouseDown}
         onMouseUp={onMouseUp}
         onMouseMove={onMouseMove}
         onDragEnter={onDragEnter}
         onDragLeave={onDragLeave}
         onDragOver={onDragOver}
         onDrop={onDrop}
         onWheel={onWheel}
      >
         {nodes.map(node => <NodeView key={`node${node.id}`} node={node} />)}
         {mode === 'select' ? <AddIcon id="cursor" style={{ left: cursor.x, top: cursor.y }} /> : null}
         {isCanvasDragging ? 
            <div 
               className="dragBounds" 
               style={{
                  left: dragLeft(),
                  top: dragTop(),
                  width: dragWidth(),
                  height: dragHeight(),
               }}
            >
            </div> : null}
      </div>
   );
}