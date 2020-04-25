import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import Slider from '@material-ui/core/Slider';
import ZoomIn from '@material-ui/icons/ZoomIn';
import ZoomOut from '@material-ui/icons/ZoomOut';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import { MAX_ZOOM, MIN_ZOOM } from '~core/view';
import useStore from '~store';

const useStyles = makeStyles(theme => ({
   root: {
   },
   slider: {
      color: '#70717b',
   },
   flipped: {
      transform: 'scaleX(-1)',
      marginLeft: 5,
   },
}));

export function ZoomControl() {
   const classes = useStyles();
   const [state, setStore] = useStore();
   const { view } = state;
   const value = view.zoom;

   const handleChange = (event: React.ChangeEvent<{}>, value: number | number[]) => {
      onZoomChange(value as number);
   };

   const onZoomChange = (amount: number) => {
      const delta = value - amount;
      view.zoomBy(delta);
      setStore();
   };

   const onZoomOutClick = () => onZoomChange(value - 0.1);
   const onZoomInClick = () => onZoomChange(value + 0.1);

   return (
      <Grid
         className={classes.root}
         container
         spacing={0}
         direction="row"
         justify="center"
         alignItems="center"
      >
         <Grid item>
            <IconButton color="default" aria-label="zoom out" onClick={onZoomOutClick} size="small">
               <ZoomOut />
            </IconButton>

         </Grid>
         <Grid item xs>
            <Slider
               className={classes.slider}
               orientation="horizontal"
               value={value}
               min={MIN_ZOOM}
               step={0.1}
               max={MAX_ZOOM}
               onChange={handleChange}
               aria-labelledby="continuous-slider"
            />
         </Grid>
         <Grid item>
            <IconButton color="default" aria-label="zoom out" onClick={onZoomInClick} size="small" className={classes.flipped}>
               <ZoomIn />
            </IconButton>
         </Grid>
      </Grid>
   );
}