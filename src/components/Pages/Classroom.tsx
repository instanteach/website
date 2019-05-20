import * as React from 'react'
import {Link, Redirect} from 'react-router-dom'
import styled from 'styled-components'

import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import FormControl from '@material-ui/core/FormControl'
import Grid from '@material-ui/core/Grid'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import OutlinedInput from '@material-ui/core/OutlinedInput'
import Select from '@material-ui/core/Select'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import CheckOutlinedIcon from '@material-ui/icons/CheckOutlined'
import DeleteIcon from '@material-ui/icons/Delete'
import SettingsIcon from '@material-ui/icons/Settings'
import TimelineIcon from '@material-ui/icons/Timeline'
import DocumentCard from '../DocumentCard'

import IClassroom from '../../interfaces/IClassroom'
import IDocument from '../../interfaces/IDocument'
import IMaterial from '../../interfaces/IMaterial'

import ClassroomService from '../../services/ClassroomService'
import DocumentsService from '../../services/DocumentsService'
import MaterialService from '../../services/MaterialService'
import UserService from '../../services/UserService'

interface IState {
	classroom:Promise<object> | IClassroom
	classroomDocuments:any[]
	del:boolean
	destroyed:boolean
	documentSelected:IDocument
	edit: boolean
	error: string
	filter:string
	forbidden:boolean
	form: object
	images: object[]
	materials:IDocument[]
	open:boolean
	openAssignMaterial:boolean
	repository:IDocument[]
	user:object
	select:boolean
}

interface IProps {
	history?:any
	match:any
	session?:any
}

const CustomLink = styled(Link)`
	text-decoration: none;
	color: inherit;
`
const AssignMaterialContent = styled('div')`
	margin-top: 1rem;
`
const UnsplashRepository = styled(Grid)`
	height: 100%;
	max-height: 500px;
	overflow-y: overlay;
	& > div {
		position:relative;
		height: 100px;
		margin-bottom: .4rem;
	}
`
const UnsplashImage = styled('img')`
	position: absolute;
	top: 0:
	left: 0;
	width: calc(100% - .4rem);
	height: 100px;
	max-height: 100px;
	cursor: pointer;
`
const UnsplashImageChecked = styled('div')`
	display: flex;
	position: absolute;
	top: .2rem;
	width: calc(100% - .4rem);
	height: 100%;
	background-color: rgba(0,0,0,0.5);
	color: white;
	justify-content: center;
	align-items: center;
`

const gridStyles = {
	alignContent: 'flex-start',
	marginTop: '2rem',
	minHeight: '85%'
}

