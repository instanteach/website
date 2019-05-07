import * as React from 'react'
import styled from 'styled-components'

import {Button, Dialog, DialogActions, DialogContent,
	DialogContentText, DialogTitle, Grid, TextField, Typography} from '@material-ui/core'
import SettingsIcon from '@material-ui/icons/Settings'
import DocumentCard from '../DocumentCard'

import IDocument from '../../interfaces/IDocument'

import ClassroomService from '../../services/ClassroomService'
import DocumentsService from '../../services/DocumentsService'
import MaterialService from '../../services/MaterialService'
import UserService from '../../services/UserService'

interface IState {
	classroom:Promise<object> | object
	classroomDocuments:any[]
	documentSelected:IDocument
	filter:string
	forbidden:boolean
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

const AssignMaterialContent = styled('div')`
	margin-top: 1rem;
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
			id: "",
			name: "",
			students: 0,
			userId: "",
		},
		classroomDocuments: [""],
		documentSelected: {
			category:"",
			folder:"",
			id:"",
			level:"",
			name:"",
			type:"",
			url:""
		},
		filter: "",
		forbidden: false,
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
			const classroom = await ClassroomService.get(classroomId)
			const user = await UserService.get(classroom.userId)
			const materialsDB = await MaterialService.getByClassroomId(classroomId)
			const repository:IDocument[] = await DocumentsService.getlAllDocuments()

			if(classroom.userId !== session.uid && !session.isAdmin) {
				this.setState({ forbidden: true })
				return
			}

			materialsDB.map((materialDB:any) => {
				repository.map((mR:IDocument) => {
					if(materialDB.materialId === mR.id) {
						materials.push(mR)
						classroomDocuments.push(mR.id)
					}
				})
			})

			this.setState({ classroom, classroomDocuments, materials, user: user ? user : {name:""}, repository })
		})()
	}

	public handleClose = () => {
		this.setState({ open: !this.state.open })
	}

	public handleAssignMaterial = () => {
		this.setState({ openAssignMaterial: !this.state.openAssignMaterial })
	}

	public search = event => {
		this.setState({ filter: event.target.value })
	}

	public selectDocumentToAssign = (documentSelected:IDocument) => {
		this.setState({
			documentSelected,
			select: !this.state.select
		})
	}

	public assignMaterialToClassroom = () => {
		(async () => {
			const {classroomDocuments, documentSelected, materials} = this.state
			const {match} = this.props
			const material = await MaterialService.assign(match.params.id, documentSelected)
			if(material.error === "") {
				this.setState({
					classroomDocuments: classroomDocuments.concat(material.data.materialId),
					materials: materials.concat(material.data),
					openAssignMaterial: false,
					select: false })
			}
		})()
	}

	public requestMaterial = event => {
		event.preventDefault()
	}

	public render() {
		const {classroom, documentSelected, filter, forbidden, materials, open, openAssignMaterial, repository, user, select, classroomDocuments} = this.state
		const {history, session} = this.props

		return (
			<>
			<Grid container={true}>
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
									session.isAdmin
									? <Button variant="raised" color="primary" onClick={this.handleAssignMaterial}>Assign Material</Button>
									: (
										<>
										<SettingsIcon style={{ marginRight: '1rem' }} />
										<Button variant="raised" color="primary" disabled={true} onClick={this.handleClose}>Request Material</Button>
										</>
									)
								}
							</Grid>
						) : null
					}
				</Grid>
				<Grid container={true} item={true} xs={12} spacing={16} style={gridStyles}>
				{
					materials.map((material: IDocument,index:number): JSX.Element => (
						<DocumentCard
							key={index}
							id={material.id}
							name={material.name}
							type={material.type}
							url={material.url}
							clicked={true} />
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
			<Dialog open={openAssignMaterial} onClose={this.handleAssignMaterial} arial-labelledby="assign-dialog">
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
			</>
		)
	}
}

export default Classroom