import {
   React,
   ReactElement,
} from '~lib';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';
import VerticalAlignTop from '@material-ui/icons/VerticalAlignTop';
import VerticalAlignCenter from '@material-ui/icons/VerticalAlignCenter';
import VerticalAlignBottom from '@material-ui/icons/VerticalAlignBottom';
import FormatAlignCenterIcon from '@material-ui/icons/FormatAlignCenter';
import OpenWithIcon from '@material-ui/icons/OpenWith';
import TimelineIcon from '@material-ui/icons/Timeline';
import CreateIcon from '@material-ui/icons/Create';
import UndoIcon from '@material-ui/icons/Undo';
import RedoIcon from '@material-ui/icons/Redo';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import AddCommentIcon from '@material-ui/icons/AddComment';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import SaveIcon from '@material-ui/icons/Save';
import Grid from '@material-ui/core/Grid';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import { makeStyles } from '@material-ui/core/styles';
import useStore from '~store';
import {
   useCommands,
   AlignLeftCommand,
   AlignHCenterCommand,
   AlignRightCommand,
   AlignTopCommand,
   AlignVCenterCommand,
   AlignBottomCommand,
   DistributeHorizontallyCommand,
   DistributeVerticallyCommand,
   CreateNodeCommand,
   DeleteNodesCommand,
   SaveCommand,
} from '~commands';
import { InteractionMode } from '~components/canvas';

const useStyles = makeStyles(theme => ({
   appBar: {
      backgroundColor: '#2d2d2d',
      whiteSpace: 'nowrap',
   },
   menuButton: {
      marginRight: theme.spacing(2),
   },
   title: {
      flexGrow: 1,
   },
   rotate90deg: {
      transform: 'rotateZ(90deg)',
   },
   toolbar: {
      padding: theme.spacing(1)
   }
}));

function buttonGroup(buttons: ReactElement[], value?: any) {
   return (
      <Grid item>
         <ToggleButtonGroup size="small" exclusive value={value}>
            {buttons}
         </ToggleButtonGroup>
      </Grid>
   );
}

