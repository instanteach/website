import {Button, Grid, Typography} from '@material-ui/core'
import * as React from 'react'
import {Link} from 'react-router-dom'
import styled from 'styled-components'

import IUser from '../../interfaces/IUser'
import UserService from '../../services/UserService'
import Avatar from '../Avatar';

interface IState {
	users:any
}

const LinkButton = styled(Link)`
	text-decoration: none;
	color: inherit;
`

class UserList extends React.PureComponent<{}, IState> {
	public state = {
		users: []
	}

	public componentDidMount() {
		(async () => {
			this.setState({ users: await UserService.getAllUsers() })
		})()
	}

	public render() {
		const {users} = this.state
		return (
			<Grid container={true}>
				{
					users.map((user:IUser) => (
						<Grid container={true} item={true} sm={4} key={user.uid} alignItems="center" style={{marginBottom:'1rem', marginTop:'1rem'}}>
							<Grid item={true} xs={3}><Avatar src={user.photoURL} alt={user.displayName} size={65} /></Grid>
							<Grid container={true} item={true} xs={9}>
								<Grid item={true} xs={12}>
									<Typography variant="title">{user.displayName}</Typography>
								</Grid>
								<Grid item={true} xs={12}>
									<Typography variant="caption">{user.email}</Typography>
								</Grid>
								<Grid container={true} item={true} xs={12} sm={11} justify="flex-end">
									<Button variant="text" color="primary"><LinkButton to={`/classrooms/user/${user.uid}`}>View</LinkButton></Button>
								</Grid>
							</Grid>
						</Grid>
					))
				}
			</Grid>
		)
	}
}

export default UserList