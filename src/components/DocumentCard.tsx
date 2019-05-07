import * as React from 'react'
import { Page } from 'react-pdf'
import { Document as PDF } from 'react-pdf/dist/entry.webpack'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

import Grid from '@material-ui/core/Grid'
import Grow from '@material-ui/core/Grow'
import Typography from '@material-ui/core/Typography'
import DocumentsService from '../services/DocumentsService'

import IDocument from '../interfaces/IDocument'

interface IState {
	url: string
}

interface IProps {
	clicked: boolean
	id: string
	linked?:boolean
	name: string
	type: string
	url: string
	size?: any
	onClick?: any
	document?:IDocument
}

const Card = styled('div')`
	display: flex;
	flex-flow: row nowrap;
	box-shadow: 1px 2px 1px rgba(0,0,0,.2);
	border-radius: 4px;
	overflow: hidden;
	cursor: pointer;
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

class DocumentCard extends React.Component<IProps, IState> {
	public state = {
		url: ""
	}

	public async componentDidMount() {
		const { url } = this.props

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

	public render(): JSX.Element {
		const { clicked, type, name, id, size=6, linked=true } = this.props
		const { url } = this.state
		return (
			<Grow in={clicked} style={{ marginBottom: '2rem' }}>
				<Grid item={true} xs={12} md={size} onClick={this.props.onClick ? this.onClick : (() => false)}>
					{
						(type === 'pdf')
						? linked 
							? (
								<LinkButton to={`/document/${id}`}>
									<Card>
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
								</LinkButton>
							)
							: (
								<Card>
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
								<DownloadButton href={url} download={name}>
									<Card>
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
								</DownloadButton>
							)
							: (
								<Card>
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
				</Grid>
			</Grow>
		)
	}
}

export default DocumentCard