export function ApplicationBar() {
   const classes = useStyles();
   const { appBar, rotate90deg } = classes;
   const { execute, undo, redo } = useCommands();
   const [{ undoStack, redoStack, nodes, selectedNodes, mode, cursor }, setStore] = useStore();
   const hasSelection = selectedNodes.length > 0;
   const hasMultiSelection = selectedNodes.length > 1;
   const hasThreeOrMoreSelection = selectedNodes.length >= 3;

   const setMode = (mode: InteractionMode) => {
      setStore({ mode, selectedNodes: [] });
   };

   const onSetModeSelection = () => setMode('select' );
   const onSetModeConnector = () => setMode('connect');
   const onSetModeHighlight = () => setMode('highlight');
   const onUndo = () => undo();
   const onRedo = () => redo();
   const onAlignLeft = () => execute(new AlignLeftCommand(selectedNodes));
   const onAlignHCenter = () => execute(new AlignHCenterCommand(selectedNodes));
   const onAlignRight = () => execute(new AlignRightCommand(selectedNodes));
   const onAlignTop = () => execute(new AlignTopCommand(selectedNodes));
   const onAlignVCenter = () => execute(new AlignVCenterCommand(selectedNodes));
   const onAlignBottom = () => execute(new AlignBottomCommand(selectedNodes));
   const onDistributeHorizontally = () => execute(new DistributeHorizontallyCommand(selectedNodes));
   const onDistributeVertically = () => execute(new DistributeVerticallyCommand(selectedNodes));
   const onCreateNode = () => execute(new CreateNodeCommand(nodes, selectedNodes, cursor));
   const onCreateComment = () => {/* TODO */ };
   const onDelete = () => execute(new DeleteNodesCommand(nodes, selectedNodes));
   const onSave = () => execute(new SaveCommand(nodes));

   return (
      <AppBar position="static" className={appBar}>
         <Toolbar className={classes.toolbar}>
            <Grid container spacing={1} direction="column" alignItems="center">
               <Grid item xs={12}>
                  <Grid container spacing={1} direction="row" justify="center">
                     {
                        buttonGroup([
                           <ToggleButton key={1} value="save" onClick={onSave} disabled={nodes.length === 0}><Tooltip title="Save"><SaveIcon /></Tooltip></ToggleButton>,
                        ])
                     }
                     {
                        buttonGroup([
                           <ToggleButton key={1} value="select" onClick={onSetModeSelection}><Tooltip title="Selection mode"><OpenWithIcon /></Tooltip></ToggleButton>,
                           <ToggleButton key={2} value="connect" onClick={onSetModeConnector}><Tooltip title="Connection mode"><TimelineIcon /></Tooltip></ToggleButton>,
                           <ToggleButton key={3} value="highlight" onClick={onSetModeHighlight}><Tooltip title="Highlight mode"><CreateIcon /></Tooltip></ToggleButton>,
                        ], mode)
                     }
                     {
                        buttonGroup([
                           <ToggleButton key={1} value="undo" onClick={onUndo} disabled={undoStack.length === 0}><Tooltip title="Undo"><UndoIcon /></Tooltip></ToggleButton>,
                           <ToggleButton key={2} value="redo" onClick={onRedo} disabled={redoStack.length === 0}><Tooltip title="Redo"><RedoIcon /></Tooltip></ToggleButton>,
                        ])
                     }
                     {
                        buttonGroup([
                           <ToggleButton key={1} value="createNode" onClick={onCreateNode}><Tooltip title="Create Node"><AddCircleIcon /></Tooltip></ToggleButton>,
                           <ToggleButton key={2} value="createComment" onClick={onCreateComment}><Tooltip title="Create Comment"><AddCommentIcon /></Tooltip></ToggleButton>,
                           <ToggleButton key={3} value="delete" onClick={onDelete} disabled={!hasSelection}><Tooltip title="Delete"><DeleteForeverIcon /></Tooltip></ToggleButton>,
                        ])
                     }
                     {
                        buttonGroup([
                           <ToggleButton key={1} value="left" onClick={onAlignLeft} disabled={!hasMultiSelection} className={rotate90deg}><Tooltip title="Align Left"><VerticalAlignBottom /></Tooltip></ToggleButton>,
                           <ToggleButton key={2} value="center" onClick={onAlignHCenter} disabled={!hasMultiSelection} className={rotate90deg}><Tooltip title="Align H Center"><VerticalAlignCenter /></Tooltip></ToggleButton>,
                           <ToggleButton key={3} value="right" onClick={onAlignRight} disabled={!hasMultiSelection} className={rotate90deg}><Tooltip title="Align Right"><VerticalAlignTop /></Tooltip></ToggleButton>,
                        ])
                     }
                     {
                        buttonGroup([
                           <ToggleButton key={1} value="top" onClick={onAlignTop} disabled={!hasMultiSelection}><Tooltip title="Align Top"><VerticalAlignTop /></Tooltip></ToggleButton>,
                           <ToggleButton key={2} value="center" onClick={onAlignVCenter} disabled={!hasMultiSelection}><Tooltip title="Align V Center"><VerticalAlignCenter /></Tooltip></ToggleButton>,
                           <ToggleButton key={3} value="bottom" onClick={onAlignBottom} disabled={!hasMultiSelection}><Tooltip title="Align Bottom"><VerticalAlignBottom /></Tooltip></ToggleButton>,
                        ])
                     }
                     {
                        buttonGroup([
                           <ToggleButton key={1} value="top" onClick={onDistributeHorizontally} disabled={!hasThreeOrMoreSelection}><Tooltip title="Distribute Horizontally"><FormatAlignCenterIcon className={rotate90deg} /></Tooltip></ToggleButton>,
                           <ToggleButton key={2} value="center" onClick={onDistributeVertically} disabled={!hasThreeOrMoreSelection}><Tooltip title="Distribute Vertically"><FormatAlignCenterIcon /></Tooltip></ToggleButton>,
                        ])
                     }
                  </Grid>
               </Grid>
            </Grid>
         </Toolbar>
      </AppBar>
   );
};
