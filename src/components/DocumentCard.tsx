import * as React from 'react'
import { Page } from 'react-pdf'
import { Document as PDF } from 'react-pdf/dist/entry.webpack'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import Grid from '@material-ui/core/Grid'
import Grow from '@material-ui/core/Grow'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import DeleteIcon from '@material-ui/icons/Delete'
import DocumentsService from '../services/DocumentsService'
import MaterialService from '../services/MaterialService'

import IDocument from '../interfaces/IDocument'
import store from '../state/store'

interface IState {
	url: string
	isRemoved: boolean
	isOpen: boolean
}

interface IProps {
	clicked: boolean
	id: string
	linked?:boolean
	menu?:boolean
	name: string
	type: string
	url: string
	size?: any
	isNew?: boolean
	onClick?: any
	document?:IDocument
	materialId?: string
	userId?: string
}

const Card = styled('div')`
	position:relative;
	display: flex;
	flex-flow: row nowrap;
	box-shadow: 1px 2px 1px rgba(0,0,0,.2);
	border-radius: 4px;
	overflow: hidden;
	cursor: pointer;
	&.is_new {
		&::before {
			content: "NEW";
			position: absolute;
			top: 0;
			right: -2rem;
			padding: .7rem;
			width: 100px;
			color: white;
			text-align: center;
			background-color: #4CAF50;
			z-index: 10;
			transform: rotate(45deg);
			font-size: .8rem;
			box-shadow: 0 0 20px 0px #8BC34A;
		}
	}
`

const CardTypeFile = styled('div')`
	display: flex;
	justify-content: center;
	align-items: center;
	width: 30%;
	max-height: 120px;
	overflow: hidden;
	border-right: 1px solid #ddd;
	@media screen and (min-width:900px) {
		width: 25%;
	}
`

const CardContent = styled('div')`
	display: flex;
	position: relative;
	flex-flow: column nowrap;
	padding: 1rem;
	padding-bottom: 2rem;
	height: 100px;
	width: 70%;
	@media screen and (min-width:900px) {
		width: 75%;
	}
`

const LinkButton = styled(Link)`
  text-decoration: none
`

const DownloadButton = styled('a')`
  text-decoration: none
`

const PDFcontainer = styled(Grid)`
	.react-pdf__Page {
		position: relative;
		overflow: hidden;
		height: 120px;
		max-height: 120px;
		color: white;
		font-size: 0;
		.react-pdf__Page__canvas {
			position: absolute;
			top: 0;
			left: 0;
		}
	}
`

const MenuButton = styled(IconButton)`
	position: absolute !important;
	top: auto !important;
	left: auto !important;
	right: 5px !important;
	bottom: 5px !important;
`

class DocumentCard extends React.Component<IProps, IState> {
	public state = {
		isOpen: false,
		isRemoved: false,
		url: ""
	}

	public async componentDidMount() {
		const { url, materialId, isNew, userId } = this.props

		if(isNew) {
			if(userId === store.getState().user.id) {
				await MaterialService.read(materialId)
			}
			else {
				console.log("Unauthorized")
			}
		}

		DocumentsService.download(url).then(response => {
			this.setState({
				url: response
			})
		})
	}

	public onClick = (e) => {
		e.preventDefault()
		this.props.onClick(this.props.document)
	}

	public removeDocumentFromDatabase = (e:any) => {
		e.preventDefault()
		const {id} = this.props
		this.setState({ isOpen: false, isRemoved: DocumentsService.remove(id) })
	}

	public toggleConfirmationModal = (e:any) => {
		e.preventDefault()
		this.setState({ isOpen: !this.state.isOpen })
	}