class Classroom extends React.Component<IProps, IState> {
	public state = {
		classroom: {
			age: 0,
			days: 0,
			id: "",
			level: "",
			name: "",
			students: 0,
			thumbnail: "",
			time: "",
			userId: ""
		},
		classroomDocuments: [""],
		del: false,
		destroyed: false,
		documentSelected: {
			category:"",
			folder:"",
			id:"",
			level:"",
			name:"",
			type:"",
			url:""
		},
		edit: false,
		error: "",
		filter: "",
		forbidden: false,
		form: {
			level: "",
			time: ""
		},
		images: [
			{
				selected: false,
				url: "https://images.unsplash.com/photo-1549354324-290af3126793?ixlib=rb-1.2.1&q=85&fm=jpg&crop=entropy&cs=srgb&dl=michael-prewett-1346961-unsplash.jpg",
			},
			{
				selected: false,
				url: "https://images.unsplash.com/photo-1500021804447-2ca2eaaaabeb?ixlib=rb-1.2.1&q=85&fm=jpg&crop=entropy&cs=srgb&dl=timj-310824-unsplash.jpg",
			},
			{
				selected: false,
				url: "https://images.unsplash.com/photo-1531538512164-e6c51ea63d20?ixlib=rb-1.2.1&q=85&fm=jpg&crop=entropy&cs=srgb&dl=mimi-thian-737634-unsplash.jpg",
			},
			{
				selected: false,
				url: "https://images.unsplash.com/photo-1531674842274-9563aa15686f?ixlib=rb-1.2.1&q=85&fm=jpg&crop=entropy&cs=srgb&dl=redcharlie-739534-unsplash.jpg",
			},
			{
				selected: false,
				url: "https://images.unsplash.com/flagged/photo-1550946107-8842ae9426db?ixlib=rb-1.2.1&q=85&fm=jpg&crop=entropy&cs=srgb&dl=bonneval-sebastien-1389597-unsplash.jpg",
			},
			{
				selected: false,
				url: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?ixlib=rb-1.2.1&q=85&fm=jpg&crop=entropy&cs=srgb&dl=kimberly-farmer-287677-unsplash.jpg",
			},
			{
				selected: false,
				url: "https://images.unsplash.com/photo-1529390079861-591de354faf5?ixlib=rb-1.2.1&q=85&fm=jpg&crop=entropy&cs=srgb&dl=santi-vedri-707620-unsplash.jpg",
			},
			{
				selected: false,
				url: "https://images.unsplash.com/photo-1519406596751-0a3ccc4937fe?ixlib=rb-1.2.1&q=85&fm=jpg&crop=entropy&cs=srgb&dl=jeffrey-hamilton-571428-unsplash.jpg",
			},
			{
				selected: false,
				url: "https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?ixlib=rb-1.2.1&q=85&fm=jpg&crop=entropy&cs=srgb&dl=tim-gouw-69753-unsplash.jpg",
			},
			{
				selected: false,
				url: "https://images.unsplash.com/photo-1484820540004-14229fe36ca4?ixlib=rb-1.2.1&q=85&fm=jpg&crop=entropy&cs=srgb&dl=markus-spiske-193031-unsplash.jpg",
			},
		],
		materials: Array(),
		open: false,
		openAssignMaterial: false,
		repository: Array(),
		select:false,
		user: {
			name: ""
		}
	}

	public componentDidMount() {
		(async () => {
			const materials = Array()
			const classroomDocuments = Array()
			const {session, match} = this.props
			const classroomId = match.params.id
			const classroom:any = await ClassroomService.get(classroomId)
			const user = await UserService.get(classroom.userId)
			const materialsOfTheClassroom = await MaterialService.getByClassroomId(classroomId)
			const repository:IDocument[] = await DocumentsService.getlAllDocuments()

			if(classroom.userId !== session.uid && !session.isAdmin) {
				this.setState({ forbidden: true })
				return
			}

			materialsOfTheClassroom.map((material:IMaterial) => {
				repository.map((mR:IDocument) => {
					if(material.materialId === mR.id) {
						materials.push({...material, document: mR})
						classroomDocuments.push(mR.id)
					}
				})
			})

			this.setState({
				classroom,
				classroomDocuments,
				form: {
					level: classroom.level,
					time: classroom.time
				},
				materials,
				repository,
				user: user ? user : {name:""}
			})
		})()
	}

	public handleChange = field => event => {
		event.preventDefault()
		this.setState({
			...this.state,
			form: {
				...this.state.form,
				[field]: event.target.value
			}
		})
	}

	public setThumbnail = index => event => {
		const {images} = this.state
		const imgs:object[] = Array()

		images.map((image, indx) => imgs.push({
			selected: index === indx,
			url: image.url
		}))

		this.setState({
			error: "",
			images: imgs
		})
	}

	public handleClose = () => {
		this.setState({ open: !this.state.open })
	}

	public edit = () => {
		this.setState({ edit: !this.state.edit })
	}

	public handleAssignMaterial = () => {
		this.setState({ openAssignMaterial: !this.state.openAssignMaterial })
	}

	public search = event => {
		this.setState({ filter: event.target.value })
	}

	public toggleConfirmationModal = event => {
		this.setState({ del: !this.state.del })
	}

