import * as React from 'react'
import ICollection from '../interfaces/ICollection'
import DocumentsService from '../services/DocumentsService'
import Folder from './Folder'

import styled from 'styled-components'

interface IState {
    collections: ICollection[]
}

const GroupFolders = styled('section')`
    display: flex;
    margin: 2rem 0;
`

class Documents extends React.Component<{}, IState> {
    public state = {
        collections: [],
    }

    public async componentWillMount() {
        const collections: ICollection[] = await DocumentsService.getDocumentsByGroup('level')

        this.setState({ collections })
    }

    public renderMaterialFolders(): JSX.Element[] {
        const {collections} = this.state

        return collections.map((collection: ICollection, index: number) => (
            <Folder key={index} collection={collection} />
        ))
    }

    public render(): JSX.Element {
        return (
            <GroupFolders>
                { this.renderMaterialFolders() }
            </GroupFolders>
        )
    }
}

export default Documents