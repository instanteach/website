import * as React from 'react'
import {Document as PDF, Page} from 'react-pdf'
import DocumentsService from '../services/DocumentsService'

import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'

import IDocument from '../interfaces/IDocument'

interface IProps {
    match: any
}

interface IState {
    page: number
    pages: number
    url: string
}

class Document extends React.Component<IProps, IState> {
    public state = {
        page: 1,
        pages: 1,
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
        console.log(numPages)
        this.setState({ pages: numPages })
    }
    
    public render(): JSX.Element {
        const {url, pages, page} = this.state
        let arr: number[] = []

        for(let i=page; i <= pages; i++) {
            arr = arr.concat(i)
        }
        
        return (
                (url === '#')
                ? <p>{url}</p>
                : ( 
                <>
                <Grid container={true} spacing={16}>
                    <Grid item={true} xs={12}>
                        <PDF file={`https://cors-anywhere.herokuapp.com/${url}`} onLoadSuccess={this.onDocumentLoadSuccess}>
                            { arr.map(item => <Page key={item} pageNumber={item} />) }
                        </PDF>
                    </Grid>
                    <Grid item={true} xs={12}>
                        <Button size="small" color="primary" variant="contained">Download PDF</Button>
                        <br />
                        <br />
                        <br />
                    </Grid>
                </Grid>
                </>
                )
        )
    }
}

export default Document
