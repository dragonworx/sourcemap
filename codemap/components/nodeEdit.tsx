import {
   React,
   useState,
   makeStyles,
   ChangeEvent,
   MouseEvent,
} from '~lib';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import BackupIcon from '@material-ui/icons/Backup';
import Grid from '@material-ui/core/Grid';
import {
   Editor,
   PathPicker,
} from '~components';
import { Node } from '~core';
import { readFile } from '~util';

export interface NodeEditProps { 
   open: boolean;
   onClose: (submission?: NodeEditSubmission) => void;
   onUpdate: () => void;
   node: Node;
}

export interface NodeEditSubmission {
   src: string;
   filePath: string;
   title: string;
}

const useStyles = makeStyles((theme) => ({
   title: {
     width: '100%',
   },
   content: {
      overflow: 'hidden'
   },
   footer: {
      position: 'relative',
      height: theme.spacing(8),
   },
   actions: {
      position: 'absolute',
      top: 0,
      left: theme.spacing(3),
      width: `calc(100% - ${theme.spacing(5)}px)`,
      '& input': {
         display: 'none',
      }
   },
   spacer: {
      flexGrow: 2,
   },
   path: {
      width: '100%',
      marginTop: theme.spacing(2),
   }
 }));

export function NodeEditor(props: NodeEditProps) {
   const { node, onClose, onUpdate } = props;
   const [ src, setSrc ] = useState(node.src);
   const [ filePath, setFilePath ] = useState(node.filePath);
   const [ title, setTitle ] = useState(node.title);
   const [ editor, setEditor ] = useState();
   const classes = useStyles();

   const onEditorDidMount = (editor: any) => {
      setEditor(editor);
      editor.setValue(src);
      editor.focus();
   };

   const onChange = (value: string) => {
      setSrc(value);
   };

   const onCancel = () => {
      onClose();
   };

   const onSave = () => {
      onClose({
         title,
         src,
         filePath,
      });
      onUpdate();
   };

   const onTitleChange = (event: ChangeEvent) => {
      setTitle((event.target as HTMLInputElement).value);
   };

   const onMouseHandler = (e: MouseEvent) => e.stopPropagation();

   const onFileChange = (event: ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;

      if (files && files.length) {
         const file = files[0];
         readFile(file)
            .then((src: string) => {
               setSrc(src);
               setFilePath(file.name);
               (editor as any).setValue(src);
            }, () => {
               throw new Error('Could not read file');
            });
      }
   };

   const onFilePathChanged = (value: string) => {
      setFilePath(value);
   };

   return (
      <Dialog
         open={props.open}
         onClose={onCancel}
         aria-labelledby="node-title"
         fullWidth={true}
         maxWidth="md"
         onMouseDown={onMouseHandler}
         onMouseUp={onMouseHandler}
         onMouseMove={onMouseHandler}
      >
         <DialogTitle>
            <TextField id="node-title" className={classes.title} label="Title" defaultValue={title} onChange={onTitleChange} />
         </DialogTitle>
         <DialogContent className={classes.content}>
            <Editor onEditorDidMount={onEditorDidMount} onChange={onChange} onAccept={onSave} />
            <div className={classes.path}>
               <PathPicker label="File Path" path={filePath} onChanged={onFilePathChanged} tooltip="Set the filepath of the source" />
            </div>
         </DialogContent>
         <DialogActions className={classes.footer}>
            <Grid className={classes.actions} container spacing={1} direction="row" alignItems="center">
               <Grid item>
                  <input accept="*" id="upload-file" type="file" onChange={onFileChange} />
                  <label htmlFor="upload-file">
                     <IconButton color="default" aria-label="upload file" component="span">
                        <Tooltip title="Upload source file"><BackupIcon /></Tooltip>
                     </IconButton>
                  </label>
               </Grid>
               <Grid item className={classes.spacer}></Grid>
               <Grid item>
                  <Button onClick={onCancel} variant="contained" color="default">
                     Cancel
                  </Button>
               </Grid>
               <Grid item>
                  <Button onClick={onSave} variant="contained" color="primary" disabled={src.length === 0}>
                     Save
                  </Button>
               </Grid>
            </Grid>
         </DialogActions>
      </Dialog>
   );
}
