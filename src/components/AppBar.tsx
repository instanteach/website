import * as React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

import AppBar from '@material-ui/core/AppBar'
import Divider from '@material-ui/core/Divider'
import Drawer from '@material-ui/core/Drawer'
import Hidden from '@material-ui/core/Hidden'
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List'
import { createStyles, withStyles } from '@material-ui/core/styles'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'

import { Theme } from '@material-ui/core'

import MenuIcon from '@material-ui/icons/Menu';

import NavItems from './NavItems'

interface IResponsiveDrawerProps {
  classes: any
  theme: any
}

interface IResponsiveDrawerState {
  mobileOpen: boolean
}

const PolicyText = styled('small')`
  position: relative;
  bottom: 0;
  text-align: center;
`

const drawerWidth = 240;

const styles = (theme: Theme) => createStyles({
  appBar: {
    marginLeft: drawerWidth,
    position: 'absolute',
    zIndex: theme.zIndex.drawer + 1,
    [theme.breakpoints.up('md')]: {
      width: `calc(100% - ${drawerWidth}px)`,
    },
  },
  content: {
    backgroundColor: theme.palette.background.default,
    flexGrow: 1,
    overflow: 'scroll',
    padding: theme.spacing.unit * 3,
  },
  drawerDocked: {
    height: '100%'
  },
  drawerPaper: {
    root: {
      height: '100%',
    },
    width: drawerWidth,
    [theme.breakpoints.up('md')]: {
      position: 'relative',
    },
  },
  navIconHide: {
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  root: {
    display: 'flex',
    flexGrow: 1,
    height: '100%',
    overflow: 'hidden',
    position: 'relative',
    width: '100%',
    zIndex: 1,
  },
  toolbar: {
    ...theme.mixins.toolbar,
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
  },
});

class ResponsiveDrawer extends React.PureComponent<IResponsiveDrawerProps, IResponsiveDrawerState> {
  public state = {
    mobileOpen: false,
  };

  public handleDrawerToggle = () => {
    this.setState(state => ({ mobileOpen: !state.mobileOpen }));
  };

  public render() {
    const { classes, theme, children } = this.props;

    const drawer = (
      <div>
        <div className={classes.toolbar}>
          Instanteach
        </div>
        <Divider />
        <List>{NavItems}</List>
      </div>
    );

    return (
      <div className={classes.root}>
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="Open drawer"
              onClick={this.handleDrawerToggle}
              className={classes.navIconHide}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="title" color="inherit" noWrap={true}>
              Responsive drawer
            </Typography>
          </Toolbar>
        </AppBar>
        <Hidden mdUp={true}>
          <Drawer
            variant="temporary"
            anchor={theme.direction === 'rtl' ? 'right' : 'left'}
            open={this.state.mobileOpen}
            onClose={this.handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden smDown={true} implementation="css">
          <Drawer
            variant="permanent"
            open={true}
            classes={{
              docked: classes.drawerDocked,
              paper: classes.drawerPaper,
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <main className={classes.content}>
          <div className={classes.toolbar} />
          {children}
          <PolicyText>
            Just so you know, your use of this site, 
            in any and all forms, constitutes an acceptance of Instanteach’s <Link to="/privacy-policy">Privacy Policy.</Link>
          </PolicyText>
        </main>
      </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(ResponsiveDrawer);