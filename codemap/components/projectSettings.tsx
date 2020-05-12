import {
   React,
   makeStyles,
   ChangeEvent,
} from '~lib';
import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { ZoomControl, PathPicker } from '~components';
import useStore from '~store';

const useStyles = makeStyles((theme) => ({
   root: {
      '& > *': {
         margin: theme.spacing(1),
         width: '25ch',
      },
   },
   label: {
      color: 'rgba(255, 255, 255, 0.7)',
      fontSize: 'smaller',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      '& > input': {
         marginLeft: 5,
         top: 26,
         position: 'absolute',
      }
   },
   formControl: {
      minWidth: 120,
   },
   bgColor: {
      height: 54,
      position: 'relative',
   }
}));

interface SelectItem {
   text: string;
   value: string;
}

export function ProjectSettings() {
   const classes = useStyles();
   const [ state, setState ] = useStore();
   const { rootPath, syntax, theme, background } = state;
   const onRootPathChanged = (value: string) => {
      state.rootPath = value;
      setState();
   };

   const select = (id: string, label: string, items: SelectItem[], defaultValue: string, onChange: (value: string) => void) => {
      const onSelectChange = (e: ChangeEvent<any>) => {
         const value = (e.target as HTMLSelectElement).value;
         onChange(value);
      };

      return (
         <FormControl className={classes.formControl} variant="filled">
            <InputLabel id={`${id}-label`}>{label}</InputLabel>
            <Select
               labelId={`${id}-label`}
               id={id}
               value={defaultValue}
               onChange={onSelectChange}
            >
               {items.map(item => <MenuItem key={item.value} value={item.value}>{item.text}</MenuItem>)}
            </Select>
         </FormControl>
      );
   };

   const onSyntaxChange = (value: string) => setState({ syntax: value });
   const onThemeChange = (value: string) => setState({ theme: value });
   const onBackgroundChange = (e: ChangeEvent<HTMLInputElement>) => {
      const value = (e.currentTarget.value);
      setState({ background: value });
   };

   return (
      <Grid container spacing={1} direction="row" justify="center" alignItems="center" className={classes.root}>
         <Grid item xs={2}>
            <PathPicker label="Project Root" path={rootPath} onChanged={onRootPathChanged} />
         </Grid>
         <Grid item xs={2}>
            {select('syntax', 'Syntax', [
               {
                  text: 'JavaScript',
                  value: 'javascript',
               },
               {
                  text: 'Python',
                  value: 'python',
               },
            ], syntax, onSyntaxChange)}
         </Grid>
         <Grid item xs={2}>
            {select('theme', 'Theme', [
               {
                  text: 'Monokai',
                  value: 'monokai',
               },
            ], theme, onThemeChange)}
         </Grid>
         <Grid item xs={1} className={classes.bgColor}>
            <label className={classes.label}>Background
               <input type="color" onChange={onBackgroundChange} defaultValue={background} />
            </label>
         </Grid>
         <Grid item xs={2}>
            <label className={classes.label}>Zoom
               <ZoomControl />
            </label>
         </Grid>
      </Grid>
   );
}