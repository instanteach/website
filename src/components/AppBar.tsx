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
import CloseIcon from '@material-ui/icons/Close';
import MenuIcon from '@material-ui/icons/Menu';
import PeopleIcon from '@material-ui/icons/People'
import * as React from 'react';
import AdSense from 'react-adsense';
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
	menuUserIsOpen: boolean
	mobileOpen: boolean
	session: any
}

const Content = styled('div')`
	display: flex;
	flex-direction: column;
	flex-wrap: wrap;
	justify-content: space-between;
	align-items: flex-start;
	min-height: 80vh;
	@media screen and (min-width: 600px) {
		min-height: 550px;
	}
`

const PolicyText = styled('small')`
  position: relative;
  bottom: 0;
	text-align: center;
	font-size: .75rem;
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
/*
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
*/

const AdSenseMobileContainer = styled('div')`
	position: fixed;
	bottom: .5rem;
	left: .5rem;
	right: .5rem;
	width: 95%;
	height: 60px;
`

const MenuUser = styled('ul')`
	position: absolute;
	display: none;
	right: 1rem;
	top: 3.5rem;
	width: 50%;
	max-width: 200px;
	border-radius: 0 0 4px 4px;
	background: white;
	color: black;
	border: 1px solid #d7d7d7;
	list-style: none;
	border-top: 0;
	margin: 0;
	padding: 0;
	cursor: pointer;
	box-shadow: 0 2px 10px 0 rgba(0,0,0,.2);
	li {
		display: flex;
		padding: .75rem;
		margin: 0;
		font-size: .9rem;
		align-items: center;
		a {
			display: block;
			width: 100%;
			text-decoration: none;
			color: inherit;
		}
		img, svg {
			width: 15px;
			margin-right: .5rem;
		}
		&:hover {
			background-color: #eee;
		}
	}
	&.show {
		display: block;
	}
	@media screen and (min-width: 600px) {
		top: 4rem;
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
		menuUserIsOpen: false,
		mobileOpen: false,
		session: null
	};
	
	public unsubscribe: any;

	public componentWillMount() {
		// Verify if exists an user session
		AuthenticationService.listener()
	}

  public componentDidMount() {
		const {session} = this.state
		const s = store.getState().session
		if(s && s !== session) {
			this.setState({ session: s })
		}
	}

	public toggleMenuUser = (event) => {
		event.preventDefault()
		this.setState({ menuUserIsOpen: !this.state.menuUserIsOpen })
	}

  public logout = () => {
		// Close session
		AuthenticationService.logout()
		window.location.href = "/"
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
				case '/my-students':
					return 'My Students'
				case '/classroom':
					return 'Classroom'
				case '/my-profile':
					return 'My Profile'
      }
    }
    return ''
	}
	
	public handleCloseDrawer = event => {
		this.handleDrawerToggle()
	}

  public render() {
		const { classes, theme, children } = this.props;
		const {session, menuUserIsOpen} = this.state
		const mediaQuery = window.matchMedia("(min-width:700px)")
		const user:IUser = store.getState().user

    const drawer = (
      <div>
        <div className={classes.toolbar}>
          <a href="/">
            <Avatar
              alt='Instanteach Logo'
							src={`${process.env.PUBLIC_URL}/images/logo.png`}
							style={{ marginTop: '.5rem', marginBottom: '.5rem', width: '100px', height: '100px' }}
            />
          </a>
        </div>
        <Divider />
        <List>{<NavItems session={session} onClick={this.handleCloseDrawer} />}</List>
        <Divider />
				{
					mediaQuery.matches
					? <>
						{/*
						<AdSenseLab src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR4Or1h2Tt0Dt9eCf5q4Vq6Ei5bQL9mg-sTcym2BuDywMIZpMSq2w" />
						*/}
						
						<AdSense.Google
							client='ca-pub-2740710281751996'
							slot='1941182538'
							style={{ display: 'block' }}
							format='auto'
							responsive='true' />
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
										<Avatar src={user.photoURL} alt={user.displayName} onClick={this.toggleMenuUser} style={{cursor: 'pointer'}} />
										<MenuUser className={`${menuUserIsOpen ? 'show' : ''}`} onClick={this.toggleMenuUser}>
											<li>
												<Link to="/my-profile">
													<PeopleIcon /> Profile
												</Link>
											</li>
											<Divider />
											<li onClick={this.logout}><CloseIcon /> Sign Out</li>
										</MenuUser>
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
					<Content>
          {children}
          <PolicyText>
            Just so you know, your use of this site,
            in any and all forms, constitutes an acceptance of Instanteach’s <Link to="/privacy-policy">Privacy Policy.</Link>
          </PolicyText>
					</Content>
					{
					!mediaQuery.matches
					? (
						<AdSenseMobileContainer>
							<AdSense.Google
							client='ca-pub-2740710281751996'
							slot='9728379381'
							style={{ display: 'block' }}
							responsive='true' />
						</AdSenseMobileContainer>
					)
					: null
					}
        </main>
      </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(ResponsiveDrawer)