	public render(): JSX.Element {
		const { clicked, type, name, id, size=6, linked=true, menu=false, isNew=false } = this.props
		const { url, isOpen, isRemoved } = this.state
		const user = store.getState().user
		return (
			<Grow in={clicked} style={{ marginBottom: '2rem' }}>
				<Grid item={true} xs={12} md={size} onClick={this.props.onClick ? this.onClick : (() => false)}>
					{
						(type === 'pdf')
						? linked 
							? (
								<LinkButton to={`/document/${id}`} style={{display: isRemoved ? 'none' : 'auto'}}>
									<Card className={`${isNew ? 'is_new' : ''}`}>
										<CardTypeFile style={{color: 'white', fontSize: 0}}>
											<PDFcontainer item={true} xs={12}>
												<PDF file={`https://cors-anywhere.herokuapp.com/${url}`}>
													<Page pageNumber={1} scale={0.2185} />
													</PDF>
											</PDFcontainer>
										</CardTypeFile>
										<CardContent>
											<Typography variant="subheading" component="h3">{name}</Typography>
										</CardContent>
										{
											menu && user.isAdmin
											? (
												<MenuButton onClick={this.toggleConfirmationModal}>
														<DeleteIcon />
													</MenuButton>
											) : null
										}
									</Card>
								</LinkButton>
							)
							: (
								<Card className={`${isNew ? 'is_new' : ''}`}>
									<CardTypeFile style={{color: 'white', fontSize: 0}}>
										<PDFcontainer item={true} xs={12}>
											<PDF file={`https://cors-anywhere.herokuapp.com/${url}`}>
												<Page pageNumber={1} scale={0.2185} />
												</PDF>
										</PDFcontainer>
									</CardTypeFile>
									<CardContent>
										<Typography variant="subheading" component="h3">{name}</Typography>
									</CardContent>
								</Card>
							)
						: linked
							? (
								<DownloadButton href={url} download={name} style={{display: isRemoved ? 'none' : 'auto'}}>
									<Card className={`${isNew ? 'is_new' : ''}`}>
										{
										<CardTypeFile style={
										(type === 'doc' || type === 'docx')
											? { backgroundColor: '#1565C0' }
											: (type === 'jpg' || type === 'jpeg' || type === 'png')
												? { backgroundColor: '#E0E0E0', color: '#888' }
												: (type === 'pptx')
													? { backgroundColor: '#FFC107' }
													: {}
										}>{type.toUpperCase()}</CardTypeFile>
										}
										<CardContent>
											<Typography variant="subheading" component="h3">{name}</Typography>
										</CardContent>
										{
											menu && user.isAdmin
											? (
												<MenuButton onClick={this.toggleConfirmationModal}>
														<DeleteIcon />
													</MenuButton>
											) : null
										}
									</Card>
								</DownloadButton>
							)
							: (
								<Card className={`${isNew ? 'is_new' : ''}`}>
									{
									<CardTypeFile style={
									(type === 'doc' || type === 'docx')
										? { backgroundColor: '#1565C0' }
										: (type === 'jpg' || type === 'jpeg' || type === 'png')
											? { backgroundColor: '#E0E0E0', color: '#888' }
											: (type === 'pptx')
												? { backgroundColor: '#FFC107' }
												: {}
									}>{type.toUpperCase()}</CardTypeFile>
									}
									<CardContent>
										<Typography variant="subheading" component="h3">{name}</Typography>
									</CardContent>
								</Card>
							)
					}
					<Dialog open={isOpen} onClose={this.toggleConfirmationModal} arial-labelledby="form-dialog-title">
						<DialogTitle id="form-dialog-title">Delete Document</DialogTitle>
						<DialogContent>
							<DialogContentText>
								Are you sure about you want to remove this document?
							</DialogContentText>
						</DialogContent>
						<DialogActions>
							<Button type="button" onClick={this.toggleConfirmationModal} color="default">No, cancel</Button>
							<Button type="button" color="primary" onClick={this.removeDocumentFromDatabase}>Yes, I'm sure</Button>
						</DialogActions>
					</Dialog>
				</Grid>
			</Grow>
		)
	}
}

export default DocumentCard
