import * as React from 'react'
import {Document as PDF, Page} from 'react-pdf'
import DocumentsService from '../services/DocumentsService'

import IDocument from '../interfaces/IDocument'

interface IProps {
    match: any
}

interface IState {
    pages: number
    url: string
}

class Document extends React.Component<IProps, IState> {
    public state = {
        pages: 0,
        url: "#"
    }

    public async componentWillMount() {
        const {match} = this.props

        const document: IDocument = await DocumentsService.getDocumentById(match.params.id)

        DocumentsService.download(document.url).then(response => {
            this.setState({
                url: response
            })
        })
    }

    public onDocumentLoadSuccess(pages) {
        this.setState({ pages })
    }
    
    public render(): JSX.Element {
        const {url, pages} = this.state
        return (
                (url === '#' && pages === 0)
                ? <p>{url}</p>
                : ( <PDF file={url} onLoadSuccess={this.onDocumentLoadSuccess}>
                        <Page pageNumber={pages} />
                    </PDF> )
        )
    }
}

export default Document
