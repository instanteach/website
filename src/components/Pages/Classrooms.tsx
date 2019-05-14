import * as React from 'react'
import {Link} from 'react-router-dom'
import styled from 'styled-components'

import {Button, Card, CardActions, CardContent, CardMedia, Dialog, DialogActions, DialogContent,
	DialogContentText, DialogTitle, Grid, TextField, Typography} from '@material-ui/core'

import IClassroom from '../../interfaces/IClassroom'
import ClassroomService from '../../services/ClassroomService'
import UserService from '../../services/UserService'

interface IState {
	classrooms:IClassroom[],
	forbidden:boolean
	open:boolean
	user:{}
}

interface IProps {
	history?:any
	session?:any
}

const CardButton = styled(Button)`
	a {
		color: inherit;
		text-decoration: none;
	}
`

class Classrooms extends React.Component<IProps, IState> {
	public state = {
		classrooms: [],
		forbidden: false,
		open: false,
		user:{
			avatar: "",
			displayName: "",
			email: "",
			isAdmin: false
		}
	}

	public componentDidMount() {
		const {history, session} = this.props
		if(history.location.pathname.includes('/my-students/user/')) {
			if(!session.isAdmin) {
				this.setState({ forbidden: true })
				return
			}
			else {
				(async () => {
					const pathname = history.location.pathname.split('/')
					const userId = pathname[3]
					const classrooms: IClassroom[] = await ClassroomService.getByUserId(userId)
					const user = await UserService.get(userId)
					this.setState({ classrooms, user: user ? user : {} })
				})()
			}
		}
		else {
			(async () => {
				const classrooms = await ClassroomService.getByUserId(session.uid)
				this.setState({ classrooms })
			})()
		}
		
	}

	public handleClose = () => {
		this.setState({ open: !this.state.open })
	}

	public createClassroom = event => {
		(async () => {
			event.preventDefault()
			const {classrooms} = this.state
			let classroom: any
			const {session} = this.props
			const form = event.target
			const data = {
				age: form.age.value,
				name: form.name.value,
				students: form.students.value,
				userId:session.uid
			}
			const response = await ClassroomService.create(data)

			console.log(response)

			if(response.error === "") {
				classroom = response.data
				const arr:IClassroom[] = [classroom, ...classrooms]

				this.setState({ open: false, classrooms: arr })
			}
			this.setState({ open: false })
		})()
	}

	public render() {
		const {classrooms, forbidden, open, user} = this.state
		const {history, session} = this.props
		const mediaQuery = window.matchMedia("(min-width:700px)")

		return (
			<>
			<Grid container={true} style={{minHeight: '75vh', flexDirection: 'column', alignItems: 'flex-start'}}>
			{
				forbidden
				? <Grid item={true}><Typography>You don't have permissions to be here.</Typography></Grid>
				: (
					<>
					<Grid container={true} item={true} alignItems="center">
						<Grid container={true} item={true} xs={8} md={10}>
						{
							session.isAdmin && history.location.pathname.includes('/my-students/user/')
							? <Typography variant="title">Classroom's {user.displayName}</Typography>
							: <Typography variant="title">Your classrooms</Typography>
						}
						</Grid>
						{
							!history.location.pathname.includes('/my-students/user/')
							? (
								<Grid container={true} item={true} xs={4} md={2} justify="flex-end">
									<Button variant="raised" color="primary" fullWidth={true} onClick={this.handleClose}>
									{
										mediaQuery.matches
										? 'New Classroom'
										: 'Add'
									}
									</Button>
								</Grid>
							) : null
						}
					</Grid>
					<Grid container={true} spacing={16}>
					{
						classrooms.length === 0
						? (
							<>
							<Grid item={true}>
								<br />
								<Typography>There aren't classrooms yet</Typography>
								<br />
								<br />
							</Grid>
							</>
						)
						: classrooms.map((classroom:any) => (
							<Grid container={true} item={true} sm={4} key={classroom.id} style={{marginBottom:'1rem', marginTop:'1rem'}}>
								<Grid item={true} xs={12}>
									<Card style={{width:'100%'}}>
									<CardMedia
									style={{height: '140px'}}
									title="Image"
									image={classroom.thumbnail}/>
										<CardContent>
											<Typography variant="title">{classroom.name}</Typography>
											<Typography variant="caption">{classroom.students} students</Typography>
											<Typography variant="caption">{classroom.age} years old average age</Typography>
										</CardContent>
										<CardActions>
											<Grid container={true} justify="flex-end">
												<CardButton size="small" color="primary"><Link to={`/classroom/${classroom.id}`}>View</Link></CardButton>
											</Grid>
										</CardActions>
									</Card>
								</Grid>
							</Grid>
						))
					}
					</Grid>
					</>
				)
			}
			</Grid>
			<Dialog open={open} onClose={this.handleClose} arial-labelledby="form-dialog-title">
				<form onSubmit={this.createClassroom}>
				<DialogTitle id="form-dialog-title">Add a new Classroom</DialogTitle>
				<DialogContent>
					<DialogContentText>
						The classrooms are groups by students to make a study plan with our digital materials. Set them a name and how many students it has.
					</DialogContentText>
					<Grid container={true} spacing={16}>
						<Grid item={true} xs={12}>
							<TextField autoFocus={true} margin="normal" id="name" name="name" label="Classroom name" type="text" fullWidth={true} required={true} />
						</Grid>
						<Grid item={true} md={6}>
							<TextField margin="normal" id="students" name="students" label="Students" type="number" fullWidth={true} inputProps={{min:1}} required={true} />
						</Grid>
						<Grid item={true} md={6}>
							<TextField margin="normal" id="age" name="age" label="Average age" type="number" fullWidth={true} inputProps={{min:1}} required={true} />
						</Grid>
					</Grid>
				</DialogContent>
				<DialogActions>
					<Button type="button" onClick={this.handleClose} color="default">Cancel</Button>
					<Button type="submit" color="primary">Add</Button>
				</DialogActions>
				</form>
			</Dialog>
			</>
		)
	}
}

export default Classrooms