	public update = event => {
		(async () => {
			event.preventDefault()
			const {classroom, images} = this.state
			const {session} = this.props
			const image = images.filter(img => img.selected)[0]

			if(classroom.userId === session.uid) {
				const form = event.target

				if(form.level.value === "" || form.time.value === "") {
					return this.setState({
						error: 'All fields are required'
					})
				}

				if(image) {
					const data = {
						age: form.age.value,
						days: form.days.value,
						level: form.level.value,
						name: form.name.value,
						students: form.students.value,
						thumbnail: image.url,
						time: form.time.value
					}
					
					const response = await ClassroomService.update(classroom.id, data)
					if(response.ok) {
						this.setState({
							classroom: {
								...classroom,
								...data
							},
							edit: false
						})
					}
					else {
						this.setState({
							error: "Ups! Has occurred an error"
						})
					}
				}
				else { 
					this.setState({
						error: "You have to select an image 🖼"
					})
				}
			}
			else {
				this.setState({
					error: "Forbidden. You don't have permissions."
				})
			}
		})()
	}

	public remove = event => {
		(async () => {
			const {session} = this.props
			const {classroom} = this.state

			if(session.uid === classroom.userId) {
				const response = await ClassroomService.remove(classroom.id)
				if(response.ok) {
					this.setState({
						destroyed: true
					})
				}
			}
		})()
	}

	public selectDocumentToAssign = (documentSelected:IDocument) => {
		this.setState({
			documentSelected,
			select: !this.state.select
		})
	}

	public assignMaterialToClassroom = () => {
		(async () => {
			const {classroom, classroomDocuments, documentSelected, materials} = this.state
			const {match} = this.props
			const material = await MaterialService.assign(match.params.id, classroom.userId, documentSelected)
			if(material.error === "") {
				this.setState({
					classroomDocuments: classroomDocuments.concat(material.data.materialId),
					materials: materials.concat(material.data),
					openAssignMaterial: false,
					select: false
				})
			}
		})()
	}

	public requestMaterial = event => {
		event.preventDefault()
	}

