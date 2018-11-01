import * as React from 'react'

import ICollection from '../interfaces/ICollection'
import IDocument from '../interfaces/IDocument';
import DocumentsService from '../services/DocumentsService'
import DocumentCard from './DocumentCard'
import Folder from './Folder'

import Grid from '@material-ui/core/Grid'

interface IPath {
    category: string | null
    folder?: string | null
    level: string | null
}

interface IState {
    categories: string[]
    clicked: boolean
    collections: ICollection[]
    documents: IDocument[]
    folders: string[]
    path: IPath
}

const gridStyles = {
    alignContent: 'flex-start',
    height: '90%'
}

class Documents extends React.Component<{}, IState> {
    public state = {
        categories: [],
        clicked: true,
        collections: [],
        documents: [],
        folders: [],
        path: {
            category: null,
            level: null
        }
    }

    public async componentWillMount() {
        const collections: ICollection[] = await DocumentsService.getDocumentsByGroup('level')

        this.setState({ collections })
    }

    public componentDidUpdate() {
        const {clicked} = this.state

        if(!clicked) {
            setTimeout(() => this.setState({ clicked: true }), 150)
        }
    }

    public handleLevel = (level: string) => {

        const {collections, path} = this.state
        const selected: ICollection = collections.filter((collection: ICollection) => collection.group === level)[0]
        let categories: string[] = []

        selected.documents.map((item: IDocument) => (
            categories = categories.filter((c: string) => c !== item.category).concat(item.category)
        ))

        this.setState({
            categories,
            clicked: false,
            documents: selected.documents,
            path: {
                ...path,
                level
            }
        })
    }

    public handleCategory = (category: string) => {
        const {documents, path} = this.state
        const selected: IDocument[] = documents.filter((doc: IDocument) => doc.level === path.level && doc.category === category)

        this.setState({
            clicked: false,
            documents: selected,
            path: {
                ...path,
                category
            }
        })
    }

    public renderFolders(): JSX.Element[] {
        const {collections, categories, clicked, documents, path} = this.state

        if (path.category !== null) {
            return documents.map((document: IDocument, index: number): JSX.Element => {
                return (
                    <DocumentCard
                        key={index}
                        name={document.name}
                        type={document.type}
                        url={document.url}
                        clicked={clicked} />
                )
            })
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

    public render(): JSX.Element {
        return (
            <Grid container={true} spacing={16} style={gridStyles}>
                { this.renderFolders() }
            </Grid>
        )
    }
}

export default Documents