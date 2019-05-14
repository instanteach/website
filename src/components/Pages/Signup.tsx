import * as React from 'react'
import {Redirect} from 'react-router-dom'
import styled from 'styled-components'

import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import SocialButton from '../SocialButton'

import AuthenticationService from '../../services/AuthenticationService'
import UserService from '../../services/UserService'
import store from '../../state/store'

interface IState {
	displayName:string
	email:string
	error:string
	password:string
	signed:boolean
	session:any
}

const Form = styled('form')`
  width: 100%;
`
const inputStyles = {
  marginBottom: '1rem',
  width: '100%'
}
const gridStyles = {
  minHeight: '90%'
}

class Signup extends React.PureComponent<{}, IState> {
	public state = {
		displayName: "",
		email: "",
		error: " ",
		password: "",
		session:null,
		signed: false
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
			[name]: event.target.value,
			error: " "
    })
	}
	
	public signup = event => {
		event.preventDefault()
		const form = event.target
		const data = {
			displayName: form.displayName.value,
			email: form.email.value,
			password: form.password.value
		}
		
		if(data.password.length < 6) {
			this.setState({ error: "Password must have 6 characters as min" })
			return
		}
		
		(async () =>{
			const response = await UserService.register(data)
			if(response.error) {
				this.setState({ error: response.error })
			}
			if(response.userId) {
				this.setState({ signed: true })
			}
		})()
	}

	public componentWillUnmount() {
		this.unsubscribe()
	}

	public loginWithFacebook = () => {
		(async () => {
			const auth = await AuthenticationService.loginWithFacebook()
		
			this.setState({
				signed: auth
			})
		})()
	}

	public loginWithGoogle = () => {
		(async () => {
			const auth = await AuthenticationService.loginWithGoogle()
		
			this.setState({
				signed: auth
			})
		})()
	}

	public render() {
		const {email, displayName, password, error, signed, session} = this.state

		return (
			<>
			{
				signed || session
				? <Redirect to="/login" />
				: null
			}
			<Grid container={true} spacing={16} style={gridStyles} direction="row" justify="center" alignItems="center">
				<Grid item={true} container={true} xs={12} md={4}>
				<Typography paragraph={true} color="error">{error}</Typography>
					<Form onSubmit={this.signup}>
						<Grid item={true} xs={12}>
							<TextField
								label="Full Name"
								value={displayName}
								name="displayName"
								type="text"
								variant="outlined"
								required={true}
								onChange={this.handleChange('displayName')}
								style={inputStyles} />
						</Grid>
						<Grid item={true} xs={12}>
							<TextField
								label="E-mail"
								value={email}
								name="email"
								type="email"
								variant="outlined"
								required={true}
								onChange={this.handleChange('email')}
								style={inputStyles} />
						</Grid>
						<Grid item={true} xs={12}>
							<TextField
								label="Password"
								value={password}
								name="password"
								type="password"
								variant="outlined"
								required={true}
								onChange={this.handleChange('password')}
								style={inputStyles} />
						</Grid>
						<Grid item={true} container={true} xs={12}>
							<Button size="large" variant="contained" color="primary" type="submit" fullWidth={true} style={{ marginBottom: '1rem' }}>Create Account</Button>
						</Grid>
						<Grid item={true} container={true} xs={12}>
							<SocialButton
								as="facebook"
								onClick={this.loginWithFacebook}
								style={{ marginBottom: '1rem' }}>Sign up with Facebook</SocialButton>
						</Grid>
						<Grid item={true} container={true} xs={12}>
							<SocialButton
								onClick={this.loginWithGoogle}
								style={{ marginBottom: '1rem' }}>Sign up with Google</SocialButton>
						</Grid>
					</Form>
				</Grid>
			</Grid>
			</>
		)
	}
}

export default Signup