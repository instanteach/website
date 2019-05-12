import * as React from 'react'
import {Redirect} from 'react-router-dom'
import styled from 'styled-components'

import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'

import UserService from 'src/services/UserService'

interface IState {
	displayName:string
	email:string
	error:string
	password:string
	signed:boolean
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
		signed: false
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

	public render() {
		const {email, displayName, password, error, signed} = this.state
		return (
			<>
			{
				signed
				? <Redirect to="/login" />
				: null
			}
			<Grid container={true} spacing={16} style={gridStyles} direction="row" justify="center" alignItems="center">
				<Grid item={true} container={true} xs={6}>
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
						<Grid item={true} container={true} xs={12} justify="flex-end">
							<Button size="medium" variant="contained" color="primary" type="submit">Create Account</Button>
						</Grid>
					</Form>
				</Grid>
			</Grid>
			</>
		)
	}
}

export default Signup