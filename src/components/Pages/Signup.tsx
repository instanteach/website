import * as React from 'react'
import {Redirect} from 'react-router-dom'
import styled from 'styled-components'

import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'

import UserService from 'src/services/UserService'

interface IState {
	email:string
	error:string
	name:string
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
		email: "",
		error: " ",
		name: "",
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
			email: form.email.value,
			name: form.name.value,
			password: form.password.value
		}
		
		if(data.password.length < 6) {
			this.setState({ error: "Password must have 6 characters as min" })
			return
		}
		
		(async () =>{
			const response = await UserService.createAccount(data)
			if(response.error) {
				this.setState({ error: response.error })
			}
			if(response.userId) {
				this.setState({ signed: true })
			}
		})()
	}

	public render() {
		const {email, name, password, error, signed} = this.state
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
								value={name}
								name="name"
								type="text"
								variant="outlined"
								required={true}
								onChange={this.handleChange('name')}
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
								minLength={6}
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