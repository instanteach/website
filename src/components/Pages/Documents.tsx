import * as React from 'react'
import styled from 'styled-components'

import ICollection from '../../interfaces/ICollection'
import IDocument from '../../interfaces/IDocument'
import DocumentsService from '../../services/DocumentsService'
import DocumentCard from '../DocumentCard'
import Folder from '../Folder'

import Chip from '@material-ui/core/Chip'
import Grid from '@material-ui/core/Grid'

interface IChip {
	key: number
	label: string
}

interface IPath {
	category: string | null
	folder: string | null
	level: string | null
}

interface IState {
	categories: string[]
	chips: IChip[]
	clicked: boolean
	collections: ICollection[]
	documents: IDocument[]
	folders: string[]
	path: IPath
}

const Chips = styled('div')`
	display: flex;
	flex-flow: row nowrap;
	width: 100%;
	margin-bottom: 1rem;
	padding: 1rem 1rem;
	overflow-x: auto;
	[class^=MuiChip] {
			margin-right: 1rem;
	}
`

const gridStyles = {
	alignContent: 'flex-start',
	minHeight: '85%'
}

class Documents extends React.Component<{}, IState> {
	public state = {
		categories: [],
		chips: [
			{ key: 0, label: 'Material' }
		],
		clicked: true,
		collections: [],
		documents: [],
		folders: [],
		path: {
			category: null,
			folder: null,
			level: null
		}
	}

	public async componentWillMount() {
		const collections: ICollection[] = await DocumentsService.getDocumentsByGroup('level')

		this.setState({ collections })
	}

	public componentDidUpdate() {
		const { clicked } = this.state

		if (!clicked) {
			setTimeout(() => this.setState({ clicked: true }), 150)
		}
	}

	public handleLevel = (level: string) => {

		const { chips, collections, path } = this.state
		const selected: ICollection = collections.filter((collection: ICollection) => collection.group === level)[0]
		let categories: string[] = []

		selected.documents.map((item: IDocument) => (
			categories = categories.filter((c: string) => c !== item.category).concat(item.category)
		))

		this.setState({
			categories,
			chips: chips.concat({ key: 1, label: level }),
			clicked: false,
			documents: selected.documents,
			folders: [],
			path: {
				...path,
				level
			}
		})
	}

	public handleCategory = (category: string) => {
		const { chips, documents, path } = this.state
		const selected: IDocument[] = documents.filter((doc: IDocument) => doc.level === path.level && doc.category === category)
		let folders: string[] = []

		documents.filter((item: IDocument) => item.folder !== "" && item.category === category).map((item: IDocument) => (
			folders = folders.filter((f: string) => f !== item.folder).concat(item.folder)
		))

		this.setState({
			chips: chips.concat({ key: 2, label: category }),
			clicked: false,
			documents: selected,
			folders,
			path: {
				...path,
				category
			}
		})
	}

	public handleFolder = (folder: string) => {
		const { chips, path } = this.state

		this.setState({
			chips: chips.concat({ key: 3, label: folder }),
			clicked: false,
			path: {
				...path,
				folder
			}
		})
	}

	public renderFolders(): JSX.Element[] {
		const { collections, categories, clicked, documents, path, folders } = this.state

		if (path.folder !== null) {
			return documents.filter((document: IDocument) => document.folder === path.folder).map((document: IDocument, index: number): JSX.Element => {
				return (
					<DocumentCard
						key={index}
						id={document.id}
						name={document.name}
						type={document.type}
						url={document.url}
						clicked={clicked} />
				)
			})
		}
		else if (path.category !== null) {
			if (folders.length > 0) {
				return folders.map((folder: string, index: number): JSX.Element => <Folder key={index} name={folder} clicked={clicked} onClick={this.handleFolder} />)
			}
			else {
				return documents.map((document: IDocument, index: number): JSX.Element => {
					return (
						<DocumentCard
							key={index}
							id={document.id}
							name={document.name}
							type={document.type}
							url={document.url}
							clicked={clicked} />
					)
				})
			}
		}
		else if (path.level !== null) {
			return categories.map((name: string, index: number) => (
				<Folder key={index} name={name} clicked={clicked} onClick={this.handleCategory} />
			))
		}
		else {
			return collections.map((collection: ICollection, index: number) => (
				<Folder key={index} name={collection.group} clicked={clicked} onClick={this.handleLevel} />
			))
		}
	}

	public async removeElement(data) {
		const { key, label } = data
		const { categories, chips, path } = this.state

		if (path.folder === label) {
			this.setState({
				chips: chips.filter(chip => chip.key < key),
				clicked: false,
				path: {
					...path,
					folder: null
				}
			})
		}
		else if (categories.filter(category => category === label).length > 0) {
			const collections: ICollection[] = await DocumentsService.getDocumentsByGroup('level')

			const selected: ICollection = collections.filter((collection: ICollection) => collection.group === path.level)[0]
			let newCategories: string[] = []

			selected.documents.map((item: IDocument) => (
				newCategories = newCategories.filter((c: string) => c !== item.category).concat(item.category)
			))

			this.setState({
				categories: newCategories,
				chips: chips.filter(chip => chip.key < key),
				clicked: false,
				documents: selected.documents,
				folders: [],
				path: {
					...path,
					category: null,
					folder: null
				}
			})
		}
		else {
			this.setState({
				categories: [],
				chips: [{ key: 0, label: 'Material' }],
				clicked: false,
				documents: [],
				folders: [],
				path: {
					category: null,
					folder: null,
					level: null
				}
			})
		}
	}

	public handleDelete = (data) => () => {
		this.removeElement(data)
	}

	public render(): JSX.Element {
		const { chips } = this.state
		return (
			<>
				<Grid container={true} spacing={16}>
					<Chips>
						{
							chips.map((chip: IChip): JSX.Element => (
								<Chip
									key={chip.key}
									label={chip.label.toUpperCase()}
									onDelete={this.handleDelete(chip)} />
							))
						}
					</Chips>
				</Grid>
				<Grid container={true} spacing={16} style={gridStyles}>
					{this.renderFolders()}
				</Grid>
			</>
		)
	}
}

export default Documents