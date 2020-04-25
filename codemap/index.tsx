console.log('App started: ' + Date.now())

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { App } from '~components';
import 'typeface-roboto';
import '~less/app.less';

ReactDOM.render(<App />, document.getElementById('app'));