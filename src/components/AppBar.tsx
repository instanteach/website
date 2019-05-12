// tslint:disable:no-console
import { Theme } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import { createStyles, withStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import MenuIcon from '@material-ui/icons/Menu';
import * as React from 'react';
// import AdSense from 'react-adsense';
import { RouteProps } from 'react-router';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import IUser from '../interfaces/IUser'
import AuthenticationService from '../services/AuthenticationService';
import NavItems from './NavItems';

import store from '../state/store'


interface IResponsiveDrawerProps extends RouteProps {
  classes: any
	theme: any
	history: any
}

interface IResponsiveDrawerState {
	mobileOpen: boolean
}

const PolicyText = styled('small')`
  position: relative;
  bottom: 0;
  text-align: center;
`

const Username = styled('span')`
	display: none;
	margin-right: .5rem;
	color: white;
	font-weight: 500;
	opacity: .8;
	@media screen and (min-width:900px) {
		display: inline-block;
	}
`

const ToolbarButton = styled(Button)`
	a {
		color: white !important;
		text-decoration: none;
	}
	opacity: .7;
	transition-duration: .3s;
	&:hover {
		opacity: 1;
	}
`

const AdSenseLab = styled('img')`
	width: 100%;
	&.horizontal {
		position: fixed;
		bottom: .5rem;
		left: .5rem;
		right: .5rem;
		width: 95%;
		height: 60px;
		overflow: hidden;
	}
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
		mobileOpen: false
  };

  public componentDidMount() {
    // Verify if exists an user session
		AuthenticationService.listener()
	}

  public logout = () => {
    // Close session
    if(AuthenticationService.logout()) {
			window.location.href='/'
		}
  }

  public handleDrawerToggle = () => {
    this.setState(state => ({ mobileOpen: !state.mobileOpen }));
  };

  public handleAppBarTitle = () => {
    const { location } = this.props
    if (location) {
      switch (location.pathname) {
        case '/':
          return 'Home'
        case '/material-generator':
          return 'Material Generator'
        case '/contact':
          return 'Contact Us'
        case '/about-us':
          return 'About Us'
        case '/privacy-policy':
          return 'Privacy Policy'
        case '/documents':
          return 'Documents'
        case '/upload':
          return 'Upload'
        case '/login':
          return 'Login'
        case '/signup':
					return 'Sign up'
				case '/users':
					return 'Users'
				case '/classrooms':
					return 'Classrooms'
				case '/classroom':
					return 'Classroom'
      }
    }
    return ''
  }

  public render() {
		const { classes, theme, children } = this.props;
		const {session} = AuthenticationService
		const mediaQuery = window.matchMedia("(min-width:700px)")
		const user:IUser = store.getState().user

    const drawer = (
      <div>
        <div className={classes.toolbar}>
          <a href="/">
            <Avatar
              alt='Instanteach Logo'
              src={`${process.env.PUBLIC_URL}/images/logo.png`}
            />
          </a>
        </div>
        <Divider />
        <List>{<NavItems session={session} />}</List>
        <Divider />
				{
					mediaQuery.matches
					? <>
						<AdSenseLab src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR4Or1h2Tt0Dt9eCf5q4Vq6Ei5bQL9mg-sTcym2BuDywMIZpMSq2w" />
						{
						/*<AdSense.Google
							client='ca-pub-2740710281751996'
							slot='1941182538'
							style={{ display: 'block' }}
							format='auto'
							responsive='true' />
						*/}
					</>
					: null
				}
      </div>
    );

    return (
      <div className={classes.root}>
        <AppBar className={classes.appBar}>
          <Toolbar>
            <Grid container={true}>
              <Grid item={true} container={true} xs={session ? 7 : 5} alignItems="center">
                <IconButton
                  color="inherit"
                  aria-label="Open drawer"
                  onClick={this.handleDrawerToggle}
                  className={classes.navIconHide}
                >
                  <MenuIcon />
                </IconButton>
                <Typography variant="title" color="inherit" noWrap={true}>
                  {this.handleAppBarTitle()}
                </Typography>
              </Grid>
              <Grid item={true} container={true} xs={session ? 5 : 7} justify="flex-end" alignItems="center">
                {
                  (session)
                    ? (
										<>
										<Username>{user.displayName}</Username>
										<Avatar src={user.photoURL} alt={user.displayName} onClick={this.logout} style={{cursor: 'pointer'}} />
										</>
										)
                    : (
											<>
											<ToolbarButton variant="text" color="primary"><Link to="/login">Log in</Link></ToolbarButton>
											<ToolbarButton variant="text" color="primary"><Link to="/signup">Sign up</Link></ToolbarButton>
											</>
										)
                }
              </Grid>
            </Grid>
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
					{
					!mediaQuery.matches
					? <AdSenseLab className="horizontal" src="https://previews.123rf.com/images/messer16/messer161705/messer16170500026/78201541-potato-chips-ads-vector-realistic-illustration-of-potato-chips-with-garlic-horizontal-banner-with-pr.jpg" />
					: null
					}
        </main>
      </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(ResponsiveDrawer)