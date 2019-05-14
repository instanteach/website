import * as React from 'react'
import {Redirect} from 'react-router-dom'
import store from '../../state/store'

import AuthenticationService from '../../services/AuthenticationService'

import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import IconButton from '@material-ui/core/IconButton'
import Snackbar from '@material-ui/core/Snackbar'
import TextField from '@material-ui/core/TextField'
import CloseIcon from '@material-ui/icons/Close'

import SocialButton from '../SocialButton'

interface IState {
  auth: boolean
  email: string
  error: boolean
	password: string
	session: any
}

const gridStyles = {
  minHeight: '90%'
}

const inputStyles = {
  marginBottom: '1rem',
  width: '100%'
}

class Login extends React.PureComponent<{}, IState> {
  public state = {
    auth: false,
    email: "",
    error: false,
		password: "",
		session: null
	}
	
	public unsubscribe: any;

	public componentWillMount() {
		// Verify if exists an user session
		AuthenticationService.listener()
	}

  public componentDidMount() {
		const {session} = this.state
		this.unsubscribe = store.subscribe(() => {
			const s = store.getState().session
			if(s && s !== session) {
				this.setState({ session: s })
			}
		})
	}

  public handleChange = name => event => {
    this.setState({
      ...this.state,
      error: false,
      [name]: event.target.value
    })
  }

  public async login() {
    const {email, password} = this.state
    const auth = await AuthenticationService.login(email, password)

    this.setState({
      auth,
      error: !auth
    })
	}
	
	public loginWithFacebook = () => {
		(async () => {
			const auth = await AuthenticationService.loginWithFacebook()
		
			this.setState({
				auth,
				error: !auth
			})
		})()
	}

	public loginWithGoogle = () => {
		(async () => {
			const auth = await AuthenticationService.loginWithGoogle()
		
			this.setState({
				auth,
				error: !auth
			})
		})()
	}

  public submit = e => {
    e.preventDefault()
    this.login()
  }

  public handleClose = () => {
    this.setState({
      error: false
    })
	}

	public componentWillUnmount() {
		this.unsubscribe()
	}

  public render() {
		const {email, auth, error, password, session} = this.state

    return (
      (session || auth)
      ? <Redirect to="/my-students" />
      : (
        <>
        <Grid container={true} spacing={16} style={gridStyles} direction="row" justify="center" alignItems="center">
          <Grid item={true} xs={12} md={4}>
            <form onSubmit={this.submit}>
              <Grid item={true} xs={12}>
                <TextField
                  label="E-mail"
                  defaultValue={email}
                  name="email"
                  type="email"
                  onChange={this.handleChange('email')}
                  variant="outlined"
                  style={inputStyles} />
              </Grid>
              <Grid item={true} xs={12}>
                <TextField
                  label="Password"
                  defaultValue={password}
                  name="password"
                  type="password"
                  onChange={this.handleChange('password')}
                  variant="outlined"
                  style={inputStyles} />
                </Grid>
                <Grid item={true} container={true} xs={12}>
                  <Button
										fullWidth={true}
										size="large"
										variant="contained"
										color="primary"
										type="submit"
										style={{ marginBottom: '1rem' }}>Log In</Button>
                </Grid>
                <Grid item={true} container={true} xs={12}>
                  <SocialButton
										as="facebook"
										onClick={this.loginWithFacebook}
										style={{ marginBottom: '1rem' }}>Login with Facebook</SocialButton>
                </Grid>
                <Grid item={true} container={true} xs={12}>
                  <SocialButton
										onClick={this.loginWithGoogle}
										style={{ marginBottom: '1rem' }}>Login with Google</SocialButton>
                </Grid>
            </form>
          </Grid>
          <Snackbar
            open={error}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            onClose={this.handleClose}
            ContentProps={{
              'aria-describedby': 'message-id',
            }}
            message={<span id="message-id">Authentication failed!</span>}
            action={[
              <IconButton
                key="close"
                aria-label="Close"
                color="inherit"
                onClick={this.handleClose}
              ><CloseIcon /></IconButton>
            ]}/>
          </Grid>
        </>
      )
    )
  }
}

export default Login
