import {
   React,
   useState,
   useRef,
   MouseEvent,
   makeStyles,
} from '~lib';
import AddCirlce from '@material-ui/icons/AddCircle';
import useStore from '~store';
import {
   NodeEditor,
   NodeEditSubmission,
   renderSource,
} from '~components';
import { Node, NodeState } from '~core';
import { removeArrayItem } from '~util';
import '~less/nodeView.less';

export interface NodeViewProps {
   node: Node;
}

const useStyles = makeStyles((theme) => ({
   title: {
      color: 'white',
      position: 'absolute',
      fontSize: 20,
      top: -29,
      left: 0,
      textShadow: '1px 1px 3px black',
   },
   filePath: {
      color: 'white',
      position: 'absolute',
      fontSize: 12,
      left: 0,
      textShadow: '1px 1px 3px black',
      width: '100%',
      // overflowWrap: 'break-word',
      marginTop: 5,
   }
}));

export function NodeView(props: NodeViewProps) {
   const divElement: React.Ref<HTMLDivElement> = useRef(null);
   const { node } = props;
   const classes = useStyles();
   const [ { nodes, selectedNodes, view, undoStack, cursor, mode }, setStore ] = useStore();
   const [ isEdit, setIsEdit ] = useState(node.state === NodeState.Creating);
   const [ preview, setPreview ] = useState(node.preview);
   const [ lineOver, setLineOver ] = useState(-1);

   const divRect = () => divElement.current!.getBoundingClientRect();

   const toLocalCoord = (clientX: number, clientY: number) => {
      const rect = divRect();
      const x = (clientX - rect.left);
      const y = (clientY - rect.top);
      return { x, y };
   };

   const getLineOver = (e: MouseEvent) => {
      const point = toLocalCoord(e.clientX, e.clientY);
      const { lineInfo } = node;
      const { tops, height } = lineInfo;
      const l = tops.length;
      const y = point.y;
      const scale = view.zoom;
      for (let i = 0; i < l; i++) {
         const lineY = tops[i];
         if (y >= lineY * scale && y <= (lineY + height) * scale) {
            return i;
         }
      }
      return -1;
   };

   const onMouseDown = () => {
      console.log("!down")
   };

   const onMouseOver = () => setLineOver(-1);

   const onMouseMove = (e: MouseEvent) => {
      if (!preview || mode !== 'highlight') {
         return;
      }
      setLineOver(getLineOver(e));
   };

   const onMouseOut = () => setLineOver(-1);

   const onDoubleClick = () => {
      setStore({ selectedNodes: [node]})
      setIsEdit(true);
   };

   const onMouseUp = () => {
      console.log("up!")
   };

   const onClose = (submission?: NodeEditSubmission) => {
      if (submission) {
         // update node
         node.title = submission.title;
         node.src = submission.src;
         node.filePath = submission.filePath;
      } else if (node.state === NodeState.Creating) {
         // create node canceled, cleanup
         removeArrayItem(nodes, node);
         removeArrayItem(selectedNodes, node);
         undoStack.pop();
         setStore();
      }
      setIsEdit(false);
   };

   const onUpdate = () => {
      renderSource(node.src).then(({ canvas, width, height, lineInfo }) => {
         node.lineInfo = lineInfo;
         node.rect.width = width / devicePixelRatio;
         node.rect.height = height / devicePixelRatio;
         node.preview = canvas.toDataURL();
         node.state = NodeState.Idle;
         setPreview(node.preview);
      });
   };

   const { left, top, width, height } = view.transformRect(node.rect);
   const scale = view.zoom;
   const isSelected = preview && selectedNodes.indexOf(node) > -1;

   if (node.state === NodeState.Creating) {
      const style = {
         left,
         top,
      };

      return (
         <div className="node" style={style}>
            <AddCirlce id="cursor" />
            <NodeEditor open={isEdit} node={node} onUpdate={onUpdate} onClose={onClose} />
         </div>
      );
   }

   const style = {
      left,
      top,
      width,
      height,
      borderColor: isSelected ? 'yellow' : undefined,
   };

   const highlightStyle = {
      top: node.lineInfo.tops[lineOver] * scale,
      height: node.lineInfo.height * scale
   };

   return (
      <div 
         ref={divElement}
         className={`node ${node.isDragging ? ' drag' : ''}`} 
         style={style} 
         data-node
         onMouseDown={onMouseDown} 
         onMouseOver={onMouseOver} 
         onMouseMove={onMouseMove}
         onMouseOut={onMouseOut}
         onMouseUp={onMouseUp}
         onDoubleClick={onDoubleClick}
      >
         {
            preview
               ? <img className="preview" src={preview} />
               : null
         }
         {
            mode === 'highlight' && preview && (lineOver !== -1)
               ? <div className="line-over" style={highlightStyle}></div>
               : null
         }
         {
            node.title
               ? <div className={classes.title}>{node.title}</div>
               : null
         }
         {
            node.filePath
               ? <div className={classes.filePath}>{node.filePath}</div>
               : null
         }
         <NodeEditor open={isEdit} node={node} onUpdate={onUpdate} onClose={onClose} />
      </div>
   );
}