	public render() {
		const {classroom, documentSelected, filter, forbidden, materials, open, openAssignMaterial, repository, user} = this.state
		const {del, destroyed, edit, error, images, select, classroomDocuments} = this.state
		const {history, session} = this.props
		const mediaQuery = window.matchMedia("(min-width:700px)")

		return (
			<>
			<Grid container={true}>
			{
			destroyed
			? <Redirect to="/my-students" />
			: null
			}
			{
			forbidden
			? <Grid item={true}><Typography>You don't have permissions to be here.</Typography></Grid>
			: (
				<>
				<Grid container={true} item={true} alignItems="center">
					<Grid container={true} item={true} xs={6}>
						<Typography variant="title">{classroom.name}</Typography>
					</Grid>
					{
						!history.location.pathname.includes('/classrooms/user/')
						? (
							<Grid container={true} item={true} xs={6} justify="flex-end" alignItems="center">
								{
									session.isAdmin && classroom.userId !== session.uid
									? <Button variant="raised" color="primary" onClick={this.handleAssignMaterial}>Assign Material</Button>
									: (
										<>
										<SettingsIcon onClick={this.edit} style={{ marginRight: '1rem', cursor: 'pointer' }} />
										<DeleteIcon onClick={this.toggleConfirmationModal} style={{ marginRight: '1rem', cursor: 'pointer' }} />
										<TimelineIcon style={{ marginRight: '1rem', cursor: 'pointer' }} />
										<CustomLink to="/material-generator"><Button variant="raised" color="primary">Request Material</Button></CustomLink>
										</>
									)
								}
							</Grid>
						) : null
					}
				</Grid>
				{
					classroom.name.length > 0 && materials.length === 0
					? (
						<Grid container={true} item={true} xs={12}>
							<Typography>This classrooms doesn't have assigned materials yet.</Typography>
						</Grid>
					) : null
				}
				<Grid container={true} item={true} xs={12} spacing={16} style={gridStyles}>
				{
					materials.map((material: IMaterial,index:number) => (
						material.document
						? <DocumentCard
								key={index}
								id={material.document.id}
								name={material.document.name}
								type={material.document.type}
								url={material.document.url}
								isNew={material.isNew}
								materialId={material.id}
								userId={material.userId}
								clicked={true} />
						: null
					))
				}
				</Grid>
				</>
			)
			}
			</Grid>
			<Dialog open={open} onClose={this.handleClose} arial-labelledby="form-dialog-title">
				<form onSubmit={this.requestMaterial}>
				<DialogTitle id="form-dialog-title">Request</DialogTitle>
				<DialogContent>
					<DialogContentText>
						The classrooms are groups by students to make a study plan with our digital materials. Set them a name and how many students it has.
					</DialogContentText>
					<TextField autoFocus={true} margin="normal" id="name" name="name" label="Classroom name" type="text" fullWidth={true} required={true} />
					<TextField margin="normal" id="students" name="students" label="Students" type="number" fullWidth={true} inputProps={{min:1}} required={true} />
					<TextField margin="normal" id="age" name="age" label="Average age" type="number" fullWidth={true} inputProps={{min:1}} required={true} />
				</DialogContent>
				<DialogActions>
					<Button type="button" onClick={this.handleClose} color="default">Cancel</Button>
					<Button type="submit" color="primary">Add</Button>
				</DialogActions>
				</form>
			</Dialog>
			<Dialog open={openAssignMaterial} onClose={this.handleAssignMaterial} arial-labelledby="assign-dialog" fullScreen={!mediaQuery.matches}>
				<DialogTitle id="assign-dialog">Assign Material</DialogTitle>
				<DialogContent>
					<DialogContentText>
						Look for the material to assign to {user.name} in the classroom {classroom.name} and notify by email
						<br />
					</DialogContentText>
					<AssignMaterialContent>
						<TextField
							autoFocus={true}
							variant="outlined"
							name="search"
							id="search"
							label="Material's Name"
							fullWidth={true}
							value={filter}
							onChange={this.search}
							style={{ marginBottom: '1rem' }} />
						<Grid container={true} item={true} xs={12}>
						{
						repository
						.filter((document:IDocument) => !classroomDocuments.some(d => d === document.id))
						.map((document:IDocument, index:number) => {
							if(select) {
								return documentSelected.id === document.id
								? (
									<Grid item={true} xs={12} key={index}>
										<DocumentCard
											id={document.id}
											document={document}
											name={document.name}
											type={document.type}
											url={document.url}
											size={12}
											linked={false}
											clicked={true}
											onClick={this.selectDocumentToAssign} />
									</Grid>
								) : null
							}
							else {
								if(document.name.toLowerCase().search(filter.toLowerCase()) !== -1) {
									return (
										<Grid item={true} xs={12} key={index}>
											<DocumentCard
												id={document.id}
												document={document}
												name={document.name}
												type={document.type}
												url={document.url}
												size={12}
												linked={false}
												clicked={true}
												onClick={this.selectDocumentToAssign} />
										</Grid>
									)
								}
								else {
									return null
								}
							}
						})
						}
						</Grid>
					</AssignMaterialContent>
				</DialogContent>
				<DialogActions>
					<Button type="button" onClick={this.handleAssignMaterial} color="default">Cancel</Button>
					<Button type="submit" color="primary" onClick={this.assignMaterialToClassroom} disabled={!select}>Assign</Button>
				</DialogActions>
			</Dialog>

			<Dialog open={edit} onClose={this.edit} arial-labelledby="form-dialog-title" fullWidth={true} fullScreen={!mediaQuery.matches}>
				<form onSubmit={this.update}>
				<DialogTitle id="form-dialog-title">Update Classroom</DialogTitle>
				<DialogContent>
					<DialogContentText style={{ marginBottom: '1rem' }}>
						The classrooms are groups by students to make a study plan with our digital materials. Set them a name and how many students it has.
					</DialogContentText>
					{
						error
						? (
							<Grid item={true} xs={12}>
								<Typography color="error">{error}</Typography>
							</Grid>
						)
						: null
					}
					<Grid container={true} spacing={16}>
						<Grid item={true} container={true} xs={12} md={5} alignContent="flex-start" id="fields">
							<Grid item={true} xs={12}>
								<TextField
									variant="outlined"
									autoFocus={true}
									margin="normal"
									id="name"
									name="name"
									label="Classroom name"
									type="text"
									defaultValue={classroom.name}
									fullWidth={true}
									required={true} />
							</Grid>
							<Grid item={true} xs={12}>
								<TextField
									variant="outlined"
									margin="normal"
									id="students"
									name="students"
									label="Students"
									type="number"
									defaultValue={classroom.students}
									fullWidth={true}
									inputProps={{min:1}}
									required={true} />
							</Grid>
							<Grid item={true} xs={12}>
								<TextField
									variant="outlined"
									margin="normal"
									id="age"
									name="age"
									label="Average age"
									type="number"
									defaultValue={classroom.age}
									fullWidth={true}
									inputProps={{min:1}}
									required={true} />
							</Grid>
							<Grid item={true} xs={12} style={{marginTop: '1rem'}}>
								<FormControl fullWidth={true}>
									<InputLabel htmlFor="level" style={{marginLeft: '1rem'}}>Classroom Level</InputLabel>
									<Select
										required={true}
										fullWidth={true}
										value={this.state.form.level}
										onChange={this.handleChange('level')}
										input={
											<OutlinedInput
												labelWidth={250}
												id="level"
												name="level" />
										}>
										<MenuItem value="Elementary">Elementary ( learning the alphabet, numbers etc...)</MenuItem>
										<MenuItem value="Beginner">Beginner</MenuItem>
										<MenuItem value="Pre-intermediate">Pre-intermediate</MenuItem>
										<MenuItem value="Intermediate">Intermediate</MenuItem>
										<MenuItem value="Upper-Intermediate">Upper-Intermediate</MenuItem>
										<MenuItem value="Advanced">Advanced</MenuItem>
									</Select>
								</FormControl>
							</Grid>
							<Grid item={true} xs={12} style={{marginTop: '1rem'}}>
								<FormControl fullWidth={true}>
									<InputLabel htmlFor="time" style={{marginLeft: '1rem'}}>Average class duration</InputLabel>
									<Select
										fullWidth={true}
										value={this.state.form.time}
										onChange={this.handleChange('time')}
										input={
											<OutlinedInput
												labelWidth={250}
												id="time"
												name="time" />
										}>
										<MenuItem value="1 hour or less">1 hour or less</MenuItem>
										<MenuItem value="1.5 hours">1.5 hours</MenuItem>
										<MenuItem value="2 hours">2 hours</MenuItem>
										<MenuItem value="3 hours">3 hours</MenuItem>
									</Select>
								</FormControl>
							</Grid>
							<Grid item={true} xs={12}>
								<TextField
									variant="outlined"
									margin="normal"
									id="days"
									name="days"
									label="Times a week"
									type="number"
									defaultValue={classroom.days}
									inputProps={{min:1}}
									fullWidth={true}
									required={true} />
							</Grid>
						</Grid>
						<UnsplashRepository item={true} container={true} spacing={8} xs={12} md={7} id="images">
						{
							images.map((image, index) => (
								<Grid key={index} item={true} md={6}>
									<UnsplashImage src={image.url} onClick={this.setThumbnail(index)} />
									{
										image.selected ? <UnsplashImageChecked><CheckOutlinedIcon /></UnsplashImageChecked> : null
									}
								</Grid>
							))
						}
						</UnsplashRepository>
					</Grid>
				</DialogContent>
				<DialogActions>
					<Button type="button" onClick={this.edit} color="default">Cancel</Button>
					<Button type="submit" color="primary">Update</Button>
				</DialogActions>
				</form>
			</Dialog>
			<Dialog open={del} onClose={this.toggleConfirmationModal} arial-labelledby="form-dialog-title">
				<DialogTitle id="form-dialog-title">Delete Classroom</DialogTitle>
				<DialogContent>
					<DialogContentText>
						Are you sure about you want to remove this classroom for ever? ⛔
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button type="button" onClick={this.toggleConfirmationModal} color="default">No, cancel</Button>
					<Button type="button" color="primary" onClick={this.remove}>Yes, I'm sure</Button>
				</DialogActions>
			</Dialog>
			</>
		)
	}
}

export default Classroom