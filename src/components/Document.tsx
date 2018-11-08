import * as React from 'react'
import {Page} from 'react-pdf'
import {Document as PDF} from 'react-pdf/dist/entry.webpack'
import styled from 'styled-components'
import DocumentsService from '../services/DocumentsService'

import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'

import IDocument from '../interfaces/IDocument'

interface IProps {
    match: any
}

interface IState {
    numPages: number
    page: number
    url: string
}

const PDFcontainer = styled(Grid)`
    .react-pdf__Page {
        display: flex;
        justify-content: center;
    }
`

class Document extends React.Component<IProps, IState> {
    public state = {
        numPages: 1,
        page: 1,
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

    public onDocumentLoadSuccess = ({ numPages }) => {
        this.setState({ numPages })
    }
    
    public render(): JSX.Element {
        const {url, numPages, page} = this.state
        let pages: number[] = []

        for(let i=page; i <= numPages; i++) {
            pages = pages.concat(i)
        }
        
        return (
                (url === '#')
                ? <p>Loading PDF...</p>
                : (
                <Grid container={true} spacing={16}>
                    <PDFcontainer item={true} xs={12}>
                        <PDF file={`https://cors-anywhere.herokuapp.com/${url}`} onLoadSuccess={this.onDocumentLoadSuccess}>
                            { pages.map(item => <Page key={item} pageNumber={item} />) }
                        </PDF>
                    </PDFcontainer>
                    <Grid item={true} xs={12} justify="center">
                        <Button component="a" target="_blank" href={url} download="Instanteach PDF Document" size="medium" color="primary" variant="contained">Download PDF</Button>
                        <br />
                        <br />
                        <br />
                    </Grid>
                </Grid>
                )
        )
    }
}

export default Document
