import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import { RawTheme } from './config/theme'
import './index.css';
import registerServiceWorker from './registerServiceWorker';

const theme = createMuiTheme(RawTheme);

ReactDOM.render(
  <MuiThemeProvider theme={theme}>
    <App />
  </MuiThemeProvider>,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
