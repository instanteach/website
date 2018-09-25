import { ThemeOptions } from "@material-ui/core/styles/createMuiTheme";

export const RawTheme: ThemeOptions = {
  palette: {
    background: {
      default: '#fafafa',
      paper: '#fff'
    },
    common: {
      black: '#000',
      white: '#fff'
    },
    error: {
      contrastText: '#fff',
      dark: '#d32f2f',
      light: '#e57373',
      main: '#f44336',
    },
    primary: {
      contrastText: '#fff',
      dark: 'rgba(26, 50, 130, 1)',
      light: 'rgba(81, 108, 199, 1)',
      main: 'rgba(38, 72, 186, 1)'
    },
    secondary: {
      contrastText: 'rgba(0, 0, 0, 1)',
      dark: 'rgba(174, 158, 15, 1)',
      light: 'rgba(250, 232, 68, 1)',
      main: 'rgba(249, 227, 22, 1)'
    },
    text: {
      disabled: 'rgba(0, 0, 0, 0.38)',
      hint: 'rgba(0, 0, 0, 0.38)',
      primary: 'rgba(0, 0, 0, 0.87)',
      secondary: 'rgba(0, 0, 0, 0.54)'
    }
  }
}