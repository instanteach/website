import * as React from 'react'
import {Link} from 'react-router-dom'
import styled from 'styled-components'

import {Button, Card, CardActions, CardContent, CardMedia, Dialog, DialogActions, DialogContent,
	DialogContentText, DialogTitle, Grid, InputLabel, TextField, Typography} from '@material-ui/core'

import IClassroom from '../../interfaces/IClassroom'
import ClassroomService from '../../services/ClassroomService'
import UserService from '../../services/UserService'
import Search from '../Search';

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
const UnsplashRepository = styled(Grid)`
	max-height: 240px;
	overflow-y: overlay;
`
const UnsplashImage = styled('img')`
	width: 100%;
	max-height: 100px;
	cursor: pointer;
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
			<Dialog open={open} onClose={this.handleClose} arial-labelledby="form-dialog-title" fullWidth={true} fullScreen={!mediaQuery.matches}>
				<form onSubmit={this.createClassroom}>
				<DialogTitle id="form-dialog-title">Add a new Classroom</DialogTitle>
				<DialogContent>
					<DialogContentText style={{ marginBottom: '1rem' }}>
						The classrooms are groups by students to make a study plan with our digital materials. Set them a name and how many students it has.
					</DialogContentText>
					<Grid container={true} spacing={16}>
						<Grid item={true} container={true} xs={12} md={5} alignContent="flex-start">
							<Grid item={true} xs={12}>
								<TextField autoFocus={true} margin="normal" id="name" name="name" label="Classroom name" type="text" fullWidth={true} required={true} />
							</Grid>
							<Grid item={true} xs={12}>
								<TextField margin="normal" id="students" name="students" label="Students" type="number" fullWidth={true} inputProps={{min:1}} required={true} />
							</Grid>
							<Grid item={true} xs={12}>
								<TextField margin="normal" id="age" name="age" label="Average age" type="number" fullWidth={true} inputProps={{min:1}} required={true} />
							</Grid>
						</Grid>
						<UnsplashRepository item={true} container={true} spacing={8} xs={12} md={7}>
							<Grid item={true} xs={12}>
								<InputLabel>Cover</InputLabel>
								<Search placeholder="Look for an image" value="" onChange="" />
							</Grid>
							<Grid item={true} md={6}>
								<UnsplashImage src="https://images.unsplash.com/photo-1549354324-290af3126793?ixlib=rb-1.2.1&q=85&fm=jpg&crop=entropy&cs=srgb&dl=michael-prewett-1346961-unsplash.jpg" />
							</Grid>
							<Grid item={true} md={6}>
								<UnsplashImage src="https://images.unsplash.com/photo-1500021804447-2ca2eaaaabeb?ixlib=rb-1.2.1&q=85&fm=jpg&crop=entropy&cs=srgb&dl=timj-310824-unsplash.jpg" />
							</Grid>
							<Grid item={true} md={6}>
								<UnsplashImage src="https://images.unsplash.com/photo-1531538512164-e6c51ea63d20?ixlib=rb-1.2.1&q=85&fm=jpg&crop=entropy&cs=srgb&dl=mimi-thian-737634-unsplash.jpg" />
							</Grid>
							<Grid item={true} md={6}>
								<UnsplashImage src="https://images.unsplash.com/photo-1531674842274-9563aa15686f?ixlib=rb-1.2.1&q=85&fm=jpg&crop=entropy&cs=srgb&dl=redcharlie-739534-unsplash.jpg" />
							</Grid>
							<Grid item={true} md={6}>
								<UnsplashImage src="https://images.unsplash.com/flagged/photo-1550946107-8842ae9426db?ixlib=rb-1.2.1&q=85&fm=jpg&crop=entropy&cs=srgb&dl=bonneval-sebastien-1389597-unsplash.jpg" />
							</Grid>
							<Grid item={true} md={6}>
								<UnsplashImage src="https://images.unsplash.com/photo-1497633762265-9d179a990aa6?ixlib=rb-1.2.1&q=85&fm=jpg&crop=entropy&cs=srgb&dl=kimberly-farmer-287677-unsplash.jpg" />
							</Grid>
							<Grid item={true} md={6}>
								<UnsplashImage src="https://images.unsplash.com/photo-1529390079861-591de354faf5?ixlib=rb-1.2.1&q=85&fm=jpg&crop=entropy&cs=srgb&dl=santi-vedri-707620-unsplash.jpg" />
							</Grid>
							<Grid item={true} md={6}>
								<UnsplashImage src="https://images.unsplash.com/photo-1519406596751-0a3ccc4937fe?ixlib=rb-1.2.1&q=85&fm=jpg&crop=entropy&cs=srgb&dl=jeffrey-hamilton-571428-unsplash.jpg" />
							</Grid>
							<Grid item={true} md={6}>
								<UnsplashImage src="https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?ixlib=rb-1.2.1&q=85&fm=jpg&crop=entropy&cs=srgb&dl=tim-gouw-69753-unsplash.jpg" />
							</Grid>
							<Grid item={true} md={6}>
								<UnsplashImage src="https://images.unsplash.com/photo-1484820540004-14229fe36ca4?ixlib=rb-1.2.1&q=85&fm=jpg&crop=entropy&cs=srgb&dl=markus-spiske-193031-unsplash.jpg" />
							</Grid>
						</UnsplashRepository>
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