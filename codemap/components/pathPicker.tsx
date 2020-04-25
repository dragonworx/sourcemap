import {
   React,
   useState,
   makeStyles,
} from '~lib';
import Link from '@material-ui/core/Link';
import { Prompt } from '~components';
import { Tooltip } from '@material-ui/core';

export interface PathPickerProps {
   label: string;
   path?: string;
   tooltip?: string;
   onChanged: (value: string) => void;
};

const useStyles = makeStyles((theme) => ({
   root: {
      // display: 'flex',
      // height: theme.spacing(6),
   },
   label: {
      color: 'rgba(255, 255, 255, 0.7)',
      fontSize: 'smaller',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      '& > *': {
         marginLeft: 5,
      }
   },
   link: {
      textOverflow: 'ellipsis',
      width: '100%',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      textAlign: 'left',
   },
}));

export function PathPicker(props: PathPickerProps) {
   const classes = useStyles();
   const [ isPathPromptOpen, setIsPathPromptOpen ] = useState(false);
   const { label, path, onChanged, tooltip } = props;

   const onRootPathClick = () => setIsPathPromptOpen(true);
   const onPathPromptClose = () => setIsPathPromptOpen(false);

   return (
      <div className={classes.root}>
         <label className={classes.label}>
            {label}
            {
               tooltip
               ? <Tooltip title={tooltip} placement="right"><Link className={classes.link} component="button" variant="body2" color="textPrimary" underline="always" onClick={onRootPathClick}>{path ? path : '<unset>'}</Link></Tooltip>
               : <Link className={classes.link} component="button" variant="body2" color="textPrimary" underline="always" onClick={onRootPathClick}>{path ? path : '<unset>'}</Link>
            }
         </label>
         <Prompt
            open={isPathPromptOpen}
            title="Enter Project Path Root"
            description="Select the location of the project path root. This will make source files path relative to this path."
            label="Project Path Root"
            defaultValue={path || ''}
            onClose={onPathPromptClose}
            onSave={onChanged}
         ></Prompt>
      </div>
   )
}