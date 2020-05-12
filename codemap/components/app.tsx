import {
  React,
  useState,
  MouseEvent,
} from '~lib';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import { createMuiTheme, CssBaseline } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';
import {
  Canvas,
  ApplicationBar,
  ProjectSettings,
} from '~components';
import { useCommands } from '~commands';
import { useKeyUpEvent, Keys } from '~hooks';


import { AffineView } from '~components/affineView';
import { useEffect } from 'react';

const useStyles = makeStyles(theme => ({
  app: {
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'wrap',
    width: '100%',
    height: '100%',
  },
  paper: {
    margin: theme.spacing(4),
    position: 'relative',
    backgroundColor: '#767474',
    // width: 500,
    // height: 500,
    flexGrow: 2,
    // marginTop: 0,
    display: 'flex',
  },
  box1: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 200,
    height: 100,
    backgroundColor: 'blue',
    cursor: 'hand',
  },
  box2: {
    position: 'absolute',
    top: 20,
    left: 20,
    width: 50,
    height: 50,
    backgroundColor: 'red',
    cursor: 'wait',
    userSelect: 'all',
  },
  box3: {
    position: 'absolute',
    top: 100,
    left: 200,
    width: 200,
    height: 50,
    backgroundColor: 'green',
    cursor: 'wait',
  },
  container: {
    width: 250,
    height: 250,
    overflow: 'auto'
  }
}));

const theme = createMuiTheme({
  palette: {
    type: 'dark'
  }
});

export function App() {
  const classes = useStyles();
  const { undo, redo } = useCommands();

  useKeyUpEvent((e: KeyboardEvent) => {
    if (e.keyCode === Keys.Z) {
      if (e.ctrlKey) {
        if (e.shiftKey) {
          redo();
        } else {
          undo();
        }
      }
    }
  });

  // return (
  //   <ThemeProvider theme={theme}>
  //     <div className={classes.app}>
  //       <CssBaseline />
  //       <ApplicationBar />
  //       <ProjectSettings />
  //       <Paper elevation={3} variant="outlined" className={classes.paper}>
  //         <Canvas />
  //       </Paper>
  //     </div>
  //   </ThemeProvider>
  // );

  return (
    <ThemeProvider theme={theme}>
      <div className={classes.app}>
        <CssBaseline />
        <div className={classes.container}>
          <AffineView width={500} height={500}>
              <div
                className={classes.box1}
                style={{
                  top: 0,
                  left: 0,
                }}
              >
                <div className={classes.box2}>hello world!</div>
              </div>
              <div className={classes.box3}>hello world!</div>
          </AffineView>
        </div>
      </div>
    </ThemeProvider>
  );
}